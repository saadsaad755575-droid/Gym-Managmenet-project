// ========================================
// PAYMENT MANAGEMENT
// ========================================

const PAYMENT_STORAGE_KEY = "gymPayments";
const MEMBER_STORAGE_KEY = "gymMembers";
const MEMBERSHIP_STORAGE_KEY = "gymMemberships";

let editingPaymentId = null;


// ========================================
// LOCAL STORAGE
// ========================================

function getPayments() {
    try {
        return JSON.parse(
            localStorage.getItem(PAYMENT_STORAGE_KEY)
        ) || [];
    } catch (error) {
        return [];
    }
}


function savePayments(payments) {
    localStorage.setItem(
        PAYMENT_STORAGE_KEY,
        JSON.stringify(payments)
    );
}


function getMembers() {
    try {
        return JSON.parse(
            localStorage.getItem(MEMBER_STORAGE_KEY)
        ) || [];
    } catch (error) {
        return [];
    }
}


function getMemberships() {
    try {
        return JSON.parse(
            localStorage.getItem(MEMBERSHIP_STORAGE_KEY)
        ) || [];
    } catch (error) {
        return [];
    }
}


// ========================================
// COMPONENT LOADER
// ========================================

function loadCSS(href, id) {

    if (id && document.getElementById(id)) {
        return;
    }

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

        loadCSS(
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
            "fontAwesomeCSS"
        );


        // =========================
        // SIDEBAR
        // =========================

        const sidebarResponse =
            await fetch("/components/sidebar/sidebar.html");

        if (!sidebarResponse.ok) {
            throw new Error("Sidebar could not be loaded.");
        }

        const sidebarHTML =
            await sidebarResponse.text();

        const sidebarDoc =
            new DOMParser().parseFromString(
                sidebarHTML,"text/html"
            );

        const sidebarElement =
            sidebarDoc.querySelector(".sidebar");


        if (sidebarElement) {

            sidebarElement
                .querySelectorAll("img")
                .forEach((img) => {

                    const src =
                        img.getAttribute("src");

                    if (
                        src &&
                        src.startsWith("../../assets/")
                    ) {
                        img.src =
                            "/" + src.replace("../../", "");
                    }
                });


            sidebarElement
                .querySelectorAll("a[href]")
                .forEach((link) => {

                    const href =
                        link.getAttribute("href");

                    if (
                        href &&
                        href.startsWith("../../admin-dashboard/")
                    ) {
                        link.href =
                            "/" + href.replace("../../", "");
                    }
                });


            const sidebar =
                document.getElementById("sidebar");

            if (sidebar) {

                sidebar.innerHTML = "";

                sidebar.appendChild(
                    sidebarElement
                );
            }


            loadCSS(
                "/components/sidebar/sidebar.css",
                "sidebarCSS"
            );
        }


        // =========================
        // NAVBAR
        // =========================

        const navbarResponse =
            await fetch("/components/navbar/navbar.html");

        if (!navbarResponse.ok) {
            throw new Error("Navbar could not be loaded.");
        }

        const navbarHTML =
            await navbarResponse.text();

        const navbarDoc =
            new DOMParser().parseFromString(
                navbarHTML,
                "text/html"
            );

        const navbarElement =
            navbarDoc.querySelector(".navbar");


        if (navbarElement) {

            navbarElement
                .querySelectorAll("img")
                .forEach((img) => {

                    const src =
                        img.getAttribute("src");

                    if (
                        src &&
                        src.startsWith("../../assets/")
                    ) {
                        img.src =  "/" + src.replace("../../", "");
                    }
                });


            const navbar =
                document.getElementById("navbar");

            if (navbar) {

                navbar.innerHTML = "";

                navbar.appendChild(
                    navbarElement
                );
            }


            loadCSS(
                "/components/navbar/navbar.css",
                "navbarCSS"
            );
        }

    } catch (error) {

        console.error(
            "Component loading error:",  error
        );

        showPageMessage(
            "Sidebar or navbar could not be loaded.","error"
        );
    }
}


// ========================================
// PAGE MESSAGE
// ========================================

function showPageMessage(message, type = "success") {

    const messageElement =
        document.getElementById("paymentMessage");

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;

    messageElement.className = "payment-message " + type;
}


function clearPageMessage() {

    const messageElement =
        document.getElementById("paymentMessage");

    if (!messageElement) {
        return;
    }

    messageElement.textContent = "";
    messageElement.className = "payment-message";
}


// ========================================
// FORM MESSAGE
// ========================================

function showFormMessage(message, type = "error") {

    const messageElement =
        document.getElementById(
            "paymentFormMessage"
        );

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;

    messageElement.className ="payment-form-message " + type;
}


function clearFormMessage() {

    const messageElement =
        document.getElementById(
            "paymentFormMessage"
        );

    if (!messageElement) {
        return;
    }

    messageElement.textContent = "";

    messageElement.className ="payment-form-message";
}


// ========================================
// GET MEMBER ID
// ========================================

function getMemberId(member) {

    return (
        member.id ||  member.memberId ||
        member.customerId ||""
    );
}


// ========================================
// GET MEMBER NAME
// ========================================

function getMemberName(member) {

    return (
        member.name ||member.memberName ||
        member.fullName ||"Unknown Member"
    );
}


// ========================================
// PAYMENT ID
// ========================================

function getNextPaymentId() {

    const payments = getPayments();

    let maxId = 0;

    payments.forEach((payment) => {

        const paymentId =
            String(payment.id || "");

        const match =
            paymentId.match(/^#P(\d+)$/i);

        if (match) {

            const number =
                Number(match[1]);

            if (number > maxId) {
                maxId = number;
            }
        }
    });


    return (
        "#P" +
        String(maxId + 1).padStart(3, "0")
    );
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(value ?? "")
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

    const cleanStatus =
        String(status || "").toLowerCase();

    if (cleanStatus === "paid") {
        return "Paid";
    }

    if (cleanStatus === "pending") {
        return "Pending";
    }

    if (cleanStatus === "overdue") {
        return "Overdue";
    }

    return status || "-";
}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(dateString);

    if (isNaN(date.getTime())) {
        return dateString;
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


// ========================================
// LOAD MEMBERS
// ========================================

function loadMembersIntoSelect() {

    const memberSelect =
        document.getElementById(
            "paymentMember"
        );

    if (!memberSelect) {
        return;
    }


    memberSelect.innerHTML =
        `<option value="">
            Select existing member
        </option>`;


    const members = getMembers();


    if (!members.length) {

        memberSelect.innerHTML =
            `<option value="">
                No members found
            </option>`;

        return;
    }


    members.forEach((member) => {

        const memberId =
            getMemberId(member);

        const memberName =
            getMemberName(member);


        if (!memberId) {
            return;
        }


        const option =
            document.createElement("option");

        option.value = memberId;

        option.textContent =
            `${memberName} (${memberId})`;

        memberSelect.appendChild(option);
    });
}


// ========================================
// LOAD MEMBERSHIP FOR MEMBER
// ========================================

function loadMembershipsForMember(memberId) {

    const membershipSelect =
        document.getElementById(
            "paymentMembership"
        );

    const amountInput =
        document.getElementById(
            "paymentAmount"
        );


    if (!membershipSelect) {
        return;
    }


    membershipSelect.innerHTML =
        `<option value="">
            Select membership
        </option>`;


    if (amountInput) {
        amountInput.value = "";
    }


    if (!memberId) {
        return;
    }


    const memberships =   getMemberships();


    const memberMemberships =
        memberships.filter((membership) => {

            return String(
                membership.memberId || ""
            ).trim().toLowerCase()  ===
            String(memberId)
                .trim()
                .toLowerCase();
        });


    if (!memberMemberships.length) {

        membershipSelect.innerHTML =
            `<option value="">
                No membership found for this member
            </option>`;

        return;
    }


    memberMemberships.forEach(
        (membership, index) => {

            const option =
                document.createElement("option");

            option.value =
                String(
                    memberships.indexOf(membership)
                );

            const plan =
                membership.plan ||
                membership.membershipPlan ||"Membership";

            const duration =
                membership.duration
                    ? ` - ${membership.duration}`   : "";

            const price =
                membership.price != null
                    ? ` - Rs. ${Number(
                        membership.price
                    ).toLocaleString()}`  : "";

            option.textContent =
                `${plan}${duration}${price}`;

            membershipSelect.appendChild(
                option
            );
        }
    );
}


// ========================================
// MEMBERSHIP CHANGE
// ========================================

function handleMembershipChange() {

    const membershipSelect =
        document.getElementById(
            "paymentMembership"
        );

    const amountInput =
        document.getElementById(
            "paymentAmount"
        );


    if (
        !membershipSelect ||
        !amountInput
    ) {
        return;
    }


    const selectedIndex = membershipSelect.value;


    if (selectedIndex === "") {
        amountInput.value = "";
        return;
    }


    const memberships = getMemberships();


    const membership =
        memberships[
            Number(selectedIndex)
        ];


    if (!membership) {
        amountInput.value = "";
        return;
    }


    if (
        membership.price !== undefined &&
        membership.price !== null
    ) {

        amountInput.value = membership.price;
    }
}


// ========================================
// CREATE PAYMENT ROW
// ========================================

function createPaymentRow(payment) {

    const row =
        document.createElement("tr");

    row.dataset.paymentId =
        payment.id;


    row.innerHTML = `
        <td>
            ${escapeHTML(payment.id)}
        </td>

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
            Rs. ${Number(
                payment.amount || 0
            ).toLocaleString()}
        </td>

        <td>
            ${formatDate(payment.paymentDate)}
        </td>

        <td>
            ${formatDate(payment.dueDate)}
        </td>

        <td>
            <span class="payment-status ${escapeHTML(
                payment.status
            )}">
                ${getStatusText(payment.status)}
            </span>
        </td>

        <td>

            <div class="table-actions">

                <button
                    class="action-btn view-payment"
                    title="View">
                    <i class="fa-solid fa-eye"></i>
                </button>

                <button
                    class="action-btn edit-payment"
                    title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="action-btn delete-payment"
                    title="Delete" >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        </td>`;


    return row;
}


// ========================================
// RENDER PAYMENTS
// ========================================

function renderPayments() {

    const tableBody =
        document.getElementById(
            "paymentTableBody"
        );

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    const payments =
        getPayments();


    payments.forEach((payment) => {

        tableBody.appendChild(
            createPaymentRow(payment)
        );
    });


    updateEmptyMessage();

    filterPayments();
}


// ========================================
// EMPTY MESSAGE
// ========================================

function updateEmptyMessage() {

    const emptyMessage =
        document.getElementById(
            "emptyPaymentMessage"
        );

    const tableBody =
        document.getElementById(
            "paymentTableBody"
        );


    if (
        !emptyMessage ||
        !tableBody
    ) {
        return;
    }


    const visibleRows =
        [...tableBody.querySelectorAll("tr")]
            .filter(
                (row) => row.style.display !== "none"
            );


    emptyMessage.style.display =
        visibleRows.length === 0 ? "block" : "none";
}


// ========================================
// UPDATE SUMMARY
// ========================================

function updatePaymentSummary() {

    const payments =
        getPayments();


    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;


    payments.forEach((payment) => {

        const amount =Number(payment.amount) || 0;

        const status =
            String(
                payment.status || ""
            ).toLowerCase();


        if (status === "paid") {
            totalPaid += amount;
        }

        if (status === "pending") {
            totalPending += amount;
        }

        if (status === "overdue") {
            totalOverdue += amount;
        }
    });


    const totalRevenue =totalPaid;


    document.getElementById("totalPaid"
    ).textContent = `Rs. ${totalPaid.toLocaleString()}`;


    document.getElementById( "totalPending"
    ).textContent =  `Rs. ${totalPending.toLocaleString()}`;


    document.getElementById("totalOverdue"
    ).textContent =  `Rs. ${totalOverdue.toLocaleString()}`;


    document.getElementById("totalRevenue"
    ).textContent =`Rs. ${totalRevenue.toLocaleString()}`;
}


// ========================================
// SEARCH + FILTER
// ========================================

function filterPayments() {

    const searchInput =document.getElementById(
            "paymentSearch"
        );

    const statusFilter =
        document.getElementById(
            "paymentStatusFilter"
        );

    const tableBody =
        document.getElementById(
            "paymentTableBody"
        );


    if (
        !searchInput ||  !statusFilter ||
        !tableBody
    ) {
        return;
    }


    const searchText =
        searchInput.value.toLowerCase().trim();


    const selectedStatus =statusFilter.value;


    const rows = tableBody.querySelectorAll("tr");


    rows.forEach((row) => {

        const rowText =row.innerText.toLowerCase();


        const statusElement =
            row.querySelector(".payment-status"
            );


        const rowStatus =statusElement
                ? [...statusElement.classList]
                    .find((className) =>
                        [
                            "paid","pending","overdue"
                        ].includes(className)) : "";


        const matchesSearch =
            rowText.includes( searchText
            );


        const matchesStatus =
            selectedStatus === "all" ||
            rowStatus === selectedStatus;


        row.style.display = matchesSearch &&
            matchesStatus   ? "" : "none";
    });


    updateEmptyMessage();
}



//==================================
// OPEN MODAL
// ========================================

function openPaymentModal() {

    const modal = document.getElementById(
            "paymentModal"
        );


    if (!modal) {
        return;
    }


    editingPaymentId = null;


    document.getElementById(
        "paymentModalTitle"
    ).textContent ="Add Payment";


    document.getElementById(
        "savePaymentText"
    ).textContent ="Add Payment";


    clearPaymentForm();

    loadMembersIntoSelect();

    clearFormMessage();


    modal.style.display = "flex";
}


// ========================================
// CLOSE MODAL
// ========================================

function closePaymentModal() {

    const modal =document.getElementById(
            "paymentModal"
        );


    if (!modal) {
        return;
    }


    modal.style.display =  "none";


    editingPaymentId = null;

    clearFormMessage();
}


// ========================================
// CLEAR FORM
// ========================================

function clearPaymentForm() {

    const member =
        document.getElementById(
            "paymentMember"
        );

    const membership =
        document.getElementById(
            "paymentMembership"
        );

    const amount =
        document.getElementById(
            "paymentAmount"
        );

    const paymentDate =
        document.getElementById(
            "paymentDate"
        );

    const dueDate =
        document.getElementById(
            "paymentDueDate"
        );

    const status =
        document.getElementById(
            "paymentStatus"
        );


    if (member) {
        member.value = "";
    }

    if (membership) {

        membership.innerHTML =
            `<option value="">
                Select membership
            </option>`;
    }

    if (amount) {
        amount.value = "";
    }

    if (paymentDate) {
        paymentDate.value = "";
    }

    if (dueDate) {
        dueDate.value = "";
    }

    if (status) {
        status.value = "paid";
    }
}


// ========================================
// VALIDATE PAYMENT
// ========================================

function validatePaymentForm() {

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


    if (!memberSelect.value) {

        showFormMessage(
            "Please select an existing member."
        );

        return false;
    }


    if (!membershipSelect.value) {

        showFormMessage(
            "Please select a membership."
        );

        return false;
    }


    if (
        !amountInput.value ||
        Number(amountInput.value) <= 0
    ) {

        showFormMessage(
            "Please enter a valid payment amount."
        );

        return false;
    }


    if (!paymentDateInput.value) {

        showFormMessage(
            "Please select the payment date."
        );

        return false;
    }


    if (!dueDateInput.value) {

        showFormMessage(
            "Please select the due date."
        );

        return false;
    }


    if (
        new Date(paymentDateInput.value) >
        new Date(dueDateInput.value)
    ) {

        showFormMessage(
            "Due date cannot be earlier than payment date."
        );

        return false;
    }


    return true;
}


// ========================================
// ADD PAYMENT
// ========================================

function addPayment() {

    if (!validatePaymentForm()) {
        return;
    }


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


    const memberId = memberSelect.value;


    const selectedMember =
        getMembers().find(
            (member) =>
                String(
                    getMemberId(member)
                ).toLowerCase() ===
                String(memberId).toLowerCase()
        );


    if (!selectedMember) {

        showFormMessage(
            "Selected member could not be found in gymMembers."
        );

        return;
    }


    const memberName =  getMemberName(selectedMember);


    const selectedMembership = getMemberships()[
            Number(
                membershipSelect.value
            )
        ];


    if (!selectedMembership) {

        showFormMessage(
            "Selected membership could not be found."
        );

        return;
    }


    const membershipName =
        selectedMembership.plan ||
        selectedMembership.membershipPlan || "Membership";


    const payment = {

        id: getNextPaymentId(),

        memberId: memberId,

        memberName: memberName,

        membership: membershipName,

        membershipPlan: membershipName,

        amount:
            Number(amountInput.value),

        paymentDate:
            paymentDateInput.value,

        dueDate:
            dueDateInput.value,

        status:
            statusSelect.value
    };


    const payments =  getPayments();


    payments.push(payment);

    savePayments(payments);


    renderPayments();

    updatePaymentSummary();


    closePaymentModal();


    showPageMessage(
        `Payment ${payment.id} added successfully.`, "success"
    );
}
// ========================================
// VIEW PAYMENT
// ========================================

function viewPayment(row) {

    const paymentId =
        row.dataset.paymentId;


    const payments = getPayments();


    const payment =
        payments.find(
            (item) =>
                item.id === paymentId
        );


    if (!payment) {

        showPageMessage(
            "Payment details could not be found.", "error"
        );

        return;
    }


    const memberId =
        payment.memberId || "-";


    const details =
        [
            `Payment ID: ${payment.id}`,
            `Member: ${payment.memberName}`,
            `Member ID: ${memberId}`,
            `Membership: ${payment.membership}`,
            `Amount: Rs. ${Number(
                payment.amount || 0
            ).toLocaleString()}`,
            `Payment Date: ${formatDate(
                payment.paymentDate
            )}`,
            `Due Date: ${formatDate(
                payment.dueDate
            )}`,
            `Status: ${getStatusText(
                payment.status
            )}`
        ].join(" • ");


    showPageMessage(
        details, "success"
    );
}


// ========================================
// EDIT PAYMENT
// ========================================

function editPayment(row) {

    const paymentId =  row.dataset.paymentId;


    const payments = getPayments();


    const payment =
        payments.find(
            (item) =>
                item.id === paymentId
        );


    if (!payment) {

        showPageMessage(
            "Payment could not be found.", "error"
        );

        return;
    }


    editingPaymentId = paymentId;


    openPaymentModal();


    editingPaymentId = paymentId;


    document.getElementById(
        "paymentModalTitle"
    ).textContent = "Edit Payment";


    document.getElementById(
        "savePaymentText"
    ).textContent = "Update Payment";


    const memberSelect =
        document.getElementById(
            "paymentMember"
        );


    memberSelect.value =  payment.memberId;


    loadMembershipsForMember(
  payment.memberId
    );


    /*
     * Membership record search
     */

    const memberships = getMemberships();


    const membershipIndex =
        memberships.findIndex(
            (membership) => {

                const memberMatch =
                    String(
                        membership.memberId || ""
                    ).toLowerCase() ===
                    String(
                        payment.memberId || ""
                    ).toLowerCase();

                const plan =
                    membership.plan ||
                    membership.membershipPlan ||"";

                return (
                    memberMatch &&
                    plan === payment.membership
                );
            }
        );


    if (membershipIndex !== -1) {

        document.getElementById(
            "paymentMembership"
        ).value =
            String(membershipIndex);
    }


    document.getElementById(
        "paymentAmount"
    ).value =
        payment.amount;


    document.getElementById(
        "paymentDate"
    ).value =
        payment.paymentDate;


    document.getElementById(
        "paymentDueDate"
    ).value =
        payment.dueDate;


    document.getElementById(
        "paymentStatus"
    ).value =
        payment.status;


    clearFormMessage();
}


// ========================================
// UPDATE PAYMENT
// ========================================

function updatePayment() {

    if (!validatePaymentForm()) {
        return;
    }


    const payments =
        getPayments();


    const payment =
        payments.find(
            (item) =>
                item.id === editingPaymentId
        );


    if (!payment) {

        showFormMessage(
            "Payment could not be found."
        );

        return;
    }


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


    const memberId =
        memberSelect.value;


    const member =
        getMembers().find(
            (item) =>
                String(
                    getMemberId(item)
                ).toLowerCase() ===
                String(memberId).toLowerCase()
        );


    const membership =
        getMemberships()[
            Number( membershipSelect.value  )
        ];


    if (!member || !membership) {

        showFormMessage(
            "Member or membership data could not be found."
        );

        return;
    }


    payment.memberId = memberId;

    payment.memberName = getMemberName(member);

    payment.membership =
        membership.plan ||
        membership.membershipPlan || "Membership";

    payment.membershipPlan = payment.membership;

    payment.amount =  Number(amountInput.value);

    payment.paymentDate = paymentDateInput.value;

    payment.dueDate = dueDateInput.value;

    payment.status =  statusSelect.value;


    savePayments(payments);


    renderPayments();

    updatePaymentSummary();

    closePaymentModal();


    showPageMessage(
        `Payment ${payment.id} updated successfully.`,"success"
    );
}


// ========================================
// DELETE PAYMENT
// ========================================

function deletePayment(row) {

    const paymentId =  row.dataset.paymentId;


    const payments = getPayments();


    const payment =
        payments.find(
            (item) =>
                item.id === paymentId
        );


    if (!payment) {

        showPageMessage(
            "Payment could not be found.",  "error"
        );

        return;
    }

    const updatedPayments =
        payments.filter(
            (item) =>
                item.id !== paymentId
        );


    savePayments(updatedPayments);


    renderPayments();

    updatePaymentSummary();


    showPageMessage(
        `Payment ${payment.id} deleted successfully.`,  "success"
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


    if (!tableBody) {
        return;
    }


    if (
        tableBody.dataset.actionsReady ==="true"
    ) {
        return;
    }


    tableBody.dataset.actionsReady = "true";


    tableBody.addEventListener(
        "click",
        function (event) {

            const row = event.target.closest("tr");


            if (!row) {
                return;
            }


            if (
                event.target.closest(
                    ".view-payment"
                )
            ) {

                viewPayment(row);
                return;
            }


            if (
                event.target.closest(
                    ".edit-payment"
                )
            ) {

                editPayment(row);
                return;
            }


            if (
                event.target.closest(
                    ".delete-payment"
                )
            ) {

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

    const memberSelect =
        document.getElementById(
            "paymentMember"
        );

    const membershipSelect =
        document.getElementById(
            "paymentMembership"
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
            function () {

                if (editingPaymentId) {
                    updatePayment();
                } else {
                    addPayment();
                }

            }
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


    if (memberSelect) {

        memberSelect.addEventListener(
            "change",
            function () {

                loadMembershipsForMember(
                    memberSelect.value
                );

                clearFormMessage();
            }
        );
    }


    if (membershipSelect) {

        membershipSelect.addEventListener(
            "change",
            handleMembershipChange
        );
    }


    window.addEventListener(
        "click",
        function (event) {

            const modal =
                document.getElementById(
                    "paymentModal"
                );

            if (
                event.target === modal
            ) {

                closePaymentModal();
            }
        }
    );
}


// ========================================
// START PAYMENT PAGE
// ========================================

async function startPaymentPage() {

    await loadComponents();

    loadMembersIntoSelect();

    renderPayments();

    updatePaymentSummary();

    setupPaymentActions();

    setupPaymentEvents();
}


// ========================================
// START
// ========================================

startPaymentPage();


