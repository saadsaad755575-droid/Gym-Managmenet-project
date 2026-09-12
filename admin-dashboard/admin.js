/* =========================
   LOAD REUSABLE COMPONENTS
========================= */

function loadComponent(elementId, filePath) {

    fetch(filePath)
        .then(response => {

            if (!response.ok) {
                throw new Error("Component not found: " + filePath);
            }

            return response.text();

        })

        .then(data => {

            document.getElementById(elementId).innerHTML = data;

        })

        .catch(error => {

            console.error(error);

        });

}


/* =========================
   SIDEBAR
========================= */
loadComponent(
    "sidebar",
    "../components/sidebar/sidebar.html"
);

/* =========================
   NAVBAR
========================= */

loadComponent(
    "navbar",
    "../components/navbar/navbar.html"
);


/* =========================
   CARDS
========================= */

loadComponent(
    "cards",
    "../components/card/card.html"
);


/* =========================
   TABLE
========================= */

loadComponent(
    "table",
    "../components/table/table.html"
);
/*========================
Quick action
==================*/
const addNewMemberBtn = document.getElementById("addNewMemberBtn");
const addNewTrainerBtn = document.getElementById("addNewTrainerBtn");
const newMembershipBtn = document.getElementById("newMembershipBtn");
const markAttendanceBtn = document.getElementById("markAttendanceBtn");


/* ADD NEW MEMBER */

if (addNewMemberBtn) {
    addNewMemberBtn.addEventListener("click", function () {

        window.location.href = "../admin-dashboard/pages/trainers/Member/Member.html";

    });
}


/* ADD NEW TRAINER */

if (addNewTrainerBtn) {
    addNewTrainerBtn.addEventListener("click", function () {

        window.location.href = "../admin-dashboard/pages/trainers/trainer.html";

    });
}


/* NEW MEMBERSHIP */

if (newMembershipBtn) {
    newMembershipBtn.addEventListener("click", function () {

        window.location.href = "../admin-dashboard/pages/membership/membership.html";

    });
}


/* MARK ATTENDANCE */

if (markAttendanceBtn) {
    markAttendanceBtn.addEventListener("click", function () {

        window.location.href = "../admin-dashboard/pages/Attendance/Attendance.html";

    });
}



