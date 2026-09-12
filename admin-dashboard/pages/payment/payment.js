

// ========================================
// PAYMENT MANAGEMENT
// ========================================

const PAYMENT_STORAGE_KEY = "gymPayments";

// ========================================
// LOCAL STORAGE
// ========================================

function getPayments() {
  return JSON.parse(localStorage.getItem(PAYMENT_STORAGE_KEY)) || [];
}

function savePayments(payments) {
  localStorage.setItem(
    PAYMENT_STORAGE_KEY,
    JSON.stringify(payments)
  );
}

// ========================================
// COMPONENT LOADER
// ========================================

function loadCSS(href, id) {
  if (id && document.getElementById(id)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;

  if (id) {
    link.id = id;
  }

  document.head.appendChild(link);
}

async function loadComponents() {
  try {
    // Font Awesome
    loadCSS(
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
      "fontAwesomeCSS"
    );

    // =========================
    // SIDEBAR
    // =========================

    const sidebarResponse = await fetch(
      "/components/sidebar/sidebar.html"
    );

    const sidebarHTML = await sidebarResponse.text();

    const sidebarDoc = new DOMParser().parseFromString(
      sidebarHTML,
      "text/html"
    );

    const sidebarElement =
      sidebarDoc.querySelector(".sidebar");

    if (sidebarElement) {
      // Fix images
      sidebarElement
        .querySelectorAll("img")
        .forEach((img) => {
          const src = img.getAttribute("src");

          if (src && src.startsWith("../../assets/")) {
            img.src = "/" + src.replace("../../", "");
          }
        });

      // Fix sidebar links
      sidebarElement
        .querySelectorAll("a[href]")
        .forEach((link) => {
          const href = link.getAttribute("href");

          if (
            href &&
            href.startsWith("../../admin-dashboard/")
          ) {
            link.href =
              "/" + href.replace("../../", "");
          }
        });

      document.getElementById("sidebar").innerHTML = "";
      document
        .getElementById("sidebar")
        .appendChild(sidebarElement);

      loadCSS(
        "/components/sidebar/sidebar.css",
        "sidebarCSS"
      );
    }

    // =========================
    // NAVBAR
    // =========================

    const navbarResponse = await fetch(
      "/components/navbar/navbar.html"
    );

    const navbarHTML = await navbarResponse.text();

    const navbarDoc = new DOMParser().parseFromString(
      navbarHTML,
      "text/html"
    );

    const navbarElement =
      navbarDoc.querySelector(".navbar");

    if (navbarElement) {
      navbarElement
        .querySelectorAll("img")
        .forEach((img) => {
          const src = img.getAttribute("src");

          if (src && src.startsWith("../../assets/")) {
            img.src = "/" + src.replace("../../", "");
          }
        });

      document.getElementById("navbar").innerHTML = "";
      document
        .getElementById("navbar")
        .appendChild(navbarElement);

      loadCSS(
        "/components/navbar/navbar.css",
        "navbarCSS"
      );
    }
  } catch (error) {
    console.error(
      "Error loading components:",
      error
    );
  }
}

// ========================================
// PAYMENT ID
// ========================================

function getNextPaymentId() {
  const payments = getPayments();

  let maxId = 1;

  payments.forEach((payment) => {
    const number = parseInt(
      payment.id.replace("#P", "")
    );

    if (!isNaN(number) && number >= maxId) {
      maxId = number + 1;
    }
  });

  return "#P" + String(maxId).padStart(3, "0");
}

// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ========================================
// STATUS TEXT
// ========================================

function getStatusText(status) {
  if (status === "paid") return "Paid";
  if (status === "pending") return "Pending";
  if (status === "overdue") return "Overdue";

  return status;
}

// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

// ========================================
// CREATE PAYMENT ROW
// ========================================

function createPaymentRow(payment) {
  const row = document.createElement("tr");

  row.dataset.paymentId = payment.id;

  row.innerHTML = `
    <td>${escapeHTML(payment.id)}</td>

    <td>
      <div class="member-info">
        <div class="member-avatar">
          <i class="fa-solid fa-user"></i>
        </div>

        <span>
          ${escapeHTML(payment.memberName)}
        </span>
      </div>
    </td>

    <td>
      ${escapeHTML(payment.membership)}
    </td>

    <td>
      Rs. ${Number(payment.amount).toLocaleString()}
    </td>

    <td>
      ${formatDate(payment.paymentDate)}
    </td>

    <td>
      ${formatDate(payment.dueDate)}
    </td>

    <td>
      <span class="payment-status ${escapeHTML(payment.status)}">
        ${getStatusText(payment.status)}
      </span>
    </td>

    <td>
      <div class="table-actions">

        <button
          class="action-btn view-payment"
          title="View"
        >
          <i class="fa-solid fa-eye"></i>
        </button>

        <button
          class="action-btn edit-payment"
          title="Edit"
        >
          <i class="fa-solid fa-pen"></i>
        </button>

        <button
          class="action-btn delete-payment"
          title="Delete"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>
    </td>
  `;

  return row;
}

// ========================================
// LOAD SAVED PAYMENTS
// ========================================

function loadSavedPayments() {
  const payments = getPayments();

  const tableBody =
    document.getElementById("paymentTableBody");

  if (!tableBody) return;

  payments.forEach((payment) => {
    tableBody.appendChild(
      createPaymentRow(payment)
    );
  });
}

// ========================================
// UPDATE SUMMARY CARDS
// ========================================

function updatePaymentSummary() {
  const payments = getPayments();

  let totalPaid = 0;
  let totalPending = 0;
  let totalOverdue = 0;

  payments.forEach((payment) => {
    const amount = Number(payment.amount) || 0;

    if (payment.status === "paid") {
      totalPaid += amount;
    }

    if (payment.status === "pending") {
      totalPending += amount;
    }

    if (payment.status === "overdue") {
      totalOverdue += amount;
    }
  });

  const totalRevenue = totalPaid;

  document.getElementById("totalPaid").textContent =
    `Rs. ${totalPaid.toLocaleString()}`;

  document.getElementById("totalPending").textContent =
    `Rs. ${totalPending.toLocaleString()}`;

  document.getElementById("totalOverdue").textContent =
    `Rs. ${totalOverdue.toLocaleString()}`;

  document.getElementById("totalRevenue").textContent =
    `Rs. ${totalRevenue.toLocaleString()}`;
}

// ========================================
// SEARCH + FILTER
// ========================================

function filterPayments() {
  const searchInput =
    document.getElementById("paymentSearch");

  const statusFilter =
    document.getElementById(
      "paymentStatusFilter"
    );

  const tableBody =
    document.getElementById(
      "paymentTableBody"
    );

  if (!searchInput || !statusFilter || !tableBody) {
    return;
  }

  const searchText =
    searchInput.value
      .toLowerCase()
      .trim();

  const selectedStatus =
    statusFilter.value;

  const rows =
    tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const rowText =
      row.innerText.toLowerCase();

    const statusElement =
      row.querySelector(".payment-status");

    const rowStatus =
      statusElement
        ? [...statusElement.classList]
            .find((className) =>
              ["paid", "pending", "overdue"]
                .includes(className)
            )
        : "";

    const matchesSearch =
      rowText.includes(searchText);

    const matchesStatus =
      selectedStatus === "all" ||
      rowStatus === selectedStatus;

    row.style.display =
      matchesSearch && matchesStatus
        ? ""
        : "none";
  });
}

// ========================================
// OPEN PAYMENT MODAL
// ========================================

function openPaymentModal() {
  const modal =
    document.getElementById(
      "paymentModal"
    );

  if (!modal) return;

  modal.style.display = "flex";
}

// ========================================
// CLOSE PAYMENT MODAL
// ========================================

function closePaymentModal() {
  const modal =
    document.getElementById(
      "paymentModal"
    );

  if (!modal) return;

  modal.style.display = "none";
}

// ========================================
// CLEAR FORM
// ========================================

function clearPaymentForm() {
  document.getElementById(
    "paymentMember"
  ).value = "";

  document.getElementById(
    "paymentMembership"
  ).value = "";

  document.getElementById(
    "paymentAmount"
  ).value = "";

  document.getElementById(
    "paymentDate"
  ).value = "";

  document.getElementById(
    "paymentDueDate"
  ).value = "";

  document.getElementById(
    "paymentStatus"
  ).value = "paid";
}

// ========================================
// ADD PAYMENT
// ========================================

function addPayment() {
  const memberSelect =
    document.getElementById(
      "paymentMember"
    );

  const membershipSelect =
    document.getElementById(
      "paymentMembership"
    );

  const amountInput =
    document.getElementById(
      "paymentAmount"
    );

  const paymentDateInput =
    document.getElementById(
      "paymentDate"
    );

  const dueDateInput =
    document.getElementById(
      "paymentDueDate"
    );

  const statusSelect =
    document.getElementById(
      "paymentStatus"
    );

  if (
    !memberSelect.value ||
    !membershipSelect.value ||
    !amountInput.value ||
    !paymentDateInput.value ||
    !dueDateInput.value
  ) {
    alert(
      "Please fill all payment details."
    );
    return;
  }

  const memberName =
    memberSelect.options[
      memberSelect.selectedIndex
    ].text;

  const membership =
    membershipSelect.options[
      membershipSelect.selectedIndex
    ].text;

  const payment = {
    id: getNextPaymentId(),

    memberId:
      memberSelect.value,

    memberName:
      memberName,

    membership:
      membership,

    amount:
      Number(amountInput.value),

    paymentDate:
      paymentDateInput.value,

    dueDate:
      dueDateInput.value,

    status:
      statusSelect.value
  };

  const payments = getPayments();

  payments.push(payment);

  savePayments(payments);

  const tableBody =
    document.getElementById(
      "paymentTableBody"
    );

  tableBody.appendChild(
    createPaymentRow(payment)
  );

  updatePaymentSummary();

  clearPaymentForm();

  closePaymentModal();

  alert(
    "Payment added successfully."
  );
}

// ========================================
// VIEW PAYMENT
// ========================================

function viewPayment(row) {
  const paymentId =
    row.dataset.paymentId;

  // Dynamic payment
  if (paymentId) {
    const payments = getPayments();

    const payment =
      payments.find(
        (item) =>
          item.id === paymentId
      );

    if (!payment) return;

    alert(
      `Payment Details\n\n` +
      `Payment ID: ${payment.id}\n` +
      `Member: ${payment.memberName}\n` +
      `Membership: ${payment.membership}\n` +
      `Amount: Rs. ${Number(
        payment.amount
      ).toLocaleString()}\n` +
      `Payment Date: ${formatDate(
        payment.paymentDate
      )}\n` +
      `Due Date: ${formatDate(
        payment.dueDate
      )}\n` +
      `Status: ${getStatusText(
        payment.status
      )}`
    );

    return;
  }

  // Hard-coded payment
  const cells =
    row.querySelectorAll("td");

  const memberName =
    cells[1]?.innerText.trim();

  const membership =
    cells[2]?.innerText.trim();

  const amount =
    cells[3]?.innerText.trim();

  const paymentDate =
    cells[4]?.innerText.trim();

  const dueDate =
    cells[5]?.innerText.trim();

  const status =
    cells[6]?.innerText.trim();

  alert(
    `Payment Details\n\n` +
    `Payment ID: #P001\n` +
    `Member: ${memberName}\n` +
    `Membership: ${membership}\n` +
    `Amount: ${amount}\n` +
    `Payment Date: ${paymentDate}\n` +
    `Due Date: ${dueDate}\n` +
    `Status: ${status}`
  );
}

// ========================================
// EDIT PAYMENT
// ========================================

function editPayment(row) {
  const paymentId =
    row.dataset.paymentId;

  if (!paymentId) {
    alert(
      "This payment is part of the original HTML data and cannot be edited."
    );
    return;
  }

  const payments = getPayments();

  const payment =
    payments.find(
      (item) =>
        item.id === paymentId
    );

  if (!payment) return;

  const member =
    prompt(
      "Enter Member Name:",
      payment.memberName
    );

  if (member === null) return;

  const membership =
    prompt(
      "Enter Membership:",
      payment.membership
    );

  if (membership === null) return;

  const amount =
    prompt(
      "Enter Amount:",
      payment.amount
    );

  if (amount === null) return;

  const paymentDate =
    prompt(
      "Enter Payment Date (YYYY-MM-DD):",
      payment.paymentDate
    );

  if (paymentDate === null) return;

  const dueDate =
    prompt(
      "Enter Due Date (YYYY-MM-DD):",
      payment.dueDate
    );

  if (dueDate === null) return;

  const status =
    prompt(
      "Enter Status (paid / pending / overdue):",
      payment.status
    );

  if (status === null) return;

  const cleanStatus =
    status.toLowerCase().trim();

  if (
    !["paid", "pending", "overdue"]
      .includes(cleanStatus)
  ) {
    alert(
      "Invalid status. Use paid, pending or overdue."
    );
    return;
  }

  if (
    !member.trim() ||
    !membership.trim() ||
    !amount.trim()
  ) {
    alert(
      "Required fields cannot be empty."
    );
    return;
  }

  payment.memberName =
    member.trim();

  payment.membership =
    membership.trim();

  payment.amount =
    Number(amount);

  payment.paymentDate =
    paymentDate;

  payment.dueDate =
    dueDate;

  payment.status =
    cleanStatus;

  savePayments(payments);

  const newRow =
    createPaymentRow(payment);

  row.replaceWith(newRow);

  updatePaymentSummary();

  filterPayments();

  alert(
    "Payment updated successfully."
  );
}

// ========================================
// DELETE PAYMENT
// ========================================

function deletePayment(row) {
  const paymentId =
    row.dataset.paymentId;

  if (!paymentId) {
    alert(
      "This payment is part of the original HTML data and cannot be deleted."
    );
    return;
  }

  const payments = getPayments();

  const payment =
    payments.find(
      (item) =>
        item.id === paymentId
    );

  if (!payment) return;

  const confirmDelete =
    confirm(
      `Delete payment ${payment.id}?`
    );

  if (!confirmDelete) return;

  const updatedPayments =
    payments.filter(
      (item) =>
        item.id !== paymentId
    );

  savePayments(updatedPayments);

  row.remove();

  updatePaymentSummary();

  alert(
    "Payment deleted successfully."
  );
}

// ========================================
// TABLE ACTIONS
// ========================================

function setupPaymentActions() {
  const tableBody =
    document.getElementById(
      "paymentTableBody"
    );

  if (!tableBody) return;

  if (
    tableBody.dataset.actionsReady ===
    "true"
  ) {
    return;
  }

  tableBody.dataset.actionsReady =
    "true";

  tableBody.addEventListener(
    "click",
    function (event) {
      const viewButton =
        event.target.closest(
          ".view-payment"
        );

      const editButton =
        event.target.closest(
          ".edit-payment"
        );

      const deleteButton =
        event.target.closest(
          ".delete-payment"
        );

      const row =
        event.target.closest("tr");

      if (!row) return;

      if (viewButton) {
        viewPayment(row);
      }

      if (editButton) {
        editPayment(row);
      }

      if (deleteButton) {
        deletePayment(row);
      }
    }
  );
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupPaymentEvents() {
  const addButton =
    document.getElementById(
      "addPaymentBtn"
    );

  const closeButton =
    document.getElementById(
      "closePaymentModal"
    );

  const cancelButton =
    document.getElementById(
      "cancelPayment"
    );

  const saveButton =
    document.getElementById(
      "savePayment"
    );

  const searchInput =
    document.getElementById(
      "paymentSearch"
    );

  const statusFilter =
    document.getElementById(
      "paymentStatusFilter"
    );

  if (addButton) {
    addButton.addEventListener(
      "click",
      openPaymentModal
    );
  }

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closePaymentModal
    );
  }

  if (cancelButton) {
    cancelButton.addEventListener(
      "click",
      closePaymentModal
    );
  }

  if (saveButton) {
    saveButton.addEventListener(
      "click",
      addPayment
    );
  }

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      filterPayments
    );
  }

  if (statusFilter) {
    statusFilter.addEventListener(
      "change",
      filterPayments
    );
  }
}

// ========================================
// START PAYMENT PAGE
// ========================================

async function startPaymentPage() {
  await loadComponents();

  loadSavedPayments();

  updatePaymentSummary();

  setupPaymentActions();

  setupPaymentEvents();
}

// ========================================
// START
// ========================================

startPaymentPage();
