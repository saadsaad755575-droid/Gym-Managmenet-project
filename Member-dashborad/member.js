/* ========================================
   MEMBER DASHBOARD JS
   COMPLETE UPDATED VERSION
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


        /* ========================================
           SUMMARY + QUICK ACCESS CARDS
        ======================================== */

        setupDashboardCardActions();


        /* ========================================
           MEMBERSHIP CARD
        ======================================== */

        updateMembershipCard();


        /* ========================================
           TODAY'S WORKOUT
        ======================================== */

        updateTodayWorkout();


        /* ========================================
           TODAY'S DIET
        ======================================== */

        updateTodayDiet();


        /* ========================================
           ATTENDANCE
        ======================================== */

        updateAttendanceCard();

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
        document.getElementById(
            containerId
        );


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

            container.innerHTML =
                data;


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

            console.error(
                error
            );

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
   GET LOGGED-IN MEMBER
======================================== */

function getLoggedInMember() {

    const loggedInMemberId =
        localStorage.getItem(
            "loggedInMemberId"
        );


    if (!loggedInMemberId) {

        console.warn(
            "No logged-in member ID found."
        );

        return null;

    }


    const savedMembers =
        localStorage.getItem(
            "gymMembers"
        );


    if (!savedMembers) {

        console.warn(
            "No member data found."
        );

        return null;

    }


    let members;


    try {

        members =
            JSON.parse(
                savedMembers
            );

    } catch (error) {

        console.error(
            "Invalid gymMembers data.",
            error
        );

        return null;

    }


    if (!Array.isArray(members)) {

        return null;

    }


    const currentMember =
        members.find(
            member => {

                const memberId =
                    member.id ||
                    member.memberId ||
                    member.customerId;


                return String(
                    memberId
                )
                    .trim()
                    .toLowerCase()
                    ===
                    String(
                        loggedInMemberId
                    )
                        .trim()
                        .toLowerCase();

            }
        );


    return currentMember || null;

}


/* ========================================
   LOAD LOGGED-IN MEMBER
======================================== */

function loadLoggedInMember() {

    const currentMember =
        getLoggedInMember();


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
        localStorage.getItem(
            "loggedInMemberId"
        );


    /* ========================================
       ASSIGNED TRAINER
    ======================================== */

    const assignedTrainerName =
        currentMember.assignedTrainer ||
        currentMember.trainer ||
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
   MEMBERSHIP CARD
======================================== */

function updateMembershipCard() {

    const currentMember =
        getLoggedInMember();


    if (!currentMember) {

        return;

    }


    let plan =
        currentMember.membership ||
        currentMember.membershipPlan ||
        currentMember.plan ||
        "No Membership";


    let status =
        currentMember.status ||
        currentMember.membershipStatus ||
        "Non-Active";


    let validTill =
        currentMember.validTill ||
        currentMember.expiryDate ||
        currentMember.membershipExpiry ||
        "";


    /* ========================================
       CHECK GYM MEMBERSHIPS
    ======================================== */

    const savedMemberships =
        localStorage.getItem(
            "gymMemberships"
        );


    if (savedMemberships) {

        try {

            const memberships =
                JSON.parse(
                    savedMemberships
                );


            if (Array.isArray(memberships)) {

                const memberId =
                    currentMember.id ||
                    currentMember.memberId ||
                    currentMember.customerId;


                const memberName =
                    currentMember.name ||
                    currentMember.memberName ||
                    currentMember.fullName;


                const membership =
                    memberships.find(
                        item => {

                            const itemMemberId =
                                item.memberId ||
                                item.memberID ||
                                item.customerId;


                            const itemMemberName =
                                item.memberName ||
                                item.name;


                            const idMatch =
                                itemMemberId &&
                                memberId &&
                                String(itemMemberId)
                                    .trim()
                                    .toLowerCase()
                                    ===
                                String(memberId)
                                    .trim()
                                    .toLowerCase();


                            const nameMatch =
                                itemMemberName &&
                                memberName &&
                                String(itemMemberName)
                                    .trim()
                                    .toLowerCase()
                                    ===
                                String(memberName)
                                    .trim()
                                    .toLowerCase();


                            return (
                                idMatch ||
                                nameMatch
                            );

                        }
                    );


                if (membership) {

                    plan =
                        membership.plan ||
                        membership.membership ||
                        membership.planName ||
                        plan;


                    status =
                        membership.status ||
                        membership.membershipStatus ||
                        status;


                    validTill =
                        membership.validTill ||
                        membership.expiryDate ||
                        membership.expiry ||
                        validTill;

                }

            }

        } catch (error) {

            console.error(
                "Invalid gymMemberships data.",
                error
            );

        }

    }


    /* ========================================
       CHECK EXPIRY
    ======================================== */

    if (validTill) {

        const expiryDate =
            parseDateValue(
                validTill
            );


        if (expiryDate) {

            const today =
                new Date();


            today.setHours(
                0,
                0,
                0,
                0
            );


            expiryDate.setHours(
                0,
                0,
                0,
                0
            );


            if (
                expiryDate < today
            ) {

                status =
                    "Non-Active";

            } else {

                status =
                    "Active";

            }

        }

    }


    /* ========================================
       SHOW MEMBERSHIP PLAN
    ======================================== */

    const membershipPlan =
        document.getElementById(
            "membershipPlan"
        );


    if (membershipPlan) {

        membershipPlan.textContent =
            plan;

    }


    /* ========================================
       SHOW MEMBERSHIP STATUS
    ======================================== */

    const membershipStatus =
        document.getElementById(
            "membershipStatus"
        );


    if (membershipStatus) {

        membershipStatus.textContent =
            normalizeMembershipStatus(
                status
            );


        membershipStatus.classList.remove(
            "active-badge"
        );


        if (
            String(status)
                .toLowerCase()
                .includes("active")
        ) {

            membershipStatus.classList.add(
                "active-badge"
            );

        }

    }


    /* ========================================
       SHOW VALID TILL
    ======================================== */

    const membershipValidTill =
        document.getElementById(
            "membershipValidTill"
        );


    if (membershipValidTill) {

        if (validTill) {

            membershipValidTill.textContent =
                `Valid Till: ${formatDate(validTill)}`;

        } else {

            membershipValidTill.textContent =
                "Valid Till: -";

        }

    }

}


/* ========================================
   MEMBERSHIP STATUS NORMALIZER
======================================== */

function normalizeMembershipStatus(
    status
) {

    const value =
        String(
            status || ""
        )
            .trim()
            .toLowerCase();


    if (
        value === "paid" ||
        value === "active"
    ) {

        return "Active";

    }


    if (
        value === "expired" ||
        value === "inactive" ||
        value === "overdue" ||
        value === "cancelled" ||
        value === "canceled"
    ) {

        return "Non-Active";

    }


    if (
        value.includes("active") &&
        !value.includes("inactive")
    ) {

        return "Active";

    }


    return "Non-Active";

}


 /*========================================
TODAY'S WORKOUT
======================================== */

function updateTodayWorkout() {

const workoutElement =
    document.getElementById(
        "todayWorkout"
    );


if (!workoutElement) {

    return;

}


const currentMember =
    getLoggedInMember();


if (!currentMember) {

    workoutElement.textContent =
        "No Workout";

    return;

}


const memberId =
    currentMember.id ||
    currentMember.memberId ||
    currentMember.customerId;


const memberName =
    currentMember.name ||
    currentMember.memberName ||
    currentMember.fullName;


const savedPlans =
    localStorage.getItem(
        "trainerWorkoutPlans"
    );


if (!savedPlans) {

    workoutElement.textContent =
        "No Workout";

    return;

}


let plans;


try {

    plans =
        JSON.parse(
            savedPlans
        );

} catch (error) {

    console.error(
        "Invalid trainerWorkoutPlans data.",
        error
    );

    workoutElement.textContent =
        "No Workout";

    return;

}


if (!Array.isArray(plans)) {

    workoutElement.textContent =
        "No Workout";

    return;

}


const assignedPlan =
    plans.find(
        plan => {

            const planMemberId =
                plan.memberId ||
                plan.memberID ||
                plan.customerId;


            const planMemberName =
                plan.memberName ||
                plan.customerName ||
                plan.member ||
                plan.customer;


            const idMatch =
                planMemberId &&
                memberId &&
                String(planMemberId)
                    .trim()
                    .toLowerCase()
                    ===
                String(memberId)
                    .trim()
                    .toLowerCase();


            const nameMatch =
                planMemberName &&
                memberName &&
                String(planMemberName)
                    .trim()
                    .toLowerCase()
                    ===
                String(memberName)
                    .trim()
                    .toLowerCase();


            return (
                idMatch ||
                nameMatch
            );

        }
    );


if (!assignedPlan) {

    workoutElement.textContent =
        "No Workout";

    return;

}


/* ========================================
   GET TODAY
======================================== */

const today =
    new Date();


const dayName =
    today.toLocaleDateString(
        "en-US",
        {
            weekday: "long"
        }
    );


let todayWorkout =
    getTodayRoutine(
        assignedPlan,
        dayName
    );


if (!todayWorkout) {

    todayWorkout =
        assignedPlan.planName ||
        assignedPlan.workoutName ||
        assignedPlan.title ||
        assignedPlan.name ||
        "Workout Plan";

}


workoutElement.textContent =
    todayWorkout;

}

/* ========================================
GET TODAY ROUTINE
======================================== */

function getTodayRoutine(
plan,
dayName
) {

const routine =
    plan.dailyRoutine ||
    plan.routine ||
    plan.weeklyRoutine ||
    plan.schedule;


if (!routine) {

    return "";

}


if (
    typeof routine === "object" &&
    !Array.isArray(routine)
) {

    return (
        routine[dayName] ||
        routine[dayName.toLowerCase()] ||
        ""
    );

}


if (typeof routine === "string") {

    const lines =
        routine.split(
            /\n|,/
        );


    const todayLine =
        lines.find(
            line =>
                line
                    .toLowerCase()
                    .includes(
                        dayName.toLowerCase()
                    )
        );


    if (todayLine) {

        return todayLine
            .replace(
                new RegExp(
                    dayName,
                    "i"
                ),
                ""
            )
            .replace(
                /^[:\-–—]\s*/,
                ""
            )
            .trim();

    }

}


return "";

}

/* ========================================
TODAY'S DIET
======================================== */

function updateTodayDiet() {

const dietElement =
    document.getElementById(
        "todayDiet"
    );


if (!dietElement) {

    return;

}


const currentMember =
    getLoggedInMember();


if (!currentMember) {

    dietElement.textContent =
        "No Diet Plan";

    return;

}


const memberId =
    currentMember.id ||
    currentMember.memberId ||
    currentMember.customerId;


const memberName =
    currentMember.name ||
    currentMember.memberName ||
    currentMember.fullName;


const savedPlans =
    localStorage.getItem(
        "trainerDietPlans"
    );


if (!savedPlans) {

    dietElement.textContent =
        "No Diet Plan";

    return;

}


let plans;


try {

    plans =
        JSON.parse(
            savedPlans
        );

} catch (error) {

    console.error(
        "Invalid trainerDietPlans data.",
        error
    );

    dietElement.textContent =
        "No Diet Plan";

    return;

}


if (!Array.isArray(plans)) {

    dietElement.textContent =
        "No Diet Plan";

    return;

}


const assignedPlan =
    plans.find(
        plan => {

            const planMemberId =
                plan.memberId ||
                plan.memberID ||
                plan.customerId;


            const planMemberName =
                plan.memberName ||
                plan.customerName ||
                plan.member ||
                plan.customer;


            const idMatch =
                planMemberId &&
                memberId &&
                String(planMemberId)
                    .trim()
                    .toLowerCase()
                    ===
                String(memberId)
                    .trim()
                    .toLowerCase();


            const nameMatch =
                planMemberName &&
                memberName &&
                String(planMemberName)
                    .trim()
                    .toLowerCase()
                    ===
                String(memberName)
                    .trim()
                    .toLowerCase();


            return (
                idMatch ||
                nameMatch
            );

        }
    );


if (!assignedPlan) {

    dietElement.textContent =
        "No Diet Plan";

    return;

}


const dietName =
    assignedPlan.planName ||
    assignedPlan.dietName ||
    assignedPlan.title ||
    assignedPlan.name ||
    "Diet Plan";


dietElement.textContent =
    dietName;

}

/* ========================================
ATTENDANCE CARD
======================================== */

function updateAttendanceCard() {

const attendanceElement =
    document.getElementById(
        "attendanceCount"
    );


if (!attendanceElement) {

    return;

}


const currentMember =
    getLoggedInMember();


if (!currentMember) {

    attendanceElement.textContent =
        "0 / 0";

    return;

}


const memberId =
    currentMember.id ||
    currentMember.memberId ||
    currentMember.customerId;


const memberName =
    currentMember.name ||
    currentMember.memberName ||
    currentMember.fullName;


const savedAttendance =
    localStorage.getItem(
        "gymAttendance"
    );


if (!savedAttendance) {

    attendanceElement.textContent =
        "0 / 0";

    return;

}


let attendance;


try {

    attendance =
        JSON.parse(
            savedAttendance
        );

} catch (error) {

    console.error(
        "Invalid gymAttendance data.",
        error
    );

    attendanceElement.textContent =
        "0 / 0";

    return;

}


if (!Array.isArray(attendance)) {

    attendanceElement.textContent =
        "0 / 0";

    return;

}


const now =
    new Date();


const currentMonth =
    now.getMonth();


const currentYear =
    now.getFullYear();


const memberAttendance =
    attendance.filter(
        record => {

            const recordMemberId =
                record.memberId ||
                record.memberID ||
                record.customerId;


            const recordMemberName =
                record.memberName ||
                record.customerName ||
                record.member ||
                record.customer;


            const recordDate =
                record.date ||
                record.attendanceDate ||
                record.createdAt ||
                record.checkInDate;


            const parsedDate =
                parseDateValue(
                    recordDate
                );


            if (!parsedDate) {

                return false;

            }


            const sameMember =
                (
                    recordMemberId &&
                    memberId &&
                    String(recordMemberId)
                        .trim()
                        .toLowerCase()
                        ===
                    String(memberId)
                        .trim()
                        .toLowerCase()
                )
                ||
                (
                    recordMemberName &&
                    memberName &&
                    String(recordMemberName)
                        .trim()
                        .toLowerCase()
                        ===
                    String(memberName)
                        .trim()
                        .toLowerCase()
                );


            const sameMonth =
                parsedDate.getMonth()
                ===
                currentMonth
                &&
                parsedDate.getFullYear()
                ===
                currentYear;


            return (
                sameMember &&
                sameMonth
            );

        }
    );


const totalDays =
    memberAttendance.length;


const presentDays =
    memberAttendance.filter(
        record => {

            const status =
                String(
                    record.status ||
                    record.attendanceStatus ||
                    record.state ||
                    "Present"
                )
                    .trim()
                    .toLowerCase();


            return (
                status === "present" ||
                status === "p" ||
                status === "checked-in" ||
                status === "check-in" ||
                status === "active"
            );

        }
    ).length;


attendanceElement.textContent =
    `${presentDays} / ${totalDays}`;

}

/* ========================================
SUMMARY CARDS + QUICK ACCESS
======================================== */

function setupDashboardCardActions() {

/* ========================================
   SUMMARY CARDS
======================================== */

const summaryCards =
    document.querySelectorAll(
        ".member-summary-card"
    );


summaryCards.forEach(
    function (card) {

        const titleElement =
            card.querySelector(
                ".summary-content > span"
            );


        if (!titleElement) {

            return;

        }


        const title =
            titleElement.textContent
                .trim()
                .toLowerCase();


        card.style.cursor =
            "pointer";


        /* ========================================
           MEMBERSHIP PLAN
        ======================================== */

        if (
            title === "membership plan"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/my fee/my-fee.html";

                }
            );

        }


        /* ========================================
           TODAY'S WORKOUT
        ======================================== */

        else if (
            title === "today's workout"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/my-Progress/my-progress.html";

                }
            );

        }


        /* ========================================
           TODAY'S DIET
        ======================================== */

        else if (
            title === "today's diet"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/my-dite-plan/my-dite-plan.html";

                }
            );

        }


        /* ========================================
           ATTENDANCE
        ======================================== */

        else if (
            title === "attendance"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/my-attendance/my-attendance.html";

                }
            );

        }

    }
);


/* ========================================
   QUICK ACCESS CARDS
======================================== */

const quickCards =
    document.querySelectorAll(
        ".quick-access-card"
    );


quickCards.forEach(
    function (card) {

        const titleElement =
            card.querySelector(
                "h3"
            );


        if (!titleElement) {

            return;

        }


        const title =
            titleElement.textContent
                .trim()
                .toLowerCase();


        card.style.cursor =
            "pointer";


        /* ========================================
           MY TRAINER
        ======================================== */

        if (
            title === "my trainer"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/my-profile/my-profile.html";

                }
            );

        }


        /* ========================================
           PROGRESS TRACKING
        ======================================== */

        else if (
            title === "progress tracking"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/my-Progress/my-progress.html";

                }
            );

        }


        /* ========================================
           FIND MY TRAINER
        ======================================== */

        else if (
            title === "find my trainer"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/find-my-trainer/find-my-trainer.html";

                }
            );

        }


        /* ========================================
           TRAINER RECOMMENDATION
        ======================================== */

        else if (
            title === "trainer recommendation"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/Trainer-Recomend/trainer-recomed.html";

                }
            );

        }


        /* ========================================
           PAYMENT HISTORY
        ======================================== */

        else if (
            title === "payment history"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/my fee/my-fee.html";

                }
            );

        }


        /* ========================================
           MY DIET PLAN
        ======================================== */

        else if (
            title === "my diet plan"
        ) {

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "pages/my-dite-plan/my-dite-plan.html";

                }
            );

        }

    }
);

}

/* ========================================
VIEW PROFILE BUTTON
======================================== */

function setupViewProfileButton() {

const viewProfileButton =
    document.querySelector(
        "#memberDashboard .view-profile-btn"
    );


if (!viewProfileButton) {

    const bannerButton =
        document.querySelector(
            ".banner-btn"
        );


    if (bannerButton) {

        bannerButton.addEventListener(
            "click",
            openMemberProfile
        );

        return;

    }


    const buttons =
        document.querySelectorAll(
            "button"
        );


    buttons.forEach(
        button => {

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

        }
    );


    return;

}


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

/* ========================================
DATE PARSER
======================================== */

function parseDateValue(
value
) {

if (!value) {

    return null;

}


if (
    value instanceof Date
) {

    return new Date(
        value
    );

}


const date =
    new Date(
        value
    );


if (
    !isNaN(
        date.getTime()
    )
) {

    return date;

}


return null;

}

/* ========================================
FORMAT DATE
======================================== */

function formatDate(
value
) {

const date =
    parseDateValue(
        value
    );


if (!date) {

    return value || "-";

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
