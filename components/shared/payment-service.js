 /*==========================================================
   payment-service.js  -  
   ========================================================== */

const PAYMENT_CONFIG = {
  TOKEN_EXPIRY_MS: 5 * 60 * 1000, // token 5 minute valid
  MAX_ATTEMPTS: 3, // galat token ki limit
  MAX_RESENDS: 3, // token dobara mangne ki limit
  DEMO_START_BALANCE: 50000, // naye demo wallet ka balance
  METHODS: {
    JazzCash: { digits: 11, label: "JazzCash number (11 digits)" },
    Easypaisa: { digits: 11, label: "Easypaisa number (11 digits)" },
    "Debit Card": { digits: 16, label: "Debit card number (16 digits)" },
  },
};

const PaymentService = {
  /* ---------------- Small helpers ---------------- */

  _fail(error, extra = {}) {
    return { ok: false, error, ...extra };
  },

  _today() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  },

  _addMonths(dateString, months) {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
  },

  _generateToken() {
    const random = crypto.getRandomValues(new Uint32Array(1))[0];
    return String(100000 + (random % 900000)); // 6 digit
  },

  _walletKey(method, accountNo) {
    return `${method}:${accountNo}`;
  },

  // "#M005", "m005 " sab same maane jayenge
  _normId(id) {
    return String(id || "").replace(/^#/, "").trim().toLowerCase();
  },

  _same(a, b) {
    return this._normId(a) === this._normId(b);
  },

  _durationText(months) {
    return months + (months === 1 ? " Month" : " Months");
  },

  _capitalize(text) {
    const t = String(text || "").trim().toLowerCase();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
  },

  /* ---------------- Plans ---------------- */

  getPlans() {
    return getData(STORAGE_KEYS.PLANS);
  },

  getPlanById(planId) {
    return this.getPlans().find((p) => p.id === planId) || null;
  },

  /* ---------------- Account number validation ---------------- */

  validateAccountNumber(method, accountNo) {
    const config = PAYMENT_CONFIG.METHODS[method];
    if (!config) return { ok: false, error: "Please select a payment method." };

    const clean = String(accountNo || "").replace(/\s|-/g, "");
    if (!/^\d+$/.test(clean)) {
      return { ok: false, error: "Account number must contain digits only." };
    }
    if (clean.length !== config.digits) {
      return { ok: false, error: `Enter a valid ${config.label}.` };
    }
    return { ok: true, accountNo: clean };
  },

  /* ---------------- Demo wallet (Option B) ----------------
     Koi bhi valid format wala number chalta hai. Pehli baar aaye
     to wallet auto-ban jata hai, baad mein wahi balance milta hai. */

  getOrCreateWallet(method, accountNo) {
    const accounts = getData(STORAGE_KEYS.ACCOUNTS);
    const key = this._walletKey(method, accountNo);
    let wallet = accounts.find((a) => a.key === key);

    if (!wallet) {
      wallet = {
        key,
        method,
        accountNo,
        balance: PAYMENT_CONFIG.DEMO_START_BALANCE,
        createdAt: new Date().toISOString(),
      };
      accounts.push(wallet);
      saveData(STORAGE_KEYS.ACCOUNTS, accounts);
    }
    return wallet;
  },

  /* ---------------- Membership + status ---------------- */

  // Member ki sabse nayi membership record
  getMembership(memberId) {
    const list = getData(STORAGE_KEYS.MEMBERSHIPS).filter((m) =>
      this._same(m.memberId, memberId)
    );
    return list.length ? list[list.length - 1] : null;
  },

  isMembershipActive(memberId) {
    const m = this.getMembership(memberId);
    if (!m) return false;
    if (m.dueDate) return m.dueDate >= this._today();
    // purani (legacy) record jisme dueDate nahi
    return String(m.paymentStatus || "").toLowerCase() === "paid";
  },

  // Status ka asli hisaab (store nahi, calculate hota hai)
  _statusFor(membership, payments) {
    const hasPending = payments.some(
      (p) => this._same(p.memberId, membership.memberId) && p.status === "Pending"
    );

    if (membership.dueDate) {
      if (membership.dueDate >= this._today()) return "Paid";
      return hasPending ? "Pending" : "Overdue";
    }

    // legacy record
    const legacy = this._capitalize(membership.paymentStatus) || "Pending";
    if (legacy === "Paid") return "Paid";
    return hasPending ? "Pending" : legacy;
  },

  /* ---------------- Refresh ----------------
     1) Expire hue Pending payments ko Expired karo
     2) Admin page ki stored paymentStatus ko sahi rakho (Paid/Overdue)  */

  refresh() {
    const payments = getData(STORAGE_KEYS.PAYMENTS);
    const now = Date.now();
    let paymentsChanged = false;

    payments.forEach((p) => {
      if (p.status === "Pending" && p.expiresAt && now > p.expiresAt) {
        p.status = "Expired";
        p.failReason = "Token expired";
        paymentsChanged = true;
        addAuditLog("PAYMENT_EXPIRED", { paymentId: p.id });
      }
    });
    if (paymentsChanged) saveData(STORAGE_KEYS.PAYMENTS, payments);

    const memberships = getData(STORAGE_KEYS.MEMBERSHIPS);
    let membershipsChanged = false;

    memberships.forEach((m) => {
      if (!m.dueDate) return; // legacy record ko na chhedo
      const status = this._statusFor(m, payments);
      if (m.paymentStatus !== status) {
        m.paymentStatus = status;
        membershipsChanged = true;
      }
    });
    if (membershipsChanged) saveData(STORAGE_KEYS.MEMBERSHIPS, memberships);
  },

  getMemberStatus(memberId) {
    this.refresh();
    const payments = getData(STORAGE_KEYS.PAYMENTS);
    const m = this.getMembership(memberId);

    if (!m) {
      const hasPending = payments.some(
        (p) => this._same(p.memberId, memberId) && p.status === "Pending"
      );
      return hasPending ? "Pending" : "No Membership";
    }
    return this._statusFor(m, payments);
  },

  /* ---------------- Step 1: Pay Now ----------------
     Validation + balance check + token generate.
     Balance yahan NAHI katta, sirf last step (verify) par. */

  startPayment({ memberId, memberName, planId, method, accountNo }) {
    this.refresh();

    const plan = this.getPlanById(planId);
    if (!plan) return this._fail("Please select a membership plan.");

    const check = this.validateAccountNumber(method, accountNo);
    if (!check.ok) return this._fail(check.error);

    // Pehle se active same plan ho to dobara payment nahi
    const membership = this.getMembership(memberId);
    if (
      membership &&
      this.isMembershipActive(memberId) &&
      (membership.planId === planId || membership.plan === plan.name)
    ) {
      const until = membership.dueDate ? ` until ${membership.dueDate}` : "";
      return this._fail(`Your ${plan.name} plan is already active${until}.`);
    }

    const payments = getData(STORAGE_KEYS.PAYMENTS);

    // Idempotency: double click / refresh par dusri payment nahi banegi
    const existing = payments.find(
      (p) =>
        this._same(p.memberId, memberId) && p.planId === planId && p.status === "Pending"
    );
    if (existing) {
      return { ok: true, payment: existing, token: existing.token, reused: true };
    }

    // Balance check (token se pehle)
    const wallet = this.getOrCreateWallet(method, check.accountNo);
    const last4 = check.accountNo.slice(-4);

    if (wallet.balance < plan.price) {
      payments.push({
        id: generateId("PAY"),
        memberId,
        memberName,
        planId,
        membership: plan.name,
        amount: plan.price,
        method,
        accountLast4: last4,
        status: "Failed",
        failReason: "Insufficient balance",
        createdAt: new Date().toISOString(),
      });
      saveData(STORAGE_KEYS.PAYMENTS, payments);
      addAuditLog("PAYMENT_FAILED_BALANCE", { memberId, planId, method, last4 });
      return this._fail("Insufficient balance. Your account balance is too low.");
    }

    const payment = {
      id: generateId("PAY"),
      memberId,
      memberName,
      planId,
      membership: plan.name,
      months: plan.months,
      amount: plan.price,
      method,
      accountKey: wallet.key, // wallet dhoondhne ke liye (poora number nahi dikhate)
      accountLast4: last4,
      token: this._generateToken(),
      expiresAt: Date.now() + PAYMENT_CONFIG.TOKEN_EXPIRY_MS,
      attempts: 0,
      resends: 0,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    payments.push(payment);
    saveData(STORAGE_KEYS.PAYMENTS, payments);

    addNotification(
      "member",
      memberId,
      `Your verification token is ${payment.token} (valid for 5 minutes).`
    );
    addAuditLog("PAYMENT_STARTED", { paymentId: payment.id, memberId, planId, method });

    return { ok: true, payment, token: payment.token };
  },

  /* ---------------- Step 2: Token verify ----------------
     Yahan paisa katta hai (last step) aur sab kuch ek saath update hota hai. */

  verifyPayment(paymentId, enteredToken) {
    this.refresh();

    const payments = getData(STORAGE_KEYS.PAYMENTS);
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) return this._fail("Payment not found.");
    if (payment.status === "Paid") return this._fail("This payment is already completed.");
    if (payment.status === "Expired") {
      return this._fail("Token expired. Please request a new token.", { expired: true });
    }
    if (payment.status !== "Pending") {
      return this._fail(`This payment is ${payment.status}.`);
    }

    // Galat token
    if (String(enteredToken || "").trim() !== payment.token) {
      payment.attempts += 1;
      const left = PAYMENT_CONFIG.MAX_ATTEMPTS - payment.attempts;

      if (left <= 0) {
        payment.status = "Failed";
        payment.failReason = "Too many wrong attempts";
        saveData(STORAGE_KEYS.PAYMENTS, payments);
        addAuditLog("PAYMENT_LOCKED", { paymentId });
        return this._fail("Too many wrong attempts. Payment locked.", { locked: true });
      }

      saveData(STORAGE_KEYS.PAYMENTS, payments);
      addAuditLog("TOKEN_INVALID", { paymentId, attempts: payment.attempts });
      return this._fail(`Invalid token. ${left} attempt(s) left.`, { attemptsLeft: left });
    }

    // Token sahi: balance dobara check (beech mein badal sakta hai)
    const accounts = getData(STORAGE_KEYS.ACCOUNTS);
    const wallet = accounts.find((a) => a.key === payment.accountKey);

    if (!wallet) return this._fail("Account not found.");
    if (wallet.balance < payment.amount) {
      payment.status = "Failed";
      payment.failReason = "Insufficient balance";
      saveData(STORAGE_KEYS.PAYMENTS, payments);
      addAuditLog("PAYMENT_FAILED_BALANCE", { paymentId });
      return this._fail("Insufficient balance. Payment failed.");
    }

    // ---- Sab update ek saath ----
    const today = this._today();
    const dueDate = this._addMonths(today, payment.months);

    wallet.balance -= payment.amount;

    const gym = getData(STORAGE_KEYS.GYM_ACCOUNT, { totalRevenue: 0 });
    gym.totalRevenue += payment.amount;

    payment.status = "Paid";
    payment.paymentDate = today;
    payment.dueDate = dueDate;
    payment.transactionId = generateId("TXN");
    payment.token = null; // token ek baar use, ab bekaar
    delete payment.expiresAt;

    // Membership record: naya banao ya purana update karo
    const memberships = getData(STORAGE_KEYS.MEMBERSHIPS);
    const existing = memberships.find((m) => this._same(m.memberId, payment.memberId));
    const details = {
      planId: payment.planId,
      plan: payment.membership,
      duration: this._durationText(payment.months),
      price: payment.amount,
      paymentStatus: "Paid",
      startDate: today,
      dueDate,
      lastPaymentId: payment.id,
    };

    if (existing) {
      Object.assign(existing, details);
    } else {
      memberships.push({
        memberId: payment.memberId,
        memberName: payment.memberName,
        name: payment.memberName,
        ...details,
      });
    }

    saveData(STORAGE_KEYS.ACCOUNTS, accounts);
    saveData(STORAGE_KEYS.GYM_ACCOUNT, gym);
    saveData(STORAGE_KEYS.PAYMENTS, payments);
    saveData(STORAGE_KEYS.MEMBERSHIPS, memberships);

    addNotification(
      "member",
      payment.memberId,
      `Payment of Rs. ${payment.amount} successful. Transaction ID: ${payment.transactionId}`
    );
    addNotification(
      "admin",
      null,
      `${payment.memberName} paid Rs. ${payment.amount} for ${payment.membership} (${payment.method}).`
    );
    addAuditLog("PAYMENT_SUCCESS", {
      paymentId,
      transactionId: payment.transactionId,
      amount: payment.amount,
    });

    return { ok: true, payment };
  },

  /* ---------------- Resend / Cancel ---------------- */

  resendToken(paymentId) {
    const payments = getData(STORAGE_KEYS.PAYMENTS);
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) return this._fail("Payment not found.");
    if (payment.status !== "Pending" && payment.status !== "Expired") {
      return this._fail(`Cannot resend token for a ${payment.status} payment.`);
    }
    if ((payment.resends || 0) >= PAYMENT_CONFIG.MAX_RESENDS) {
      return this._fail("Resend limit reached. Please start a new payment.");
    }

    payment.token = this._generateToken();
    payment.expiresAt = Date.now() + PAYMENT_CONFIG.TOKEN_EXPIRY_MS;
    payment.attempts = 0;
    payment.resends = (payment.resends || 0) + 1;
    payment.status = "Pending";
    delete payment.failReason;
    saveData(STORAGE_KEYS.PAYMENTS, payments);

    addNotification(
      "member",
      payment.memberId,
      `Your new verification token is ${payment.token} (valid for 5 minutes).`
    );
    addAuditLog("TOKEN_RESENT", { paymentId });

    return { ok: true, payment, token: payment.token };
  },

  cancelPayment(paymentId) {
    const payments = getData(STORAGE_KEYS.PAYMENTS);
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) return this._fail("Payment not found.");
    if (payment.status !== "Pending" && payment.status !== "Expired") {
      return this._fail(`Cannot cancel a ${payment.status} payment.`);
    }

    payment.status = "Cancelled";
    payment.token = null;
    saveData(STORAGE_KEYS.PAYMENTS, payments);
    addAuditLog("PAYMENT_CANCELLED", { paymentId });
    return { ok: true };
  },

  /* ---------------- Read-only queries (member + admin pages) ---------------- */

  _byNewest(a, b) {
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  },

  getMemberPayments(memberId) {
    this.refresh();
    return getData(STORAGE_KEYS.PAYMENTS)
      .filter((p) => this._same(p.memberId, memberId))
      .sort(this._byNewest);
  },

  getAllPayments() {
    this.refresh();
    return getData(STORAGE_KEYS.PAYMENTS).sort(this._byNewest);
  },

  // Member Fee page ke upar wale 4 cards
  getMemberSummary(memberId) {
    const m = this.getMembership(memberId);
    const status = this.getMemberStatus(memberId);
    const fee = m ? Number(m.price) || 0 : 0;

    const totalPaid = this.getMemberPayments(memberId)
      .filter((p) => String(p.status).toLowerCase() === "paid")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return {
      planName: m && m.plan ? m.plan : "-",
      duration: m && m.duration ? m.duration : "-",
      fee,
      totalPaid,
      remaining: status === "Paid" ? 0 : fee,
      dueDate: m ? m.dueDate || null : null,
      status,
    };
  },

  // Admin Payment page ke 4 cards: payments se calculate (single source of truth)
  getPaymentTotals() {
    const payments = this.getAllPayments();
    const sum = (...statuses) =>
      payments
        .filter((p) => statuses.includes(String(p.status).toLowerCase()))
        .reduce((total, p) => total + (Number(p.amount) || 0), 0);

    const totalPaid = sum("paid");
    return {
      totalPaid,
      totalPending: sum("pending"),
      totalFailed: sum("failed", "expired"),
      totalRevenue: totalPaid,
    };
  },

  // Admin Membership page: Records table + Paid/Pending/Overdue cards
  getMembershipRecords() {
    this.refresh();
    const payments = getData(STORAGE_KEYS.PAYMENTS);
    return getData(STORAGE_KEYS.MEMBERSHIPS).map((m) => ({
      memberId: m.memberId,
      memberName: m.memberName || m.name || "-",
      plan: m.plan || "-",
      duration: m.duration || "-",
      price: Number(m.price) || 0,
      dueDate: m.dueDate || null,
      status: this._statusFor(m, payments),
    }));
  },
};

 
