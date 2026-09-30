/* ========================================
   ADMIN ATTENDANCE
   COMPONENTS + ATTENDANCE STORAGE
======================================== */


/* ========================================
   STORAGE KEY
======================================== */

const ATTENDANCE_STORAGE_KEY = "gymAttendance";


/* ========================================
   LOAD ADMIN COMPONENTS
======================================== */

async function loadComponents() {

    try {

        /* ==============================
           ADMIN SIDEBAR
        ============================== */

        const sidebarContainer =
            document.getElementById(
                "admin-sidebar"
            );


        if (sidebarContainer) {

            const sidebarResponse =
                await fetch(
                    "../../../components/sidebar/sidebar.html"
                );


            if (!sidebarResponse.ok) {

                throw new Error(
                    "Admin sidebar could not be loaded."
                );

            }


            sidebarContainer.innerHTML = await sidebarResponse.text();

        }


        /* ==============================
           ADMIN NAVBAR
        ============================== */

        const navbarContainer =
            document.getElementById(
                "admin-navbar"
            );


        if (navbarContainer) {

            const navbarResponse =
                await fetch(
                    "../../../components/navbar/navbar.html"
                );


            if (!navbarResponse.ok) {

                throw new Error(
                    "Admin navbar could not be loaded."
                );

            }


            navbarContainer.innerHTML = await navbarResponse.text();

        }


        console.log("ADMIN COMPONENTS LOADED");

    }

    catch (error) {

        console.error(
            "COMPONENT LOADING ERROR:",error
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

        const records = JSON.parse(savedRecords);


        return Array.isArray(records)
            ? records: [];

    }

    catch (error) {

        console.error(
            "ATTENDANCE DATA ERROR:",error
        );

        return [];

    }

}


/* ========================================
   TODAY DATE
======================================== */

function getTodayDate() {

    const today =new Date();


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
        record.memberId || record.id ||
        record.memberID || "-"
    );

}


function getMemberName(record) {

    return (
        record.memberName ||record.name ||
    record.member || "-"
    );

}


function getRecordDate(record) {

    return (
        record.date ||record.attendanceDate ||
          record.markedDate || ""
    );

}


function getCheckIn(record) {

    return (
        record.checkIn || record.checkInTime ||
        record.time || "-"
    );

}


function getStatus(record) {

    return (
        record.status || "Present"
    );

}


function getVerification(record) {

    return (
        record.verification ||record.verificationStatus ||
        record.identityStatus ||
        "Verified"
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
        normalizedStatus ==="absent"
    ) {

        return "status-absent";

    }


    if (
        normalizedStatus ==="late"
    ) {

        return "status-late";

    }


    return "status-present";

}


/* ========================================
   FILTER RECORDS
======================================== */

function getFilteredAttendance() {

    const records =
        getAttendanceRecords();


    const searchValue =
        attendanceSearch.value
            .trim().toLowerCase();


    const selectedDate =
        attendanceDateFilter.value;


    const selectedStatus =
        attendanceStatusFilter.value;


    return records.filter(
        function (record) {

            const memberId =
                String(
                    getMemberId(record)).toLowerCase();


            const memberName =
                String(
                    getMemberName(record)
                ).toLowerCase();


            const recordDate =getRecordDate(record);


            const recordStatus = getStatus(record);


            const matchesSearch =
                !searchValue ||
                memberId.includes( searchValue ) ||
                memberName.includes(
                    searchValue
                );


            const matchesDate =
                !selectedDate || recordDate === selectedDate;


            const matchesStatus =
                selectedStatus === "all" ||
                recordStatus === selectedStatus;


            return (
                matchesSearch && matchesDate && matchesStatus
            );

        }
    );

}


/* ========================================
   RENDER TABLE
======================================== */

function renderAttendanceTable() {

    const records = getFilteredAttendance();


    attendanceTableBody.innerHTML = "";


    if (records.length === 0) {

        attendanceEmptyState.style.display ="block";

        return;

    }


    attendanceEmptyState.style.display ="none";


    records.forEach(
        function (record, index) {

            const row = document.createElement("tr");


            const status =  getStatus(record);


            const statusClass =
                getStatusClass( status );


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
                        class="status-badge ${statusClass}">
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
                        data-index="${index}"
                        title="View Attendance">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>`;


            attendanceTableBody.appendChild( row);

        }
    );

}


/* ========================================
   UPDATE STATISTICS
======================================== */

function updateAttendanceStatistics() {

    const records = getAttendanceRecords();


    const today = getTodayDate();


    const todayRecords =
        records.filter(
            function (record) {

                return (
                    getRecordDate(record) === today
                );

            }
        );


    const present =
        todayRecords.filter(
            function (record) {

                return (
                    String(
                        getStatus(record)
                    ).toLowerCase() ===
                    "present"
                );

            }
        ).length;


    const absent = todayRecords.filter(
            function (record) {

                return (
                    String(
                        getStatus(record)
                    ).toLowerCase() ==="absent"
                );

            }
        ).length;


    const late =
        todayRecords.filter(
            function (record) {

                return (
                    String(
                        getStatus(record)
                    ).toLowerCase() ===
                    "late"
                );

            }
        ).length;


    totalAttendance.textContent =records.length;


    todayPresent.textContent = present;


    todayAbsent.textContent =  absent;


    todayLate.textContent =  late;

}


/* ========================================
   VIEW ATTENDANCE
======================================== */

attendanceTableBody.addEventListener(
    "click",
    function (event) {

        const button = event.target.closest(
                ".attendance-action-btn"
            );


        if (!button) {

            return;

        }


        const index =
            Number(button.dataset.index
            );


        const records = getFilteredAttendance();


        const record =records[index];


        if (!record) {

            return;

        }


        alert(
            "Member: " +
            getMemberName(record) +"\nMember ID: " +
            getMemberId(record) +"\nDate: " +
            getRecordDate(record) + "\nCheck In: " +
            getCheckIn(record) + "\nStatus: " +
            getStatus(record)
        );

    }
);


/* ========================================
   SEARCH
======================================== */

attendanceSearch.addEventListener("input",
    function () {

        renderAttendanceTable();

    }
);


/* ========================================
   DATE FILTER
======================================== */

attendanceDateFilter.addEventListener("change",
    function () {

        renderAttendanceTable();

    }
);


/* ========================================
   STATUS FILTER
======================================== */

attendanceStatusFilter.addEventListener("change",
    function () {

        renderAttendanceTable();

    }
);


/* ========================================
   CLEAR FILTERS
======================================== */

clearAttendanceFilters.addEventListener("click",
    function () {

        attendanceSearch.value = "";

        attendanceDateFilter.value = "";

        attendanceStatusFilter.value = "all";

        renderAttendanceTable();

    }
);


/* ========================================
   INITIALIZE PAGE
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
