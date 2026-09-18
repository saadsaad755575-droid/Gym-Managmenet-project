/* =========================
   CUSTOMER PROGRESS JS
========================= */


/* =========================
   LOAD COMPONENTS
========================= */

function loadComponent(elementId, filePath) {

    const element = document.getElementById(elementId);

    if (!element) return;

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


/* =========================
   STORAGE
========================= */

const STORAGE_KEY = "trainerCustomerProgress";

let progressRecords = [];
let editingProgressId = null;


/* =========================
   ELEMENTS
========================= */

const customerSelect = document.getElementById("customerSelect");

const openProgressForm =
    document.getElementById("openProgressForm");

const progressTableBody =
    document.getElementById("progressTableBody");

const measurementsTableBody =
    document.getElementById("measurementsTableBody");

const chartEmpty =
    document.getElementById("chartEmpty");

let progressChart = null;


/* =========================
   LOAD PROGRESS DATA
========================= */

function loadProgressRecords() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);

    if (!savedData) {

        progressRecords = [];

        return;
    }

    try {

        progressRecords = JSON.parse(savedData);

        if (!Array.isArray(progressRecords)) {
            progressRecords = [];
        }

    } catch (error) {

        console.error(
            "Could not load customer progress:",
            error
        );

        progressRecords = [];
    }
}


/* =========================
   SAVE PROGRESS DATA
========================= */

function saveProgressRecords() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progressRecords)
    );
}


/* =========================
   LOAD CUSTOMERS
========================= */

function loadCustomers() {

    customerSelect.innerHTML = `
        <option value="">
            Select Customer
        </option>
    `;

    const possibleKeys = [
        "assignedCustomers",
        "myCustomers",
        "members",
        "gymMembers",
        "memberData"
    ];

    let customers = [];

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

            console.error(
                `Could not read ${key}:`,
                error
            );
        }
    }


    customers.forEach(customer => {

        const id =
            customer.id ||
            customer.memberId ||
            customer.customerId;

        const name =
            customer.name ||
            customer.memberName ||
            customer.customerName ||
            customer.fullName;

        if (!id || !name) return;

        const option =
            document.createElement("option");

        option.value = id;

        option.textContent = name;

        customerSelect.appendChild(option);

    });
}


/* =========================
   CUSTOMER SELECT
========================= */

customerSelect.addEventListener(
    "change",
    function () {

        const customerId = this.value;

        if (!customerId) {

            clearCustomerProgress();

            return;
        }

        showCustomerProgress(customerId);

    }
);


/* =========================
   CLEAR CUSTOMER DATA
========================= */

function clearCustomerProgress() {

    document.getElementById("goalType").textContent = "—";

    document.getElementById("startingWeight").textContent = "—";

    document.getElementById("targetWeight").textContent = "—";

    document.getElementById("goalStatus").textContent = "—";

    document.getElementById("goalDetails").textContent =
        "Select a customer to view their goal.";

    document.getElementById("overviewStartingWeight").textContent =
        "—";

    document.getElementById("currentWeight").textContent =
        "—";

    document.getElementById("overviewTargetWeight").textContent =
        "—";

    document.getElementById("overallProgress").textContent =
        "—";

    measurementsTableBody.innerHTML = `
        <tr>
            <td>Weight</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>

        <tr>
            <td>Chest</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>

        <tr>
            <td>Waist</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>

        <tr>
            <td>Arms</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
        </tr>
    `;

    progressTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="progress-empty">
                Select a customer to view progress records.
            </td>
        </tr>
    `;

    destroyChart();
}


/* =========================
   SHOW CUSTOMER PROGRESS
========================= */

function showCustomerProgress(customerId) {

    const customerRecords =
        progressRecords.filter(
            record => String(record.customerId) === String(customerId)
        );


    if (customerRecords.length === 0) {

        clearCustomerProgress();

        progressTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="progress-empty">
                    No progress records found for this customer.
                </td>
            </tr>
        `;

        return;
    }


    customerRecords.sort(
        (a, b) =>
            new Date(a.date) - new Date(b.date)
    );


    const firstRecord =
        customerRecords[0];

    const latestRecord =
        customerRecords[customerRecords.length - 1];


    /* =========================
       GOAL
    ========================= */

    document.getElementById("goalType").textContent =
        firstRecord.goalType || "—";

    document.getElementById("startingWeight").textContent =
        formatWeight(firstRecord.startingWeight);

    document.getElementById("targetWeight").textContent =
        formatWeight(firstRecord.targetWeight);

    document.getElementById("goalStatus").textContent =
        latestRecord.goalStatus || "In Progress";

    document.getElementById("goalDetails").textContent =
        firstRecord.goalDetails || "—";


    /* =========================
       OVERVIEW
    ========================= */

    document.getElementById("overviewStartingWeight").textContent =
        formatWeight(firstRecord.startingWeight);

    document.getElementById("currentWeight").textContent =
        formatWeight(latestRecord.weight);

    document.getElementById("overviewTargetWeight").textContent =
        formatWeight(firstRecord.targetWeight);

    document.getElementById("overallProgress").textContent =
        `${calculateProgress(firstRecord, latestRecord)}%`;


    /* =========================
       MEASUREMENTS
    ========================= */

    renderMeasurements(
        firstRecord,
        latestRecord
    );


    /* =========================
       TABLE
    ========================= */

    renderCustomerRecords(
        customerRecords
    );


    /* =========================
       CHART
    ========================= */

    renderProgressChart(
        customerRecords
    );
}


/* =========================
   WEIGHT FORMAT
========================= */

function formatWeight(weight) {

    if (
        weight === undefined ||
        weight === null ||
        weight === ""
    ) {
        return "—";
    }

    return `${weight} kg`;
}


/* =========================
   CALCULATE PROGRESS
========================= */

function calculateProgress(
    startingRecord,
    currentRecord
) {

    const start =
        Number(startingRecord.startingWeight);

    const target =
        Number(startingRecord.targetWeight);

    const current =
        Number(currentRecord.weight);


    if (
        !Number.isFinite(start) ||
        !Number.isFinite(target) ||
        !Number.isFinite(current) ||
        start === target
    ) {
        return 0;
    }


    const totalDistance =
        Math.abs(start - target);

    const achievedDistance =
        Math.abs(start - current);


    let percentage =
        (achievedDistance / totalDistance) * 100;


    percentage =
        Math.max(0, Math.min(100, percentage));


    return Math.round(percentage);
}


/* =========================
   MEASUREMENTS
========================= */

function renderMeasurements(
    firstRecord,
    latestRecord
) {

    const measurements = [

        {
            name: "Weight",
            start: firstRecord.startingWeight,
            current: latestRecord.weight,
            unit: "kg"
        },

        {
            name: "Chest",
            start: firstRecord.chest,
            current: latestRecord.chest,
            unit: "in"
        },

        {
            name: "Waist",
            start: firstRecord.waist,
            current: latestRecord.waist,
            unit: "in"
        },

        {
            name: "Arms",
            start: firstRecord.arms,
            current: latestRecord.arms,
            unit: "in"
        }

    ];


    measurementsTableBody.innerHTML =
        measurements.map(measurement => {

            const start =
                formatMeasurement(
                    measurement.start,
                    measurement.unit
                );

            const current =
                formatMeasurement(
                    measurement.current,
                    measurement.unit
                );

            const change =
                calculateChange(
                    measurement.start,
                    measurement.current,
                    measurement.unit
                );


            return `
                <tr>

                    <td>${measurement.name}</td>

                    <td>${start}</td>

                    <td>${current}</td>

                    <td>${change}</td>

                </tr>
            `;

        }).join("");
}


/* =========================
   MEASUREMENT FORMAT
========================= */

function formatMeasurement(
    value,
    unit
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "—";
    }

    return `${value} ${unit}`;
}


/* =========================
   CALCULATE CHANGE
========================= */

function calculateChange(
    start,
    current,
    unit
) {

    if (
        start === undefined ||
        current === undefined ||
        start === "" ||
        current === ""
    ) {
        return "—";
    }


    const difference =
        Number(current) - Number(start);


    if (!Number.isFinite(difference)) {
        return "—";
    }


    const sign =
        difference > 0 ? "+" : "";


    return `${sign}${difference.toFixed(1)} ${unit}`;
}


/* =========================
   RENDER RECORDS
========================= */

function renderCustomerRecords(
    records
) {

    if (!records.length) {

        progressTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="progress-empty">
                    No progress records found.
                </td>
            </tr>
        `;

        return;
    }


    progressTableBody.innerHTML =
        records.map(record => {

            const progress =
                calculateRecordProgress(record);


            return `
                <tr>

                    <td>
                        ${escapeHTML(record.customer)}
                    </td>

                    <td>
                        ${formatDate(record.date)}
                    </td>

                    <td>
                        ${formatWeight(record.weight)}
                    </td>

                    <td>
                        ${escapeHTML(record.goalType || "—")}
                    </td>

                    <td>
                        <span class="progress-status ${getStatusClass(record.goalStatus)}">
                            ${escapeHTML(record.goalStatus || "In Progress")}
                        </span>
                    </td>

                    <td>
                        ${escapeHTML(record.notes || "—")}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="progress-action-btn"
                            title="View"
                            onclick="viewProgress(${record.id})">

                            <i class="fa-solid fa-eye"></i>

                        </button>


                        <button
                            type="button"
                            class="progress-action-btn"
                            title="Edit"
                            onclick="editProgress(${record.id})">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="progress-action-btn delete"
                            title="Delete"
                            onclick="deleteProgress(${record.id})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>
            `;

        }).join("");
}


/* =========================
   RECORD PROGRESS
========================= */

function calculateRecordProgress(record) {

    if (
        record.progress !== undefined &&
        record.progress !== ""
    ) {
        return Number(record.progress);
    }

    return 0;
}


/* =========================
   STATUS CLASS
========================= */

function getStatusClass(status) {

    if (status === "Target Achieved") {
        return "achieved";
    }

    if (status === "Needs Improvement") {
        return "attention";
    }

    return "in-progress";
}


/* =========================
   OPEN ADD PROGRESS
========================= */

openProgressForm.addEventListener(
    "click",
    function () {

        editingProgressId = null;

        openProgressModal();

    }
);


/* =========================
   PROGRESS MODAL
========================= */

function openProgressModal(record = null) {

    const modal =
        document.getElementById("trainerModal");

    if (!modal) {

        console.error(
            "Trainer modal not loaded yet."
        );

        return;
    }


    const title =
        document.getElementById("trainerModalTitle");

    const modalBody =
        modal.querySelector(".trainer-modal-body");

    const modalFooter =
        modal.querySelector(".trainer-modal-footer");


    if (!modalBody || !modalFooter) return;


    title.textContent =
        record
            ? "Edit Customer Progress"
            : "Add Customer Progress";


    modalBody.innerHTML = `

        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-user"></i>
                Customer & Goal
            </h3>

            <div class="trainer-modal-grid">

                <div class="trainer-modal-field">

                    <label>Customer</label>

                    <select id="progressCustomerInput">

                        <option value="">
                            Select Customer
                        </option>

                    </select>

                </div>


                <div class="trainer-modal-field">

                    <label>Progress Date</label>

                    <input
                        type="date"
                        id="progressDateInput">

                </div>


                <div class="trainer-modal-field">

                    <label>Goal Type</label>

                    <select id="goalTypeInput">

                        <option value="">
                            Select Goal
                        </option>

                        <option value="Weight Loss">
                            Weight Loss
                        </option>

                        <option value="Muscle Gain">
                            Muscle Gain
                        </option>

                        <option value="Strength Building">
                            Strength Building
                        </option>

                        <option value="Body Building">
                            Body Building
                        </option>

                        <option value="General Fitness">
                            General Fitness
                        </option>

                        <option value="Fat Loss">
                            Fat Loss
                        </option>

                        <option value="Endurance / Stamina">
                            Endurance / Stamina
                        </option>

                        <option value="Flexibility & Mobility">
                            Flexibility & Mobility
                        </option>

                        <option value="Weight Gain">
                            Weight Gain
                        </option>

                        <option value="Fitness Maintenance">
                            Fitness Maintenance
                        </option>

                        <option value="Custom Goal">
                            Custom Goal
                        </option>

                    </select>

                </div>


                <div class="trainer-modal-field">

                    <label>Goal Status</label>

                    <select id="goalStatusInput">

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Target Achieved">
                            Target Achieved
                        </option>

                        <option value="Needs Improvement">
                            Needs Improvement
                        </option>

                    </select>

                </div>

            </div>

        </div>


        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-bullseye"></i>
                Goal Details
            </h3>

            <div class="trainer-modal-grid">

                <div class="trainer-modal-field">

                    <label>Starting Weight (kg)</label>

                    <input
                        type="number"
                        id="startingWeightInput"
                        min="0"
                        step="0.1"
                        placeholder="e.g. 85">

                </div>


                <div class="trainer-modal-field">

                    <label>Target Weight (kg)</label>

                    <input
                        type="number"
                        id="targetWeightInput"
                        min="0"
                        step="0.1"
                        placeholder="e.g. 75">

                </div>

            </div>


            <div class="trainer-modal-field">

                <label>Goal Details</label>

                <textarea
                    id="goalDetailsInput"
                    placeholder="Describe the customer's goal..."></textarea>

            </div>

        </div>


        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-ruler-combined"></i>
                Current Measurements
            </h3>

            <div class="trainer-modal-grid">

                <div class="trainer-modal-field">

                    <label>Current Weight (kg)</label>

                    <input
                        type="number"
                        id="weightInput"
                        min="0"
                        step="0.1"
                        placeholder="e.g. 80">

                </div>


                <div class="trainer-modal-field">

                    <label>Chest (in)</label>

                    <input
                        type="number"
                        id="chestInput"
                        min="0"
                        step="0.1"
                        placeholder="e.g. 40">

                </div>


                <div class="trainer-modal-field">

                    <label>Waist (in)</label>

                    <input
                        type="number"
                        id="waistInput"
                        min="0"
                        step="0.1"
                        placeholder="e.g. 34">

                </div>


                <div class="trainer-modal-field">

                    <label>Arms (in)</label>

                    <input
                        type="number"
                        id="armsInput"
                        min="0"
                        step="0.1"
                        placeholder="e.g. 14">

                </div>

            </div>

        </div>


        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-note-sticky"></i>
                Trainer Notes
            </h3>

            <div class="trainer-modal-field">

                <textarea
                    id="progressNotesInput"
                    placeholder="Add notes about customer progress..."></textarea>

            </div>

        </div>
    `;


    modalFooter.innerHTML = `

        <button
            type="button"
            class="trainer-modal-btn cancel-btn"
            id="progressModalCancel">

            Cancel

        </button>


        <button
            type="button"
            class="trainer-modal-btn save-btn"
            id="progressModalSave">

            <i class="fa-solid fa-floppy-disk"></i>

            ${record ? "Update Progress" : "Save Progress"}

        </button>
    `;


    fillProgressCustomers();


    if (record) {

        fillProgressForm(record);

    } else {

        document.getElementById(
            "progressDateInput"
        ).value = getToday();

    }


    document.getElementById(
        "progressModalCancel"
    ).addEventListener(
        "click",
        closeProgressModal
    );


    document.getElementById(
        "progressModalSave"
    ).addEventListener(
        "click",
        saveProgress
    );


    modal.style.display = "flex";
}


/* =========================
   FILL CUSTOMERS IN MODAL
========================= */

function fillProgressCustomers() {

    const select =
        document.getElementById(
            "progressCustomerInput"
        );

    if (!select) return;


    Array.from(customerSelect.options)
        .forEach(option => {

            if (!option.value) return;

            const newOption =
                document.createElement("option");

            newOption.value =
                option.value;

            newOption.textContent =
                option.textContent;

            select.appendChild(newOption);

        });


    if (customerSelect.value) {

        select.value =
            customerSelect.value;

    }
}


/* =========================
   FILL EDIT FORM
========================= */

function fillProgressForm(record) {

    document.getElementById(
        "progressCustomerInput"
    ).value = record.customerId;


    document.getElementById(
        "progressDateInput"
    ).value = record.date;


    document.getElementById(
        "goalTypeInput"
    ).value = record.goalType || "";


    document.getElementById(
        "goalStatusInput"
    ).value =
        record.goalStatus || "In Progress";


    document.getElementById(
        "startingWeightInput"
    ).value =
        record.startingWeight || "";


    document.getElementById(
        "targetWeightInput"
    ).value =
        record.targetWeight || "";


    document.getElementById(
        "goalDetailsInput"
    ).value =
        record.goalDetails || "";


    document.getElementById(
        "weightInput"
    ).value =
        record.weight || "";


    document.getElementById(
        "chestInput"
    ).value =
        record.chest || "";


    document.getElementById(
        "waistInput"
    ).value =
        record.waist || "";


    document.getElementById(
        "armsInput"
    ).value =
        record.arms || "";


    document.getElementById(
        "progressNotesInput"
    ).value =
        record.notes || "";
}


/* =========================
   SAVE PROGRESS
========================= */

function saveProgress() {

    const customerInput =
        document.getElementById(
            "progressCustomerInput"
        );

    const dateInput =
        document.getElementById(
            "progressDateInput"
        );

    const goalTypeInput =
        document.getElementById(
            "goalTypeInput"
        );

    const goalStatusInput =
        document.getElementById(
            "goalStatusInput"
        );

    const startingWeightInput =
        document.getElementById(
            "startingWeightInput"
        );

    const targetWeightInput =
        document.getElementById(
            "targetWeightInput"
        );

    const goalDetailsInput =
        document.getElementById(
            "goalDetailsInput"
        );

    const weightInput =
        document.getElementById(
            "weightInput"
        );


    if (
        !customerInput.value ||
        !dateInput.value ||
        !goalTypeInput.value ||
        !startingWeightInput.value ||
        !targetWeightInput.value ||
        !weightInput.value
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    const customerOption =
        customerInput.options[
            customerInput.selectedIndex
        ];


    const recordData = {

        customerId:
            customerInput.value,

        customer:
            customerOption.textContent,

        date:
            dateInput.value,

        goalType:
            goalTypeInput.value,

        goalStatus:
            goalStatusInput.value,

        startingWeight:
            Number(startingWeightInput.value),

        targetWeight:
            Number(targetWeightInput.value),

        goalDetails:
            goalDetailsInput.value.trim(),

        weight:
            Number(weightInput.value),

        chest:
            document.getElementById(
                "chestInput"
            ).value
                ? Number(
                    document.getElementById(
                        "chestInput"
                    ).value
                )
                : "",

        waist:
            document.getElementById(
                "waistInput"
            ).value
                ? Number(
                    document.getElementById(
                        "waistInput"
                    ).value
                )
                : "",

        arms:
            document.getElementById(
                "armsInput"
            ).value
                ? Number(
                    document.getElementById(
                        "armsInput"
                    ).value
                )
                : "",

        notes:
            document.getElementById(
                "progressNotesInput"
            ).value.trim()

    };


    if (editingProgressId) {

        const index =
            progressRecords.findIndex(
                record =>
                    record.id === editingProgressId
            );


        if (index !== -1) {

            progressRecords[index] = {

                ...progressRecords[index],

                ...recordData

            };
        }

    } else {

        progressRecords.push({

            id: Date.now(),

            ...recordData

        });

    }


    saveProgressRecords();

    closeProgressModal();


    customerSelect.value =
        recordData.customerId;


    showCustomerProgress(
        recordData.customerId
    );


    editingProgressId = null;
}


/* =========================
   CLOSE PROGRESS MODAL
========================= */

function closeProgressModal() {

    const modal =
        document.getElementById(
            "trainerModal"
        );

    if (!modal) return;

    modal.style.display = "none";
}


/* =========================
   VIEW PROGRESS
========================= */

function viewProgress(id) {

    const record =
        progressRecords.find(
            item => item.id === id
        );

    if (!record) return;


    const modal =
        document.getElementById(
            "trainerModal"
        );

    if (!modal) return;


    const title =
        document.getElementById(
            "trainerModalTitle"
        );

    const modalBody =
        modal.querySelector(
            ".trainer-modal-body"
        );

    const modalFooter =
        modal.querySelector(
            ".trainer-modal-footer"
        );


    title.textContent =
        "Customer Progress Details";


    modalBody.innerHTML = `

        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-user"></i>
                Customer Information
            </h3>

            <div class="trainer-modal-grid">

                <div class="trainer-modal-field">
                    <label>Customer</label>
                    <p>${escapeHTML(record.customer)}</p>
                </div>

                <div class="trainer-modal-field">
                    <label>Date</label>
                    <p>${formatDate(record.date)}</p>
                </div>

                <div class="trainer-modal-field">
                    <label>Goal</label>
                    <p>${escapeHTML(record.goalType)}</p>
                </div>

                <div class="trainer-modal-field">
                    <label>Goal Status</label>
                    <p>${escapeHTML(record.goalStatus)}</p>
                </div>

            </div>

        </div>


        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-bullseye"></i>
                Goal
            </h3>

            <div class="trainer-modal-grid">

                <div class="trainer-modal-field">
                    <label>Starting Weight</label>
                    <p>${formatWeight(record.startingWeight)}</p>
                </div>

                <div class="trainer-modal-field">
                    <label>Target Weight</label>
                    <p>${formatWeight(record.targetWeight)}</p>
                </div>

                <div class="trainer-modal-field">
                    <label>Current Weight</label>
                    <p>${formatWeight(record.weight)}</p>
                </div>

            </div>

            <div class="trainer-modal-field">

                <label>Goal Details</label>

                <p>
                    ${escapeHTML(record.goalDetails || "—")}
                </p>

            </div>

        </div>


        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-ruler-combined"></i>
                Measurements
            </h3>

            <div class="trainer-modal-grid">

                <div class="trainer-modal-field">
                    <label>Chest</label>
                    <p>${formatMeasurement(record.chest, "in")}</p>
                </div>

                <div class="trainer-modal-field">
                    <label>Waist</label>
                    <p>${formatMeasurement(record.waist, "in")}</p>
                </div>

                <div class="trainer-modal-field">
                    <label>Arms</label>
                    <p>${formatMeasurement(record.arms, "in")}</p>
                </div>

            </div>

        </div>


        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-note-sticky"></i>
                Trainer Notes
            </h3>

            <div class="trainer-modal-field">

                <p>
                    ${escapeHTML(record.notes || "No notes added.")}
                </p>

            </div>

        </div>
    `;


    modalFooter.innerHTML = `

        <button
            type="button"
            class="trainer-modal-btn cancel-btn"
            id="viewProgressClose">

            Close

        </button>
    `;


    document.getElementById(
        "viewProgressClose"
    ).addEventListener(
        "click",
        closeProgressModal
    );


    modal.style.display = "flex";
}


/* =========================
   EDIT PROGRESS
========================= */

function editProgress(id) {

    const record =
        progressRecords.find(
            item => item.id === id
        );

    if (!record) return;


    editingProgressId = id;

    openProgressModal(record);
}


/* =========================
   DELETE PROGRESS
========================= */

function deleteProgress(id) {

    const record =
        progressRecords.find(
            item => item.id === id
        );

    if (!record) return;


    const confirmed =
        confirm(
            `Delete progress record for ${record.customer}?`
        );


    if (!confirmed) return;


    progressRecords =
        progressRecords.filter(
            item => item.id !== id
        );


    saveProgressRecords();


    if (customerSelect.value) {

        showCustomerProgress(
            customerSelect.value
        );

    } else {

        renderAllRecords();

    }
}

/* =========================
   RENDER ALL RECORDS
========================= */

function renderAllRecords() {

    if (!progressRecords.length) {

        progressTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="progress-empty">
                    No progress records found.
                </td>
            </tr>
        `;

        return;
    }


    renderCustomerRecords(
        progressRecords
    );
}


/* =========================
   PROGRESS CHART
========================= */

function renderProgressChart(records) {

    const canvas =
        document.getElementById(
            "progressChart"
        );

    if (!canvas) return;


    if (!records.length) {

        destroyChart();

        return;
    }


    chartEmpty.style.display =
        "none";


    const labels =
        records.map(
            record => formatDate(record.date)
        );


    const weights =
        records.map(
            record => Number(record.weight)
        );


    const targetWeight =
        Number(records[0].targetWeight);


    destroyChart();


    const ctx =
        canvas.getContext("2d");


    progressChart =
        new Chart(ctx, {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {
                        label: "Current Weight",

                        data: weights,

                        borderWidth: 2,

                        tension: 0.3,

                        fill: false
                    },

                    {
                        label: "Target Weight",

                        data: records.map(
                            () => targetWeight
                        ),

                        borderWidth: 1,

                        borderDash: [6, 6],

                        tension: 0,

                        fill: false
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        labels:{
                            color:"#ffffff"

                        }
                    
                    }

                },

                scales: {

                    y: {

                        beginAtZero: false,

                        title: {
                            display: true,
                            text: "Weight (kg)"
                        }

                    },

                    x: {

                        title: {
                            color:"#cccccc"
                    },
                    grid:{
                        color:"rgba(255,255,0.12)"
                    }

                },

            }
        }
        });
}


/* =========================
   DESTROY CHART
========================= */

function destroyChart() {

    if (progressChart) {

        progressChart.destroy();

        progressChart = null;
    }


    if (chartEmpty) {

        chartEmpty.style.display =
            "flex";
    }
}


/* =========================
   DATE FORMAT
========================= */

function formatDate(date) {

    if (!date) return "—";


    const dateObject =
        new Date(`${date}T00:00:00`);


    if (Number.isNaN(dateObject.getTime())) {
        return date;
    }


    return dateObject.toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================
   TODAY
========================= */

function getToday() {

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


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================
   MODAL CLOSE EVENTS
========================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.id ===
            "trainerModalClose" ||
            event.target.id ===
            "trainerModalCancel"
        ) {

            closeProgressModal();
        }

    }
);


/* =========================
   INITIALIZE
========================= */

loadProgressRecords();

loadCustomers();

renderAllRecords();

