

/* =========================
   MEMBER NAVBAR JS
========================= */

function initMemberNavbar() {

    const menuToggle =
        document.getElementById("memberMenuToggle");

    const notificationBtn =
        document.getElementById("memberNotificationBtn");

    const notificationBadge =
        document.getElementById("memberNotificationBadge");

    const profile =
        document.getElementById("memberNavbarProfile");

    const searchInput =
        document.getElementById("memberSearch");


    /* =========================
       LOAD MEMBER INFORMATION
    ========================= */

    loadNavbarMember();


    /* =========================
       MOBILE MENU
    ========================= */

    if (menuToggle) {

        menuToggle.addEventListener("click", () => {

            const sidebar =
                document.querySelector(".member-sidebar");

            if (sidebar) {

                sidebar.classList.toggle("show");

            }

           });

    }


    /* =========================
       NOTIFICATION
    ========================= */

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",() => {

                console.log("Member notifications opened.");

            }
        );

    }


    /* =========================
       PROFILE
    ========================= */

    if (profile) {

        profile.addEventListener(
            "click",() => {

                console.log("Member profile clicked.");

            }
        );

    }


    /* =========================
       SEARCH
    ========================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",() => {

                console.log("Searching:", searchInput.value);

            }
        );

    }

}


/* =========================
   LOAD MEMBER DATA
========================= */

function loadNavbarMember() {

    const nameElement =
        document.getElementById("navbarMemberName");

    const idElement =
        document.getElementById("navbarMemberId");


    if (!nameElement) return;


    const members =
        JSON.parse(
            localStorage.getItem("gymMembers")
        ) || [];

    const loggedInMember =
        localStorage.getItem("loggedInMember");

    const loggedInMemberId =
        localStorage.getItem("loggedInMemberId");

    const loggedInMemberEmail =
        localStorage.getItem("loggedInMemberEmail");


    let member = null;


    /* =========================
       FIND BY MEMBER ID
    ========================= */

    if (loggedInMemberId) {

        member = members.find(item =>
                String(
                    item.id ||item.memberId ||
                    item.customerId ||""
                ) === String(loggedInMemberId)
        );

    }


    /* =========================
       FIND BY NAME
    ========================= */

    if (!member && loggedInMember) {

        member = members.find(item =>
                String(
                    item.name ||item.fullName ||
                    item.memberName || item.customerName ||""
                )
                .trim().toLowerCase()===
                String(loggedInMember)
                    .trim().toLowerCase()
        );

    }


    /* =========================
       FIND BY EMAIL
    ========================= */

    if (!member && loggedInMemberEmail) {

        member = members.find(item =>
                String(
                    item.email ||item.memberEmail ||
                    item.customerEmail || ""
                )
                .trim().toLowerCase() ===
                String(loggedInMemberEmail)
                    .trim().toLowerCase()
        );

    }


    /* =========================
       MEMBER FOUND
    ========================= */

    if (member) {

        const memberName =
            member.name || member.fullName ||
            member.memberName || member.customerName ||
            "Member Name";


        const memberId =
            member.id || member.memberId ||
            member.customerId || "-";


        nameElement.textContent = memberName;


        if (idElement) {

            idElement.textContent =
                `Member ID: ${memberId}`;

        }

        return;

    }


    /* =========================
       NO MEMBER FOUND
    ========================= */

    nameElement.textContent = "Member Name";


    if (idElement) {

        idElement.textContent ="Member ID: -";

    }

}
