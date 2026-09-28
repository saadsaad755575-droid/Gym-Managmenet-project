

/* =========================================================
   MEMBER MY DIET PLAN
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const DIET_PLANS_STORAGE_KEY = "trainerDietPlans";

const DIET_TRACKING_STORAGE_KEY = "memberDietProofs";

const MEMBER_STORAGE_KEY = "gymMembers";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentMember = null;

let currentDietPlan = null;

let selectedMeal = null;



/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMemberSidebar();

        loadMemberNavbar();

        loadMyDietPlan();

        initializeMealModal();

    }
);



/* =========================================================
   LOAD MEMBER SIDEBAR
========================================================= */

function loadMemberSidebar() {

    loadComponent(
        "member-sidebar",
        "../../../components/member-sidebar/member-sidebar.html",
        function () {

            if (
                typeof initializeMemberSidebar === "function"
            ) {

                initializeMemberSidebar();

            }

        }
    );

}



/* =========================================================
   LOAD MEMBER NAVBAR
========================================================= */

function loadMemberNavbar() {

    loadComponent(
        "member-navbar",
        "../../../components/member-navbar/member-navbar.html",
        function () {

            if (
                typeof initMemberNavbar === "function"
            ) {

                initMemberNavbar();

            }

        }
    );

}



/* =========================================================
   REUSABLE COMPONENT LOADER
========================================================= */

function loadComponent(
    containerId,
    filePath,
    callback
) {

    const container =
        document.getElementById(containerId);


    if (!container) {

        console.error(
            "Component container not found:",
            containerId
        );

        return;

    }


    fetch(filePath)

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Component could not be loaded: " +
                    filePath
                );

            }

            return response.text();

        })

        .then(function (html) {

            container.innerHTML = html;


            if (typeof callback === "function") {

                callback();

            }

        })

        .catch(function (error) {

            console.error(error);

            container.innerHTML =
                "<p>Component could not be loaded.</p>";

        });

}



/* =========================================================
   GET CURRENT MEMBER
========================================================= */

function getCurrentMember() {

    /*
       Member Login mein current member save hone ke
       architecture ko follow karte hue pehle currentMember
       check kar rahe hain.
    */

    const savedCurrentMember =
        localStorage.getItem("currentMember");


    if (savedCurrentMember) {

        try {

            const parsedMember =
                JSON.parse(savedCurrentMember);


            if (
                parsedMember &&
                typeof parsedMember === "object"
            ) {

                return parsedMember;

            }

        }

        catch (error) {

            console.error(
                "currentMember data is invalid:",
                error
            );

        }

    }

    const currentMemberId =
        localStorage.getItem("currentMemberId");


    if (currentMemberId) {

        const members =
            getMembers();


        const foundMember =
            members.find(function (member) {

                return String(
                    member.memberId ||
                    member.id ||
                    member.customerId
                ) === String(currentMemberId);

            });


        if (foundMember) {

            return foundMember;

        }

    }



    /*
       Existing gymMembers data se fallback.
    */

    const members =
        getMembers();


    if (members.length === 1) {

        return members[0];

    }


    return null;

}



/* =========================================================
   GET ALL MEMBERS
========================================================= */

function getMembers() {

    const savedMembers =
        localStorage.getItem(MEMBER_STORAGE_KEY);


    if (!savedMembers) {

        return [];

    }


    try {

        const members =
            JSON.parse(savedMembers);


        return Array.isArray(members)
            ? members
            : [];

    }

    catch (error) {

        console.error(
            "gymMembers data is invalid:",
            error
        );

        return [];

    }

}



/* =========================================================
   GET MEMBER ID
========================================================= */

function getMemberId(member) {

    if (!member) {

        return null;

    }


    return (
        member.memberId ||member.id ||
        member.customerId
    );

}


/* =========================================================
   LOAD MY DIET PLAN
========================================================= */

function loadMyDietPlan() {

    currentMember = getCurrentMember();


    if (!currentMember) {

        console.warn(
            "No current member found."
        );

        showEmptyDietPlan();

        return;

    }


    const memberId = getMemberId(currentMember);


    if (!memberId) {

        console.warn(
            "Current member does not have a valid ID."
        );

        showEmptyDietPlan();

        return;

    }


    const savedPlans =
        localStorage.getItem(
            DIET_PLANS_STORAGE_KEY
        );


    if (!savedPlans) {

        showEmptyDietPlan();

        return;

    }


    let dietPlans = [];


    try {

        dietPlans = JSON.parse(savedPlans);


        if (!Array.isArray(dietPlans)) {

            dietPlans = [];

        }

    }

    catch (error) {

        console.error(
            "trainerDietPlans data is invalid:",
            error
        );

        showEmptyDietPlan();

        return;

    }


    const memberPlans =
        dietPlans.filter(function (plan) {

            return String(plan.customerId) ===
                String(memberId);

        });


    if (memberPlans.length === 0) {

        showEmptyDietPlan();

        return;

    }


    /*
       Active plan 
    */

    currentDietPlan =
        memberPlans.find(function (plan) {

            return String(
                plan.status || ""
            ).toLowerCase() === "active";

        }) || memberPlans[memberPlans.length - 1];


    renderDietPlan();

}



/* =========================================================
   SHOW EMPTY DIET PLAN
========================================================= */

function showEmptyDietPlan() {

    const emptyState =
        document.getElementById("noDietPlan");

    const content =
        document.getElementById("dietPlanContent");


    if (emptyState) {

        emptyState.style.display = "block";

    }


    if (content) {

        content.style.display = "none";

    }

}



/* =========================================================
   SHOW DIET PLAN
========================================================= */

function showDietPlan() {

    const emptyState =
        document.getElementById("noDietPlan");

    const content =
        document.getElementById("dietPlanContent");


    if (emptyState) {

        emptyState.style.display = "none";

    }


    if (content) {

        content.style.display = "block";

    }

}



/* =========================================================
   RENDER COMPLETE DIET PLAN
========================================================= */

function renderDietPlan() {

    if (!currentDietPlan) {

        showEmptyDietPlan();

        return;

    }


    showDietPlan();

    renderPlanOverview();

    renderPlanInformation();

    renderInstructions();

    renderMeals();

    renderWeeklySchedule();

}



/* =========================================================
   RENDER PLAN OVERVIEW
========================================================= */

function renderPlanOverview() {

    const planName =
        document.getElementById("dietPlanName");

    const trainer =
        document.getElementById("dietPlanTrainer");

    const status =
        document.getElementById("dietPlanStatus");


    if (planName) {

        planName.textContent =
            currentDietPlan.dietPlan ||
            "My Diet Plan";

    }


    if (trainer) {

        const trainerName =
            currentDietPlan.trainerName ||
            currentDietPlan.trainer ||
            "Assigned Trainer";


        trainer.innerHTML =
            `<i class="fa-solid fa-user-tie"></i>
             Trainer: ${escapeHTML(trainerName)}`;

    }


    if (status) {

        status.textContent =
            currentDietPlan.status ||
            "Active";

    }

}



/* =========================================================
   RENDER PLAN INFORMATION
========================================================= */

function renderPlanInformation() {

    const schedule =
        document.getElementById("dietSchedule");

    const totalMeals =
        document.getElementById("totalMeals");


    const meals =
        Array.isArray(currentDietPlan.meals)
            ? currentDietPlan.meals
            : [];


    if (schedule) {

        const selectedDays =
            Array.isArray(currentDietPlan.schedule)
                ? currentDietPlan.schedule
                : [];


        schedule.textContent =
            selectedDays.length > 0
                ? selectedDays.join(", ")
                : "Daily";

    }


    if (totalMeals) {

        totalMeals.textContent =
            meals.length;

    }


    updateMealCounters();

}



/* =========================================================
   RENDER INSTRUCTIONS
========================================================= */

function renderInstructions() {

    const instructions =
        document.getElementById(
            "dietInstructions"
        );


    if (!instructions) {

        return;

    }


    instructions.textContent =
        currentDietPlan.instructions ||
        "No special instructions provided by your trainer.";

}



/* =========================================================
   RENDER MEALS
========================================================= */

function renderMeals() {

    const container =
        document.getElementById(
            "mealsContainer"
        );


    if (!container) {

        return;

    }


    const meals =
        Array.isArray(currentDietPlan.meals)
            ? currentDietPlan.meals
            : [];


    container.innerHTML = "";


    if (meals.length === 0) {

        container.innerHTML = `

            <div class="empty-diet-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-utensils"></i>

                </div>

                <h2>
                    No Meals Added
                </h2>

                <p>
                    Your trainer has not added meals
                    to this diet plan yet.
                </p>

            </div>

        `;

        return;

    }


    meals.forEach(function (meal, index) {

        const mealTracking =
            getTodayMealTracking(meal);


        const isCompleted =
            mealTracking &&
            (
                mealTracking.status === "Submitted" ||
                mealTracking.status === "Followed"
            );


        const mealType =
            meal.type ||
            "Meal";


        const food =
            meal.food ||
            "Not specified";


        const quantity =
            meal.quantity ||
            "Not specified";


        const time =
            meal.time ||
            "Not specified";


        const instructions =
            meal.instructions ||
            "Follow the quantity and timing recommended by your trainer.";


        const card =
            document.createElement("div");


        card.className =
            "meal-card";


        card.innerHTML = `

            <div class="meal-card-top">

                <div class="meal-title">

                    <div class="meal-icon">

                        <i class="${getMealIcon(mealType)}"></i>

                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(mealType)}
                        </h3>

                        <span>
                            Meal ${index + 1}
                        </span>

                    </div>

                </div>


                <span class="${
                    isCompleted
                        ? "meal-completed"
                        : "meal-pending"
                }">

                    ${
                        isCompleted
                            ? "COMPLETED"
                            : "PENDING"
                    }

                </span>

            </div>


            <div class="meal-info">

                <div class="meal-info-item">

                    <span>
                        FOOD
                    </span>

                    <strong>
                        ${escapeHTML(food)}
                    </strong>

                </div>


                <div class="meal-info-item">

                    <span>
                        QUANTITY
                    </span>

                    <strong>
                        ${escapeHTML(quantity)}
                    </strong>

                </div>


                <div class="meal-info-item">

                    <span>
                        MEAL TIME
                    </span>

                    <strong>
                        ${escapeHTML(time)}
                    </strong>

                </div>

            </div>


            <div class="meal-instructions">

                <i class="fa-solid fa-circle-info"></i>

                ${escapeHTML(instructions)}

            </div>


            <button
                type="button"
                class="complete-meal-btn ${
                    isCompleted
                        ? "completed"
                        : ""
                }"
                data-meal-id="${meal.id || index}"
                ${isCompleted ? "disabled" : ""}
            >

                <i class="fa-solid ${
                    isCompleted
                        ? "fa-circle-check"
                        : "fa-check"
                }"></i>

                ${
                    isCompleted
                        ? "Meal Completed":"Mark Meal Completed"
                }
                </button>`;
    
const button =
            card.querySelector(
                ".complete-meal-btn"
            );


        if (button && !isCompleted) {

            button.addEventListener(
                "click",
                function () {

                    openMealModal(meal);

                }
            );

        }


        container.appendChild(card);

    });


    updateCurrentDate();

    updateMealCounters();

}



/* =========================================================
   GET MEAL ICON
========================================================= */

function getMealIcon(type) {

    const mealType =
        String(type || "").toLowerCase();


    if (mealType.includes("breakfast")) {

        return "fa-solid fa-mug-hot";

    }


    if (mealType.includes("lunch")) {

        return "fa-solid fa-bowl-food";

    }


    if (
        mealType.includes("snack") ||
        mealType.includes("snacks")
    ) {

        return "fa-solid fa-apple-whole";

    }


    if (mealType.includes("dinner")) {

        return "fa-solid fa-utensils";

    }


    return "fa-solid fa-bowl-food";

}



/* =========================================================
   RENDER WEEKLY SCHEDULE
========================================================= */

function renderWeeklySchedule() {

    const container =
        document.getElementById(
            "weeklySchedule"
        );


    if (!container) {

        return;

    }


    const schedule =
        Array.isArray(currentDietPlan.schedule)
            ? currentDietPlan.schedule
            : [];


    const days = [
        "Monday","Tuesday",
        "Wednesday","Thursday",
        "Friday", "Saturday",
        "Sunday"
    ];


    container.innerHTML = "";


    days.forEach(function (day) {

        const isActive =
            schedule.some(function (savedDay) {

                return String(savedDay)
                    .toLowerCase()
                    .includes(
                        day.toLowerCase()
                    );

            });


        const dayCard =
            document.createElement("div");


        dayCard.className =
            "schedule-day" +
            (
                isActive
                    ? " active"
                    : ""
            );


        dayCard.innerHTML = `

            <h4>
                ${day.substring(0, 3)}
            </h4>

            <p>

                ${
                    isActive
                        ? "Diet Day"
                        : "Rest"
                }

            </p>  `;


        container.appendChild(dayCard);

    });

}



/* =========================================================
   UPDATE CURRENT DATE
========================================================= */

function updateCurrentDate() {

    const dateElement =
        document.getElementById(
            "currentMealDate"
        );


    if (!dateElement) {

        return;

    }


    const today =
        new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}



/* =========================================================
   INITIALIZE MEAL MODAL
========================================================= */

function initializeMealModal() {

    const closeButton =
        document.getElementById(
            "closeMealModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelMealBtn"
        );


    const submitButton =
        document.getElementById(
            "submitMealBtn"
        );


    const modal =
        document.getElementById(
            "mealModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeMealModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeMealModal
        );

    }


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            submitMealCompletion
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {

                    closeMealModal();

                }

            }
        );

    }

}



/* =========================================================
   OPEN MEAL MODAL
========================================================= */

function openMealModal(meal) {

    selectedMeal = meal;


    const modal =
        document.getElementById(
            "mealModal"
        );


    const mealName =
        document.getElementById(
            "modalMealName"
        );


    const food =
        document.getElementById(
            "modalMealFood"
        );


    const quantity =
        document.getElementById(
            "modalMealQuantity"
        );


    const time =
        document.getElementById(
            "modalMealTime"
        );


    const instructions =
        document.getElementById(
            "modalMealInstructions"
        );


    const feedback =
        document.getElementById(
            "mealFeedback"
        );


    if (mealName) {

        mealName.textContent =
            meal.type ||
            "Meal";

    }


    if (food) {

        food.textContent =
            meal.food ||
            "Not specified";

    }


    if (quantity) {

        quantity.textContent =
            meal.quantity ||
            "Not specified";

    }


    if (time) {

        time.textContent =
            meal.time ||
            "Not specified";

    }


    if (instructions) {

        instructions.textContent =
            meal.instructions ||
            "Follow the instructions provided by your trainer.";

    }


    if (feedback) {

        feedback.value = "";

    }


    if (modal) {

        modal.classList.add("show");

    }

}



/* =========================================================
   CLOSE MEAL MODAL
========================================================= */

function closeMealModal() {

    const modal =
        document.getElementById(
            "mealModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }


    selectedMeal = null;

}


/* ========================================
   SUBMIT MEAL COMPLETION
======================================== */

function submitMealCompletion() {

    if (!selectedMeal || !currentMember || !currentDietPlan) {
        return;
    }

    const memberId = getMemberId(currentMember);

    if (!memberId) {
        alert("Member information not found.");
        return;
    }

    const feedback =
        document.getElementById("mealFeedback").value.trim();

    const today = getTodayDate();

    const existingRecords = getDietTrackingRecords();

    /* Prevent duplicate submission */

    const alreadySubmitted = existingRecords.some(record =>
        String(record.memberId) === String(memberId) &&
        String(record.planId) === String(currentDietPlan.id) &&
        String(record.mealId) === String(selectedMeal.id) &&
        record.date === today
    );

    if (alreadySubmitted) {
        alert("This meal has already been submitted today.");
        return;
    }

    /* Create tracking record */

    const trackingRecord = {

        id: Date.now(),

        memberId: memberId,

        memberName:
            currentMember.name ||
            currentMember.memberName ||
            currentMember.fullName ||
            "Member",

        trainerName:
            currentDietPlan.trainerName ||
            currentDietPlan.trainer ||
            currentMember.trainerName ||
            currentMember.trainer ||
            currentMember.assignedTrainer ||
            "",

        planId: currentDietPlan.id,

        dietPlan:
            currentDietPlan.dietPlan ||
            "Diet Plan",

        mealId:
            selectedMeal.id ||
            Date.now(),

        meal:
            selectedMeal.type ||
            "Meal",

        food:
            selectedMeal.food ||
            "",

        quantity:
            selectedMeal.quantity ||
            "",

        time:
            selectedMeal.time ||
            "",

        date: today,

        submittedAt:
            new Date().toISOString(),

        proof: "Submitted",

        feedback: feedback,

        status: "Submitted",

        reviewedBy: "",

        reviewedAt: ""

    };


    /* Save record */

    existingRecords.push(trackingRecord);

    localStorage.setItem(
        DIET_TRACKING_STORAGE_KEY,
        JSON.stringify(existingRecords)
    );


    /* Close modal */

    closeMealModal();


    /* Refresh meal cards */

    renderMeals();


    /* Refresh counters */

    updateMealCounters();


    alert("Meal completed successfully.");

}



/* ========================================
   GET DIET TRACKING RECORDS
======================================== */

function getDietTrackingRecords() {

    const savedRecords =
        localStorage.getItem(
            DIET_TRACKING_STORAGE_KEY
        );

    if (!savedRecords) {
        return [];
    }

    try {

        return JSON.parse(savedRecords);

    } catch (error) {

        console.error(
            "Error reading diet tracking records:",
            error
        );

        return [];
    }
}



/* ========================================
   GET TODAY'S MEAL TRACKING
======================================== */

function getTodayMealTracking(meal) {

    if (
        !currentMember ||
        !currentDietPlan ||
        !meal
    ) {
        return null;
    }

    const memberId =
        getMemberId(currentMember);

    const records =
        getDietTrackingRecords();

    const today =
        getTodayDate();

    return records.find(record =>

        String(record.memberId) ===
        String(memberId)

        &&

        String(record.planId) ===
        String(currentDietPlan.id)

        &&

        String(record.mealId) ===
        String(meal.id)

        &&

        record.date === today

    ) || null;
}



/* ========================================
   UPDATE MEAL COUNTERS
======================================== */

function updateMealCounters() {

    const totalMeals =
        currentDietPlan &&
        Array.isArray(currentDietPlan.meals)
            ? currentDietPlan.meals.length
            : 0;


    let completedMeals = 0;


    if (currentDietPlan && currentMember) {

        const memberId =
            getMemberId(currentMember);

        const records =
            getDietTrackingRecords();

        const today =
            getTodayDate();


        completedMeals =
            currentDietPlan.meals.filter(meal => {

                return records.some(record =>

                    String(record.memberId) ===
                    String(memberId)

                    &&

                    String(record.planId) ===
                    String(currentDietPlan.id)

                    &&

                    String(record.mealId) ===
                    String(meal.id)

                    &&

                    record.date === today

                );

            }).length;
    }


    const remainingMeals =
        Math.max(
            totalMeals - completedMeals,
            0
        );


    const totalElement =
        document.getElementById("totalMeals");

    const completedElement =
        document.getElementById("completedMeals");

    const remainingElement =
        document.getElementById("remainingMeals");


    if (totalElement) {
        totalElement.textContent =
            totalMeals;
    }

    if (completedElement) {
        completedElement.textContent =
            completedMeals;
    }

    if (remainingElement) {
        remainingElement.textContent =
            remainingMeals;
    }

}



/* ========================================
   GET TODAY DATE
======================================== */

function getTodayDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}



/* ========================================
   ESCAPE HTML
======================================== */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
} 



