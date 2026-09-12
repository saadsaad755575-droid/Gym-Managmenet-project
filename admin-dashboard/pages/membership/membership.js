// ========================================
// MEMBERSHIP MANAGEMENT
// ========================================


// ========================================
// STORAGE KEYS
// ========================================

const MEMBER_STORAGE_KEY = "gymMembers";
const MEMBERSHIP_STORAGE_KEY = "gymMemberships";


// ========================================
// MEMBERSHIP PLANS
// ========================================

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


// ========================================
// LOAD CSS
// ========================================

function loadCSS(href, id) {

    if (!document.getElementById(id)) {

        const link =
            document.createElement("link");

        link.id = id;
        link.rel = "stylesheet";
        link.href = href;

        document.head.appendChild(link);

    }

}


// ========================================
// LOAD COMPONENTS
// ========================================

async function loadComponents() {

    try {

        // =========================
        // FONT AWESOME
        // =========================

        loadCSS(
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
            "font-awesome-css"
        );


        // =========================
        // SIDEBAR
        // =========================

        const sidebar =
            document.getElementById("sidebar");

        if (sidebar) {

            const sidebarResponse =
                await fetch(
                    "/components/sidebar/sidebar.html"
                );

            if (!sidebarResponse.ok) {

                throw new Error(
                    "Sidebar could not be loaded."
                );

            }

            const sidebarHTML =
                await sidebarResponse.text();

            const sidebarDocument =
                new DOMParser().parseFromString(
                    sidebarHTML,
                    "text/html"
                );

            const sidebarElement =
                sidebarDocument.querySelector(
                    ".sidebar"
                );

            if (sidebarElement) {

                sidebarElement
                    .querySelectorAll("img")
                    .forEach(function (img) {

                        const src =
                            img.getAttribute("src");

                        if (
                            src &&
                            src.includes("../../assets/")
                        ) {

                            img.src =
                                "/assets/" +
                                src.split("../../assets/")[1];

                        }

                    });

                sidebar.innerHTML =
                    sidebarElement.outerHTML;

            }

            loadCSS(
                "/components/sidebar/sidebar.css",
                "sidebar-component-css"
            );

        }


        // =========================
        // NAVBAR
        // =========================

        const navbar =
            document.getElementById("navbar");

        if (navbar) {

            const navbarResponse =
                await fetch(
                    "/components/navbar/navbar.html"
                );

            if (!navbarResponse.ok) {

                throw new Error(
                    "Navbar could not be loaded."
                );

            }

            const navbarHTML =
                await navbarResponse.text();

            const navbarDocument =
                new DOMParser().parseFromString(
                    navbarHTML,
                    "text/html"
                );

            const navbarElement =
                navbarDocument.querySelector(
                    ".navbar"
                );

            if (navbarElement) {

                const profileImage =
                    navbarElement.querySelector("img");

                if (profileImage) {

                    const src =
                        profileImage.getAttribute("src");

                    if (
                        src &&
                        src.includes("../../assets/")
                    ) {

                        profileImage.src =
                            "/assets/" +
                            src.split("../../assets/")[1];

                    }

                }

                navbar.innerHTML =
                    navbarElement.outerHTML;

            }

            loadCSS(
                "/components/navbar/navbar.css",
                "navbar-component-css"
            );

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
// GET MEMBERS
// ========================================

function getSavedMembers() {

    const savedMembers =
        localStorage.getItem(
            MEMBER_STORAGE_KEY
        );

    if (!savedMembers) {

        return [];

    }

    try {

        return JSON.parse(savedMembers);

    }

    catch (error) {

        console.error(
            "Member data could not be loaded:",
            error
        );

        return [];

    }

}


// ========================================
// GET MEMBERSHIPS
// ========================================

function getSavedMemberships() {

    const savedMemberships =
        localStorage.getItem(
            MEMBERSHIP_STORAGE_KEY
        );

    if (!savedMemberships) {

        return [];

    }

    try {

        return JSON.parse(savedMemberships);

    }

    catch (error) {

        console.error(
            "Membership data could not be loaded:",
            error
        );

        return [];

    }

}


// ========================================
// SAVE MEMBERSHIPS
// ========================================

function saveMemberships(memberships) {

    localStorage.setItem(
        MEMBERSHIP_STORAGE_KEY,
        JSON.stringify(memberships)
    );

}


// ========================================
// FIND MEMBER
// ========================================

function findMember(memberId) {

    const members =
        getSavedMembers();

    return members.find(function (member) {

        const id =
            member.memberId ||
            member.id ||
            member.memberID;

        return String(id) === String(memberId);

    });

}


// ========================================
// GET MEMBER ID
// ========================================

function getMemberId(member) {

    return (
        member.memberId ||
        member.id ||
        member.memberID ||
        ""
    );

}


// ========================================
// GET MEMBER NAME
// ========================================

function getMemberName(member) {

    return (
        member.memberName ||
        member.name ||
        member.fullName ||
        "Unknown Member"
    );

}


// ========================================
// FORMAT PRICE
// ========================================

function formatPrice(price) {

    return "Rs. " + Number(price).toLocaleString();

}


// ========================================
// CREATE MEMBERSHIP ROW
// ========================================

function createMembershipRow(membership) {

    const row =
        document.createElement("tr");

    row.innerHTML = `

        <td>${membership.memberId}</td>

        <td>${membership.memberName}</td>

        <td>${membership.plan}</td>

        <td>${membership.duration}</td>

        <td>${formatPrice(membership.price)}</td>

        <td>
            <span class="payment-status">
                ${membership.paymentStatus}
            </span>
        </td>

        <td>
            <button
                class="manage-membership-btn"
                data-member-id="${membership.memberId}"
            >
                Manage
            </button>
        </td>

    `;

    return row;

}


// ========================================
// RENDER MEMBERSHIPS
// ========================================

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


    memberships.forEach(function (membership) {

        const row =
            createMembershipRow(membership);

        tableBody.appendChild(row);

    });


    updatePaymentStatusCounts();

}


// ========================================
// UPDATE PAYMENT STATUS COUNTS
// ========================================

function updatePaymentStatusCounts() {

    const memberships =
        getSavedMemberships();


    const paidCount =
        memberships.filter(function (membership) {

            return membership.paymentStatus === "Paid";

        }).length;


    const pendingCount =
        memberships.filter(function (membership) {

            return membership.paymentStatus === "Pending";

        }).length;


    const overdueCount =
        memberships.filter(function (membership) {

            return membership.paymentStatus === "Overdue";

        }).length;


    const paidCard =
        document.querySelector(
            ".status-card.paid h3"
        );

    const pendingCard =
        document.querySelector(
            ".status-card.pending h3"
        );

    const overdueCard =
        document.querySelector(
            ".status-card.overdue h3"
        );


    if (paidCard) {

        paidCard.textContent =
            `Paid (${paidCount})`;

    }


    if (pendingCard) {

        pendingCard.textContent =
            `Pending (${pendingCount})`;

    }


    if (overdueCard) {

        overdueCard.textContent =
            `Overdue (${overdueCount})`;

    }

}


// ========================================
// ADD MEMBERSHIP
// ========================================

function addMembership() {

    const members =
        getSavedMembers();


    if (members.length === 0) {

        alert(
            "No members found. Please add a member first."
        );

        return;

    }


    const memberId =
        prompt(
            "Enter Member ID:"
        );


    if (!memberId) {

        return;

    }


    const member =
        findMember(memberId);


    if (!member) {

        alert(
            "Member not found."
        );

        return;

    }


    const plan =
        prompt(
            "Enter Plan:\n\nMonthly\n3 Months\n6 Months\nYearly"
        );


    if (!plan) {

        return;

    }


    if (!membershipPlans[plan]) {

        alert(
            "Invalid membership plan."
        );

        return;

    }


    const paymentStatus =
        prompt(
            "Enter Payment Status:\n\nPaid\nPending\nOverdue"
        );


    if (!paymentStatus) {

        return;

    }


    const validStatuses = [
        "Paid",
        "Pending",
        "Overdue"
    ];


    if (
        !validStatuses.includes(
            paymentStatus
        )
    ) {

        alert(
            "Invalid payment status."
        );

        return;

    }


    const memberships =
        getSavedMemberships();


    const planData =
        membershipPlans[plan];


    const membership = {

        memberId:
            getMemberId(member),

        memberName:
            getMemberName(member),

        plan:
            plan,

        duration:
            planData.duration,

        price:
            planData.price,

        paymentStatus:
            paymentStatus

    };


    memberships.push(
        membership
    );


    saveMemberships(
        memberships
    );


    renderMemberships();


    alert(
        "Membership added successfully."
    );

}


// ========================================
// MANAGE EXISTING MEMBERSHIP
// ========================================

function manageMembership(memberId) {

    const memberships =
        getSavedMemberships();


    const membershipIndex =
        memberships.findIndex(
            function (membership) {

                return String(
                    membership.memberId
                ) === String(memberId);

            }
        );


    if (membershipIndex === -1) {

        alert(
            "Membership record not found."
        );

        return;

    }


    const currentMembership =
        memberships[membershipIndex];


    const plan =
        prompt(
            "Enter New Plan:\n\nMonthly\n3 Months\n6 Months\nYearly",
            currentMembership.plan
        );


    if (!plan) {

        return;

    }


    if (!membershipPlans[plan]) {

        alert(
            "Invalid membership plan."
        );

        return;

    }


    const paymentStatus =
        prompt(
            "Enter Payment Status:\n\nPaid\nPending\nOverdue",
            currentMembership.paymentStatus
        );


    if (!paymentStatus) {

        return;

    }


    const validStatuses = [
        "Paid",
        "Pending",
        "Overdue"
    ];


    if (
        !validStatuses.includes(
            paymentStatus
        )
    ) {

        alert(
            "Invalid payment status."
        );

        return;

    }


    const planData =
        membershipPlans[plan];


    memberships[membershipIndex].plan =
        plan;

    memberships[membershipIndex].duration =
        planData.duration;

    memberships[membershipIndex].price =
        planData.price;

    memberships[membershipIndex].paymentStatus =
        paymentStatus;


    saveMemberships(
        memberships
    );


    renderMemberships();


    alert(
        "Membership updated successfully."
    );

}


// ========================================
// PLAN CARD BUTTONS
// ========================================

function setupPlanButtons() {

    const planButtons =
        document.querySelectorAll(
            ".plan-btn"
        );


    planButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const card =
                        button.closest(
                            ".membership-card"
                        );


                    if (!card) {

                        return;

                    }


                    const plan =
                        card.querySelector(
                            "h3"
                        ).textContent.trim();


                    const memberId =
                        prompt(
                            `Enter Member ID to manage ${plan}:`
                        );


                    if (!memberId) {

                        return;

                    }


                    const memberships =
                        getSavedMemberships();


                    const membershipExists =
                        memberships.some(
                            function (membership) {

                                return String(
                                    membership.memberId
                                ) === String(memberId);

                            }
                        );


                    if (!membershipExists) {

                        alert(
                            "This member does not have a membership yet. Please use Add Membership first."
                        );

                        return;

                    }


                    manageMembership(
                        memberId
                    );

                }
            );

        }
    );

}


// ========================================
// TABLE MANAGE BUTTON
// ========================================

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


            manageMembership(
                memberId
            );

        }
    );

}


// ========================================
// ADD MEMBERSHIP BUTTON
// ========================================

function setupAddMembershipButton() {

    const button =
        document.getElementById(
            "addMembershipBtn"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        addMembership
    );

}


// ========================================
// START MEMBERSHIP PAGE
// ========================================

async function startMembershipPage() {

    await loadComponents();

    renderMemberships();

    setupAddMembershipButton();

    setupPlanButtons();

    setupTableButtons();

}


// ========================================
// START
// ========================================

startMembershipPage();
