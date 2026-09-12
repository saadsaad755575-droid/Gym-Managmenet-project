

/* =========================
   WORKOUT PLANS JS
========================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================= */

    const customerSelect = document.getElementById("customerSelect");
    const planName = document.getElementById("planName");
    const planStatus = document.getElementById("planStatus");
    const dailyRoutine = document.getElementById("dailyRoutine");

    const exercisePopup = document.getElementById("exercisePopup");
    const openExerciseList = document.getElementById("openExerciseList");
    const closeExerciseList = document.getElementById("closeExerciseList");
    const exerciseSearch = document.getElementById("exerciseSearch");
    const exerciseList = document.getElementById("exerciseList");
    const exerciseTableBody = document.getElementById("exerciseTableBody");

    const saveWorkoutPlan = document.getElementById("saveWorkoutPlan");
    const cancelWorkoutForm = document.getElementById("cancelWorkoutForm");
    const workoutFormCard = document.getElementById("workoutFormCard");

    const workoutPlansTableBody =
        document.getElementById("workoutPlansTableBody");

    const openWorkoutForm =
        document.getElementById("openWorkoutForm");


    /* =========================
       STORAGE KEY
    ========================== */

    const workoutPlansStorageKey = "trainerWorkoutPlans";


    /* =========================
       EXERCISE LIST
    ========================== */

    const exercises = [
        "Squats",
        "Push-ups",
        "Plank",
        "Lunges",
        "Bench Press",
        "Pull-ups",
        "Shoulder Press",
        "Bicep Curls",
        "Tricep Extensions",
        "Leg Press",
        "Deadlift",
        "Crunches",
        "Leg Raises",
        "Lat Pulldown",
        "Chest Fly"
    ];


    /* =========================
       CURRENT PLAN EXERCISES
    ========================== */

    let selectedExercises = [];
    let editingPlanId = null;


    /* =========================
       GET SAVED WORKOUT PLANS
    ========================== */

    function getWorkoutPlans() {

        return JSON.parse(
            localStorage.getItem(workoutPlansStorageKey)
        ) || [];

    }


    /* =========================
       SAVE WORKOUT PLANS
    ========================== */

    function saveWorkoutPlans(plans) {

        localStorage.setItem(
            workoutPlansStorageKey,
            JSON.stringify(plans)
        );

    }


    /* =========================
       LOAD ASSIGNED CUSTOMERS
    ========================== */

    function loadAssignedCustomers() {

        customerSelect.innerHTML =
            '<option value="">Select Customer</option>';

        let customers = [];

        /*
           Existing My Customers / Member data ko read
           karne ke liye common storage names check kiye ja rahe hain.
        */

        const possibleKeys = [
            "assignedCustomers",
            "myCustomers",
            "members",
            "gymMembers",
            "memberData"
        ];

        for (const key of possibleKeys) {

            const data = localStorage.getItem(key);

            if (!data) continue;

            try {

                const parsedData = JSON.parse(data);

                if (Array.isArray(parsedData)) {
                    customers = parsedData;
                    break;
                }

            } catch (error) {

                console.log(
                    "Could not read customer data from:",
                    key
                );

            }

        }


        /* =========================
           ADD CUSTOMERS
        ========================== */

        customers.forEach((customer, index) => {

            const customerName =
                customer.name ||
                customer.fullName ||
                customer.memberName ||
                customer.customerName ||
                `${customer.firstName || ""} ${customer.lastName || ""}`.trim();

            if (!customerName) return;


            const option = document.createElement("option");

            option.value =
                customer.id ||
                customer.memberId ||
                customer.customerId ||
                index;

            option.textContent = customerName;

            customerSelect.appendChild(option);

        });

    }


    /* =========================
       POPULATE EXERCISE LIST
    ========================== */

    function renderExerciseList(searchText = "") {

        exerciseList.innerHTML = "";

        const filteredExercises =
            exercises.filter(exercise =>
                exercise.toLowerCase().includes(
                    searchText.toLowerCase()
                )
            );


        if (filteredExercises.length === 0) {

            exerciseList.innerHTML = `
                <div style="
                    padding:20px;
                    text-align:center;
                    color:#777b7e;
                    font-size:13px;
                ">
                    No exercise found.
                </div>
            `;

            return;
        }


        filteredExercises.forEach(exercise => {

            const button = document.createElement("button");

            button.type = "button";
            button.className = "exercise-option";

            button.dataset.exercise = exercise;

            const alreadyAdded =
                selectedExercises.some(
                    item => item.name === exercise
                );


            if (alreadyAdded) {

                button.disabled = true;

                button.innerHTML = `
                    <span>
                        <i class="fa-solid fa-dumbbell"></i>
                        ${exercise}
                    </span>

                    <i class="fa-solid fa-check"></i>
                `;

            } else {

                button.innerHTML = `
                    <span>
                        <i class="fa-solid fa-dumbbell"></i>
                        ${exercise}
                    </span>

                    <i class="fa-solid fa-plus"></i>
                `;

                button.addEventListener(
                    "click",
                    () => addExercise(exercise)
                );

            }


            exerciseList.appendChild(button);

        });

    }


    /* =========================
       ADD EXERCISE
    ========================== */

    function addExercise(exerciseName) {

        const alreadyExists =
            selectedExercises.some(
                exercise => exercise.name === exerciseName
            );

        if (alreadyExists) return;


        selectedExercises.push({

            id: Date.now(),

            name: exerciseName,

            sets: 3,

            reps: 12,

            workoutTime: "10 min",

            restTime: "60 sec"

        });


        renderExerciseTable();

        renderExerciseList(
            exerciseSearch.value
        );

    }


    /* =========================
       RENDER EXERCISE TABLE
    ========================== */

    function renderExerciseTable() {

        exerciseTableBody.innerHTML = "";


        if (selectedExercises.length === 0) {

            exerciseTableBody.innerHTML = `
                <tr class="empty-exercise-row">
                    <td colspan="6">
                        No exercises added yet.
                    </td>
                </tr>
            `;

            return;

        }


        selectedExercises.forEach(exercise => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>
                    <strong>${exercise.name}</strong>
                </td>

                <td>
                    <input
                        type="number"
                        class="exercise-input"
                        min="1"
                        value="${exercise.sets}"
                        data-id="${exercise.id}"
                        data-field="sets"
                    >
                </td>

                <td>
                    <input
                        type="number"
                        class="exercise-input"
                        min="1"
                        value="${exercise.reps}"
                        data-id="${exercise.id}"
                        data-field="reps"
                    >
                </td>

                <td>
                    <input
                        type="text"
                        class="exercise-input"
                        value="${exercise.workoutTime}"
                        data-id="${exercise.id}"
                        data-field="workoutTime"
                    >
                </td>

                <td>
                    <input
                        type="text"
                        class="exercise-input"
                        value="${exercise.restTime}"
                        data-id="${exercise.id}"
                        data-field="restTime"
                    >
                </td>

                <td>

                    <button
                        type="button"
                        class="action-btn delete-exercise"
                        data-id="${exercise.id}"
                        title="Remove Exercise"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>
            `;


            exerciseTableBody.appendChild(row);

        });

    }


    /* =========================
       EXERCISE INPUT CHANGE
    ========================== */

    exerciseTableBody.addEventListener(
        "input",
        event => {

            const input =
                event.target.closest(".exercise-input");

            if (!input) return;


            const id = Number(input.dataset.id);

            const field = input.dataset.field;

            const exercise =
                selectedExercises.find(
                    item => item.id === id
                );

            if (!exercise) return;


            exercise[field] = input.value;

        }
    );


    /* =========================
       DELETE EXERCISE
    ========================== */

    exerciseTableBody.addEventListener(
        "click",
        event => {

            const deleteButton =
                event.target.closest(".delete-exercise");

            if (!deleteButton) return;


            const id =
                Number(deleteButton.dataset.id);


            selectedExercises =
                selectedExercises.filter(
                    exercise => exercise.id !== id
                );


            renderExerciseTable();

            renderExerciseList(
                exerciseSearch.value
            );

        }
    );


    /* =========================
       OPEN EXERCISE POPUP
    ========================== */

    openExerciseList.addEventListener(
        "click",
        () => {

            renderExerciseList();

            exercisePopup.classList.add("show");

            exerciseSearch.value = "";

        }
    );


    /* =========================
       CLOSE EXERCISE POPUP
    ========================== */

    closeExerciseList.addEventListener(
        "click",
        () => {

            exercisePopup.classList.remove("show");

        }
    );


    /* =========================
       CLOSE POPUP OUTSIDE
    ========================== */

    exercisePopup.addEventListener(
        "click",
        event => {

            if (event.target === exercisePopup) {

                exercisePopup.classList.remove("show");

            }

        }
    );


    /* =========================
       SEARCH EXERCISE
    ========================== */

    exerciseSearch.addEventListener(
        "input",
        () => {

            renderExerciseList(
                exerciseSearch.value
            );

        }
    );


    /* =========================
       GET SELECTED DAYS
    ========================== */

    function getSelectedDays() {

        const checkedDays =
            document.querySelectorAll(
                '.day-option input:checked'
            );

        return Array.from(checkedDays)
            .map(day => day.value);

    }


    /* =========================
       SAVE WORKOUT PLAN
    ========================== */

    saveWorkoutPlan.addEventListener(
        "click",
        () => {

            const customerValue =
                customerSelect.value;

            const customerName =
                customerSelect.options[
                    customerSelect.selectedIndex
                ]?.textContent;


            const name =
                planName.value.trim();

            const days =
                getSelectedDays();

            const status =
                planStatus.value;

            const routine =
                dailyRoutine.value.trim();


            /* =========================
               VALIDATION
            ========================== */

            if (!customerValue) {

                alert("Please select a customer.");

                return;

            }


            if (!name) {

                alert("Please enter workout plan name.");

                return;

            }


            if (days.length === 0) {

                alert("Please select at least one workout day.");

                return;

            }


            if (selectedExercises.length === 0) {

                alert("Please add at least one exercise.");

                return;

            }


            /* =========================
               PLAN OBJECT
            ========================== */

            const plan = {

                id: editingPlanId || Date.now(),

                customerId: customerValue,

                customerName: customerName,

                planName: name,

                workoutDays: days,

                status: status,

                dailyRoutine: routine,

                exercises: selectedExercises.map(
                    exercise => ({
                        ...exercise
                    })
                ),

                createdAt:
                    new Date().toISOString()

            };


            let plans =
                getWorkoutPlans();


            /* =========================
               EDIT EXISTING PLAN
            ========================== */

            if (editingPlanId) {

                plans =
                    plans.map(existingPlan =>
                        existingPlan.id === editingPlanId
                            ? plan
                            : existingPlan
                    );

            }

            /* =========================
               CREATE NEW PLAN
            ========================== */

            else {

                plans.push(plan);

            }


            saveWorkoutPlans(plans);
            /*=======================
            CREATE NOTIFICATION
            =======================*/
            createNotification(
                "workout",
                editingPlanId
                ?"Workout plan Updated"
                :"New Workout Plan",
                editingPlanId
                ? `${customerName} 's
                workout plan has been updated.`
                :`A new Workout plan has been assigned to $
                {customerName}.`,
                "fa-dumbbell"
            );


            alert(
                editingPlanId
                    ? "Workout plan updated successfully."
                    : "Workout plan saved successfully."
            );


            resetForm();

            renderWorkoutPlans();

        }
    );


    /* =========================
       RENDER SAVED PLANS
    ========================== */

    function renderWorkoutPlans() {

        const plans =
            getWorkoutPlans();


        workoutPlansTableBody.innerHTML = "";


        if (plans.length === 0) {

            workoutPlansTableBody.innerHTML = `
                <tr class="empty-plans-row">
                    <td colspan="6">
                        No workout plans found.
                    </td>
                </tr>
            `;

            return;

        }


        plans.forEach(plan => {

            const row =
                document.createElement("tr");


            const exerciseCount =
                plan.exercises?.length || 0;


            const schedule =
                plan.workoutDays?.join(", ") || "-";


            let statusClass =
                "status-active";


            if (plan.status === "Paused") {

                statusClass = "status-paused";

            }

            if (plan.status === "Completed") {

                statusClass = "status-completed";

            }


            row.innerHTML = `

                <td>
                    ${plan.customerName || "-"}
                </td>

                <td>
                    <strong>
                        ${plan.planName || "-"}
                    </strong>
                </td>

                <td>
                    ${exerciseCount} Exercise${exerciseCount !== 1 ? "s" : ""}
                </td>

                <td>
                    ${schedule}
                </td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${plan.status}
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        class="action-btn view-plan"
                        data-id="${plan.id}"
                        title="View"
                    >
                        <i class="fa-solid fa-eye"></i>
                    </button>

                    <button
                        type="button"
                        class="action-btn edit-plan"
                        data-id="${plan.id}"
                        title="Edit"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        type="button"
                        class="action-btn delete-plan"
                        data-id="${plan.id}"
                        title="Delete"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>
            `;


            workoutPlansTableBody.appendChild(row);

        });

    }


    /* =========================
       PLAN ACTIONS
    ========================== */

    workoutPlansTableBody.addEventListener(
        "click",
        event => {

            const viewButton =
                event.target.closest(".view-plan");

            const editButton =
                event.target.closest(".edit-plan");

            const deleteButton =
                event.target.closest(".delete-plan");


            if (viewButton) {

                viewPlan(
                    Number(viewButton.dataset.id)
                );

            }


            if (editButton) {

                editPlan(
                    Number(editButton.dataset.id)
                );

            }


            if (deleteButton) {

                deletePlan(
                    Number(deleteButton.dataset.id)
                );

            }

        }
    );


    /* =========================
       VIEW PLAN
    ========================== */

    function viewPlan(id) {

        const plans =
            getWorkoutPlans();

        const plan =
            plans.find(item => item.id === id);

        if (!plan) return;


        const exerciseNames =
            plan.exercises
                .map(exercise => exercise.name)
                .join(", ");


        alert(
            `Workout Plan

Customer: ${plan.customerName}

Plan: ${plan.planName}

Exercises: ${exerciseNames}

Days: ${plan.workoutDays.join(", ")}

Status: ${plan.status}

Instructions:
${plan.dailyRoutine || "No instructions added."}`
        );

    }


    /* =========================
       EDIT PLAN
    ========================== */

    function editPlan(id) {

        const plans =
            getWorkoutPlans();editingPlanId

        const plan =
            plans.find(item => item.id === id);

        if (!plan) return;
        editingPlanId=id;
        customerSelect.value=plan.customerId;
        planName.value=plan.planName;
        planStatus.value=plan.status;
        dailyRoutine.value=plan.dailyRoutine|| "";
        /* Select Days*/
        document.querySelectorAll('.day-option input')
        forEach(checkbox => {
            checkbox.checked=plan.workoutDays.includes(checkbox.value);
        });
          /* Load Exercises */

        selectedExercises =
            plan.exercises.map(
                exercise => ({
                    ...exercise
                })
            );


        renderExerciseTable();


        /* Change button text */

        saveWorkoutPlan.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Update Workout Plan
        `;


        workoutFormCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =========================
       DELETE PLAN
    ========================== */

    function deletePlan(id) {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this workout plan?"
            );


        if (!confirmDelete) return;


        const plans =
            getWorkoutPlans();


        const updatedPlans =
            plans.filter(
                plan => plan.id !== id
            );


        saveWorkoutPlans(updatedPlans);


        renderWorkoutPlans();

    }


    /* =========================
       RESET FORM
    ========================== */

    function resetForm() {

        editingPlanId = null;

        customerSelect.value = "";

        planName.value = "";

        planStatus.value = "Active";

        dailyRoutine.value = "";


        document
            .querySelectorAll(
                '.day-option input'
            )
            .forEach(checkbox => {

                checkbox.checked = false;

            });


        selectedExercises = [];


        renderExerciseTable();


        saveWorkoutPlan.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Save Workout Plan
        `;

    }


    /* =========================
       CANCEL FORM
    ========================== */

    cancelWorkoutForm.addEventListener(
        "click",
        () => {

            resetForm();

        }
    );


    /* =========================
       OPEN CREATE FORM
    ========================== */

    openWorkoutForm.addEventListener(
        "click",
        () => {

            resetForm();

            workoutFormCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );


    /* =========================
       LOAD TRAINER COMPONENTS
    ========================== */

    function loadComponent(elementId, filePath) {

        const element =
            document.getElementById(elementId);

        if (!element) return;


        fetch(filePath)
            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Could not load ${filePath}`
                    );

                }

                return response.text();

            })
            .then(data => {

                element.innerHTML = data;

            })
            .catch(error => {

                console.error(error);

            });

    }


    /* =========================
       COMPONENT PATHS
    ========================== */

    loadComponent(
        "trainer-sidebar",
        "../../../components/trainer.sidebar/trainer.sidebar.html"
    );


    loadComponent(
        "trainer-navbar",
        "../../../components/trainer-navbar/trainer-navbar.html"
    );


    /* =========================
       INITIAL LOAD
    ========================== */

    loadAssignedCustomers();

    renderExerciseTable();

    renderWorkoutPlans();

});


