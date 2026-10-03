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

        const element = document.getElementById(elementId);

        if (element) {
            element.innerHTML = data;
        }

        /* Cards load hone ke baad data update karein */
        if (elementId === "cards") {
            updateDashboardCards();
        }

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

/* =========================
LOCAL STORAGE HELPERS
========================= */

function getStorageArray(key) {

try {

    const data = JSON.parse(
        localStorage.getItem(key) || "[]"
    );

    return Array.isArray(data) ? data : [];

} catch (error) {

    console.error("Storage error:", key, error);

    return [];

}

}

/* =========================
UPDATE DASHBOARD CARDS
========================= */

function updateDashboardCards() {

const members = getStorageArray("gymMembers");
const memberships = getStorageArray("gymMemberships");
const payments = getStorageArray("gymPayments");
const attendance = getStorageArray("gymAttendance");


/* =========================
   TOTAL MEMBERS
========================= */

const totalMembers =
    members.length;


const totalMembersElement =
    document.getElementById("totalMembersCard");

if (totalMembersElement) {

    totalMembersElement.textContent =
        totalMembers.toLocaleString();

}


/* =========================
   TOTAL TRAINERS
========================= */

let trainers = getStorageArray("gymTrainers");

/*
   Agar gymTrainers naam ka storage abhi
   available nahi hai to members ke assigned
   trainers se unique trainer count nikalein.
*/

if (trainers.length === 0) {

    const trainerNames = members
        .map(member =>
            String(member.trainer || "").trim()
        )
        .filter(trainer =>
            trainer &&
            trainer.toLowerCase() !== "not assigned"
        );

    trainers = [...new Set(trainerNames)];

}


const totalTrainers =
    Array.isArray(trainers)
        ? trainers.length
        : 0;


const totalTrainersElement =
    document.getElementById("totalTrainersCard");

if (totalTrainersElement) {

    totalTrainersElement.textContent =
        totalTrainers.toLocaleString();

}


/* =========================
   ACTIVE MEMBERSHIPS
========================= */

let activeMemberships = 0;


if (memberships.length > 0) {

    activeMemberships =
        memberships.filter(membership => {

            const status =
                String(
                    membership.status || ""
                ).toLowerCase().trim();

            return status === "active";

        }).length;

} else {

    /*
       Agar gymMemberships empty hai,
       to gymMembers ke status se calculate karein.
    */

    activeMemberships =
        members.filter(member => {

            const status =
                String(
                    member.status || ""
                ).toLowerCase().trim();

            return status === "active";

        }).length;

}


const activeMembershipsElement =
    document.getElementById("activeMembershipsCard");

if (activeMembershipsElement) {

    activeMembershipsElement.textContent =
        activeMemberships.toLocaleString();

}


/* =========================
   PENDING PAYMENTS
========================= */

const pendingPayments =
    payments.filter(payment => {

        const status =
            String(
                payment.status || ""
            ).toLowerCase().trim();

        return status === "pending";

    }).length;


const pendingPaymentsElement =
    document.getElementById("pendingPaymentsCard");

if (pendingPaymentsElement) {

    pendingPaymentsElement.textContent =
        pendingPayments.toLocaleString();

}


/* =========================
   EXPIRED MEMBERSHIPS
========================= */

let expiredMemberships = 0;


if (memberships.length > 0) {

    expiredMemberships =
        memberships.filter(membership => {

            const status =
                String(
                    membership.status || ""
                ).toLowerCase().trim();

            return (
                status === "expired" ||
                status === "overdue"
            );

        }).length;

} else {

    expiredMemberships =
        members.filter(member => {

            const status =
                String(
                    member.status || ""
                ).toLowerCase().trim();

            return (
                status === "expired" ||
                status === "overdue"
            );

        }).length;

}


const expiredMembershipsElement =
    document.getElementById(
        "expiredMembershipsCard"
    );


if (expiredMembershipsElement) {

    expiredMembershipsElement.textContent =
        expiredMemberships.toLocaleString();

}


/* =========================
   TODAY'S ATTENDANCE
========================= */

const today =
    new Date().toISOString().split("T")[0];


const todayAttendance =
    attendance.filter(record => {

        const attendanceDate =
            record.date ||
            record.attendanceDate ||
            record.checkInDate;

        if (!attendanceDate) {
            return false;
        }

        return String(attendanceDate).startsWith(today);

    });


const todayAttendanceElement =
    document.getElementById(
        "todayAttendanceCard"
    );


if (todayAttendanceElement) {

    todayAttendanceElement.textContent =
        todayAttendance.length.toLocaleString();

}

}

/* =========================
QUICK ACTIONS
========================= */

const addNewMemberBtn =
document.getElementById("addNewMemberBtn");

const addNewTrainerBtn =
document.getElementById("addNewTrainerBtn");

const newMembershipBtn =
document.getElementById("newMembershipBtn");

const markAttendanceBtn =
document.getElementById("markAttendanceBtn");

/* =========================
ADD NEW MEMBER
========================= */

if (addNewMemberBtn) {

addNewMemberBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "../admin-dashboard/pages/trainers/Member/Member.html";

    }
);

}

/* =========================
ADD NEW TRAINER
========================= */

if (addNewTrainerBtn) {

addNewTrainerBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "../admin-dashboard/pages/trainers/trainer.html";

    }
);

}

/* =========================
NEW MEMBERSHIP
========================= */

if (newMembershipBtn) {

newMembershipBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "../admin-dashboard/pages/membership/membership.html";

    }
);

}

/* =========================
MARK ATTENDANCE
========================= */

if (markAttendanceBtn) {

markAttendanceBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "../admin-dashboard/pages/Attendance/Attendance.html";

    }
);

}

/* =========================
AUTO REFRESH
========================= */

window.addEventListener(
"storage",
function () {

    updateDashboardCards();

}

); 
