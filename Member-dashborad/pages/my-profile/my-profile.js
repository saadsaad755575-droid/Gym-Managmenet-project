


/* ========================================
   MEMBER PROFILE JS
======================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadComponent(
            "member-sidebar",
            "../../../components/member-sidebar/member-sidebar.html");
        loadComponent(
            "member-navbar",
            "../../../components/member-navbar/member-navbar.html");

        loadMemberProfile();

    });



/* ========================================
   LOAD COMPONENT
======================================== */

function loadComponent(
    containerId,
    filePath
) {

    const container =
        document.getElementById(containerId);
     if (!container) {

        console.error("Container not found:",
            containerId
        );

        return;

    }


    fetch(filePath)

        .then(response => {

if (!response.ok) {

                throw new Error(
                    "Failed to load: " +
                    filePath
                );

            }

            return response.text();

        })

        .then(data => {

        container.innerHTML = data;


            /* ==============================
               SIDEBAR INITIALIZATION
            ============================== */

            if (
                containerId === "member-sidebar" &&
                typeof initializeMemberSidebar === "function"
            ) {

                initializeMemberSidebar();

            }


            /* ==============================
               NAVBAR INITIALIZATION
            ============================== */

            if (
                containerId === "member-navbar" &&
                typeof initMemberNavbar === "function"
            ) {

                initMemberNavbar();

            }

        })

        .catch(error => {

            console.error(error);


            container.innerHTML = `

                <p style="
                    color:#f5b900;
                    padding:20px;">

                    Component could not be loaded.

                </p>`;
            });

}



/* ========================================
   LOAD MEMBER PROFILE
======================================== */

const MEMBER_STORAGE_KEY ="gymMembers";


function loadMemberProfile() {

    const storedMembers =
        localStorage.getItem( MEMBER_STORAGE_KEY);


    if (!storedMembers) {

        console.warn(
            "No member data found in localStorage.");

        return;

    }


    let members;


    try {

        members = JSON.parse(storedMembers);

    }

    catch (error) {

        console.error("Invalid member data:", error
        );

        return;

    }


    if (!Array.isArray(members)) {

        console.warn("Member storage is not an array.");

        return;

    }


    if (members.length === 0) {

        console.warn("No members found.");

        return;

    }

    const loggedInMemberId =
    localStorage.getItem("loggedInMemberId");


if (!loggedInMemberId) {

    console.warn("No logged-in member ID found.");

    return;

}


const member = members.find(
    function (item) {

        const memberId =
            item.id ||item.memberId || item.customerId ||
            item.memberID ||"";

        return (
            String(memberId).trim().toLowerCase()===
            String(loggedInMemberId).trim().toLowerCase()
        );

    }
);


if (!member) {

    console.warn(
        "Logged-in member was not found in gymMembers."
    );

    return;

}


renderMemberProfile(member);





}



/* ========================================
   RENDER MEMBER PROFILE
======================================== */

function renderMemberProfile(member) {


    const name =
        member.name || member.memberName ||
        member.fullName || "Member Name";


    const id =
         member.id || member.memberId ||
        member.customerId ||"-";


    const type =
        member.type || member.memberType ||
        "Customer";


    const phone =
        member.phone || member.contact ||
        member.mobile ||"-";


    const email =
        member.email || "-";


    const trainer =
        member.trainerName || member.assignedTrainer ||
        member.trainer || "No Trainer Assigned";


    const trainerType =
        member.trainerType || member.trainerSpecialization ||
        "Fitness Trainer";


    const membership =
        member.membershipPlan || member.plan ||
        member.membership ||"-";


    const status =
        member.membershipStatus || member.status || "Active";


    const startDate =
        member.startDate || member.membershipStartDate || "-";


    const validTill =
        member.validTill ||member.expiryDate ||
        member.membershipExpiry || "-";


    const goal =
        member.fitnessGoal ||member.goal ||"-";


    const weight =
        member.weight || "-";


    const height =
        member.height || "-";


    const joiningDate =
        member.joiningDate || member.joinDate ||"-";


    /* ====================================
       SET PROFILE DATA
    ==================================== */

    setText(
        "profileMemberName",name
    );


    setText(
        "profileMemberType", type
    );


    setText(
        "profileMemberId","Member ID: " + id
    );


    setText(
        "profileMembershipStatus",status
    );


    setText(
        "profileFullName", name
    );


    setText(
        "profileId",id
    );


    setText(
        "profilePhone", phone
    );


    setText(
        "profileEmail",email
    );


    setText(
        "profileTrainerName",trainer
    );


    setText(
        "profileTrainerType",trainerType
    );


    setText(
        "profileMembershipPlan",membership
    );


    setText(
        "profileStatus",status
    );


    setText(
        "profileStartDate",startDate
    );


    setText(
        "profileValidTill",validTill
    );


    setText(
        "profileGoal", goal
    );


    setText(
        "profileWeight", weight
    );


    setText(
        "profileHeight", height
    );


    setText(
        "profileJoiningDate", joiningDate
    );

}



/* ========================================
   SET TEXT
======================================== */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.textContent =
        value ?? "-";

}
