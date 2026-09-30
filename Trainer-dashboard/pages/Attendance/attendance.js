/* ========================================
   TRAINER ATTENDANCE
   COMPONENTS + ATTENDANCE STORAGE
======================================== */


/* ========================================
   STORAGE KEY
======================================== */

const ATTENDANCE_STORAGE_KEY = "gymAttendance";


/* ========================================
   LOAD TRAINER COMPONENTS
======================================== */

async function loadComponents() {

    try {

        /* ==============================
           TRAINER SIDEBAR
        ============================== */

        const sidebarContainer =
            document.getElementById(
                "trainer-sidebar"
            );


        if (sidebarContainer) {

            const sidebarResponse =
                await fetch(
                    "../../../components/trainer.sidebar/trainer.sidebar.html"
                );


            if (!sidebarResponse.ok) {

                throw new Error(
                    "Trainer sidebar could not be loaded."
                );

            }


            sidebarContainer.innerHTML =
                await sidebarResponse.text();

        }


        /* ==============================
           TRAINER NAVBAR
        ============================== */

        const navbarContainer =
            document.getElementById(
                "trainer-navbar"
            );


        if (navbarContainer) {

            const navbarResponse =
                await fetch(
                    "../../../components/trainer-navbar/trainer-navbar.html"
                );


            if (!navbarResponse.ok) {

                throw new Error(
                    "Trainer navbar could not be loaded."
                );

            }


            navbarContainer.innerHTML =
                await navbarResponse.text();

        }


        console.log(
            "TRAINER COMPONENTS LOADED"
        );

    }

    catch (error) {

        console.error(
            "TRAINER COMPONENT LOADING ERROR:",error
        );

    }

}


/* ========================================
   DOM ELEMENTS
======================================== */

const attendanceTableBody =
    document.getElementById(
        "attendanceTableBody"
    );


const attendanceEmptyState =
    document.getElementById(
        "attendanceEmptyState"
    );


const attendanceSearch =
    document.getElementById(
        "attendanceSearch"
    );


const attendanceDateFilter =
    document.getElementById(
        "attendanceDateFilter"
    );


const attendanceStatusFilter =
    document.getElementById(
        "attendanceStatusFilter"
    );


const clearAttendanceFilters =
    document.getElementById(
        "clearAttendanceFilters"
    );


const totalAttendance =
    document.getElementById(
        "totalAttendance"
    );


const todayPresent =
    document.getElementById(
        "todayPresent"
    );


const todayAbsent =
    document.getElementById(
        "todayAbsent"
    );


const todayLate =
    document.getElementById(
        "todayLate"
    );


/* ========================================
   GET ATTENDANCE RECORDS
======================================== */

function getAttendanceRecords() {

    const savedRecords =
        localStorage.getItem(
            ATTENDANCE_STORAGE_KEY
        );


    if (!savedRecords) {

        return [];

    }


    try {

        const records =
            JSON.parse(
                savedRecords
            );


        if (!Array.isArray(records)) {

            return [];

        }


        return records;

    }

    catch (error) {

        console.error(
            "ATTENDANCE DATA ERROR:", error
        );

        return [];

    }

}


/* ========================================
   TODAY DATE
======================================== */

function getTodayDate() {

    const today = new Date();


    const year = today.getFullYear();


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
   RECORD HELPERS
======================================== */

function getMemberId(record) {

    return (
        record.memberId ||record.id ||
        record.memberID || "-"
    );

}


function getMemberName(record) {

    return (
        record.memberName || record.name ||
         record.member ||"-"
    );

}


function getRecordDate(record) {

    return (
        record.date || record.attendanceDate ||
        record.markedDate ||""
    );

}


function getCheckIn(record) {

    return (
        record.checkIn ||record.checkInTime ||
        record.time || "-"
    );

}


function getStatus(record) {

    return (
        record.status ||"Present"
    );

}


function getVerification(record) {

    return (
        record.verification || record.verificationStatus ||
        record.identityStatus || "Verified"
    );

}


function getLocation(record) {

    return (
        record.location || record.locationStatus ||
        "Verified"
    );

}


/* ========================================
   STATUS CLASS
======================================== */

function getStatusClass(status) {

    const normalizedStatus =
        String(status)
            .toLowerCase();


    if (
        normalizedStatus === "absent"
    ) {

        return "status-absent";

    }


    if (
        normalizedStatus === "late"
    ) {

        return "status-late";

    }


    return "status-present";

}


/* ========================================
   FILTER ATTENDANCE
======================================== */

function getFilteredAttendance() {

    const records = getAttendanceRecords();


    const searchValue =
        attendanceSearch.value
            .trim() .toLowerCase();


    const selectedDate = attendanceDateFilter.value;


    const selectedStatus =attendanceStatusFilter.value;


    return records.filter(
        function (record) {

            const memberId =
                String(
                    getMemberId(record)
                ).toLowerCase();


            const memberName =
                String(
                    getMemberName(record)
                ).toLowerCase();


            const recordDate =getRecordDate(record);


            const recordStatus =getStatus(record);


            const matchesSearch =
                !searchValue ||
                memberId.includes(searchValue ) ||
                memberName.includes(searchValue
                );


            const matchesDate =!selectedDate ||
                recordDate === selectedDate;


            const matchesStatus =selectedStatus === "all" ||
                recordStatus === selectedStatus;


            return (
                matchesSearch && matchesDate &&
                matchesStatus
            );

        }
    );

}


/* ========================================
   RENDER ATTENDANCE TABLE
======================================== */

function renderAttendanceTable() {

    const records = getFilteredAttendance();


    attendanceTableBody.innerHTML = "";


    if (records.length === 0) {

        attendanceEmptyState.style.display = "block";

        return;

    }


    attendanceEmptyState.style.display = "none";


    records.forEach(
        function (record, index) {

            const status = getStatus(record);


            const statusClass =getStatusClass(status);


            const row =
                document.createElement( "tr" );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${getMemberId(record)}
                    </strong>
                </td>

                <td>
                    ${getMemberName(record)}
                </td>

                <td>
                    ${getRecordDate(record)}
                </td>

                <td>
                    ${getCheckIn(record)}
                </td>

                <td>

                    <span
                        class="status-badge ${statusClass}"
                    >
                        ${status}
                    </span>

                </td>

                <td>
                    ${getVerification(record)}
                </td>

                <td>
                    ${getLocation(record)}
                </td>

                <td>

                    <button
                        type="button"
                        class="attendance-action-btn"
                        data-record-index="${index}"
                        title="View Attendance" >

                        <i
                            class="fa-solid fa-eye"
                        ></i>

                    </button>

                </td>`;


            attendanceTableBody.appendChild(
                row
            );

        }
    );

}


/* ========================================
   UPDATE STATISTICS
======================================== */

function updateAttendanceStatistics() {

    const records = getAttendanceRecords();


    const today =getTodayDate();


    const todayRecords =
        records.filter(
            function (record) {

                return (
                    getRecordDate(record) ===today
                );

            }
        );


    const presentCount =
        todayRecords.filter(
            function (record) {

                return (
                    String(
                        getStatus(record)
                    ).toLowerCase() ==="present"
                );

            }
        ).length;


    const absentCount =
        todayRecords.filter(
            function (record) {

                return (
                    String(
                        getStatus(record)
                    ).toLowerCase() === "absent"
                );

            }
        ).length;


    const lateCount = todayRecords.filter(
            function (record) {

                return (
                    String(
                        getStatus(record)
                    ).toLowerCase() ==="late"
                );

            }
        ).length;


    totalAttendance.textContent =records.length;


    todayPresent.textContent = presentCount;


    todayAbsent.textContent = absentCount;


    todayLate.textContent = lateCount;

}


/* ========================================
   VIEW ATTENDANCE
======================================== */

attendanceTableBody.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".attendance-action-btn"
            );


        if (!button) {

            return;

        }


        const recordIndex =
            Number(
                button.dataset.recordIndex
            );


        const records = getFilteredAttendance();


        const record =records[recordIndex];


        if (!record) {

            return;

        }


        alert(
            "Member: " +
            getMemberName(record) +

            "\nMember ID: " +
            getMemberId(record) +

            "\nDate: " +
            getRecordDate(record) +

            "\nCheck In: " +
            getCheckIn(record) +

            "\nStatus: " +
            getStatus(record) +

            "\nVerification: " +
            getVerification(record) +

            "\nLocation: " +
            getLocation(record)
        );

    }
);


/* ========================================
   SEARCH
======================================== */

attendanceSearch.addEventListener(
    "input",
    function () {

        renderAttendanceTable();

    }
);


/* ========================================
   DATE FILTER
======================================== */

attendanceDateFilter.addEventListener(
    "change",function () {

        renderAttendanceTable();

    }
);


/* ========================================
   STATUS FILTER
======================================== */

attendanceStatusFilter.addEventListener(
    "change", function () {

        renderAttendanceTable();

    }
);


/* ========================================
   CLEAR FILTERS
======================================== */

clearAttendanceFilters.addEventListener(
    "click",
    function () {

        attendanceSearch.value = "";

        attendanceDateFilter.value = "";

        attendanceStatusFilter.value = "all";

        renderAttendanceTable();

    }
);


/* ========================================
   INITIALIZE TRAINER ATTENDANCE
======================================== */

async function initializeAttendancePage() {

    await loadComponents();

    renderAttendanceTable();

    updateAttendanceStatistics();

}


/* ========================================
   START
======================================== */

initializeAttendancePage(); 
