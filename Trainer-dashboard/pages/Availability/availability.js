

/* =========================
   AVAILABILITY PAGE
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


/* =========================
   LOCAL STORAGE
========================= */

const AVAILABILITY_KEY = "trainerAvailability";

let availabilityRecords =
    JSON.parse(
        localStorage.getItem(AVAILABILITY_KEY)
    ) || [];

let editingAvailabilityId = null;


/* =========================
   DOM ELEMENTS
========================= */

const availabilityTableBody =
    document.getElementById("availabilityTableBody");

const openAvailabilityForm =
    document.getElementById("openAvailabilityForm");

const availabilityCards =
    document.getElementById("availability-cards");

const currentAvailabilityStatus =
    document.getElementById("currentAvailabilityStatus");

const todayWorkingHours =
    document.getElementById("todayWorkingHours");

const todayAvailableSlots =
    document.getElementById("todayAvailableSlots");


/* =========================
   DEFAULT WEEK
========================= */

const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];


/* =========================
   SAVE DATA
========================= */

function saveAvailability() {

    localStorage.setItem(
        AVAILABILITY_KEY,
        JSON.stringify(availabilityRecords)
    );
    createNotification(
        "availability",
        editingAvailabilityId
        ? " Availability Updated"
        :"Availability Set",
        editingAvailabilityId
        ?`your availability for ${day} has been updated.`
        :`Availability has been set for $ {day}.`,
        "fa-calender-check"
    );
}


/* =========================
   GET STATUS
========================= */

function calculateStatus(
    maxSlots,
    bookedSlots,
    manualStatus
) {

    if (manualStatus === "Unavailable") {
        return "Unavailable";
    }

    if (manualStatus === "Busy") {
        return "Busy";
    }

    const availableSlots =
        Math.max(0, maxSlots - bookedSlots);

    if (availableSlots === 0) {
        return "Busy";
    }

    if (availableSlots <= 2) {
        return "Limited Slots";
    }

    return "Available";
}


/* =========================
   UPDATE CARDS
========================= */

function updateAvailabilityCards() {

    if (!availabilityCards) return;

    const availableDays =
        availabilityRecords.filter(
            item => item.status === "Available"
        ).length;

    const limitedDays =
        availabilityRecords.filter(
            item => item.status === "Limited Slots"
        ).length;

    const busyDays =
        availabilityRecords.filter(
            item => item.status === "Busy"
        ).length;

    const unavailableDays =
        availabilityRecords.filter(
            item => item.status === "Unavailable"
        ).length;


    const cards = availabilityCards.querySelectorAll(
        ".trainer-card"
    );

    if (cards.length < 4) return;


    /* Card 1 */

    cards[0].querySelector(".card-icon i").className =
        "fa-solid fa-calendar-check";

    cards[0].querySelector(".card-content p").textContent =
        "Available Days";

    cards[0].querySelector(".card-content h2").textContent =
        availableDays;

    cards[0].querySelector(".card-content span").textContent =
        "Days Available";


    /* Card 2 */

    cards[1].querySelector(".card-icon i").className =
        "fa-solid fa-clock";

    cards[1].querySelector(".card-content p").textContent =
        "Limited Slots";

    cards[1].querySelector(".card-content h2").textContent =
        limitedDays;

    cards[1].querySelector(".card-content span").textContent =
        "Days With Limited Slots";


    /* Card 3 */

    cards[2].querySelector(".card-icon i").className =
        "fa-solid fa-user-clock";

    cards[2].querySelector(".card-content p").textContent =
        "Busy Days";

    cards[2].querySelector(".card-content h2").textContent =
        busyDays;

    cards[2].querySelector(".card-content span").textContent =
        "Fully Booked Days";


    /* Card 4 */

cards[3].querySelector(".card-icon i").className =
    "fa-solid fa-calendar-xmark";

cards[3].querySelector(".card-content p").textContent =
    "Unavailable";

cards[3].querySelector(".card-content h2").textContent =
    unavailableDays;

cards[3].querySelector(".card-content span").textContent =
    "Days Unavailable";
}


/* =========================
   RENDER TABLE
========================= */

function renderAvailability() {

    if (!availabilityTableBody) return;

    availabilityTableBody.innerHTML = "";


    if (availabilityRecords.length === 0) {

        availabilityTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="availability-empty">

                    <i class="fa-solid fa-calendar-xmark"></i>

                    No availability records found.

                </td>
            </tr>
        `;

        return;
    }


    availabilityRecords.forEach(record => {

        const row = document.createElement("tr");

        const availableSlots =
            Math.max(
                0,
                Number(record.maxSlots) -
                Number(record.bookedSlots)
            );


        row.innerHTML = `

            <td>
                <span class="availability-day">
                    ${escapeHTML(record.day)}
                </span>
            </td>

            <td>
                <span class="availability-time">
                    ${
                        record.startTime && record.endTime
                            ? `${formatTime(record.startTime)} - ${formatTime(record.endTime)}`
                            : "—"
                    }
                </span>
            </td>

            <td>
                <span class="availability-status ${getStatusClass(record.status)}">
                    ${escapeHTML(record.status)}
                </span>
            </td>

            <td>
                <span class="slot-number">
                    ${record.maxSlots}
                </span>
            </td>

            <td>
                <span class="slot-number">
                    ${record.bookedSlots}
                </span>
            </td>

            <td>
                <span class="slot-number">
                    ${availableSlots}
                </span>
            </td>

            <td>

                <div class="availability-actions">

                    <button
                        type="button"
                        class="availability-action-btn"
                        title="Edit"
                        onclick="editAvailability('${record.id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        type="button"
                        class="availability-action-btn"
                        title="Delete"
                        onclick="deleteAvailability('${record.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        `;

        availabilityTableBody.appendChild(row);

    });
}


/* =========================
   OPEN AVAILABILITY FORM
========================= */

if (openAvailabilityForm) {

    openAvailabilityForm.addEventListener(
        "click",
        () => {

            editingAvailabilityId = null;

            openAvailabilityModal();

        }
    );
}


/* =========================
   OPEN MODAL
========================= */

function openAvailabilityModal(record = null) {

    const modalContainer =
        document.getElementById(
            "trainer-modal-container"
        );

    if (!modalContainer) return;


    fetch(
        "../../../components/trainer-modal/trainer-modal.html"
    )
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Trainer modal could not be loaded."
                );
            }

            return response.text();

        })
        .then(data => {

            modalContainer.innerHTML = data;


            const modal =
                document.getElementById(
                    "trainerModal"
                );

            if (!modal) return;


            const modalTitle =
                modal.querySelector(
                    ".trainer-modal-title"
                );

            const modalBody =
                modal.querySelector(
                    ".trainer-modal-body"
                );


            if (modalTitle) {

                modalTitle.innerHTML = `

                    <i class="fa-solid fa-calendar-check"></i>

                    ${
                        record
                            ? "Edit Availability"
                            : "Set Availability"
                    }

                `;
            }


            if (modalBody) {

                modalBody.innerHTML = `

                    <div class="trainer-form-group">

                        <label for="availabilityDay">
                            Day
                        </label>

                        <select
                            id="availabilityDay"
                            required>

                            <option value="">
                                Select Day
                            </option>

                            ${weekDays.map(day => `
                                <option value="${day}">
                                    ${day}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="trainer-form-group">

                        <label for="availabilityStatus">
                            Availability Status
                        </label>

                        <select
                            id="availabilityStatus"
                            required>

                            <option value="Available">
                                Available
                            </option>

                            <option value="Limited Slots">
                                Limited Slots
                            </option>

                            <option value="Busy">
                                Busy
                            </option>

                            <option value="Unavailable">
                                Unavailable
                            </option>

                        </select>

                    </div>


                    <div class="trainer-form-row">

                        <div class="trainer-form-group">

                            <label for="availabilityStartTime">
                                Start Time
                            </label>

                            <input
                                type="time"
                                id="availabilityStartTime">

                        </div>


                        <div class="trainer-form-group">

                            <label for="availabilityEndTime">
                                End Time
                            </label>

                            <input
                                type="time"
                                id="availabilityEndTime">

                        </div>

                    </div>


                    <div class="trainer-form-row">

                        <div class="trainer-form-group">

                            <label for="maximumSlots">
                                Maximum Slots
                            </label>

                            <input
                                type="number"
                                id="maximumSlots"
                                min="0"
                                value="5">

                        </div>


                        <div class="trainer-form-group">

                            <label for="bookedSlots">
                                Booked Slots
                            </label>

                            <input
                                type="number"
                                id="bookedSlots"
                                min="0"
                                value="0">

                        </div>

                    </div>


                    <div class="trainer-form-group">

                        <label for="availabilityNotes">
                            Notes
                        </label>

                        <textarea
                            id="availabilityNotes"
                            rows="3"
                            placeholder="Enter availability notes...">
                        </textarea>

                    </div>


                    <div class="trainer-modal-actions">

                        <button
                            type="button"
                            class="trainer-modal-btn secondary"
                            id="cancelAvailability">

                            Cancel

                        </button>


                        <button
                            type="button"
                            class="trainer-modal-btn primary"
                            id="saveAvailability">

                            <i class="fa-solid fa-floppy-disk"></i>

                            ${
                                record
                                    ? "Update Availability"
                                    : "Save Availability"
                            }

                        </button>

                    </div>

                `;
            }


            if (record) {

                document.getElementById(
                    "availabilityDay"
                ).value = record.day;

                document.getElementById(
                    "availabilityStatus"
                ).value = record.status;

                document.getElementById(
                    "availabilityStartTime"
                ).value = record.startTime || "";

                document.getElementById(
                    "availabilityEndTime"
                ).value = record.endTime || "";

                document.getElementById(
                    "maximumSlots"
                ).value = record.maxSlots;

                document.getElementById(
                    "bookedSlots"
                ).value = record.bookedSlots;

                document.getElementById(
                    "availabilityNotes"
                ).value = record.notes || "";

            }


            modal.style.display = "flex";


            document
                .getElementById("cancelAvailability")
                .addEventListener("click", () => {

                    modal.style.display = "none";

                });


            document
                .getElementById("saveAvailability")
                .addEventListener(
                    "click",
                    saveAvailabilityRecord
                );

        })
        .catch(error => {

            console.error(
                "Availability Modal Error:",
                error
            );

        });
}


/* =========================
   SAVE AVAILABILITY RECORD
========================= */

function saveAvailabilityRecord() {

    const day =
        document.getElementById(
            "availabilityDay"
        ).value;

    const status =
        document.getElementById(
            "availabilityStatus"
        ).value;

    const startTime =
        document.getElementById(
            "availabilityStartTime"
        ).value;

    const endTime =
        document.getElementById(
            "availabilityEndTime"
        ).value;

    const maxSlots =
        Number(
            document.getElementById(
                "maximumSlots"
            ).value
        );

    const bookedSlots =
        Number(
            document.getElementById(
                "bookedSlots"
            ).value
        );

    const notes =
        document.getElementById(
            "availabilityNotes"
        ).value.trim();


    if (!day) {

        alert("Please select a day.");

        return;
    }


    if (
        status !== "Unavailable" &&
        (!startTime || !endTime)
    ) {

        alert(
            "Please select start and end time."
        );

        return;
    }


    if (
        startTime &&
        endTime &&
        endTime <= startTime
    ) {

        alert(
            "End time must be after start time."
        );

        return;
    }


    if (maxSlots < 0 || bookedSlots < 0) {

        alert(
            "Slot values cannot be negative."
        );

        return;
    }


    if (bookedSlots > maxSlots) {

        alert(
            "Booked slots cannot be greater than maximum slots."
        );

        return;
    }


    let finalStatus = calculateStatus(
        maxSlots,
        bookedSlots,
        status
    );


    if (status === "Limited Slots") {

        finalStatus = "Limited Slots";

    }


    const record = {

        id: editingAvailabilityId ||
            Date.now().toString(),

        day: day,

        startTime:
            status === "Unavailable"
                ? ""
                : startTime,

        endTime:
            status === "Unavailable"
                ? ""
                : endTime,

        status: finalStatus,

        maxSlots: maxSlots,

        bookedSlots: bookedSlots,

        notes: notes

    };


    if (editingAvailabilityId) {

        const index =
            availabilityRecords.findIndex(
                item =>
                    item.id ===
                    editingAvailabilityId
            );

        if (index !== -1) {

            availabilityRecords[index] =
                record;

        }

    }

    else {

        availabilityRecords.push(record);

    }


    saveAvailability();

    renderAvailability();

    updateAvailabilityCards();

    updateCurrentAvailability();


    const modal =
        document.getElementById(
            "trainerModal"
        );

    if (modal) {

        modal.style.display = "none";

    }


    editingAvailabilityId = null;
}


/* =========================
   EDIT AVAILABILITY
========================= */

function editAvailability(id) {

    const record =
        availabilityRecords.find(
            item => item.id === id
        );

    if (!record) return;

    editingAvailabilityId = id;

    openAvailabilityModal(record);
}


/* =========================
   DELETE AVAILABILITY
========================= */

function deleteAvailability(id) {

    const record =
        availabilityRecords.find(
            item => item.id === id
        );

    if (!record) return;


    const confirmDelete =
        confirm(
            `Are you sure you want to delete ${record.day} availability?`
        );


    if (!confirmDelete) return;


    availabilityRecords =
        availabilityRecords.filter(
            item => item.id !== id
        );


    saveAvailability();

    renderAvailability();

    updateAvailabilityCards();

    updateCurrentAvailability();
}


/* =========================
   CURRENT AVAILABILITY
========================= */

function updateCurrentAvailability() {

    if (
        !currentAvailabilityStatus ||
        !todayWorkingHours ||
        !todayAvailableSlots
    ) {
        return;
    }


    const todayName =
        new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    const todayRecord =
        availabilityRecords.find(
            item => item.day === todayName
        );


    if (!todayRecord) {

        currentAvailabilityStatus.textContent =
            "Unavailable";

        currentAvailabilityStatus.className =
            "availability-status status-unavailable";

        todayWorkingHours.textContent =
            "No schedule set";

        todayAvailableSlots.textContent =
            "0";

        return;
    }


    currentAvailabilityStatus.textContent =
        todayRecord.status;

    currentAvailabilityStatus.className =
        `availability-status ${getStatusClass(
            todayRecord.status
        )}`;


    if (
        todayRecord.startTime &&
        todayRecord.endTime
    ) {

        todayWorkingHours.textContent =
            `${formatTime(
                todayRecord.startTime
            )} - ${formatTime(
                todayRecord.endTime
            )}`;

    }

    else {

        todayWorkingHours.textContent =
            "Not Available";

    }


    const availableSlots =
        Math.max(
            0,
            Number(todayRecord.maxSlots) -
            Number(todayRecord.bookedSlots)
        );


    todayAvailableSlots.textContent =
        availableSlots;
}


/* =========================
   STATUS CLASS
========================= */

function getStatusClass(status) {

    if (status === "Available") {
        return "status-available";
    }

    if (status === "Limited Slots") {
        return "status-limited";
    }

    if (status === "Busy") {
        return "status-busy";
    }

    if (status === "Unavailable") {
        return "status-unavailable";
    }

    return "";
}


/* =========================
   FORMAT TIME
========================= */

function formatTime(timeString) {

    if (!timeString) return "—";

    const [hours, minutes] =
        timeString.split(":");

    const date = new Date();

    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
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
   LOAD TRAINER CARDS
========================= */

fetch(
    "../components/trainer-card/trainer-card.html"
)
    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Trainer card could not be loaded."
            );
        }

        return response.text();

    })
    .then(data => {

        if (availabilityCards) {

            availabilityCards.innerHTML = data;

            updateAvailabilityCards();

        }

    })
    .catch(error => {

        console.error(
            "Trainer Card Error:",
            error
        );

    });


/* =========================
   INITIAL LOAD
========================= */

renderAvailability();

updateCurrentAvailability();
