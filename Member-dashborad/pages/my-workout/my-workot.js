/*==========================
MY WORKOUT PLAN JS
===============================*/


/*===========================
DOM READY
===========================*/
document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadComponenet(
            "member-sidebar",
            "../../../components/member-sidebar/member-sidebar.html"
        );
        loadComponenet(
            "member-navbar",
            "../../../components/member-navbar/member-navbar.html"
        );
        loadMyWorkoutPlans();
    }
);

/*=============================
LOAD COMPONENT
==============================*/
function loadComponenet(
    containerId,filePath
)
{
    const container=
    document.getElementById(containerId);
    if(!container){
        return;

    }
    fetch(filePath)
    .then(response =>
    {
        if(!response.ok){
            throw new
            Error("Failed to load:" + filePath);

        }
        return response.text();

})
.then(data =>{
    container.innerHTML=data;
    /*=============== SIDEBAR=============*/
    if(containerId==="member-sidebar" && 
        typeof
        initializeMemberSidebar==="function")
        {
            initializeMemberSidebar();
        }
        /*====================== NAVBAR=============*/
        if(containerId==="member-navbar " &&
            typeof
            initMemberNavbar==="function"
        )
        {
            initMemberNavbar();
        }

})
.catch(error => {
console.error(error);
container.innerHTML =`
<p style="
color:#f5b900;
padding:20px;">
Component could not be loaded.
</p>`;
}
);
}
/*==========================
STORAGE KEY
============================*/
const WORKOUT_PLANS_KEY =
"trainerWorkoutPlans";
const MEMBER_KEY ="gymMembers";
/*=============================
GET MEMBERS
===============================*/
function getMembers(){
    try{
        return JSON.parse(
            localStorage.getItem(MEMBER_KEY)
        )||[];
    }
    catch(error){
        console.error("Invalide gymMembers data",
            error
        );
        return[];

    }
}
/*=============================
GET WORKOUT PLANS
============================*/
function getWorkoutPlans(){

    try{
        return JSON.parse(
            localStorage.getItem(WORKOUT_PLANS_KEY)
        )||[];
    }
    catch(error)
    {
        console.error("Invalid workout plan data",error);
        return[];
    }
}
/*==============================
GET CURRENT MEMBER
==============================*/
function getCurrentMember(){
    const members =
    getMembers();
    return members[0] || null;
}
/*=============================
LOAD MY WORKOUT PLANS
===============================*/
function loadMyWorkoutPlans() {

    const container =
        document.getElementById("workoutPlansContainer");

    const emptyState =
    document.getElementById("emptyWorkout");


    if (!container) {
        return;
    }


    const member = getCurrentMember();


    if (!member) {

        container.innerHTML = "";

        if (emptyState) {
            emptyState.style.display = "block";
        }

        return;

    }


    const memberId =
        String(
            member.id ||member.memberId ||
            member.customerId || "");


    const memberName =
        String(
            member.name ||member.memberName ||
            member.fullName ||""
        )
        .trim().toLowerCase();


    const allPlans = getWorkoutPlans();

    const memberPlans =
        allPlans.filter(plan => {

            const planCustomerId =
                String(
                    plan.customerId || ""
                );


            const planCustomerName =
                String(
                    plan.customerName || ""
                )
                .trim().toLowerCase();


            if (
                memberId &&
                planCustomerId === memberId
            ) {

                return true;

            }


            if (
                memberName &&
                planCustomerName === memberName
            ) {

                return true;

            }


            return false;

        });


    if (memberPlans.length === 0) {

        container.innerHTML = "";

        if (emptyState) {
            emptyState.style.display = "block";
        }

        return;

    }


    if (emptyState) {
        emptyState.style.display = "none";
    }


    renderWorkoutPlans(
        memberPlans
    );

}


/* ========================================
   RENDER PLANS
======================================== */

function renderWorkoutPlans(
    plans
) {

    const container =
        document.getElementById(
            "workoutPlansContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    plans.forEach(plan => {

        const card =
            document.createElement("article");

        card.className ="workout-plan-card";


        const status =
            plan.status || "Active";


        let statusClass = "status-active";


        if (status === "Paused") {

            statusClass ="status-paused";

        }

        if (status === "Completed") {

            statusClass = "status-completed";

        }


        const days =
            plan.workoutDays?.join(", ")
            || "-";


        const exercises =
            Array.isArray(plan.exercises)
                ? plan.exercises: [];


        card.innerHTML = `

            <div class="plan-top">

                <div class="plan-icon">
                    <i class="fa-solid fa-dumbbell"></i>
                </div>

                <div class="plan-title">

                    <h2>
                        ${plan.planName || "Workout Plan"}
                    </h2>

                    <span>
                        Assigned by your trainer
                    </span>

                </div>

                <span class="plan-status ${statusClass}">
                    ${status}
                </span>

            </div>


            <div class="plan-info">

                <div class="info-box">

                    <span>
                        Workout Days
                    </span>

                    <strong>
                        ${days}
                    </strong>

                </div>


                <div class="info-box">

                    <span>
                        Exercises
                    </span>

                    <strong>
                        ${exercises.length}
                    </strong>

                </div>

            </div>


            <div class="plan-routine">

                <span>
                    Daily Routine
                </span>

                <p>
                    ${plan.dailyRoutine || "No routine instructions provided."}
                </p>

            </div>


            <div class="exercise-section">

                <h3>
                    Exercises
                </h3>

                <div class="exercise-list">

                    ${renderExercises(exercises)}

                </div>

            </div>

        `;


        container.appendChild(card);

    });

}


/* ========================================
   RENDER EXERCISES
======================================== */

function renderExercises(
    exercises
) {

    if (!exercises.length) {

        return `
            <div class="exercise-item">

                <div class="exercise-name">
                    No exercises added.
                </div>

            </div>`;

    }


    return exercises.map(
        exercise => `

            <div class="exercise-item">

                <div class="exercise-name">
                    ${exercise.name || "Exercise"}
                </div>

                <div class="exercise-details">

                    <span class="exercise-detail">
                        Sets:
                        <strong>
                            ${exercise.sets || "-"}
                        </strong>
                    </span>

                    <span class="exercise-detail">
                        Reps:
                        <strong>
                            ${exercise.reps || "-"}
                        </strong>
                    </span>

                    <span class="exercise-detail">
                        Workout:
                        <strong>
                            ${exercise.workoutTime || "-"}
                        </strong>
                    </span>

                    <span class="exercise-detail">
                        Rest:
                        <strong>
                            ${exercise.restTime || "-"}
                        </strong>
                    </span>

                </div>

            </div>`
         ).join("");

}
