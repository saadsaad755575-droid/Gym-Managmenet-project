

/* =========================
   ATTENDANCE MANAGEMENT
========================= */

const attendanceStorageKey = "trainerAttendance";

let attendanceRecords = [];
let editingAttendanceId = null;


/* =========================
   LOAD COMPONENT
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
    "trainer-modal-container",
    "../../../components/trainer-modal/trainer-modal.html"
);


/* =========================
   DOM ELEMENTS
========================= */

const attendanceFormCard =
    document.getElementById("attendanceFormCard");

const attendanceForm =
    document.getElementById("attendanceForm");

const openAttendanceForm =
    document.getElementById("openAttendanceForm");

const closeAttendanceForm =
    document.getElementById("closeAttendanceForm");

const cancelAttendance =
    document.getElementById("cancelAttendance");

const customerSelect =
    document.getElementById("customerSelect");

const attendanceDate =
    document.getElementById("attendanceDate");

const attendanceStatus =
    document.getElementById("attendanceStatus");

const checkInTime =
    document.getElementById("checkInTime");

const checkOutTime =
    document.getElementById("checkOutTime");

const attendanceNotes =
    document.getElementById("attendanceNotes");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");


/* =========================
   LOAD ATTENDANCE DATA
========================= */

function loadAttendanceData() {

    const savedData =
        localStorage.getItem(attendanceStorageKey);

    if (savedData) {

        try {

            attendanceRecords = JSON.parse(savedData);

        } catch (error) {

            console.error(
                "Attendance data could not be loaded.",
                error
            );

            attendanceRecords = [];
        }

    } else {

        attendanceRecords = [];

    }

}


/* =========================
   SAVE ATTENDANCE DATA
========================= */

function saveAttendanceData() {

    localStorage.setItem(
        attendanceStorageKey,
        JSON.stringify(attendanceRecords)
    );

}


/* =========================
   LOAD CUSTOMERS
========================= */

function loadCustomers() {

    customerSelect.innerHTML =
        `<option value="">Select Customer</option>`;

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
                `Could not read ${key}`,
                error
            );

        }

    }


    /* =========================
       NO CUSTOMERS
    ========================= */

    if (customers.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "No assigned customers found";

        option.disabled = true;

        customerSelect.appendChild(option);

        return;
    }


    /* =========================
       CUSTOMER OPTIONS
    ========================= */

    customers.forEach(customer => {

        const option =
            document.createElement("option");

        const customerId =
            customer.id ||
            customer.memberId ||
            customer.customerId ||
            "";

        const customerName =
            customer.name ||
            customer.memberName ||
            customer.customerName ||
            customer.fullName ||
            "Unknown Customer";

        option.value = customerId;

        option.textContent = customerName;

        customerSelect.appendChild(option);

    });

}


/* =========================
   SET TODAY'S DATE
========================= */

function setTodayDate() {

    const today =
        new Date().toISOString().split("T")[0];

    attendanceDate.value = today;

}


/* =========================
   OPEN FORM
========================= */

openAttendanceForm.addEventListener(
    "click",
    function () {

        editingAttendanceId = null;

        attendanceForm.reset();

        setTodayDate();

        loadCustomers();

        attendanceFormCard.style.display = "block";

        attendanceFormCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =========================
   CLOSE FORM
========================= */

function closeForm() {

    attendanceFormCard.style.display = "none";

    attendanceForm.reset();

    editingAttendanceId = null;

}


closeAttendanceForm.addEventListener(
    "click",
    closeForm
);


cancelAttendance.addEventListener(
    "click",
    closeForm
);


/* =========================
   STATUS CHANGE
========================= */

attendanceStatus.addEventListener(
    "change",
    function () {

        if (this.value === "Absent") {

            checkInTime.value = "";
            checkOutTime.value = "";

            checkInTime.disabled = true;
            checkOutTime.disabled = true;

        } else {

            checkInTime.disabled = false;
            checkOutTime.disabled = false;

        }

    }
);


/* =========================
   SAVE / UPDATE ATTENDANCE
========================= */

attendanceForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const customerId =
            customerSelect.value;

        const customerName =
            customerSelect.options[
                customerSelect.selectedIndex
            ]?.textContent || "";


        const date =
            attendanceDate.value;

        const status =
            attendanceStatus.value;

        const checkIn =
            checkInTime.value;

        const checkOut =
            checkOutTime.value;

        const notes =
            attendanceNotes.value.trim();


        /* =========================
           VALIDATION
        ========================= */

        if (!customerId) {

            alert("Please select a customer.");

            return;
        }

        if (!date) {

            alert("Please select attendance date.");

            return;
        }

        if (!status) {

            alert("Please select attendance status.");

            return;
        }


        if (
            status !== "Absent" &&
            !checkIn
        ) {

            alert("Please select check-in time.");

            return;
        }


        /* =========================
           UPDATE EXISTING RECORD
        ========================= */

        if (editingAttendanceId !== null) {

            const recordIndex =
                attendanceRecords.findIndex(
                    record =>
                        record.id === editingAttendanceId
                );


            if (recordIndex !== -1) {

                attendanceRecords[recordIndex] = {

                    ...attendanceRecords[recordIndex],

                    customerId: customerId,
                    customer: customerName,
                    date: date,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    status: status,
                    notes: notes

                };

            }

        }

        /* =========================
           CREATE NEW RECORD
        ========================= */

        else {

            const newAttendance = {

                id: Date.now(),

                customerId: customerId,

                customer: customerName,

                date: date,

                checkIn: checkIn,

                checkOut: checkOut,

                status: status,

                notes: notes

            };

            attendanceRecords.push(
                newAttendance
            );

        }


        /* =========================
           SAVE
        ========================= */

        saveAttendanceData();

        renderAttendanceTable();

        closeForm();

    }
);


/* =========================
   RENDER ATTENDANCE TABLE
========================= */

function renderAttendanceTable() {

    attendanceTableBody.innerHTML = "";


    if (attendanceRecords.length === 0) {

        attendanceTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-attendance">

                    <i class="fa-solid fa-calendar-xmark"></i>

                    No attendance records found.

                </td>

            </tr>

        `;

        return;
    }


    attendanceRecords.forEach(record => {

        const row =
            document.createElement("tr");


        const formattedDate =
            formatDate(record.date);


        const formattedCheckIn =
            formatTime(record.checkIn);


        const formattedCheckOut =
            formatTime(record.checkOut);


        const statusClass =
            record.status.toLowerCase();


        row.innerHTML = `

            <td>
                ${escapeHTML(record.customer)}
            </td>

            <td>
                ${formattedDate}
            </td>

            <td>
                ${formattedCheckIn}
            </td>

            <td>
                ${formattedCheckOut}
            </td>

            <td>

                <span
                    class="attendance-status ${statusClass}">

                    ${escapeHTML(record.status)}

                </span>

            </td>

            <td>
                ${escapeHTML(record.notes || "-")}
            </td>

            <td>

                <button
                    type="button"
                    class="attendance-action-btn"
                    title="View"
                    onclick="viewAttendance(${record.id})">

                    <i class="fa-solid fa-eye"></i>

                </button>


                <button
                    type="button"
                    class="attendance-action-btn"
                    title="Edit"
                    onclick="editAttendance(${record.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    type="button"
                    class="attendance-action-btn delete"
                    title="Delete"
                    onclick="deleteAttendance(${record.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        attendanceTableBody.appendChild(row);

    });

}


/* =========================
   VIEW ATTENDANCE
========================= */

function viewAttendance(id) {

    const record =
        attendanceRecords.find(
            item => item.id === id
        );

    if (!record) return;


    const modal =
        document.getElementById("trainerModal");

    if (!modal) {

        alert("Trainer modal could not be loaded.");

        return;
    }


    const modalTitle =
        document.getElementById("trainerModalTitle");

    const memberName =
        document.getElementById("memberName");

    const memberId =
        document.getElementById("memberId");

    const memberGoal =
        document.getElementById("memberGoal");

    const workoutPlan =
        document.getElementById("workoutPlan");

    const workoutDays =
        document.getElementById("workoutDays");

    const progressSection =
        document.querySelector(
            ".trainer-modal-section:nth-child(3)"
        );

    const notes =
        document.getElementById("trainerNotes");

    const saveButton =
        document.getElementById("trainerModalSave");


    if (modalTitle) {

        modalTitle.textContent =
            "Attendance Details";

    }

    if (memberName) {

        memberName.textContent =
            record.customer;

    }

    if (memberId) {

        memberId.textContent =
            record.customerId || "-";

    }

    if (memberGoal) {

        memberGoal.textContent =
            `Attendance Date: ${formatDate(record.date)}`;

    }

    if (workoutPlan) {

        workoutPlan.textContent =
            `Check-in: ${formatTime(record.checkIn)}`;

    }

    if (workoutDays) {

        workoutDays.textContent =
            `Check-out: ${formatTime(record.checkOut)}`;

    }


    /* Hide progress section for attendance view */

    if (progressSection) {

        progressSection.style.display = "none";

    }


    if (notes) {

        notes.value =
            record.notes || "";

        notes.readOnly = true;

    }


    if (saveButton) {

        saveButton.style.display = "none";

    }


    modal.style.display = "flex";


    const closeModal =
        document.getElementById("trainerModalClose");

    const cancelModal =
        document.getElementById("trainerModalCancel");


    function closeAttendanceModal() {

        modal.style.display = "none";

        if (progressSection) {

            progressSection.style.display = "";

        }

        if (notes) {

            notes.readOnly = false;

        }

        if (saveButton) {

            saveButton.style.display = "";

        }

    }


    if (closeModal) {

        closeModal.onclick =
            closeAttendanceModal;

    }

    if (cancelModal) {

        cancelModal.onclick =
            closeAttendanceModal;

    }

}


/* =========================
   EDIT ATTENDANCE
========================= */

function editAttendance(id) {

    const record =
        attendanceRecords.find(
            item => item.id === id
        );

    if (!record) return;


    editingAttendanceId = id;


    loadCustomers();


    setTimeout(() => {

        customerSelect.value =
            record.customerId;

    }, 100);


    attendanceDate.value =
        record.date;

    attendanceStatus.value =
        record.status;

    checkInTime.value =
        record.checkIn || "";

    checkOutTime.value =
        record.checkOut || "";

    attendanceNotes.value =
        record.notes || "";


    if (record.status === "Absent") {

        checkInTime.disabled = true;
        checkOutTime.disabled = true;

    } else {

        checkInTime.disabled = false;
        checkOutTime.disabled = false;

    }


    attendanceFormCard.style.display =
        "block";


    attendanceFormCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================
   DELETE ATTENDANCE
========================= */

function deleteAttendance(id) {

    const record =
        attendanceRecords.find(
            item => item.id === id
        );

    if (!record) return;


    const confirmed =
        confirm(
            `Delete attendance record for ${record.customer}?`
        );


    if (!confirmed) return;


    attendanceRecords =
        attendanceRecords.filter(
            item => item.id !== id
        );


    saveAttendanceData();

    renderAttendanceTable();

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(dateString) {

    if (!dateString) return "-";


    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================
   FORMAT TIME
========================= */

function formatTime(timeString) {

    if (!timeString) return "-";


    const [hours, minutes] =
        timeString.split(":");


    const date =
        new Date();

    date.setHours(
        Number(hours),
        Number(minutes)
    );


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

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
   INITIAL LOAD
========================= */

loadAttendanceData();

loadCustomers();

setTodayDate();

renderAttendanceTable();
