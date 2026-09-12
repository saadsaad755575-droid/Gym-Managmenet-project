
/* =========================
   COMPONENT LOADER
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


/* =========================
   LOAD TRAINER COMPONENTS
========================= */

loadComponent(
    "trainer-sidebar",
    "../../../components/trainer.sidebar/trainer.sidebar.html"
);

loadComponent(
    "trainer-navbar",
    "../../../components/trainer-navbar/trainer-navbar.html"
);

loadComponent(
    "schedule-cards",
    "../../../components/trainer-card/trainer-card.html"
);
loadComponent(
    "trainer-modal-container",
    "../../../components/trainer-modal/trainer-modal.html"
);
/* =========================
   STORAGE
========================= */

const STORAGE_KEY = "trainerSchedule";

let scheduleRecords =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

let editingScheduleId = null;


/* =========================
   ELEMENTS
========================= */

const openScheduleForm =
    document.getElementById(
        "openScheduleForm"
    );

const scheduleTableBody =
    document.getElementById(
        "scheduleTableBody"
    );

const filterCustomer =
    document.getElementById(
        "filterCustomer"
    );

const filterDate =
    document.getElementById(
        "filterDate"
    );

const filterStatus =
    document.getElementById(
        "filterStatus"
    );

const clearScheduleFilters =
    document.getElementById(
        "clearScheduleFilters"
    );


/* =========================
   TRAINER CARD DATA
========================= */

function updateScheduleCards() {

    const cardsContainer =
        document.getElementById(
            "schedule-cards"
        );

    if (!cardsContainer) return;


    const cards =
        cardsContainer.querySelectorAll(
            ".trainer-card"
        );


    if (cards.length < 4) return;


    const today =
        getToday();


    const todayCount =
        scheduleRecords.filter(
            record =>
                record.date === today
        ).length;


    const upcomingCount =
        scheduleRecords.filter(
            record =>
                record.date > today &&
                record.status === "Scheduled"
        ).length;


    const completedCount =
        scheduleRecords.filter(
            record =>
                record.status === "Completed"
        ).length;


    const cancelledCount =
        scheduleRecords.filter(
            record =>
                record.status === "Cancelled"
        ).length;


    /* Today's Sessions */

    cards[0].querySelector(
        ".card-icon i"
    ).className =
        "fa-solid fa-calendar-day";

    cards[0].querySelector(
        ".card-content p"
    ).textContent =
        "Today's Sessions";

    cards[0].querySelector(
        ".card-content h2"
    ).textContent =
        todayCount;

    cards[0].querySelector(
        ".card-content span"
    ).textContent =
        "Scheduled Today";


    /* Upcoming Sessions */

    cards[1].querySelector(
        ".card-icon i"
    ).className =
        "fa-solid fa-clock";

    cards[1].querySelector(
        ".card-content p"
    ).textContent =
        "Upcoming Sessions";

    cards[1].querySelector(
        ".card-content h2"
    ).textContent =
        upcomingCount;

    cards[1].querySelector(
        ".card-content span"
    ).textContent =
        "Upcoming Training Sessions";


    /* Completed Sessions */

    cards[2].querySelector(
        ".card-icon i"
    ).className =
        "fa-solid fa-circle-check";

    cards[2].querySelector(
        ".card-content p"
    ).textContent =
        "Completed Sessions";

    cards[2].querySelector(
        ".card-content h2"
    ).textContent =
        completedCount;

    cards[2].querySelector(
        ".card-content span"
    ).textContent =
        "Completed Sessions";


    /* Cancelled Sessions */

    cards[3].querySelector(
        ".card-icon i"
    ).className =
        "fa-solid fa-circle-xmark";

    cards[3].querySelector(
        ".card-content p"
    ).textContent =
        "Cancelled Sessions";

    cards[3].querySelector(
        ".card-content h2"
    ).textContent =
        cancelledCount;

    cards[3].querySelector(
        ".card-content span"
    ).textContent =
        "Cancelled Sessions";

}


/* =========================
   GET TODAY
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
   SAVE STORAGE
========================= */

function saveScheduleRecords() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            scheduleRecords
        )
    );

}


/* =========================
   LOAD CUSTOMERS
========================= */

function getCustomers() {

    const possibleKeys = [
        "assignedCustomers",
        "myCustomers",
        "members",
        "gymMembers",
        "memberData"
    ];


    for (const key of possibleKeys) {

        const data =
            localStorage.getItem(key);

        if (!data) continue;


        try {

            const customers =
                JSON.parse(data);

            if (
                Array.isArray(customers) &&
                customers.length
            ) {

                return customers;

            }

        } catch (error) {

            console.error(error);

        }

    }


    return [];

}


/* =========================
   FILL CUSTOMER FILTER
========================= */

function fillCustomerFilter() {

    if (!filterCustomer) return;


    const customers =
        getCustomers();


    customers.forEach(
        customer => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                customer.id ||
                customer.memberId ||
                customer.customerId ||
                customer.name;


            option.textContent =
                customer.name ||
                customer.fullName ||
                customer.customerName ||
                "Customer";


            filterCustomer.appendChild(
                option
            );

        }
    );

}


/* =========================
   OPEN ADD SCHEDULE
========================= */

openScheduleForm.addEventListener(
    "click",
    function () {

        editingScheduleId = null;

        openScheduleModal();

    }
);


/* =========================
   SCHEDULE MODAL
========================= */

function openScheduleModal(
    record = null
) {

    const modal =
        document.getElementById(
            "trainerModal"
        );


    if (!modal) {

        console.error(
            "Trainer modal not loaded yet."
        );

        return;

    }


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


    if (
        !modalBody ||
        !modalFooter
    ) return;


    title.textContent =
        record
            ? "Edit Schedule"
            : "Add Schedule";


    modalBody.innerHTML = `

        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-calendar-days"></i>
                Session Information
            </h3>


            <div class="trainer-modal-grid">


                <div class="trainer-modal-field">

                    <label>
                        Customer
                    </label>

                    <select id="scheduleCustomerInput">

                        <option value="">
                            Select Customer
                        </option>

                    </select>

                </div>


                <div class="trainer-modal-field">

                    <label>
                        Date
                    </label>

                    <input
                        type="date"
                        id="scheduleDateInput">

                </div>


                <div class="trainer-modal-field">

                    <label>
                        Start Time
                    </label>

                    <input
                        type="time"
                        id="scheduleStartTimeInput">

                </div>


                <div class="trainer-modal-field">

                    <label>
                        End Time
                    </label>

                    <input
                        type="time"
                        id="scheduleEndTimeInput">

                </div>


                <div class="trainer-modal-field">

                    <label>
                        Session Type
                    </label>

                    <select id="scheduleTypeInput">

                        <option value="">
                            Select Session Type
                        </option>

                        <option value="Personal Training">
                            Personal Training
                        </option>

                        <option value="Workout Session">
                            Workout Session
                        </option>

                        <option value="Fitness Assessment">
                            Fitness Assessment
                        </option>

                        <option value="Progress Review">
                            Progress Review
                        </option>

                        <option value="Diet Consultation">
                            Diet Consultation
                        </option>

                    </select>

                </div>


                <div class="trainer-modal-field">

                    <label>
                        Status
                    </label>

                    <select id="scheduleStatusInput">

                        <option value="Scheduled">
                            Scheduled
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>

                    </select>

                </div>


            </div>

        </div>


        <div class="trainer-modal-section">

            <h3>
                <i class="fa-solid fa-note-sticky"></i>
                Session Notes
            </h3>


            <div class="trainer-modal-field">

                <label>
                    Notes
                </label>

                <textarea
                    id="scheduleNotesInput"
                    placeholder="Add notes about this session..."></textarea>

            </div>

        </div>

    `;


    modalFooter.innerHTML = `

        <button
            type="button"
            class="trainer-modal-btn cancel-btn"
            id="scheduleModalCancel">

            Cancel

        </button>


        <button
            type="button"
            class="trainer-modal-btn save-btn"
            id="scheduleModalSave">

            <i class="fa-solid fa-floppy-disk"></i>

            ${record
                ? "Update Schedule"
                : "Save Schedule"}

        </button>

    `;


    fillScheduleCustomers();


    if (record) {

        fillScheduleForm(record);

    } else {

        document.getElementById(
            "scheduleDateInput"
        ).value =
            getToday();

    }


    document.getElementById(
        "scheduleModalCancel"
    ).addEventListener(
        "click",
        closeScheduleModal
    );


    document.getElementById(
        "scheduleModalSave"
    ).addEventListener(
        "click",
        saveSchedule
    );


    modal.style.display = "flex";

}


/* =========================
   FILL MODAL CUSTOMERS
========================= */

function fillScheduleCustomers() {

    const select =
        document.getElementById(
            "scheduleCustomerInput"
        );


    if (!select) return;


    const customers =
        getCustomers();


    customers.forEach(
        customer => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                customer.id ||
                customer.memberId ||
                customer.customerId ||
                customer.name;


            option.textContent =
                customer.name ||
                customer.fullName ||
                customer.customerName ||
                "Customer";


            select.appendChild(
                option
            );

        }
    );

}


/* =========================
   FILL EDIT FORM
========================= */

function fillScheduleForm(record) {

    document.getElementById(
        "scheduleCustomerInput"
    ).value =
        record.customerId;


    document.getElementById(
        "scheduleDateInput"
    ).value =
        record.date;


    document.getElementById(
        "scheduleStartTimeInput"
    ).value =
        record.startTime;


    document.getElementById(
        "scheduleEndTimeInput"
    ).value =
        record.endTime;


    document.getElementById(
        "scheduleTypeInput"
    ).value =
        record.sessionType;


    document.getElementById(
        "scheduleStatusInput"
    ).value =
        record.status;


    document.getElementById(
        "scheduleNotesInput"
    ).value =
        record.notes || "";

}


/* =========================
   SAVE SCHEDULE
========================= */

function saveSchedule() {

    const customerInput =
        document.getElementById(
            "scheduleCustomerInput"
        );

    const dateInput =
        document.getElementById(
            "scheduleDateInput"
        );

    const startTimeInput =
        document.getElementById(
            "scheduleStartTimeInput"
        );

    const endTimeInput =
        document.getElementById(
            "scheduleEndTimeInput"
        );

    const sessionTypeInput =
        document.getElementById(
            "scheduleTypeInput"
        );

    const statusInput =
        document.getElementById(
            "scheduleStatusInput"
        );

    const notesInput =
        document.getElementById(
            "scheduleNotesInput"
        );


    if (
        !customerInput.value ||
        !dateInput.value ||
        !startTimeInput.value ||
        !endTimeInput.value ||
        !sessionTypeInput.value
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    if (
        endTimeInput.value <=
        startTimeInput.value
    ) {

        alert(
            "End time must be after start time."
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

        startTime:
            startTimeInput.value,

        endTime:
            endTimeInput.value,

        sessionType:
            sessionTypeInput.value,

        status:
            statusInput.value,

        notes:
            notesInput.value.trim()

    };


    if (editingScheduleId) {

        const index =
            scheduleRecords.findIndex(
                record =>
                    record.id ===
                    editingScheduleId
            );


        if (index !== -1) {

            scheduleRecords[index] = {

                ...scheduleRecords[index],

                ...recordData

            };

        }

    } else {

        scheduleRecords.push({

            id: Date.now(),

            ...recordData

        });

    }


    saveScheduleRecords();

    closeScheduleModal();

    renderSchedules();

    updateScheduleCards();

    editingScheduleId = null;

}


/* =========================
   CLOSE MODAL
========================= */

function closeScheduleModal() {

    const modal =
        document.getElementById(
            "trainerModal"
        );


    if (!modal) return;


    modal.style.display = "none";

}


 /*=========================
   RECENT SCHEDULE
========================= */

function renderSchedules() {

    if (!scheduleTableBody) return;

    const filteredRecords = getFilteredSchedules();

    scheduleTableBody.innerHTML = "";

    if (filteredRecords.length === 0) {

        scheduleTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="schedule-empty">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <p>No schedule records found.</p>
                </td>
            </tr>
        `;

        return;
    }

    filteredRecords.forEach(schedule => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${escapeHTML(schedule.customer)}</strong>
            </td>

            <td>
                ${formatDate(schedule.date)}
            </td>

            <td>
                ${formatTime(schedule.startTime)}
            </td>

            <td>
                ${formatTime(schedule.endTime)}
            </td>

            <td>
                ${escapeHTML(schedule.sessionType)}
            </td>

            <td>
                <span class="schedule-status ${getStatusClass(schedule.status)}">
                    ${escapeHTML(schedule.status)}
                </span>
            </td>

            <td>
                ${schedule.notes
                    ? escapeHTML(schedule.notes)
                    : `<span class="no-notes">No notes</span>`
                }
            </td>

            <td>
                <div class="schedule-actions">

                    <button
                        type="button"
                        class="schedule-action-btn view-btn"
                        title="View"
                        onclick="viewSchedule('${schedule.id}')">

                        <i class="fa-solid fa-eye"></i>

                    </button>


                    <button
                        type="button"
                        class="schedule-action-btn edit-btn"
                        title="Edit"
                        onclick="editSchedule('${schedule.id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="schedule-action-btn delete-btn"
                        title="Delete"
                        onclick="deleteSchedule('${schedule.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>
            </td>
        `;

        scheduleTableBody.appendChild(row);
    });
}

/* =========================
   FILTER SCHEDULES
========================= */

function getFilteredSchedules() {

    const customer = filterCustomer?.value || "";
    const date = filterDate?.value || "";
    const status = filterStatus?.value || "";

    return scheduleRecords.filter(schedule => {

        const customerMatch =
            !customer ||
            schedule.customerId === customer;

        const dateMatch =
            !date ||
            schedule.date === date;

        const statusMatch =
            !status ||
            schedule.status === status;

        return customerMatch && dateMatch && statusMatch;
    });
}

/* =========================
   VIEW SCHEDULE
========================= */

function viewSchedule(id) {

    const schedule = scheduleRecords.find(
        item => item.id === id
    );

    if (!schedule) return;

    loadTrainerModal();

    setTimeout(() =>  {

        const modal = document.getElementById("trainerModal");

        if (!modal) return;

        const modalBody = modal.querySelector(".trainer-modal-body");
        const modalTitle = modal.querySelector(".trainer-modal-title");

        if (modalTitle) {
            modalTitle.innerHTML = `
                <i class="fa-solid fa-calendar-check"></i>
                Schedule Details
            `;
        }

        if (modalBody) {

            modalBody.innerHTML = `
                <div class="view-details">

                    <div class="detail-item">
                        <strong>Customer</strong>
                        <span>${escapeHTML(schedule.customer)}</span>
                    </div>

                    <div class="detail-item">
                        <strong>Date</strong>
                        <span>${formatDate(schedule.date)}</span>
                    </div>

                    <div class="detail-item">
                        <strong>Start Time</strong>
                        <span>${formatTime(schedule.startTime)}</span>
                    </div>

                    <div class="detail-item">
                        <strong>End Time</strong>
                        <span>${formatTime(schedule.endTime)}</span>
                    </div>

                    <div class="detail-item">
                        <strong>Session Type</strong>
                        <span>${escapeHTML(schedule.sessionType)}</span>
                    </div>

                    <div class="detail-item">
                        <strong>Status</strong>
                        <span class="schedule-status ${getStatusClass(schedule.status)}">
                            ${escapeHTML(schedule.status)}
                        </span>
                    </div>

                    <div class="detail-item">
                        <strong>Notes</strong>
                        <span>
                            ${
                                schedule.notes
                                    ? escapeHTML(schedule.notes)
                                    : "No notes added."
                            }
                        </span>
                    </div>

                </div>
            `;
        }

        modal.style.display = "flex";

    }, 100);
}

/* =========================
   EDIT SCHEDULE
========================= */

function editSchedule(id) {

    const schedule = scheduleRecords.find(
        item => item.id === id
    );

    if (!schedule) return;

    editingScheduleId = id;

    openScheduleModal(schedule);
}

/* =========================
   DELETE SCHEDULE
========================= */

function deleteSchedule(id) {

    const schedule = scheduleRecords.find(
        item => item.id === id
    );

    if (!schedule) return;

    const confirmDelete = confirm(
        `Are you sure you want to delete the schedule for ${schedule.customer}?`
    );

    if (!confirmDelete) return;

    scheduleRecords = scheduleRecords.filter(
        item => item.id !== id
    );

    saveScheduleRecords();

    renderSchedules();

    updateScheduleCards();
}

/* =========================
   FORMAT DATE
========================= */

function formatDate(dateString) {

    if (!dateString) return "-";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


/* =========================
   FORMAT TIME
========================= */

function formatTime(timeString) {

    if (!timeString) return "-";

    const [hours, minutes] = timeString.split(":");

    const date = new Date();

    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

/* =========================
   STATUS CLASS
========================= */

function getStatusClass(status) {

    if (status === "Scheduled") {
        return "status-scheduled";
    }

    if (status === "Completed") {
        return "status-completed";
    }

    if (status === "Cancelled") {
        return "status-cancelled";
    }

    return "";
}

/* =========================
   ESCAPE HTML
========================= */

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

/* =========================
   CLEAR FILTERS
========================= */

if (clearScheduleFilters) {

    clearScheduleFilters.addEventListener("click", () => {

        if (filterCustomer) {
            filterCustomer.value = "";
        }

        if (filterDate) {
            filterDate.value = "";
        }

        if (filterStatus) {
            filterStatus.value = "";
        }

        renderSchedules();
    });
}

/* =========================
   FILTER EVENTS
========================= */

if (filterCustomer) {
    filterCustomer.addEventListener(
        "change",
        renderSchedules
    );
}

if (filterDate) {
    filterDate.addEventListener(
        "change",
        renderSchedules
    );
}

if (filterStatus) {
    filterStatus.addEventListener(
        "change",
        renderSchedules
    );
}

/* =========================
   INITIAL LOAD
========================= */

fillCustomerFilter();

renderSchedules();

updateScheduleCards();
