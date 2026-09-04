
// ========================================
// LOAD COMPONENTS
// ========================================

async function loadComponents() {

    try {

        // =========================
        // SIDEBAR
        // =========================

        const sidebar =
            document.getElementById("sidebar");

        if (sidebar) {

            const sidebarResponse =
                await fetch(
                    "../../../components/sidebar/sidebar.html"
                );

            if (!sidebarResponse.ok) {

                throw new Error(
                    "Sidebar could not be loaded."
                );

            }

            sidebar.innerHTML =
                await sidebarResponse.text();

        }


        // =========================
        // NAVBAR
        // =========================

        const navbar =
            document.getElementById("navbar");

        if (navbar) {

            const navbarResponse =
                await fetch(
                    "../../components/navbar/navbar.html"
                );

            if (!navbarResponse.ok) {

                throw new Error(
                    "Navbar could not be loaded."
                );

            }

            navbar.innerHTML =
                await navbarResponse.text();

        }

    }

    catch (error) {

        console.error(
            "Component loading error:",
            error
        );

    }

}



// ========================================
// FILTER MEMBERS
// ========================================

function filterMembers() {

    const searchInput =
        document.getElementById("memberSearch");

    const membershipFilter =
        document.getElementById(
            "membershipFilter"
        );

    const paymentFilter =
        document.getElementById(
            "paymentFilter"
        );

    const tableBody =
        document.getElementById(
            "memberTableBody"
        );


    if (
        !searchInput ||
        !membershipFilter ||
        !paymentFilter ||
        !tableBody
    ) {

        return;

    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedMembership =
        membershipFilter.value;


    const selectedPayment =
        paymentFilter.value;


    const rows =
        tableBody.querySelectorAll("tr");


    rows.forEach(function (row) {

        const rowText =
            row.innerText.toLowerCase();


        // =========================
        // MEMBERSHIP
        // =========================

        const membershipElement =
            row.querySelector(".membership");


        let matchesMembership = true;


        if (
            selectedMembership !== "all" &&
            membershipElement
        ) {

            matchesMembership =
                membershipElement.classList.contains(
                    selectedMembership
                );

        }


        // =========================
        // PAYMENT
        // =========================

        const paymentElement =
            row.querySelector(".payment");


        let matchesPayment = true;


        if (
            selectedPayment !== "all" &&
            paymentElement
        ) {

            matchesPayment =
                paymentElement.classList.contains(
                    selectedPayment
                );

        }


        // =========================
        // SEARCH
        // =========================

        const matchesSearch =
            rowText.includes(searchText);


        // =========================
        // SHOW / HIDE
        // =========================

        row.style.display =
            matchesSearch &&
            matchesMembership &&
            matchesPayment
                ? ""
                : "none";

    });

}



// ========================================
// VIEW MEMBER
// ========================================

function setupViewButtons() {

    const buttons =
        document.querySelectorAll(
            ".view-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const row =
                    button.closest("tr");

                if (!row) return;


                const nameElement =
                    row.querySelector(
                        ".member-info strong"
                    );


                const memberName =
                    nameElement
                        ? nameElement.innerText
                        : "Member";


                alert(
                    "Member Profile:\n\n" +
                    memberName
                );

            }
        );

    });

}



// ========================================
// EDIT MEMBER
// ========================================

function setupEditButtons() {

    const buttons =
        document.querySelectorAll(
            ".edit-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const row =
                    button.closest("tr");

                if (!row) return;


                const nameElement =
                    row.querySelector(
                        ".member-info strong"
                    );


                const memberName =
                    nameElement
                        ? nameElement.innerText
                        : "Member";


                alert(
                    "Edit Member:\n\n" +
                    memberName
                );

            }
        );

    });

}



// ========================================
// DELETE MEMBER
// ========================================

function setupDeleteButtons() {

    const buttons =
        document.querySelectorAll(
            ".delete-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const row =
                    button.closest("tr");

                if (!row) return;


                const nameElement =
                    row.querySelector(
                        ".member-info strong"
                    );


                const memberName =
                    nameElement
                        ? nameElement.innerText
                        : "this member";


                const confirmDelete =
                    confirm(
                        "Are you sure you want to delete " +
                        memberName +
                        "?"
                    );


                if (confirmDelete) {

                    row.remove();

                    alert(
                        memberName +
                        " has been deleted."
                    );

                }

            }
        );

    });

}



// ========================================
// ADD MEMBER
// ========================================

function setupAddMemberButton() {

    const addMemberBtn =
        document.getElementById(
            "addMemberBtn"
        );


    if (!addMemberBtn) {
        return;
    }


    addMemberBtn.addEventListener(
        "click",
        function () {


            // =========================
            // MEMBER NAME
            // =========================

            const memberName =
                prompt(
                    "Enter Member Name:"
                );


            if (!memberName) {
                return;
            }


            // =========================
            // PHONE
            // =========================

            const phone =
                prompt(
                    "Enter Phone Number:"
                );


            if (!phone) {
                return;
            }


            // =========================
            // EMAIL
            // =========================

            const email =
                prompt(
                    "Enter Email:"
                );


            if (!email) {
                return;
            }


            // =========================
            // TABLE BODY
            // =========================

            const tableBody =
                document.getElementById(
                    "memberTableBody"
                );


            if (!tableBody) {
                return;
            }


            // =========================
            // MEMBER ID
            // =========================

            const memberCount =
                tableBody.querySelectorAll(
                    "tr"
                ).length + 1;


            const memberId =
                "#M" +
                String(
                    memberCount
                ).padStart(3, "0");


            // =========================
            // CURRENT DATE
            // =========================

            const joinDate =
                new Date().toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            // =========================
            // CREATE ROW
            // =========================

            const newRow =
                document.createElement("tr");


            newRow.innerHTML = `

                <td>
                    ${memberId}
                </td>


                <td>

                    <div class="member-info">

                        <div class="member-icon">

                            <i
                                class="fa-solid fa-user"
                            ></i>

                        </div>


                        <div>

                            <strong>
                                ${memberName}
                            </strong>

                            <small>
                                Regular Member
                            </small>

                        </div>

                    </div>

                </td>


                <td>

                    <span>
                        ${phone}
                    </span>

                    <small class="email">
                        ${email}
                    </small>

                </td>


                <td>

                    <span class="membership pending">
                        Basic
                    </span>

                </td>


                <td>
                    Not Assigned
                </td>


                <td>

                    <span class="payment pending">
                        Pending
                    </span>

                </td>


                <td>
                    ${joinDate}
                </td>


                <td>

                    <span class="member-status active">
                        Active
                    </span>

                </td>


                <td>

                    <button
                        class="action-btn view-btn"
                        title="View"
                    >

                        <i
                            class="fa-solid fa-eye"
                        ></i>

                    </button>


                    <button
                        class="action-btn edit-btn"
                        title="Edit"
                    >

                        <i
                            class="fa-solid fa-pen"
                        ></i>

                    </button>


                    <button
                        class="action-btn delete-btn"
                        title="Delete"
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                    </button>

                </td>

            `;


            // =========================
            // ADD TO TABLE
            // =========================

            tableBody.appendChild(
                newRow
            );


            // =========================
            // ACTIVATE BUTTONS
            // =========================

            setupViewButtons();
            setupEditButtons();
            setupDeleteButtons();


            // =========================
            // SUCCESS
            // =========================

            alert(
                memberName +
                " has been added successfully!"
            );

        }
    );

}



// ========================================
// START MEMBER PAGE
// ========================================

async function startMemberPage() {

    // Load Sidebar + Navbar
    await loadComponents();


    // =========================
    // SEARCH
    // =========================

    const searchInput =
        document.getElementById(
            "memberSearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterMembers
        );

    }


    // =========================
    // MEMBERSHIP FILTER
    // =========================

    const membershipFilter =
        document.getElementById(
            "membershipFilter"
        );


    if (membershipFilter) {

        membershipFilter.addEventListener(
            "change",
            filterMembers
        );

    }


    // =========================
    // PAYMENT FILTER
    // =========================

    const paymentFilter =
        document.getElementById(
            "paymentFilter"
        );


    if (paymentFilter) {

        paymentFilter.addEventListener(
            "change",
            filterMembers
        );

    }


    // =========================
    // BUTTONS
    // =========================

    setupViewButtons();

    setupEditButtons();

    setupDeleteButtons();

    setupAddMemberButton();

}



// ========================================
// RUN
// ========================================

startMemberPage();
