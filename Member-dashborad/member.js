
/* ========================================
MEMBER DASHBOARD JS
PART 2 — VIEW PROFILE
======================================== */

/* ========================================
DOM CONTENT LOADED
======================================== */

document.addEventListener(
"DOMContentLoaded",
function () {

    /* ========================================
       LOAD MEMBER SIDEBAR
    ======================================== */

    loadComponenet(
        "member-sidebar",
        "../components/member-sidebar/member-sidebar.html"
    );


    /* ========================================
       LOAD MEMBER NAVBAR
    ======================================== */

    loadComponenet(
        "member-navbar",
        "../components/member-navbar/member-navbar.html"
    );


    /* ========================================
       LOAD MEMBER TABLE
    ======================================== */

    loadComponenet(
        "member-table",
        "../components/member-table/member-table.html"
    );


    /* ========================================
       LOAD MEMBER MODAL
    ======================================== */

    loadComponenet(
        "member-modal",
        "../components/member-modal/member-modal.html"
    );


    /* ========================================
       LOAD LOGGED-IN MEMBER
    ======================================== */

    loadLoggedInMember();


    /* ========================================
       VIEW PROFILE BUTTON
    ======================================== */

    setupViewProfileButton();

}

);

/* ========================================
LOAD COMPONENT FUNCTION
======================================== */

function loadComponenet(
containerId,
filePath
) {

const container =
    document.getElementById(containerId);


/* ========================================
   CHECK CONTAINER
======================================== */

if (!container) {

    console.error(
        "Container not found:",
        containerId
    );

    return;
}


/* ========================================
   FETCH COMPONENT
======================================== */

fetch(filePath)

    .then(response => {

        if (!response.ok) {

            throw new Error(
                `Failed to load: ${filePath}`
            );

        }

        return response.text();

    })


    /* ========================================
       INSERT COMPONENT
    ======================================== */

    .then(data => {

        container.innerHTML = data;


        /* ========================================
           INITIALIZE SIDEBAR
        ======================================== */

        if (
            containerId === "member-sidebar" &&
            typeof initializeMemberSidebar === "function"
        ) {

            initializeMemberSidebar();

        }


        /* ========================================
           INITIALIZE NAVBAR
        ======================================== */

        if (
            containerId === "member-navbar" &&
            typeof initMemberNavbar === "function"
        ) {

            initMemberNavbar();

        }


        /* ========================================
           INITIALIZE CARD
        ======================================== */

        if (
            containerId === "member-cards" &&
            typeof initMemberCard === "function"
        ) {

            initMemberCard();

        }


        /* ========================================
           INITIALIZE TABLE
        ======================================== */

        if (
            containerId === "member-table" &&
            typeof initMemberTable === "function"
        ) {

            initMemberTable();

        }


        /* ========================================
           INITIALIZE MODAL
        ======================================== */

        if (
            containerId === "member-modal" &&
            typeof initMemberModal === "function"
        ) {

            initMemberModal();

        }

    })


    /* ========================================
       ERROR HANDLING
    ======================================== */

    .catch(error => {

        console.error(error);

        container.innerHTML = `
            <p style="
                color:#f5b900;
                padding:20px;
            ">
                Component could not be loaded.
            </p>
        `;

    });

}

/* ========================================
LOAD LOGGED-IN MEMBER
======================================== */

function loadLoggedInMember() {

/* ========================================
   GET LOGGED-IN MEMBER ID
======================================== */

const loggedInMemberId =
    localStorage.getItem("loggedInMemberId");


if (!loggedInMemberId) {

    console.warn(
        "No logged-in member ID found."
    );

    return;
}


/* ========================================
   GET MEMBERS
======================================== */

const savedMembers =
    localStorage.getItem("gymMembers");


if (!savedMembers) {

    console.warn(
        "No member data found."
    );

    return;
}


let members;


try {

    members =
        JSON.parse(savedMembers);

} catch (error) {

    console.error(
        "Invalid gymMembers data.",
        error
    );

    return;
}


/* ========================================
   FIND CURRENT MEMBER
======================================== */

const currentMember =
    members.find(member => {

        const memberId =
            member.id ||
            member.memberId ||
            member.customerId;

        return String(memberId).trim().toLowerCase()
            ===
            String(loggedInMemberId)
                .trim()
                .toLowerCase();

    });


if (!currentMember) {

    console.warn(
        "Logged-in member record not found."
    );

    return;
}


/* ========================================
   MEMBER NAME
======================================== */

const memberName =
    currentMember.name ||
    currentMember.memberName ||
    currentMember.fullName ||
    "Member";


/* ========================================
   MEMBER TYPE
======================================== */

const memberType =
    currentMember.type ||
    currentMember.memberType ||
    currentMember.customerType ||
    "Customer";


/* ========================================
   MEMBER ID
======================================== */

const memberId =
    currentMember.id ||
    currentMember.memberId ||
    currentMember.customerId ||
    loggedInMemberId;


/* ========================================
   ASSIGNED TRAINER

======================================== */

const assignedTrainerName =
    currentMember.assignedTrainer ||
    currentMember.trainerName ||
    currentMember.assignedTrainerName ||
    "-";


/* ========================================
   TRAINER TYPE
======================================== */

const assignedTrainerType =
    currentMember.trainerType ||
    currentMember.assignedTrainerType ||
    currentMember.trainerSpecialization ||
    "Fitness Trainer";


/* ========================================
   SHOW MEMBER NAME
======================================== */

const welcomeName =
    document.getElementById(
        "memberWelcomeName"
    );

if (welcomeName) {

    welcomeName.textContent =
        memberName;

}


const nameElement =
    document.getElementById(
        "memberName"
    );

if (nameElement) {

    nameElement.textContent =
        memberName;

}


/* ========================================
   SHOW MEMBER TYPE
======================================== */

const typeElement =
    document.getElementById(
        "memberType"
    );

if (typeElement) {

    typeElement.textContent =
        memberType;

}


/* ========================================
   SHOW MEMBER ID
======================================== */

const idElement =
    document.getElementById(
        "memberId"
    );

if (idElement) {

    idElement.textContent =
        `Member ID: ${memberId}`;

}


/* ========================================
   SHOW TRAINER
======================================== */

const trainerElement =
    document.getElementById(
        "assignedTrainerName"
    );

if (trainerElement) {

    trainerElement.textContent =
        assignedTrainerName;

}


/* ========================================
   SHOW TRAINER TYPE
======================================== */

const trainerTypeElement =
    document.getElementById(
        "assignedTrainerType"
    );

if (trainerTypeElement) {

    trainerTypeElement.textContent =
        assignedTrainerType;

}

}

/* ========================================
VIEW PROFILE BUTTON
======================================== */

function setupViewProfileButton() {

const viewProfileButton =
    document.querySelector(
        "#memberDashboard .view-profile-btn"
    );


/* ========================================
   IF SPECIFIC ID/CLASS NOT FOUND
   TRY BUTTON TEXT
======================================== */

if (!viewProfileButton) {

    const buttons =
        document.querySelectorAll(
            "button"
        );


    buttons.forEach(button => {

        const buttonText =
            button.textContent
                .trim()
                .toLowerCase();


        if (
            buttonText.includes(
                "view profile"
            )
        ) {

            button.addEventListener(
                "click",
                openMemberProfile
            );

        }

    });

    return;
}


/* ========================================
   CONNECT BUTTON
======================================== */

viewProfileButton.addEventListener(
    "click",
    openMemberProfile
);

}

/* ========================================
OPEN MEMBER PROFILE
======================================== */

function openMemberProfile() {

window.location.href =
    "pages/my-profile/my-profile.html";

} 
