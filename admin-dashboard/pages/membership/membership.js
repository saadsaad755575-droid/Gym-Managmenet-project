
/* =========================================================
   MEMBERSHIP MANAGEMENT JS
   Existing Logic + Membership Start/Expiry Date
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const MEMBER_STORAGE_KEY = "gymMembers";
const MEMBERSHIP_STORAGE_KEY = "gymMemberships";


/* =========================================================
   MEMBERSHIP PLANS
========================================================= */

const membershipPlans = {
  "Monthly": {
    duration: "1 Month",
    price: 2500
  },

  "3 Months": {
    duration: "3 Months",
    price: 6500
  },

  "6 Months": {
    duration: "6 Months",
    price: 11000
  },

  "Yearly": {
    duration: "12 Months",
    price: 20000
  }
};


/* =========================================================
   VALID PAYMENT STATUSES
========================================================= */

const validPaymentStatuses = [
  "Paid",
  "Pending",
  "Overdue"
];


/* =========================================================
   LOAD CSS
========================================================= */

function loadCSS(href) {

  if (document.querySelector(`link[href="${href}"]`)) {
    return;
  }

  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href = href;

  document.head.appendChild(link);
}


/* =========================================================
   LOAD COMPONENTS
========================================================= */

async function loadComponents() {

  try {

    const sidebarContainer =
      document.getElementById("sidebar");

    const navbarContainer =
      document.getElementById("navbar");


    /* =========================
       LOAD SIDEBAR
    ========================== */

    if (sidebarContainer) {

      const sidebarResponse =
        await fetch("/components/sidebar/sidebar.html");

      if (!sidebarResponse.ok) {
        throw new Error("Sidebar component could not be loaded.");
      }

      sidebarContainer.innerHTML =
        await sidebarResponse.text();

      loadCSS("/components/sidebar/sidebar.css");
    }


    /* =========================
       LOAD NAVBAR
    ========================== */

    if (navbarContainer) {

      const navbarResponse =
        await fetch("/components/navbar/navbar.html");

      if (!navbarResponse.ok) {
        throw new Error("Navbar component could not be loaded.");
      }

      navbarContainer.innerHTML =
        await navbarResponse.text();

      loadCSS("/components/navbar/navbar.css");
    }


    /* =========================
       FONT AWESOME
    ========================== */

    if (
      !document.querySelector(
        'link[href*="font-awesome"]'
      )
    ) {

      const fontAwesome =
        document.createElement("link");

      fontAwesome.rel = "stylesheet";

      fontAwesome.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";

      document.head.appendChild(fontAwesome);
    }


  } catch (error) {

    console.error(
      "Component loading error:",
      error
    );

  }

}


/* =========================================================
   GET SAVED MEMBERS
========================================================= */

function getSavedMembers() {

  try {

    const members =
      JSON.parse(
        localStorage.getItem(MEMBER_STORAGE_KEY)
      );

    return Array.isArray(members)
      ? members
      : [];

  } catch (error) {

    console.error(
      "Error reading gymMembers:",
      error
    );

    return [];
  }
}


/* =========================================================
   GET SAVED MEMBERSHIPS
========================================================= */

function getSavedMemberships() {

  try {

    const memberships =
      JSON.parse(
        localStorage.getItem(
          MEMBERSHIP_STORAGE_KEY
        )
      );

    return Array.isArray(memberships)
      ? memberships
      : [];

  } catch (error) {

    console.error(
      "Error reading gymMemberships:",
      error
    );

    return [];
  }
}


/* =========================================================
   SAVE MEMBERSHIPS
========================================================= */

function saveMemberships(memberships) {

  localStorage.setItem(
    MEMBERSHIP_STORAGE_KEY,
    JSON.stringify(memberships)
  );

}


/* =========================================================
   FIND MEMBER
========================================================= */

function findMember(memberId) {

  const members =
    getSavedMembers();

  return members.find(member => {

    const id =
      member.memberId ||
      member.id ||
      member.memberID;

    return String(id) === String(memberId);

  });

}


/* =========================================================
   GET MEMBER ID
========================================================= */

function getMemberId(member) {

  return (
    member.memberId ||
    member.id ||
    member.memberID ||
    ""
  );

}


/* =========================================================
   GET MEMBER NAME
========================================================= */

function getMemberName(member) {

  return (
    member.memberName ||
    member.name ||
    member.fullName ||
    "Unknown Member"
  );

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

  const numericPrice =
    Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Rs. 0";
  }

  return `Rs. ${numericPrice.toLocaleString()}`;

}


/* =========================================================
   NORMALIZE PAYMENT STATUS
========================================================= */

function normalizePaymentStatus(status) {

  const cleanedStatus =
    String(status || "")
      .trim();

  const matchedStatus =
    validPaymentStatuses.find(
      item =>
        item.toLowerCase() ===
        cleanedStatus.toLowerCase()
    );

  return matchedStatus || "Pending";

}


/* =========================================================
   GET TODAY DATE
   Format: YYYY-MM-DD
========================================================= */

function getTodayDate() {

  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

  if (!dateString) {
    return "Not Set";
  }

  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  if (isNaN(date.getTime())) {
    return "Not Set";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


/* =========================================================
   ADD MONTHS SAFELY
   Prevents month-end date problems
========================================================= */

function addMonthsSafely(
  date,
  months
) {

  const originalDay =
    date.getDate();

  date.setDate(1);

  date.setMonth(
    date.getMonth() + months
  );

  const lastDayOfMonth =
    new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

  date.setDate(
    Math.min(
      originalDay,
      lastDayOfMonth
    )
  );

  return date;

}


/* =========================================================
   CALCULATE EXPIRY DATE
========================================================= */

function calculateExpiryDate(
  startDate,
  plan
) {

  if (!startDate || !plan) {
    return "";
  }

  const date =
    new Date(
      `${startDate}T00:00:00`
    );

  if (isNaN(date.getTime())) {
    return "";
  }


  /* =========================
     MONTHLY
  ========================== */

  if (plan === "Monthly") {

    addMonthsSafely(
      date,
      1
    );

  }


  /* =========================
     3 MONTHS
  ========================== */

  else if (plan === "3 Months") {

    addMonthsSafely(
      date,
      3
    );

  }


  /* =========================
     6 MONTHS
  ========================== */

  else if (plan === "6 Months") {

    addMonthsSafely(
      date,
      6
    );

  }


  /* =========================
     YEARLY
  ========================== */

  else if (plan === "Yearly") {

    date.setFullYear(
      date.getFullYear() + 1
    );

  }


  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}

/* =========================================================
   CREATE MEMBERSHIP ROW
========================================================= */

function createMembershipRow(
  membership
) {

  const row =
    document.createElement("tr");

  row.innerHTML = `

    <td>
      ${membership.memberId || "-"}
    </td>

    <td>
      ${membership.memberName || "-"}
    </td>

    <td>
      ${membership.plan || "-"}
    </td>

    <td>
      ${membership.duration || "-"}
    </td>

    <td>
      ${formatPrice(membership.price)}
    </td>

    <td>
      <span class="payment-status ${String(
        membership.paymentStatus || "Pending"
      ).toLowerCase()}">
        ${membership.paymentStatus || "Pending"}
      </span>
    </td>

    <td>
      <button
        class="manage-membership-btn"
        data-member-id="${membership.memberId}"
      >
        <i class="fa-solid fa-pen-to-square"></i>
        Manage
      </button>
    </td>

  `;

  return row;

}


/* =========================================================
   RENDER MEMBERSHIPS
========================================================= */

function renderMemberships() {

  const tableBody =
    document.getElementById(
      "membershipTableBody"
    );

  if (!tableBody) {
    return;
  }


  const memberships =
    getSavedMemberships();


  tableBody.innerHTML = "";


  /* =========================
     NO MEMBERSHIP
  ========================== */

  if (memberships.length === 0) {

    tableBody.innerHTML = `

      <tr>

        <td
          colspan="7"
          style="text-align:center;"
        >

          No memberships found.

        </td>

      </tr>

    `;

    updatePaymentStatusCounts();

    return;
  }


  /* =========================
     CREATE ROWS
  ========================== */

  memberships.forEach(
    membership => {

      tableBody.appendChild(
        createMembershipRow(
          membership
        )
      );

    }
  );


  updatePaymentStatusCounts();

}


/* =========================================================
   UPDATE PAYMENT STATUS COUNTS
========================================================= */

function updatePaymentStatusCounts() {

  const memberships =
    getSavedMemberships();


  const paidCount =
    memberships.filter(
      membership =>
        normalizePaymentStatus(
          membership.paymentStatus
        ) === "Paid"
    ).length;


  const pendingCount =
    memberships.filter(
      membership =>
        normalizePaymentStatus(
          membership.paymentStatus
        ) === "Pending"
    ).length;


  const overdueCount =
    memberships.filter(
      membership =>
        normalizePaymentStatus(
          membership.paymentStatus
        ) === "Overdue"
    ).length;


  const paidElement =
    document.getElementById(
      "paidCount"
    );

  const pendingElement =
    document.getElementById(
      "pendingCount"
    );

  const overdueElement =
    document.getElementById(
      "overdueCount"
    );


  if (paidElement) {
    paidElement.textContent =
      paidCount;
  }

  if (pendingElement) {
    pendingElement.textContent =
      pendingCount;
  }

  if (overdueElement) {
    overdueElement.textContent =
      overdueCount;
  }

}


/* =========================================================
   ADD MEMBERSHIP
========================================================= */

function addMembership() {

  const members =
    getSavedMembers();


  /* =========================
     CHECK MEMBERS
  ========================== */

  if (members.length === 0) {

    alert(
      "No members found. Please add a member first."
    );

    return;
  }


  /* =========================
     MEMBER ID
  ========================== */

  const memberIdInput =
    prompt(
      "Enter Member ID:"
    );


  if (
    memberIdInput === null
  ) {
    return;
  }


  const memberId =
    memberIdInput.trim();


  if (!memberId) {

    alert(
      "Member ID is required."
    );

    return;
  }


  /* =========================
     FIND MEMBER
  ========================== */

  const member =
    findMember(memberId);


  if (!member) {

    alert(
      "Member not found. Please enter a valid Member ID."
    );

    return;
  }


  /* =========================
     SELECT PLAN
  ========================== */

  const planInput =
    prompt(
      "Enter Membership Plan:\n\nMonthly\n3 Months\n6 Months\nYearly"
    );


  if (
    planInput === null
  ) {
    return;
  }


  const cleanedPlan =
    planInput.trim();


  /* =========================
     VALIDATE PLAN
  ========================== */

  if (
    !membershipPlans[
      cleanedPlan
    ]
  ) {

    alert(
      "Invalid membership plan."
    );

    return;
  }


  const planData =
    membershipPlans[
      cleanedPlan
    ];


  /* =========================
     PAYMENT STATUS
  ========================== */

  const paymentStatusInput =
    prompt(
      "Enter Payment Status:\n\nPaid\nPending\nOverdue"
    );


  if (
    paymentStatusInput === null
  ) {
    return;
  }


  const normalizedStatus =
    normalizePaymentStatus(
      paymentStatusInput
    );


  /* =========================
     CHECK DUPLICATE
  ========================== */

  const memberships =
    getSavedMemberships();


  const existingMembership =
    memberships.find(
      membership =>
        String(
          membership.memberId
        ) === String(memberId)
    );


  if (existingMembership) {

    alert(
      "This member already has a membership. Please use Manage Membership."
    );

    return;
  }


  /* =====================================================
     CREATE START + EXPIRY DATE
  ===================================================== */

  const startDate =
    getTodayDate();


  const expiryDate =
    calculateExpiryDate(
      startDate,
      cleanedPlan
    );


  /* =========================
     CREATE MEMBERSHIP
  ========================== */

  const membership = {

    memberId:
      getMemberId(member),

    memberName:
      getMemberName(member),

    plan:
      cleanedPlan,

    duration:
      planData.duration,

    price:
      planData.price,

    paymentStatus:
      normalizedStatus,

    startDate:
      startDate,

    expiryDate:
      expiryDate

  };


  /* =========================
     SAVE
  ========================== */

  memberships.push(
    membership
  );


  saveMemberships(
    memberships
  );


  /* =========================
     REFRESH UI
  ========================== */

  renderMemberships();


  /* =========================
     SUCCESS MESSAGE
  ========================== */

  alert(

    `Membership added successfully!\n\n` +

    `Member: ${membership.memberName}\n` +

    `Plan: ${membership.plan}\n` +

    `Start Date: ${formatDate(
      membership.startDate
    )}\n` +

    `Expiry Date: ${formatDate(
      membership.expiryDate
    )}\n\n` +

    `Payment Status: ${membership.paymentStatus}`

  );

}


/* =========================================================
   MANAGE MEMBERSHIP
========================================================= */

function manageMembership(
  memberId
) {

  const memberships =
    getSavedMemberships();


  const membershipIndex =
    memberships.findIndex(
      membership =>
        String(
          membership.memberId
        ) === String(memberId)
    );


  /* =========================
     MEMBERSHIP NOT FOUND
  ========================== */

  if (
    membershipIndex === -1
  ) {

    alert(
      "Membership not found."
    );

    return;
  }


  const membership =
    memberships[
      membershipIndex
    ];


  /* =========================
     CURRENT / OLD PLAN
  ========================== */

  const currentPlan =
    membership.plan || "Monthly";

  const oldPlan =
    membership.plan || "Monthly";


  /* =========================
     CHANGE PLAN
  ========================== */

  const planInput =
    prompt(

      `Enter Membership Plan:\n\n` +

      `Monthly\n` +
      `3 Months\n` +
      `6 Months\n` +
      `Yearly\n\n` +

      `Current Plan: ${currentPlan}`

    );


  if (
    planInput === null
  ) {
    return;
  }


  const cleanedPlan =
    planInput.trim();


  /* =========================
     VALIDATE PLAN
  ========================== */

  if (
    !membershipPlans[
      cleanedPlan
    ]
  ) {

    alert(
      "Invalid membership plan."
    );

    return;
  }


  const planData =
    membershipPlans[
      cleanedPlan
    ];


  /* =========================
     PAYMENT STATUS
  ========================== */

  const paymentStatusInput =
    prompt(

      `Enter Payment Status:\n\n` +

      `Paid\n` +
      `Pending\n` +
      `Overdue\n\n` +

      `Current Status: ${
        membership.paymentStatus ||
        "Pending"
      }`

    );


  if (
    paymentStatusInput === null
  ) {
    return;
  }


  const normalizedStatus =
    normalizePaymentStatus(
      paymentStatusInput
    );


  /* =====================================================
     UPDATE MEMBERSHIP INFORMATION
  ===================================================== */

  membership.plan =
    cleanedPlan;

  membership.duration =
    planData.duration;

  membership.price =
    planData.price;

  membership.paymentStatus =
    normalizedStatus;


  /* =====================================================
     RENEWAL DATE LOGIC
  ===================================================== */

  const today =
    getTodayDate();


  const currentExpiry =
    membership.expiryDate || "";


  let shouldRenew =
    false;


  /* =========================
     DATE MISSING
  ========================== */

  if (
    !membership.startDate ||
    !membership.expiryDate
  ) {

    shouldRenew = true;

  }


  /* =========================
     PLAN CHANGED
  ========================== */

  if (
    oldPlan !== cleanedPlan
  ) {

    shouldRenew = true;

  }


  /* =========================
     CHECK EXPIRED
  ========================== */

  if (currentExpiry) {

    const todayDate =
      new Date(
        `${today}T00:00:00`
      );


    const expiryDate =
      new Date(
        `${currentExpiry}T00:00:00`
      );


    if (
      expiryDate < todayDate
    ) {

      shouldRenew = true;

    }

  }


  /* =====================================================
     RENEW MEMBERSHIP
  ===================================================== */

  if (shouldRenew) {

    const newStartDate =
      today;


    const newExpiryDate =
      calculateExpiryDate(
        newStartDate,
        cleanedPlan
      );


    membership.startDate =
      newStartDate;


    membership.expiryDate =
      newExpiryDate;

  }


  /* =========================
     SAVE
  ========================== */

  memberships[
    membershipIndex
  ] = membership;


  saveMemberships(
    memberships
  );


  /* =========================
     REFRESH
  ========================== */

  renderMemberships();


  /* =========================
     SUCCESS MESSAGE
  ========================== */

  alert(

    `Membership updated successfully!\n\n` +

    `Member: ${membership.memberName}\n` +

    `Plan: ${membership.plan}\n` +

    `Start Date: ${formatDate(
      membership.startDate
    )}\n` +

    `Expiry Date: ${formatDate(
      membership.expiryDate
    )}\n\n` +

    `Payment Status: ${membership.paymentStatus}`

  );

}


/* =========================================================
   PLAN BUTTONS
========================================================= */

function setupPlanButtons() {

  const planButtons =
    document.querySelectorAll(
      ".plan-btn"
    );


  planButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        function () {

          const planCard =
            button.closest(
              ".plan-card"
            );


          if (!planCard) {
            return;
          }


          const planHeading =
            planCard.querySelector(
              "h3"
            );


          if (!planHeading) {
            return;
          }


          const selectedPlan =
            planHeading.textContent.trim();


          const memberIdInput =
            prompt(
              `Enter Member ID for ${selectedPlan}:`
            );


          if (
            memberIdInput === null
          ) {
            return;
          }


          const memberId =
            memberIdInput.trim();


          if (!memberId) {

            alert(
              "Member ID is required."
            );

            return;
          }


          const membership =
            getSavedMemberships()
              .find(
                item =>
                  String(
                    item.memberId
                  ) === String(memberId)
              );


          if (!membership) {

            alert(
              "No membership found for this member."
            );

            return;
          }


          /* =========================
             USE EXISTING MANAGE LOGIC
          ========================== */

          manageMembership(
            memberId
          );

        }
      );

    }
  );

}


/* =========================================================
   TABLE BUTTONS
========================================================= */

function setupTableButtons() {

  const tableBody =
    document.getElementById(
      "membershipTableBody"
    );


  if (!tableBody) {
    return;
  }


  tableBody.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(
          ".manage-membership-btn"
        );


      if (!button) {
        return;
      }


      const memberId =
        button.dataset.memberId;


      if (!memberId) {
        return;
      }


      manageMembership(
        memberId
      );

    }
  );

}


/* =========================================================
   ADD MEMBERSHIP BUTTON
========================================================= */

function setupAddMembershipButton() {

  const addButton =
    document.getElementById(
      "addMembershipBtn"
    );


  if (!addButton) {

    console.warn(
      "addMembershipBtn not found."
    );

    return;
  }


  addButton.addEventListener(
    "click",
    addMembership
  );

}


/* =========================================================
   START MEMBERSHIP PAGE
========================================================= */

async function startMembershipPage() {

  /* =========================
     LOAD COMPONENTS
  ========================== */

  await loadComponents();


  /* =========================
     RENDER MEMBERSHIPS
  ========================== */

  renderMemberships();


  /* =========================
     ADD BUTTON
  ========================== */

  setupAddMembershipButton();


  /* =========================
     PLAN BUTTONS
  ========================== */

  setupPlanButtons();


  /* =========================
     TABLE BUTTONS
  ========================== */

  setupTableButtons();

}


/* =========================================================
   START MEMBERSHIP PAGE
========================================================= */

startMembershipPage();
