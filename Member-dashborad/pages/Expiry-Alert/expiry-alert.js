

/* =========================================================
   MEMBERSHIP EXPIRY ALERT - MEMBER DASHBOARD
========================================================= */

const MEMBER_STORAGE_KEY = "gymMembers";
const MEMBERSHIP_STORAGE_KEY = "gymMemberships";


/* =========================================================
   DOM CONTENT LOADED
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadMemberComponents();

});


/* =========================================================
   LOAD SIDEBAR + NAVBAR
========================================================= */

async function loadMemberComponents() {

    try {

        await loadComponent(
            "member-sidebar",
            "../../../components/member-sidebar/member-sidebar.html"
        );

        await loadComponent(
            "member-navbar",
            "../../../components/member-navbar/member-navbar.html"
        );


        /* Initialize sidebar */
        if (typeof initializeMemberSidebar === "function") {
            initializeMemberSidebar();
        }


        /* Initialize navbar */
        if (typeof initMemberNavbar === "function") {
            initMemberNavbar();
        }


        /* Load membership information */
        loadMembershipExpiry();

    } catch (error) {

        console.error(
            "Membership components could not be loaded:",
            error
        );

    }

}


/* =========================================================
   LOAD COMPONENT
========================================================= */

async function loadComponent(containerId, filePath) {

    const container = document.getElementById(containerId);

    if (!container) {

        console.error(
            `Container "${containerId}" not found.`
        );

        return;

    }


    try {

        const response = await fetch(filePath);

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status} - ${response.statusText}`
            );

        }


        const html = await response.text();

        container.innerHTML = html;

    } catch (error) {

        console.error(
            `Component could not be loaded: ${filePath}`,
            error
        );

        container.innerHTML = `
            <div style="
                color:#ff5555;
                padding:20px;
                text-align:center;
            ">
                Component could not be loaded.
            </div>
        `;

    }

}


/* =========================================================
   GET CURRENT MEMBER
========================================================= */

function getCurrentMember() {

    try {

        /* ========================================
           GET LOGGED-IN MEMBER ID
        ======================================== */

        const loggedInMemberId =
            localStorage.getItem("loggedInMemberId");


        /* ========================================
           FIND THAT MEMBER IN gymMembers
        ======================================== */

        if (loggedInMemberId) {

            const members =
                JSON.parse(
                    localStorage.getItem(MEMBER_STORAGE_KEY)
                );


            if (Array.isArray(members)) {

                const currentMember =
                    members.find(function (member) {

                        const memberId =
                            String(
                                member.id ||
                                member.memberId ||member.memberID ||
                                member.customerId ||member.customerID ||""
                            )
                            .trim();


                        return (
                            memberId === String(loggedInMemberId).trim()
                        );

                    });


                if (currentMember) {

                    return currentMember;

                }

            }

        }

    } catch (error) {

        console.error(
            "Error finding logged-in member:",error
        );

    }


    /* ========================================
       FALLBACK
    
    ======================================== */

    try {

        const members =
            JSON.parse(
                localStorage.getItem(MEMBER_STORAGE_KEY)
            );


        if (
            Array.isArray(members) && members.length > 0
        ) {

            return members[0];

        }

    } catch (error) {

        console.error(
            "Error reading gymMembers:",error
        );

    }


    return null;
}



/* =========================================================
   GET MEMBER ID
========================================================= */

function getMemberId(member) {

    if (!member) {
        return "";
    }


    return (
        member.memberId ||member.id ||
        member.memberID ||member.customerId ||
        member.customerID || ""
    );

}


/* =========================================================
   GET MEMBER NAME
========================================================= */

function getMemberName(member) {

    if (!member) {
        return "Member";
    }


    return (
        member.memberName ||member.name ||
        member.fullName ||member.customerName ||"Member"
    );

}


/* =========================================================
   GET MEMBERSHIPS
========================================================= */

function getMemberships() {

    try {

        const memberships = JSON.parse(
            localStorage.getItem(MEMBERSHIP_STORAGE_KEY)
        );


        if (Array.isArray(memberships)) {

            return memberships;

        }

    } catch (error) {

        console.error(
            "Error reading gymMemberships:",
            error
        );

    }


    return [];

}


/* =========================================================
   FIND CURRENT MEMBER MEMBERSHIP
========================================================= */

function findMemberMembership(memberId) {

    const memberships = getMemberships();


    if (!memberId) {

        return null;

    }


    return (
        memberships.find(function (membership) {

            return (
                String(membership.memberId) ===
                String(memberId)
            );

        }) || null
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "Not Set";

    }


    const date = new Date(
        `${dateString}T00:00:00`
    );


    if (isNaN(date.getTime())) {

        return "Not Set";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit", month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   GET TODAY
========================================================= */

function getTodayDate() {

    const today = new Date();


    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =========================================================
   CALCULATE DAYS REMAINING
========================================================= */

function calculateDaysRemaining(expiryDate) {

    if (!expiryDate) {

        return null;

    }


    const today = new Date(
        `${getTodayDate()}T00:00:00`
    );

    const expiry = new Date(
        `${expiryDate}T00:00:00`
    );


    if (
        isNaN(today.getTime()) ||
        isNaN(expiry.getTime())
    ) {

        return null;

    }


    const difference =
        expiry.getTime() - today.getTime();


    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

}


/* =========================================================
   MAIN MEMBERSHIP FUNCTION
========================================================= */

function loadMembershipExpiry() {

    const member = getCurrentMember();


    if (!member) {

        showNoMembership(
            "Member information was not found."
        );

        return;

    }


    const memberId = getMemberId(member);

    const membership = findMemberMembership(memberId);


    if (!membership) {

        showNoMembership(
            "No active membership record was found for your account."
        );

        return;

    }


    /* Render member details */

    renderMembershipDetails(
        member,membership
    );


    /* Calculate expiry */

    const daysRemaining =
        calculateDaysRemaining(
            membership.expiryDate
        );


    /* Render summary */

    renderSummary(
        membership,daysRemaining
    );


    /* Render alert */

    renderExpiryAlert(
        membership, daysRemaining
    );


    /* Render renewal information */

    renderRenewalBox(
        membership,daysRemaining
    );

}


/* =========================================================
   RENDER SUMMARY CARDS
========================================================= */

function renderSummary(
    membership,daysRemaining
) {

    const statusElement =
        document.getElementById(
            "membershipStatus"
        );


    const planElement =
        document.getElementById(
            "membershipPlan"
        );


    const expiryElement =
        document.getElementById(
            "membershipExpiryDate"
        );


    const daysElement =
        document.getElementById(
            "membershipDaysRemaining"
        );


    if (statusElement) {

        statusElement.textContent =
            getMembershipStatus(
                membership,daysRemaining
            );

    }


    if (planElement) {

        planElement.textContent =
            membership.plan || "Not Set";

    }


    if (expiryElement) {

        expiryElement.textContent =formatDate(
                membership.expiryDate
            );

    }


    if (daysElement) {

        if (daysRemaining === null) {

            daysElement.textContent ="Not Set";

        } else if (daysRemaining < 0) {

            daysElement.textContent = "Expired";

        } else if (daysRemaining === 0) {

            daysElement.textContent ="Today";

        } else {

            daysElement.textContent =`${daysRemaining} Days`;

        }

    }

}


/* =========================================================
   GET MEMBERSHIP STATUS
========================================================= */

function getMembershipStatus(
    membership,daysRemaining
) {

    const paymentStatus =
        String(
            membership.paymentStatus || ""
        ).toLowerCase();


    if (
        paymentStatus === "overdue" ||
        paymentStatus === "pending"
    ) {

        if (
            daysRemaining !== null &&
            daysRemaining <= 0
        ) {

            return "Expired";

        }

    }


    if (
        daysRemaining !== null && daysRemaining <= 0
    ) {

        return "Expired";

    }


    return "Active";

}


/* =========================================================
   RENDER MEMBERSHIP DETAILS
========================================================= */

function renderMembershipDetails(
    member,membership
) {

    setText(
        "membershipMemberId",
        getMemberId(member) || "Not Set"
    );


    setText(
        "membershipMemberName",
        getMemberName(member)
    );


    setText(
        "membershipPlanDetails",
        membership.plan || "Not Set"
    );


    setText(
        "membershipDuration",
        membership.duration || "Not Set"
    );


    setText(
        "membershipStartDate",
        formatDate(
            membership.startDate
        )
    );


    setText(
        "membershipExpiryDetails",
        formatDate(
            membership.expiryDate
        )
    );


    setText(
        "membershipPrice",
        formatPrice(
            membership.price
        )
    );


    setText(
        "membershipPaymentStatus",
        membership.paymentStatus || "Not Set"
    );

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    const numericPrice =  Number(price);


    if (!Number.isFinite(numericPrice)) {

        return "Not Set";

    }


    return `PKR ${numericPrice.toLocaleString()}`;

}


/* =========================================================
   SET TEXT HELPER
========================================================= */

function setText(
    elementId,value
) {

    const element =  document.getElementById(elementId);


    if (element) {

        element.textContent = value;

    }

}


/* =========================================================
   RENDER EXPIRY ALERT
========================================================= */

function renderExpiryAlert(
    membership, daysRemaining
) {

    const alertBox =
        document.getElementById(
            "membershipAlert"
        );


    const alertIcon =
        document.getElementById(
            "membershipAlertIcon"
        );


    const alertTitle =
        document.getElementById(
            "membershipAlertTitle"
        );


    const alertMessage =
        document.getElementById(
            "membershipAlertMessage"
        );


    if (!alertBox) {

        return;

    }


    /* Remove previous states */

    alertBox.classList.remove(
        "active","warning", "danger"
    );


    /* No expiry date */

    if (daysRemaining === null) {

        alertBox.classList.add( "warning" );


        if (alertIcon) {

            alertIcon.className = "fa-solid fa-circle-exclamation";

        }


        if (alertTitle) {

            alertTitle.textContent = "Membership Expiry Date Not Set";

        }


        if (alertMessage) {

            alertMessage.textContent =
                "Your membership expiry date has not been recorded yet. Please contact the gym administration.";

        }


        return;

    }


    /* EXPIRED */

    if (daysRemaining < 0) {

        alertBox.classList.add(
            "danger"
        );


        if (alertIcon) {

            alertIcon.className ="fa-solid fa-circle-xmark";

        }


        if (alertTitle) {

            alertTitle.textContent ="Membership Expired";

        }


        if (alertMessage) {

            alertMessage.textContent =
                "Your membership has expired. Please contact the gym administration to renew your membership.";

        }


        return;

    }


    /* EXPIRES TODAY */

    if (daysRemaining === 0) {

        alertBox.classList.add( "danger" );


        if (alertIcon) {

            alertIcon.className ="fa-solid fa-triangle-exclamation fa-beat";

        }


        if (alertTitle) {

            alertTitle.textContent ="Membership Expires Today";

        }


        if (alertMessage) {

            alertMessage.textContent =
                "Your membership expires today. Please renew your membership through the gym administration.";

        }


        return;

    }


    /* 1 - 7 DAYS */

    if (daysRemaining <= 7) {

        alertBox.classList.add("danger");


        if (alertIcon) {

            alertIcon.className ="fa-solid fa-bell fa-beat";

        }


        if (alertTitle) {

            alertTitle.textContent = `Membership Expires in ${daysRemaining} Days`;

        }


        if (alertMessage) {

            alertMessage.textContent =
                `Your membership will expire in ${daysRemaining} days. 
                Please renew your membership soon.`;

        }


        return;

    }


    /* =========================================================
   8 - 15 DAYS
========================================================= */

if (daysRemaining <= 15) {

    alertBox.classList.add( "warning"
    );


    if (alertIcon) {

        alertIcon.className = "fa-solid fa-bell";

    }


    if (alertTitle) {

        alertTitle.textContent =
            `Membership Expires in ${daysRemaining} Days`;

    }


    if (alertMessage) {

        alertMessage.textContent =
            `Your membership will expire in ${daysRemaining} days. 
            Please plan your renewal before the expiry date.`;

    }


    return;

}


/* =========================================================
   16 - 30 DAYS
========================================================= */

if (daysRemaining <= 30) {

    alertBox.classList.add(
        "warning"
    );


    if (alertIcon) {

        alertIcon.className =
            "fa-solid fa-calendar-days";

    }


    if (alertTitle) {

        alertTitle.textContent =
            `Membership Expires in ${daysRemaining} Days`;

    }


    if (alertMessage) {

        alertMessage.textContent =
            `Your membership will expire in ${daysRemaining} days.
             You can contact the gym administration for renewal.`;

    }


    return;

}


/* =========================================================
   MORE THAN 30 DAYS
========================================================= */

alertBox.classList.add("active"
);


if (alertIcon) {

    alertIcon.className ="fa-solid fa-circle-check";

}


if (alertTitle) {

    alertTitle.textContent = "Membership is Active";

}


if (alertMessage) {

    alertMessage.textContent =
        `Your membership is active and will expire in ${daysRemaining} days.`;

}

}


/* =========================================================
   RENDER RENEWAL BOX
========================================================= */

function renderRenewalBox(
    membership,
    daysRemaining
) {

    const message =
        document.getElementById(
            "renewalMessage"
        );


    const status =
        document.getElementById(
            "renewalStatus"
        );


    if (!message || !status) {

        return;

    }


    /* =====================================================
       EXPIRED
    ===================================================== */

    if (
        daysRemaining !== null &&
        daysRemaining <= 0
    ) {

        message.textContent =
            "Your membership needs renewal. Please contact the gym administration to choose a new membership plan and complete payment.";

        status.textContent ="Renew Now";

        return;

    }


    /* =====================================================
       EXPIRING SOON
    ===================================================== */

    if (
        daysRemaining !== null &&
        daysRemaining <= 30
    ) {

        message.textContent =
            "Your membership is approaching its expiry date. Please contact the gym administration if you want to renew it.";

        status.textContent =
            "Renew Soon";

        return;

    }


    /* =====================================================
       ACTIVE
    ===================================================== */

    message.textContent =
        "Your membership is currently active. Renewal information will be updated here when your membership approaches its expiry date.";

    status.textContent =
        "Active";

}


/* =========================================================
   SHOW NO MEMBERSHIP
========================================================= */

function showNoMembership(
    messageText
) {

    const noMembership =
        document.getElementById(
            "noMembership"
        );


    const summary =
        document.querySelector(
            ".membership-summary"
        );


    const alert =
        document.getElementById(
            "membershipAlert"
        );


    const details =
        document.getElementById(
            "membershipDetails"
        );


    const renewal =
        document.querySelector(
            ".renewal-box"
        );


    /* Hide membership summary */

    if (summary) {

        summary.style.display =
            "none";

    }


    /* Hide alert */

    if (alert) {

        alert.style.display =
            "none";

    }


    /* Hide details */

    if (details) {

        details.style.display =
            "none";

    }


    /* Hide renewal box */

    if (renewal) {

        renewal.style.display =
            "none";

    }


    /* Show no membership message */

    if (noMembership) {

        noMembership.style.display =
            "block";


        const paragraph =
            noMembership.querySelector("p");


        if (paragraph) {

            paragraph.textContent =
                messageText ||
                "No membership information is available.";

        }

    }

}
