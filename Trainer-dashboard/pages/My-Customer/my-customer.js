

/* =========================
   MY CUSTOMERS JS
========================= */


/* =========================
   STORAGE
========================= */

const MEMBER_STORAGE_KEY = "gymMembers";


/* =========================
   CURRENT TRAINER
========================= */

function getCurrentTrainer(){
    const savedTrainer=
    localStorage.getItem("currentTrainer");
    return savedTrainer || "Ahmed Khan"
}


/* =========================
   LOAD COMPONENT
========================= */

async function loadComponent(containerId, filePath) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(filePath);

        if (!response.ok) {

            throw new Error(
                "Component not found: " + filePath
            );

        }

        const html =
            await response.text();

        container.innerHTML =
            html;

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `
            <p style="
                color:#f5b900;
                padding:20px;
            ">
                Component could not be loaded.
            </p>
        `;

    }

}


/* =========================
   GET SAVED MEMBERS
========================= */

function getSavedMembers() {

    const savedMembers =
        localStorage.getItem(
            MEMBER_STORAGE_KEY
        );

    if (!savedMembers) {
        return [];
    }

    try {

        const members =
            JSON.parse(savedMembers);

        return Array.isArray(members)
            ? members
            : [];

    }

    catch (error) {

        console.error(
            "Could not read members:",
            error
        );

        return [];

    }

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================
   LOAD MY CUSTOMERS
========================= */

function loadMyCustomers() {

    const tableContainer =
        document.getElementById(
            "trainer-table"
        );

    if (!tableContainer) {
        console.error(
            "Trainer table container not found."
        );
        return;
    }


    const table =
        tableContainer.querySelector(
            ".trainer-table-container table"
        );

    if (!table) {

        console.error(
            "Trainer table HTML not found."
        );

        return;

    }


    const tableBody =
        table.querySelector("tbody");

    if (!tableBody) {
        return;
    }


    const allMembers =
        getSavedMembers();


      

const CURRENT_TRAINER = getCurrentTrainer();

const myCustomers = allMembers.filter(function (member) {

        String(member.trainer || "").trim().toLowerCase()
        ===
        CURRENT_TRAINER.trim().toLowerCase()
        return(
            assignedTrainer === "ahmed Khan" ||
            assignedTrainer === "usman ahmed"
        );

});






    tableBody.innerHTML = "";


    /* =========================
       NO CUSTOMERS
    ========================= */

    if (myCustomers.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#888888;
                    "
                >

                    <i
                        class="fa-solid fa-users"
                        style="
                            font-size:30px;
                            color:#f5b900;
                            margin-bottom:10px;
                        "
                    ></i>

                    <br>

                    No customers are assigned
                    to ${escapeHTML(CURRENT_TRAINER)} yet.

                </td>

            </tr>

        `;

        updateCustomerCount(0);

        return;

    }


    /* =========================
       CREATE CUSTOMER ROWS
    ========================= */

    myCustomers.forEach(
        function (member) {

            const row =
                document.createElement("tr");


            row.dataset.memberId =
                member.id;


            const status =
                member.status || "Active";


            const statusClass =
                status.toLowerCase() === "inactive"
                    ? "status-inactive"
                    : "status-active";


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(member.name)}
                    </strong>

                    <small>
                        ${escapeHTML(member.id)}
                    </small>

                </td>


                <td>
                    ${escapeHTML(
                        member.goal || "Not Set"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        member.workoutPlan ||
                        "Not Assigned"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        member.progress ||
                        "0%"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        member.attendance ||
                        "0%"
                    )}
                </td>


                <td>

                    <span class="${statusClass}">
                        ${escapeHTML(status)}
                    </span>

                </td>


                <td>

                    <button
                        class="table-action customer-view-btn"
                        type="button"
                        title="View Customer"
                    >

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );


    updateCustomerCount(
        myCustomers.length
    );

}


/* =========================
   CUSTOMER COUNT
========================= */

function updateCustomerCount(count) {

    const countElement =
        document.getElementById(
            "totalCustomers"
        );

    if (countElement) {

        countElement.textContent =
            count;

    }

}


/* =========================
   SEARCH + FILTER
========================= */

function filterMyCustomers() {

    const searchInput =
        document.getElementById(
            "customerSearch"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const tableContainer =
        document.getElementById(
            "trainer-table"
        );


    if (!searchInput || !tableContainer) {
        return;
    }


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const rows =
        tableContainer.querySelectorAll(
            "tbody tr[data-member-id]"
        );


    let visibleCount = 0;


    rows.forEach(
        function (row) {

            const rowText =
                row.innerText
                    .toLowerCase();


            const statusElement =
                row.querySelector(
                    ".status-active, .status-inactive"
                );


            const rowStatus =
                statusElement
                    ? statusElement.textContent
                        .trim()
                        .toLowerCase()
                    : "";


            const matchesSearch =
                rowText.includes(searchText);


            const matchesStatus =
                selectedStatus === "all" ||
                rowStatus === selectedStatus;


            const showRow =
                matchesSearch &&
                matchesStatus;


            row.style.display =
                showRow ? "" : "none";


            if (showRow) {
                visibleCount++;
            }

        }
    );


    updateCustomerCount(
        visibleCount
    );

}


/* =========================
   VIEW CUSTOMER
========================= */

function setupCustomerView() {

    const tableContainer =
        document.getElementById(
            "trainer-table"
        );


    if (!tableContainer) {
        return;
    }


    tableContainer.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".customer-view-btn"
                );


            if (!button) {
                return;
            }


            const row =
                button.closest("tr");


            if (!row) {
                return;
            }


            const memberId =
                row.dataset.memberId;


            const members =
                getSavedMembers();


            const member =
                members.find(
                    function (item) {

                        return item.id === memberId;

                    }
                );


            if (!member) {

                alert(
                    "Customer data not found."
                );

                return;

            }


            alert(

                "Customer Profile\n\n" +

                "Member ID: " +
                member.id +

                "\nName: " +
                member.name +

                "\nPhone: " +
                member.phone +

                "\nEmail: " +
                member.email +

                "\nMembership: " +
                member.membership +

                "\nTrainer: " +
                member.trainer +

                "\nPayment: " +
                member.payment +

                "\nJoin Date: " +
                member.joinDate +

                "\nStatus: " +
                (member.status || "Active")

            );

        }
    );

}


/* =========================
   SEARCH SETUP
========================= */

function setupCustomerSearch() {

    const searchInput =
        document.getElementById(
            "customerSearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterMyCustomers
        );

    }


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterMyCustomers
        );

    }

}


/* =========================
   START PAGE
========================= */

async function startMyCustomersPage() {

    /* =========================
       LOAD SIDEBAR
    ========================= */

    await loadComponent(
        "trainer-sidebar",
        "../../../components/trainer.sidebar/trainer.sidebar.html"
    );


    /* =========================
       LOAD NAVBAR
    ========================= */

    await loadComponent(
        "trainer-navbar",
        "../../../components/trainer-navbar/trainer-navbar.html"
    );


    /* =========================
       LOAD TABLE
    ========================= */

    await loadComponent(
        "trainer-table",
        "../../../components/trainer-table/trainer-table.html"
    );


    /* =========================
       INITIALIZE NAVBAR
    ========================= */

    if (
        typeof initTrainerNavbar ===
        "function"
    ) {

        initTrainerNavbar();

    }


    /* =========================
       INITIALIZE SIDEBAR
    ========================= */

    if (
        typeof initTrainerSidebar ===
        "function"
    ) {

        initTrainerSidebar();

    }


    /* =========================
       LOAD CUSTOMERS
    ========================= */

    loadMyCustomers();


    /* =========================
       SEARCH
    ========================= */

    setupCustomerSearch();


    /* =========================
       VIEW BUTTON
    ========================= */

    setupCustomerView();

}


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    startMyCustomersPage
);
