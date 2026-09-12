document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       LOAD COMPONENT
    ===================================================== */

    function loadComponent(elementId, filePath) {

        const element = document.getElementById(elementId);

        if (!element) {
            console.error(`Element not found: ${elementId}`);
            return;
        }

        fetch(filePath)
            .then(response => {

                if (!response.ok) {
                    throw new Error(`Could not load ${filePath}`);
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


    /* =====================================================
       LOAD TRAINER COMPONENTS
    ===================================================== */

    loadComponent(
        "trainer-sidebar",
        "../../../components/trainer.sidebar/trainer.sidebar.html"
    );


    loadComponent(
        "trainer-navbar",
        "../../../components/trainer-navbar/trainer-navbar.html"
    );


    loadComponent(
        "trainer-modal-container",
        "../../../components/trainer-modal/trainer-modal.html"
    );


    /* =====================================================
       VARIABLES
    ===================================================== */

    let meals = [];

    let editingPlanId = null;

    const dietPlansStorageKey = "trainerDietPlans";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const openDietForm =
        document.getElementById("openDietForm");

    const dietFormCard =
        document.getElementById("dietFormCard");

    const cancelDietForm =
        document.getElementById("cancelDietForm");

    const saveDietPlan =
        document.getElementById("saveDietPlan");

    const customerSelect =
        document.getElementById("customerSelect");

    const dietPlanSelect =
        document.getElementById("dietPlanSelect");

    const dietStatus =
        document.getElementById("dietStatus");

    const openMealModal =
        document.getElementById("openMealModal");

    const mealTableBody =
        document.getElementById("mealTableBody");

    const dietPlansTableBody =
        document.getElementById("dietPlansTableBody");

    const dailyInstructions =
        document.getElementById("dailyInstructions");


    /* =====================================================
       CREATE DIET FORM
    ===================================================== */

    if (openDietForm) {

        openDietForm.addEventListener("click", () => {

            dietFormCard.style.display = "block";

            openDietForm.style.display = "none";

            editingPlanId = null;

            resetDietForm();

        });

    }


    /* =====================================================
       CANCEL DIET FORM
    ===================================================== */

    if (cancelDietForm) {

        cancelDietForm.addEventListener("click", () => {

            dietFormCard.style.display = "none";

            openDietForm.style.display = "inline-flex";

            editingPlanId = null;

            resetDietForm();

        });

    }


    /* =====================================================
       RESET DIET FORM
    ===================================================== */

    function resetDietForm() {

        if (customerSelect) {
            customerSelect.value = "";
        }

        if (dietPlanSelect) {
            dietPlanSelect.value = "";
        }

        if (dietStatus) {
            dietStatus.value = "Active";
        }

        if (dailyInstructions) {
            dailyInstructions.value = "";
        }

        meals = [];


        document
            .querySelectorAll(".day-option input")
            .forEach(input => {

                input.checked = false;

            });


        renderMeals();

    }


    /* =====================================================
       LOAD CUSTOMERS
    ===================================================== */

    function loadCustomers() {

        const possibleKeys = [

            "assignedCustomers",
            "myCustomers",
            "members",
            "gymMembers",
            "memberData"

        ];


        let customers = [];


        for (const key of possibleKeys) {

            const storedData =
                localStorage.getItem(key);


            if (!storedData) {
                continue;
            }


            try {

                const parsedData =
                    JSON.parse(storedData);


                if (Array.isArray(parsedData)) {

                    customers = parsedData;


                    if (customers.length > 0) {
                        break;
                    }

                }

            } catch (error) {

                console.error(
                    `Error reading ${key}:`,
                    error
                );

            }

        }


        if (!customerSelect) {
            return;
        }


        customerSelect.innerHTML = `

            <option value="">
                Select Customer
            </option>

        `;


        customers.forEach(customer => {

            const name =

                customer.name ||
                customer.fullName ||
                customer.memberName ||
                customer.customerName ||
                "Unknown Customer";


            const id =

                customer.id ||
                customer.memberId ||
                customer.customerId ||
                name;


            const option =
                document.createElement("option");


            option.value = id;

            option.textContent = name;


            customerSelect.appendChild(option);

        });

    }


    loadCustomers();


    /* =====================================================
       OPEN MEAL MODAL
    ===================================================== */

    if (openMealModal) {

        openMealModal.addEventListener("click", () => {

            const modal =
                document.getElementById("trainerModal");


            if (!modal) {

                console.error(
                    "Trainer Modal is not loaded yet."
                );

                return;
            }


            prepareMealModal();


            modal.style.display="flex";

        });

    }


    /* =====================================================
       PREPARE MEAL MODAL
    ===================================================== */

    function prepareMealModal() {

        const modal =
            document.getElementById("trainerModal");


        if (!modal) {
            return;
        }


        const title =
            document.getElementById(
                "trainerModalTitle"
            );


        if (title) {

            title.textContent = "Add Meal";

        }


        const headerDescription =
            modal.querySelector(
                ".trainer-modal-header p"
            );


        if (headerDescription) {

            headerDescription.textContent =
                "Add meal information to the diet plan";

        }


        const sections =
            modal.querySelectorAll(
                ".trainer-modal-section"
            );


        /* =================================================
           SECTION 1
        ================================================= */

        if (sections.length >= 1) {

            const firstSection =
                sections[0];


            const heading =
                firstSection.querySelector("h3");


            if (heading) {

                heading.innerHTML = `

                    <i class="fa-solid fa-bowl-food"></i>
                    Meal Information

                `;

            }


            const fields =
                firstSection.querySelectorAll(
                    ".trainer-modal-field"
                );


            if (fields.length >= 4) {

                createInputField(
                    fields[0],
                    "Meal Type",
                    "mealTypeInput",
                    "select"
                );


                createInputField(
                    fields[1],
                    "Food Item",
                    "foodItemInput",
                    "text",
                    "e.g. Grilled Chicken"
                );


                createInputField(
                    fields[2],
                    "Quantity",
                    "foodQuantityInput",
                    "text",
                    "e.g. 150g"
                );


                createInputField(
                    fields[3],
                    "Meal Time",
                    "mealTimeInput",
                    "time"
                );

            }

        }


        /* =================================================
           SECTION 2
        ================================================= */

        if (sections.length >= 2) {

            const secondSection =
                sections[1];


            const heading =
                secondSection.querySelector("h3");


            if (heading) {

                heading.innerHTML = `

                    <i class="fa-solid fa-note-sticky"></i>
                    Meal Instructions

                `;

            }


            const grid =
                secondSection.querySelector(
                    ".trainer-modal-grid"
                );


            if (grid) {

                grid.innerHTML = `

                    <div
                        class="trainer-modal-field"
                        style="grid-column: 1 / -1;"
                    >

                        <label for="mealInstructionsInput">
                            Instructions
                        </label>

                        <textarea
                            id="mealInstructionsInput"
                            placeholder="Add instructions for this meal..."
                            rows="4"
                        ></textarea>

                    </div>

                `;

            }

        }


        /* =================================================
           HIDE EXTRA SECTIONS
        ================================================= */

        for (
            let i = 2;
            i < sections.length;
            i++
        ) {

            sections[i].style.display = "none";

        }


        /* =================================================
           FOOTER BUTTONS
        ================================================= */

        const cancelButton =
            document.getElementById(
                "trainerModalCancel"
            );


        const saveButton =
            document.getElementById(
                "trainerModalSave"
            );


        if (cancelButton) {

            cancelButton.textContent = "Cancel";

        }


        if (saveButton) {

            saveButton.style.display = "inline-flex";

            saveButton.innerHTML = `

                <i class="fa-solid fa-plus"></i>
                Add Meal

            `;

        }

    }


    /* =====================================================
       CREATE INPUT FIELD
    ===================================================== */

    function createInputField(
        field,
        labelText,
        inputId,
        type = "text",
        placeholder = ""
    ) {

        if (!field) {
            return;
        }


        if (type === "select") {

            field.innerHTML = `

                <label for="${inputId}">
                    ${labelText}
                </label>

                <select id="${inputId}">

                    <option value="">
                        Select Meal Type
                    </option>

                    <option value="Breakfast">
                        Breakfast
                    </option>

                    <option value="Lunch">
                        Lunch
                    </option>

                    <option value="Snack">
                        Snack
                    </option>

                    <option value="Dinner">
                        Dinner
                    </option>

                </select>

            `;

            return;
        }


        field.innerHTML = `

            <label for="${inputId}">
                ${labelText}
            </label>

            <input
                type="${type}"
                id="${inputId}"
                placeholder="${placeholder}"
            >

        `;

    }


    /* =====================================================
       MODAL CLOSE
    ===================================================== */

    document.addEventListener("click", event => {

        if (

            event.target.closest(
                "#trainerModalClose"
            )

            ||

            event.target.closest(
                "#trainerModalCancel"
            )

        ) {

            closeMealModal();

        }

    });


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeMealModal() {

        const modal =
            document.getElementById(
                "trainerModal"
            );


        if (!modal) {
            return;
        }


        modal.style.display="none";

    }


    /* =====================================================
       ADD MEAL
    ===================================================== */

    document.addEventListener("click", event => {

        const saveButton =
            event.target.closest(
                "#trainerModalSave"
            );


        if (!saveButton) {
            return;
        }


        const modal =
            document.getElementById(
                "trainerModal"
            );


        if (!modal) {
            return;
        }


        const mealType =
            document.getElementById(
                "mealTypeInput"
            );


        const foodItem =
            document.getElementById(
                "foodItemInput"
            );


        const quantity =
            document.getElementById(
                "foodQuantityInput"
            );


        const mealTime =
            document.getElementById(
                "mealTimeInput"
            );


        const instructions =
            document.getElementById(
                "mealInstructionsInput"
            );


        if (

            !mealType ||
            !foodItem ||
            !quantity ||
            !mealTime ||
            !instructions

        ) {

            return;

        }


        /* =================================================
           VALIDATION
        ================================================= */

        if (

            !mealType.value ||
            !foodItem.value.trim() ||
            !quantity.value.trim() ||
            !mealTime.value

        ) {

            alert(
                "Please fill all required meal fields."
            );

            return;

        }


        /* =================================================
           MEAL OBJECT
        ================================================= */

        const meal = {

            id: Date.now(),

            type: mealType.value,

            food: foodItem.value.trim(),

            quantity: quantity.value.trim(),

            time: mealTime.value,

            instructions:
                instructions.value.trim()

        };


        meals.push(meal);


        /* =================================================
           UPDATE MEALS TABLE
        ================================================= */

        renderMeals();


        /* =================================================
           CLOSE MODAL
        ================================================= */

        closeMealModal();

    });


    /* =====================================================
       RENDER MEALS
    ===================================================== */

    function renderMeals() {

        if (!mealTableBody) {
            return;
        }


        if (meals.length === 0) {

            mealTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="empty-row"
                    >

                        No meals added yet.

                    </td>

                </tr>

            `;

            return;

        }


        mealTableBody.innerHTML = "";


        meals.forEach(meal => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(meal.type)}
                </td>

                <td>
                    ${escapeHTML(meal.food)}
                </td>

                <td>
                    ${escapeHTML(meal.quantity)}
                </td>

                <td>
                    ${formatTime(meal.time)}
                </td>

                <td>
                    ${escapeHTML(
                        meal.instructions || "-"
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        class="table-action delete-action"
                        data-meal-id="${meal.id}"
                        title="Delete Meal"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            `;


            mealTableBody.appendChild(row);

        });

    }


    /* =====================================================
       DELETE MEAL
    ===================================================== */

    if (mealTableBody) {

        mealTableBody.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-meal-id]"
                    );


                if (!button) {
                    return;
                }


                const mealId =
                    Number(
                        button.dataset.mealId
                    );


                meals =
                    meals.filter(
                        meal =>
                            meal.id !== mealId
                    );


                renderMeals();

            }
        );

    }


    /* =====================================================
       SAVE DIET PLAN
    ===================================================== */

    if (saveDietPlan) {

        saveDietPlan.addEventListener(
            "click",
            () => {

                const customerId =
                    customerSelect.value;


                const customerName =
                    customerSelect.options[
                        customerSelect.selectedIndex
                    ]?.textContent || "";


                const dietPlan =
                    dietPlanSelect.value;


                const status =
                    dietStatus.value;


                /* =========================================
                   VALIDATION
                ========================================= */

                if (!customerId) {

                    alert(
                        "Please select a customer."
                    );

                    return;

                }


                if (!dietPlan) {

                    alert(
                        "Please select a diet plan."
                    );

                    return;

                }


                if (meals.length === 0) {

                    alert(
                        "Please add at least one meal."
                    );

                    return;

                }


                /* =========================================
                   SELECT DAYS
                ========================================= */

                const selectedDays = [];


                document
                    .querySelectorAll(
                        ".day-option input"
                    )
                    .forEach(input => {

                        if (input.checked) {

                            selectedDays.push(
                                input.value
                            );

                        }

                    });


                if (selectedDays.length === 0) {

                    alert(
                        "Please select at least one day."
                    );

                    return;

                }


                /* =========================================
                   LOAD EXISTING PLANS
                ========================================= */

                let dietPlans =
                    JSON.parse(
                        localStorage.getItem(
                            dietPlansStorageKey
                        )
                    ) || [];


                /* =========================================
                   CREATE / UPDATE
                ========================================= */

                if (editingPlanId) {

                    const index =
                        dietPlans.findIndex(
                            plan =>
                                plan.id === editingPlanId
                        );


                    if (index !== -1) {

                        dietPlans[index] = {

                            ...dietPlans[index],

                            customerId,

                            customer:
                                customerName,

                            dietPlan,

                            meals: [...meals],

                            schedule:
                                selectedDays,

                            instructions:
                                dailyInstructions.value.trim(),

                            status

                        };

                    }

                }

                else {

                    const newPlan = {

                        id: Date.now(),

                        customerId,

                        customer:
                            customerName,

                        dietPlan,

                        meals: [...meals],

                        schedule:
                            selectedDays,

                        instructions:
                            dailyInstructions.value.trim(),

                        status

                    };


                    dietPlans.push(newPlan);

                }


                /* =========================================
                   SAVE TO LOCAL STORAGE
                ========================================= */

                localStorage.setItem(
                    dietPlansStorageKey,
                    JSON.stringify(dietPlans)
                );
                /*============================
                CREATE NOTIFICATION
                =============================*/
                createNotification(
                    "diet",
                    editingPlanId
                    ?"Diet Plan Updated"
                    : "New Diet Plan",
                    editingPlanId
                    ?`${customerName}'s diet
                    plan has been updated.`
                    :` A new diet plan has been assigned to $ 
                    {customerName}.`,
                    "fa-utensils"
                );


                /* =========================================
                   UPDATE TABLE
                ========================================= */

                renderDietPlans();


                /* =========================================
                   RESET FORM
                ========================================= */

                editingPlanId = null;

                resetDietForm();


                dietFormCard.style.display =
                    "none";


                openDietForm.style.display =
                    "inline-flex";


                alert(
                    "Diet plan saved successfully."
                );

            }
        );

    }


    /* =====================================================
       RENDER SAVED DIET PLANS
    ===================================================== */

    function renderDietPlans() {

        if (!dietPlansTableBody) {
            return;
        }


        const dietPlans =
            JSON.parse(
                localStorage.getItem(
                    dietPlansStorageKey
                )
            ) || [];


        if (dietPlans.length === 0) {

            dietPlansTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="empty-row"
                    >

                        No diet plans created yet.

                    </td>

                </tr>

            `;

            return;

        }


        dietPlansTableBody.innerHTML = "";


        dietPlans.forEach(plan => {

            const row =
                document.createElement("tr");


            const schedule =
                plan.schedule &&
                plan.schedule.length

                    ? plan.schedule.join(", ")

                    : "-";


            const mealCount =
                Array.isArray(plan.meals)
                    ? plan.meals.length
                    : 0;


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        plan.customer
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        plan.dietPlan
                    )}
                </td>

                <td>
                    ${mealCount} Meals
                </td>

                <td>
                    ${escapeHTML(schedule)}
                </td>

                <td>

                    <span
                        class="status-badge ${getStatusClass(
                            plan.status
                        )}"
                    >

                        ${escapeHTML(
                            plan.status
                        )}

                    </span>

                </td>

                <td>

                    <div class="table-actions">

                        <button
                            type="button"
                            class="table-action view-action"
                            data-view-id="${plan.id}"
                            title="View"
                        >

                            <i class="fa-solid fa-eye"></i>

                        </button>


                        <button
                            type="button"
                            class="table-action edit-action"
                            data-edit-id="${plan.id}"
                            title="Edit"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="table-action delete-action"
                            data-delete-id="${plan.id}"
                            title="Delete"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            dietPlansTableBody.appendChild(row);

        });

    }


    /* =====================================================
       VIEW DIET PLAN
    ===================================================== */

    if (dietPlansTableBody) {

        dietPlansTableBody.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-view-id]"
                    );


                if (!button) {
                    return;
                }


                const planId =
                    Number(
                        button.dataset.viewId
                    );


                const dietPlans =
                    JSON.parse(
                        localStorage.getItem(
                            dietPlansStorageKey
                        )
                    ) || [];


                const plan =
                    dietPlans.find(
                        item =>
                            item.id === planId
                    );


                if (!plan) {
                    return;
                }


                openViewModal(plan);

            }
        );

    }


    /* =====================================================
       VIEW MODAL
    ===================================================== */

    function openViewModal(plan) {

        const modal =
            document.getElementById(
                "trainerModal"
            );


        if (!modal) {
            return;
        }


        const title =
            document.getElementById(
                "trainerModalTitle"
            );


        if (title) {

            title.textContent =
                "Diet Plan Details";

        }


        const description =
            modal.querySelector(
                ".trainer-modal-header p"
            );


        if (description) {

            description.textContent =
                "View customer diet plan information";

        }


        const sections =
            modal.querySelectorAll(
                ".trainer-modal-section"
            );


        /* =================================================
           SECTION 1
        ================================================= */

        if (sections[0]) {

            sections[0].style.display =
                "block";


            const heading =
                sections[0].querySelector("h3");


            if (heading) {

                heading.innerHTML = `

                    <i class="fa-solid fa-user"></i>
                    Customer Information

                `;

            }


            const fields =
                sections[0].querySelectorAll(
                    ".trainer-modal-field"
                );


            if (fields[0]) {

                fields[0].innerHTML = `

                    <label>
                        Customer
                    </label>

                    <p>
                        ${escapeHTML(
                            plan.customer
                        )}
                    </p>

                `;

            }


            if (fields[1]) {

                fields[1].innerHTML = `

                    <label>
                        Diet Plan
                    </label>

                    <p>
                        ${escapeHTML(
                            plan.dietPlan
                        )}
                    </p>

                `;

            }


            if (fields[2]) {

                fields[2].innerHTML = `

                    <label>
                        Status
                    </label>

                    <span class="modal-status">
                        ${escapeHTML(
                            plan.status
                        )}
                    </span>

                `;

            }


            if (fields[3]) {

                const mealCount =
                    Array.isArray(plan.meals)
                        ? plan.meals.length
                        : 0;


                fields[3].innerHTML = `

                    <label>
                        Meals
                    </label>

                    <p>
                        ${mealCount} Meals
                    </p>

                `;

            }

        }


        /* =================================================
           SECTION 2 - MEALS
        ================================================= */

        if (sections[1]) {

            sections[1].style.display =
                "block";


            const heading =
                sections[1].querySelector("h3");


            if (heading) {

                heading.innerHTML = `

                    <i class="fa-solid fa-utensils"></i>
                    Meal Schedule

                `;

            }


            const grid =
                sections[1].querySelector(
                    ".trainer-modal-grid"
                );


            if (grid) {

                const planMeals =
                    Array.isArray(plan.meals)
                        ? plan.meals
                        : [];


                grid.innerHTML =
                    planMeals.map(meal => `

                        <div class="trainer-modal-field">

                            <label>
                                ${escapeHTML(
                                    meal.type
                                )}
                            </label>

                            <p>
                                ${escapeHTML(
                                    meal.food
                                )}

                                -

                                ${escapeHTML(
                                    meal.quantity
                                )}

                                -

                                ${formatTime(
                                    meal.time
                                )}

                            </p>

                        </div>

                    `).join("");

            }

        }


        /* =================================================
           SECTION 3 - SCHEDULE
        ================================================= */

        if (sections[2]) {

            sections[2].style.display =
                "block";


            const heading =
                sections[2].querySelector("h3");


            if (heading) {

                heading.innerHTML = `

                    <i class="fa-solid fa-calendar-days"></i>
                    Weekly Schedule

                `;

            }


            const progress =
                sections[2].querySelector(
                    ".trainer-progress"
                );


            const schedule =
                Array.isArray(plan.schedule)
                    ? plan.schedule
                    : [];


            if (progress) {

                progress.innerHTML = `

                    <div class="progress-info">

                        <span>
                            Selected Days
                        </span>

                        <span>
                            ${schedule.length}
                        </span>

                    </div>

                    <div style="margin-top:10px;">

                        ${escapeHTML(
                            schedule.join(", ")
                        )}

                    </div>

                `;

            }

        }


        /* =================================================
           SECTION 4 - INSTRUCTIONS
        ================================================= */

        if (sections[3]) {

            sections[3].style.display =
                "block";


            const heading =
                sections[3].querySelector("h3");


            if (heading) {

                heading.innerHTML = `

                    <i class="fa-solid fa-note-sticky"></i>
                    Daily Instructions

                `;

            }


            const textarea =
                sections[3].querySelector(
                    "textarea"
                );


            if (textarea) {

                textarea.value =
                    plan.instructions || "";

                textarea.readOnly = true;

            }

        }


        /* =================================================
           FOOTER
        ================================================= */

        const saveButton =
            document.getElementById(
                "trainerModalSave"
            );


        if (saveButton) {

            saveButton.style.display =
                "none";

        }


        const cancelButton =
            document.getElementById(
                "trainerModalCancel"
            );


        if (cancelButton) {

            cancelButton.textContent =
                "Close";

        }


        modal.classList.add("active");

    }


    /* =====================================================
       EDIT DIET PLAN
    ===================================================== */

    if (dietPlansTableBody) {

        dietPlansTableBody.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-edit-id]"
                    );


                if (!button) {
                    return;
                }


                const planId =
                    Number(
                        button.dataset.editId
                    );


                const dietPlans =
                    JSON.parse(
                        localStorage.getItem(
                            dietPlansStorageKey
                        )
                    ) || [];


                const plan =
                    dietPlans.find(
                        item =>
                            item.id === planId
                    );


                if (!plan) {
                    return;
                }


                editingPlanId =
                    planId;


                customerSelect.value =
                    plan.customerId || "";


                dietPlanSelect.value =
                    plan.dietPlan || "";


                dietStatus.value =
                    plan.status || "Active";


                meals =
                    Array.isArray(plan.meals)
                        ? [...plan.meals]
                        : [];


                dailyInstructions.value =
                    plan.instructions || "";


                document
                    .querySelectorAll(
                        ".day-option input"
                    )
                    .forEach(input => {

                        input.checked =
                            plan.schedule?.includes(
                                input.value
                            ) || false;

                    });


                renderMeals();


                dietFormCard.style.display =
                    "block";


                openDietForm.style.display =
                    "none";

            }
        );

    }


    /* =====================================================
       DELETE DIET PLAN
    ===================================================== */

    if (dietPlansTableBody) {

        dietPlansTableBody.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-delete-id]"
                    );


                if (!button) {
                    return;
                }


                const planId =
                    Number(
                        button.dataset.deleteId
                    );


                let dietPlans =
                    JSON.parse(
                        localStorage.getItem(
                            dietPlansStorageKey
                        )
                    ) || [];


                dietPlans =
                    dietPlans.filter(
                        plan =>
                            plan.id !== planId
                    );


                localStorage.setItem(
                    dietPlansStorageKey,
                    JSON.stringify(dietPlans)
                );


                renderDietPlans();

            }
        );

    }


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    function getStatusClass(status) {

        if (status === "Active") {
            return "status-active";
        }


        if (status === "Paused") {
            return "status-paused";
        }


        if (status === "Completed") {
            return "status-completed";
        }


        return "";

    }


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(time) {

        if (!time) {
            return "-";
        }


        const [hours, minutes] =
            time.split(":");


        let hour =
            parseInt(hours, 10);


        const ampm =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12 || 12;


        return `${hour}:${minutes} ${ampm}`;

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       INITIAL RENDER
    ===================================================== */

    renderMeals();

    renderDietPlans();

});