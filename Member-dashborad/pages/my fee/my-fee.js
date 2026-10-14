
/* ===========================
   my-fee.js  
   ========================== */

(function () {
  "use strict";

  /* ============ 1. State ============ */
  let member = null;
  let selectedPlanId = null;
  let currentPaymentId = null;
  let timerInterval = null;
  let bannerTimeout = null;

  /* ============ 2. Small helpers ============ */
  const $ = (id) => document.getElementById(id);

  const money = (n) => "Rs. " + (Number(n) || 0).toLocaleString("en-PK");

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const statusKey = (status) =>
    String(status || "").trim().toLowerCase().replace(/\s+/g, "-");

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value ?? "-";
  }

  function setBadge(id, status) {
    const el = $(id);
    if (!el) return;
    el.className = "fee-status-badge " + statusKey(status);
    el.textContent = status || "-";
  }

  /* ============ 3. Sidebar / Navbar (aapka purana code) ============ */
  function loadComponent(containerId, filePath) {
    const container = $(containerId);
    if (!container) {
      console.error("Container not found:", containerId);
      return Promise.resolve();
    }

    return fetch(filePath)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load: " + filePath);
        return response.text();
      })
      .then((data) => {
        container.innerHTML = data;

        if (containerId === "member-sidebar" && typeof initializeMemberSidebar === "function") {
          initializeMemberSidebar();
        }
        if (containerId === "member-navbar" && typeof initMemberNavbar === "function") {
          initMemberNavbar();
        }
      })
      .catch((error) => {
        console.error(error);
        container.innerHTML =
          '<p style="color:#f5b900; padding:20px;">Component could not be loaded.</p>';
      });
  }

  /* ============ 4. Logged-in member ============ */
  function getCurrentMember() {
    const id = localStorage.getItem("loggedInMemberId");
    if (!id) return null;

    const members = getData(STORAGE_KEYS.MEMBERS);
    const found = members.find((m) => PaymentService._same(m.memberId || m.id, id));
    const name = found ? found.name || found.fullName || found.memberName : null;

    return { id: String(id), name: name ? String(name) : String(id) };
  }

  /* ============ 5. Payment methods dropdown (config se) ============ */
  function fillMethodOptions() {
    const select = $("payMethod");
    if (!select) return;
    Object.keys(PAYMENT_CONFIG.METHODS).forEach((method) => {
      const option = document.createElement("option");
      option.value = method;
      option.textContent = method;
      select.append(option);
    });
  }

  /* ============ 6. Banner (SMS jaisi notification) ============ */
  function showBanner(html, autoHideMs) {
    $("payBannerText").innerHTML = html;
    $("payBanner").hidden = false;
    clearTimeout(bannerTimeout);
    if (autoHideMs) bannerTimeout = setTimeout(hideBanner, autoHideMs);
  }

  function hideBanner() {
    $("payBanner").hidden = true;
  }

  /* ============ 7. Modal steps ============ */
  function showStep(step) {
    $("payStepForm").hidden = step !== "form";
    $("payStepToken").hidden = step !== "token";
    $("payStepDone").hidden = step !== "done";
  }

  function showError(id, message) {
    const el = $(id);
    el.textContent = message;
    el.hidden = !message;
  }

  function openModal() {
    const plan = PaymentService.getPlanById(selectedPlanId);
    if (!plan) return;

    $("payPlanName").textContent = plan.name;
    $("payDuration").textContent = PaymentService._durationText(plan.months);
    $("payAmount").textContent = money(plan.price);
    $("payMethod").value = "";
    $("payAccount").value = "";
    $("payAccount").placeholder = "Enter demo account number";
    $("payHint").textContent = "Demo only. Do not enter real account details.";
    showError("payError", "");
    showStep("form");
    $("payOverlay").hidden = false;
  }

  function closeModal() {
    $("payOverlay").hidden = true;
    stopTimer();
  }

  /* ============ 8. Token timer ============ */
  function startTimer(expiresAt) {
    stopTimer();
    $("payVerifyBtn").disabled = false;

    const tick = () => {
      const ms = expiresAt - Date.now();
      if (ms <= 0) {
        $("payTimer").textContent = "Token expired";
        $("payTimer").classList.add("expired");
        $("payVerifyBtn").disabled = true;
        stopTimer();
        return;
      }
      const m = String(Math.floor(ms / 60000)).padStart(2, "0");
      const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
      $("payTimer").textContent = `${m}:${s}`;
      $("payTimer").classList.remove("expired");
    };

    tick();
    timerInterval = setInterval(tick, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  /* ============ 9. Actions ============ */
  function onSendToken() {
    const result = PaymentService.startPayment({
      memberId: member.id,
      memberName: member.name,
      planId: selectedPlanId,
      method: $("payMethod").value,
      accountNo: $("payAccount").value,
    });

    if (!result.ok) {
      showError("payError", result.error);
      render(); // failed payment history mein dikhe
      return;
    }

    currentPaymentId = result.payment.id;
    showBanner(
      `Your verification token: <strong>${esc(result.token)}</strong> (valid for 5 minutes)`
    );
    $("payToken").value = "";
    showError("payTokenError", "");
    startTimer(result.payment.expiresAt);
    showStep("token");
    render();
  }

  function onVerify() {
    const result = PaymentService.verifyPayment(currentPaymentId, $("payToken").value);

    if (!result.ok) {
      showError("payTokenError", result.error);
      if (result.locked) $("payVerifyBtn").disabled = true;
      if (result.expired) {
        stopTimer();
        $("payTimer").textContent = "Token expired";
        $("payVerifyBtn").disabled = true;
      }
      render();
      return;
    }

    stopTimer();
    const p = result.payment;
    $("payReceipt").innerHTML = `
      <div><span>Transaction ID</span><strong>${esc(p.transactionId)}</strong></div>
      <div><span>Plan</span><strong>${esc(p.membership)}</strong></div>
      <div><span>Amount</span><strong>${money(p.amount)}</strong></div>
      <div><span>Method</span><strong>${esc(p.method)} (**** ${esc(p.accountLast4)})</strong></div>
      <div><span>Next Due Date</span><strong>${esc(p.dueDate)}</strong></div>`;
    showStep("done");
    showBanner(`Payment of <strong>${money(p.amount)}</strong> successful.`, 6000);
    currentPaymentId = null;
    selectedPlanId = null;
    render();
  }

  function onResend() {
    const result = PaymentService.resendToken(currentPaymentId);
    if (!result.ok) {
      showError("payTokenError", result.error);
      return;
    }
    $("payToken").value = "";
    showError("payTokenError", "");
    showBanner(
      `Your new verification token: <strong>${esc(result.token)}</strong> (valid for 5 minutes)`
    );
    startTimer(result.payment.expiresAt);
  }

  function onCancel() {
    if (currentPaymentId) PaymentService.cancelPayment(currentPaymentId);
    currentPaymentId = null;
    hideBanner();
    closeModal();
    render();
  }

  /* ============ 10. Render (page ka saara data) ============ */
  function renderSummary() {
    const s = PaymentService.getMemberSummary(member.id);

    setText("membershipFee", money(s.fee));
    setText("membershipPlan", s.planName !== "-" ? s.planName + " Plan" : "No Membership");
    setText("totalPaid", money(s.totalPaid));
    setText("remainingAmount", money(s.remaining));
    setBadge("paymentStatus", s.status);

    setText("detailMembershipPlan", s.planName);
    setText("detailDuration", s.duration);
    setText("detailTotalFee", money(s.fee));
    setBadge("detailMembershipStatus", s.status);

    const alertBox = $("feeAlert");
    if (s.status === "Overdue") {
      setText("feeAlertTitle", "Payment Overdue");
      setText(
        "feeAlertMessage",
        s.dueDate
          ? `Your membership expired on ${s.dueDate}. Choose a plan below to renew.`
          : "Your membership payment is overdue. Choose a plan below to renew."
      );
      alertBox.style.display = "flex";
    } else if (s.status === "Pending") {
      setText("feeAlertTitle", "Payment Pending");
      setText(
        "feeAlertMessage",
        "Choose a plan and click Pay Now to complete or verify your payment."
      );
      alertBox.style.display = "flex";
    } else {
      alertBox.style.display = "none";
    }
  }

  function renderPlans() {
    const plans = PaymentService.getPlans();
    const membership = PaymentService.getMembership(member.id);
    const active = PaymentService.isMembershipActive(member.id);

    const isCurrentPlan = (plan) =>
      active && membership && (membership.planId === plan.id || membership.plan === plan.name);

    // Jo plan already active hai wo select nahi ho sakta
    const selected = plans.find((p) => p.id === selectedPlanId);
    if (selected && isCurrentPlan(selected)) selectedPlanId = null;

    $("planGrid").innerHTML = plans
      .map((plan) => {
        const current = isCurrentPlan(plan);
        const isSelected = plan.id === selectedPlanId;
        return `
          <button class="plan-card ${isSelected ? "selected" : ""} ${current ? "current" : ""}"
                  data-plan="${esc(plan.id)}" ${current ? "disabled" : ""}>
            <span class="plan-name">${esc(plan.name)}</span>
            <span class="plan-duration">${PaymentService._durationText(plan.months)}</span>
            <strong class="plan-price">${money(plan.price)}</strong>
            <span class="plan-tag">${current ? "Current Plan" : isSelected ? "Selected" : "Select"}</span>
          </button>`;
      })
      .join("");

    $("payNowBtn").disabled = !selectedPlanId;
  }

  function renderHistory() {
    const payments = PaymentService.getMemberPayments(member.id);
    const body = $("paymentHistoryBody");

    if (!payments.length) {
      body.innerHTML = `
        <tr class="empty-payment-row">
          <td colspan="6">
            <i class="fa-solid fa-receipt"></i>
            <span>No payment history found.</span>
          </td>
        </tr>`;
      return;
    }

    body.innerHTML = payments
      .map((p) => {
        const status = PaymentService._capitalize(p.status) || "-";
        return `
        <tr>
          <td><span class="payment-id">#${esc(p.transactionId || p.id || "-")}</span></td>
          <td>${esc(p.membership || "-")}</td>
          <td><span class="payment-amount">${money(p.amount)}</span></td>
          <td>${esc(p.paymentDate || "-")}</td>
          <td>${esc(p.dueDate || "-")}</td>
          <td><span class="payment-status ${statusKey(p.status)}">${esc(status)}</span></td>
        </tr>`;
      })
      .join("");
  }

  function render() {
    renderSummary();
    renderPlans();
    renderHistory();
  }

  /* ============ 11. Events ============ */
  function bindEvents() {
    $("planGrid").addEventListener("click", (e) => {
      const card = e.target.closest(".plan-card");
      if (!card || card.disabled) return;
      selectedPlanId = card.dataset.plan;
      renderPlans();
    });

    $("payNowBtn").addEventListener("click", openModal);
    $("payClose").addEventListener("click", closeModal);
    $("payBannerClose").addEventListener("click", hideBanner);
    $("payDoneBtn").addEventListener("click", closeModal);
    $("paySendBtn").addEventListener("click", onSendToken);
    $("payVerifyBtn").addEventListener("click", onVerify);
    $("payResendBtn").addEventListener("click", onResend);
    $("payCancelBtn").addEventListener("click", onCancel);

    $("payMethod").addEventListener("change", (e) => {
      const config = PAYMENT_CONFIG.METHODS[e.target.value];
      $("payAccount").placeholder = config ? config.label : "Enter demo account number";
      $("payHint").textContent = config
        ? "Demo only. Any " + config.digits + "-digit number works."
        : "Demo only. Do not enter real account details.";
    });

    // Sirf digits allow
    ["payAccount", "payToken"].forEach((id) =>
      $(id).addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
      })
    );

    // Dusre tab (admin) mein data badle to yahan bhi refresh
    onStorageChange(() => render());
  }

  /* ============ 12. Start ============ */
  document.addEventListener("DOMContentLoaded", () => {
    loadComponent("member-sidebar", "../../../components/member-sidebar/member-sidebar.html");
    loadComponent("member-navbar", "../../../components/member-navbar/member-navbar.html");

    member = getCurrentMember();

    if (!member) {
      console.warn("No logged-in member found.");
      setText("feeAlertTitle", "Member not found");
      setText("feeAlertMessage", "Please log in again to view your fees.");
      $("feeAlert").style.display = "flex";
      return;
    }

    // Payment modal reusable component pehle load hota hai, phir page start
    loadComponent(
      "payment-modal",
      "../../../components/payment modal/payment-madal.html"
    ).then(() => {
      if (!$("payOverlay")) {
        setText("feeAlertTitle", "Payment form not loaded");
        setText(
          "feeAlertMessage",
          "Check the payment-modal component path (F12 > Console)."
        );
        $("feeAlert").style.display = "flex";
        render();
        return;
      }
      fillMethodOptions();
      bindEvents();
      render();
    });
  });
})();

 
