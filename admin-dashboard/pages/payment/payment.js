

/* ==========================================================
   payment.js  
   ========================================================== */

(function () {
  "use strict";

  /* ============ 1. Helpers ============ */
  const $ = (id) => document.getElementById(id);

  const money = (n) => "Rs. " + (Number(n) || 0).toLocaleString("en-PK");

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const statusKey = (status) => String(status || "").trim().toLowerCase();

  const statusText = (status) => PaymentService._capitalize(status) || "-";

  // Aapki payment.css ke classes: status-paid / status-pending / status-failed
  const statusClass = (key) =>
    ({
      paid: "status-paid",
      pending: "status-pending",
      failed: "status-failed",
      expired: "status-failed",
      overdue: "status-failed",
      cancelled: "status-cancelled",
    }[key] || "status-pending");

  /* ============ 2. Sidebar / Navbar (aapka apna working code) ============ */
  async function loadPaymentComponents() {
    const components = [
      {
        containerId: "sidebar",
        htmlPath: "../../../components/sidebar/sidebar.html",
        jsPath: "../../../components/sidebar/sidebar.js",
      },
      {
        containerId: "navbar",
        htmlPath: "../../../components/navbar/navbar.html",
        jsPath: "../../../components/navbar/navbar.js",
      },
    ];

    for (const component of components) {
      const container = document.getElementById(component.containerId);

      if (!container) {
        console.error(`Component container not found: ${component.containerId}`);
        continue;
      }

      const response = await fetch(component.htmlPath);

      if (!response.ok) {
        throw new Error(`Unable to load ${component.htmlPath}`);
      }

      container.innerHTML = await response.text();

      await new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = component.jsPath;
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error(`Unable to load ${component.jsPath}`));

        document.body.appendChild(script);
      });
    }
  }

  /* ============ 3. Member ka naam (purani payments ke liye) ============ */
  function getMemberName(payment) {
    if (payment.memberName) return payment.memberName;

    const members = getData(STORAGE_KEYS.MEMBERS);
    const found = members.find((m) =>
      PaymentService._same(m.memberId || m.id, payment.memberId)
    );
    return found ? found.name || found.fullName || found.memberName || "-" : "-";
  }

  /* ============ 4. Summary cards ============ */
  function renderCards() {
    const totals = PaymentService.getPaymentTotals();

    $("totalPaid").textContent = money(totals.totalPaid);
    $("totalPending").textContent = money(totals.totalPending);
    $("totalFailed").textContent = money(totals.totalFailed);
    $("totalRevenue").textContent = money(totals.totalRevenue);
  }

  /* ============ 5. Table (search + filters) ============ */
  function getFilteredPayments() {
    const search = $("paymentSearch").value.trim().toLowerCase();
    const status = $("paymentStatusFilter").value;
    const method = $("paymentMethodFilter").value;

    return PaymentService.getAllPayments().filter((p) => {
      if (status !== "all" && statusKey(p.status) !== status) return false;
      if (method !== "all" && (p.method || "") !== method) return false;

      if (search) {
        const text = [
          getMemberName(p),
          p.memberId,
          p.id,
          p.transactionId,
          p.membership,
        ]
          .join(" ")
          .toLowerCase();
        if (!text.includes(search)) return false;
      }
      return true;
    });
  }

  function renderTable() {
    const payments = getFilteredPayments();
    const body = $("paymentTableBody");

    $("emptyPaymentMessage").hidden = payments.length > 0;

    body.innerHTML = payments
      .map((p) => {
        const key = statusKey(p.status);
        return `
        <tr>
          <td><strong>#${esc(p.transactionId || p.id || "-")}</strong></td>
          <td>
            ${esc(getMemberName(p))}
            <br><small>${esc(p.memberId || "")}</small>
          </td>
          <td>${esc(p.membership || p.plan || "-")}</td>
          <td>${money(p.amount)}</td>
          <td>${esc(p.method || "Not specified")}</td>
          <td>${esc(p.paymentDate || "-")}</td>
          <td>${esc(p.dueDate || "-")}</td>
          <td><span class="payment-status ${statusClass(key)}">${esc(statusText(p.status))}</span></td>
          <td>
            <button type="button" class="secondary-btn" data-action="view" data-id="${esc(p.id)}" title="View details">
              <i class="fa-solid fa-eye"></i>
            </button>
          </td>
        </tr>`;
      })
      .join("");
  }

  /* ============ 6. View modal (sirf dekhna) ============ */
  function openView(paymentId) {
    const p = PaymentService.getAllPayments().find((x) => String(x.id) === String(paymentId));
    if (!p) return;

    const rows = [
      ["Payment ID", p.id],
      ["Transaction ID", p.transactionId || "-"],
      ["Member", `${getMemberName(p)} (${p.memberId || "-"})`],
      ["Membership", p.membership || p.plan || "-"],
      ["Amount", money(p.amount)],
      ["Method", p.method || "Not specified"],
      ["Account", p.accountLast4 ? "**** " + p.accountLast4 : "-"],
      ["Payment Date", p.paymentDate || "-"],
      ["Due Date", p.dueDate || "-"],
      ["Status", statusText(p.status)],
    ];
    if (p.failReason) rows.push(["Reason", p.failReason]);

    $("paymentViewBody").innerHTML = rows
      .map(([label, value]) => `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`)
      .join("");

    $("paymentViewModal").hidden = false;
  }

  function closeView() {
    $("paymentViewModal").hidden = true;
  }

  /* ============ 7. Render + events ============ */
  function render() {
    renderCards();
    renderTable();
  }

  function bindEvents() {
    $("paymentSearch").addEventListener("input", renderTable);
    $("paymentStatusFilter").addEventListener("change", renderTable);
    $("paymentMethodFilter").addEventListener("change", renderTable);

    $("paymentTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest('[data-action="view"]');
      if (btn) openView(btn.dataset.id);
    });

    $("closePaymentView").addEventListener("click", closeView);
    $("paymentViewDone").addEventListener("click", closeView);
    $("paymentViewModal").addEventListener("click", (e) => {
      if (e.target === $("paymentViewModal")) closeView();
    });

    // Member pay kare to ye page bina refresh ke update ho
    onStorageChange(render);
  }

  /* ============ 8. Start ============ */
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      await loadPaymentComponents();
    } catch (error) {
      console.error("Payment page component error:", error);
    }

    bindEvents();
    render();

    // Token expire hone wali payments time ke saath badal jati hain
    setInterval(render, 30000);
  });
})();

 
