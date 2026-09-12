

// ========================================
// ATTENDANCE MANAGEMENT
// ========================================

const ATTENDANCE_STORAGE_KEY = "gymAttendance";

// ========================================
// LOCAL STORAGE
// ========================================

function getAttendance() {
  return JSON.parse(
    localStorage.getItem(ATTENDANCE_STORAGE_KEY)
  ) || [];
}

function saveAttendance(records) {
  localStorage.setItem(
    ATTENDANCE_STORAGE_KEY,
    JSON.stringify(records)
  );
}

// ========================================
// CSS LOADER
// ========================================

function loadCSS(href, id) {
  if (id && document.getElementById(id)) return;

  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href = href;

  if (id) {
    link.id = id;
  }

  document.head.appendChild(link);
}

// ========================================
// LOAD SIDEBAR + NAVBAR
// ========================================

async function loadComponents() {
  try {

    // Font Awesome
    loadCSS(
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
      "fontAwesomeCSS"
    );

    // ========================================
    // SIDEBAR
    // ========================================

    const sidebarResponse = await fetch(
      "/components/sidebar/sidebar.html"
    );

    const sidebarHTML =
      await sidebarResponse.text();

    const sidebarDoc =
      new DOMParser().parseFromString(
        sidebarHTML,
        "text/html"
      );

    const sidebarElement =
      sidebarDoc.querySelector(".sidebar");

    if (sidebarElement) {

      // Fix images
      sidebarElement
        .querySelectorAll("img")
        .forEach((img) => {

          const src =
            img.getAttribute("src");

          if (
            src &&
            src.startsWith("../../assets/")
          ) {
            img.src =
              "/" + src.replace("../../", "");
          }
        });

      // Fix links
      sidebarElement
        .querySelectorAll("a[href]")
        .forEach((link) => {

          const href =
            link.getAttribute("href");

          if (
            href &&
            href.startsWith(
              "../../admin-dashboard/"
            )
          ) {
            link.href =
              "/" + href.replace("../../", "");
          }
        });

      document.getElementById(
        "sidebar"
      ).innerHTML = "";

      document
        .getElementById("sidebar")
        .appendChild(sidebarElement);

      loadCSS(
        "/components/sidebar/sidebar.css",
        "sidebarCSS"
      );
    }

    // ========================================
    // NAVBAR
    // ========================================

    const navbarResponse = await fetch(
      "/components/navbar/navbar.html"
    );

    const navbarHTML =
      await navbarResponse.text();

    const navbarDoc =
      new DOMParser().parseFromString(
        navbarHTML,
        "text/html"
      );

    const navbarElement =
      navbarDoc.querySelector(".navbar");

    if (navbarElement) {

      // Fix images
      navbarElement
        .querySelectorAll("img")
        .forEach((img) => {

          const src =
            img.getAttribute("src");

          if (
            src &&
            src.startsWith("../../assets/")
          ) {
            img.src =
              "/" + src.replace("../../", "");
          }
        });

      document.getElementById(
        "navbar"
      ).innerHTML = "";

      document
        .getElementById("navbar")
        .appendChild(navbarElement);

      loadCSS(
        "/components/navbar/navbar.css",
        "navbarCSS"
      );
    }

  } catch (error) {

    console.error(
      "Error loading components:",
      error
    );
  }
}

// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ========================================
// GET NEXT ATTENDANCE ID
// ========================================

function getNextAttendanceId() {

  const records = getAttendance();

  let maxId = 1;

  records.forEach((record) => {

    const number =
      parseInt(
        record.id.replace("#A", "")
      );

    if (
      !isNaN(number) &&
      number >= maxId
    ) {
      maxId = number + 1;
    }
  });

  return (
    "#A" +
    String(maxId).padStart(3, "0")
  );
}

// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {

  if (!dateString) return "-";

  const date =
    new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}

// ========================================
// FORMAT TIME
// ========================================

function formatTime(timeString) {

  if (!timeString) return "-";

  const parts =
    timeString.split(":");

  let hours =
    parseInt(parts[0]);

  const minutes =
    parts[1];

  const ampm =
    hours >= 12 ? "PM" : "AM";

  hours =
    hours % 12 || 12;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    minutes +
    " " +
    ampm
  );
}

// ========================================
// STATUS TEXT
// ========================================

function getStatusText(status) {

  if (status === "present")
    return "Present";

  if (status === "absent")
    return "Absent";

  if (status === "late")
    return "Late";

  return status;
}

// ========================================
// CREATE ATTENDANCE ROW
// ========================================

function createAttendanceRow(record) {

  const row =
    document.createElement("tr");

  row.dataset.attendanceId =
    record.id;

  row.innerHTML = `
    <td>
      ${escapeHTML(record.id)}
    </td>

    <td>
      <div class="member-info">

        <div class="member-avatar">
          <i class="fa-solid fa-user"></i>
        </div>

        <span>
          ${escapeHTML(record.memberName)}
        </span>

      </div>
    </td>

    <td>
      ${formatDate(record.date)}
    </td>

    <td>
      ${formatTime(record.checkIn)}
    </td>

    <td>
      ${formatTime(record.checkOut)}
    </td>

    <td>
      <span class="attendance-status ${escapeHTML(record.status)}">
        ${getStatusText(record.status)}
      </span>
    </td>

    <td>
      <div class="table-actions">

        <button
          class="action-btn view-attendance"
          title="View"
        >
          <i class="fa-solid fa-eye"></i>
        </button>

        <button
          class="action-btn edit-attendance"
          title="Edit"
        >
          <i class="fa-solid fa-pen"></i>
        </button>

        <button
          class="action-btn delete-attendance"
          title="Delete"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>
    </td>
  `;

  return row;
}

// ========================================
// LOAD SAVED ATTENDANCE
// ========================================

function loadSavedAttendance() {

  const records =
    getAttendance();

  const tableBody =
    document.getElementById(
      "attendanceTableBody"
    );

  if (!tableBody) return;

  records.forEach((record) => {

    tableBody.appendChild(
      createAttendanceRow(record)
    );
  });
}

// ========================================
// UPDATE SUMMARY
// ========================================

function updateAttendanceSummary() {

  const tableBody =
    document.getElementById(
      "attendanceTableBody"
    );

  if (!tableBody) return;

  const rows =
    tableBody.querySelectorAll("tr");

  let present = 0;
  let absent = 0;
  let late = 0;
  let today = 0;

  // Get today's date
  const todayDate =
    new Date()
      .toISOString()
      .split("T")[0];

  rows.forEach((row) => {

    const cells =
      row.querySelectorAll("td");

    if (cells.length < 7) return;

    const dateText =
      cells[2].innerText.trim();

    const statusElement =
      cells[5].querySelector(
        ".attendance-status"
      );

    if (!statusElement) return;

    if (
      statusElement.classList.contains(
        "present"
      )
    ) {
      present++;
    }

    if (
      statusElement.classList.contains(
        "absent"
      )
    ) {
      absent++;
    }

    if (
      statusElement.classList.contains(
        "late"
      )
    ) {
      late++;
    }

    // Compare formatted date
    const recordDate =
      new Date(dateText);

    if (
      !isNaN(recordDate.getTime())
    ) {

      const formatted =
        recordDate
          .toISOString()
          .split("T")[0];

      if (
        formatted === todayDate
      ) {
        today++;
      }
    }
  });

  document.getElementById(
    "todayAttendance"
  ).textContent = today;

  document.getElementById(
    "totalPresent"
  ).textContent = present;

  document.getElementById(
    "totalAbsent"
  ).textContent = absent;

  document.getElementById(
    "totalLate"
  ).textContent = late;
}

// ========================================
// SEARCH + FILTER
// ========================================

function filterAttendance() {

  const searchInput =
    document.getElementById(
      "attendanceSearch"
    );

  const dateFilter =
    document.getElementById(
      "attendanceDateFilter"
    );

  const statusFilter =
    document.getElementById(
      "attendanceStatusFilter"
    );

  const tableBody =
    document.getElementById(
      "attendanceTableBody"
    );

  if (
    !searchInput ||
    !dateFilter ||
    !statusFilter ||
    !tableBody
  ) {
    return;
  }

  const searchText =
    searchInput.value
      .toLowerCase()
      .trim();

  const selectedDate =
    dateFilter.value;

  const selectedStatus =
    statusFilter.value;

  const rows =
    tableBody.querySelectorAll("tr");

  rows.forEach((row) => {

    const rowText =
      row.innerText.toLowerCase();

    const cells =
      row.querySelectorAll("td");

    const statusElement =
      row.querySelector(
        ".attendance-status"
      );

    const rowStatus =
      statusElement
        ? [...statusElement.classList]
            .find((className) =>
              [
                "present",
                "absent",
                "late"
              ].includes(className)
            )
        : "";

    const rowDate =
      cells[2]
        ? cells[2].innerText.trim()
        : "";

    const matchesSearch =
      rowText.includes(searchText);

    const matchesStatus =
      selectedStatus === "all" ||
      rowStatus === selectedStatus;

    let matchesDate = true;

    if (selectedDate) {

      const formattedDate =
        formatDate(selectedDate);

      matchesDate =
        rowDate === formattedDate;
    }

    row.style.display =
      matchesSearch &&
      matchesStatus &&
      matchesDate
        ? ""
        : "none";
  });
}

// ========================================
// OPEN MODAL
// ========================================

function openAttendanceModal() {

  const modal =
    document.getElementById(
      "attendanceModal"
    );

  if (!modal) return;

  modal.style.display = "flex";

  // Default today's date
  const dateInput =
    document.getElementById(
      "attendanceDate"
    );

  if (dateInput && !dateInput.value) {

    dateInput.value =
      new Date()
        .toISOString()
        .split("T")[0];
  }
}

// ========================================
// CLOSE MODAL
// ========================================

function closeAttendanceModal() {

  const modal =
    document.getElementById(
      "attendanceModal"
    );

  if (!modal) return;

  modal.style.display = "none";
}

// ========================================
// CLEAR FORM
// ========================================

function clearAttendanceForm() {

  document.getElementById(
    "attendanceMember"
  ).value = "";

  document.getElementById(
    "attendanceDate"
  ).value =
    new Date()
      .toISOString()
      .split("T")[0];

  document.getElementById(
    "checkInTime"
  ).value = "";

  document.getElementById(
    "checkOutTime"
  ).value = "";

  document.getElementById(
    "attendanceStatus"
  ).value = "present";
}

// ========================================
// ADD / MARK ATTENDANCE
// ========================================

function addAttendance() {

  const memberSelect =
    document.getElementById(
      "attendanceMember"
    );

  const dateInput =
    document.getElementById(
      "attendanceDate"
    );

  const checkInInput =
    document.getElementById(
      "checkInTime"
    );

  const checkOutInput =
    document.getElementById(
      "checkOutTime"
    );

  const statusSelect =
    document.getElementById(
      "attendanceStatus"
    );

  if (
    !memberSelect.value ||
    !dateInput.value
  ) {

    alert(
      "Please select member and attendance date."
    );

    return;
  }

  const memberName =
    memberSelect.options[
      memberSelect.selectedIndex
    ].text;

  const record = {

    id:
      getNextAttendanceId(),

    memberId:
      memberSelect.value,

    memberName:
      memberName,

    date:
      dateInput.value,

    checkIn:
      checkInInput.value,

    checkOut:
      checkOutInput.value,

    status:
      statusSelect.value
  };

  const records =
    getAttendance();

  records.push(record);

  saveAttendance(records);

  const tableBody =
    document.getElementById(
      "attendanceTableBody"
    );

  tableBody.appendChild(
    createAttendanceRow(record)
  );

  updateAttendanceSummary();

  clearAttendanceForm();

  closeAttendanceModal();

  alert(
    "Attendance marked successfully."
  );
}

// ========================================
// VIEW ATTENDANCE
// ========================================

function viewAttendance(row) {

  const attendanceId =
    row.dataset.attendanceId;

  // Dynamic record
  if (attendanceId) {

    const records =
      getAttendance();

    const record =
      records.find(
        (item) =>
          item.id === attendanceId
      );

    if (!record) return;

    alert(
      `Attendance Details\n\n` +
      `Attendance ID: ${record.id}\n` +
      `Member: ${record.memberName}\n` +
      `Date: ${formatDate(record.date)}\n` +
      `Check-in: ${formatTime(record.checkIn)}\n` +
      `Check-out: ${formatTime(record.checkOut)}\n` +
      `Status: ${getStatusText(record.status)}`
    );

    return;
  }

  // Existing HTML record
  const cells =
    row.querySelectorAll("td");

  const id =
    cells[0]?.innerText.trim();

  const member =
    cells[1]?.innerText.trim();

  const date =
    cells[2]?.innerText.trim();

  const checkIn =
    cells[3]?.innerText.trim();

  const checkOut =
    cells[4]?.innerText.trim();

  const status =
    cells[5]?.innerText.trim();

  alert(
    `Attendance Details\n\n` +
    `Attendance ID: ${id}\n` +
    `Member: ${member}\n` +
    `Date: ${date}\n` +
    `Check-in: ${checkIn}\n` +
    `Check-out: ${checkOut}\n` +
    `Status: ${status}`
  );
}

// ========================================
// EDIT ATTENDANCE
// ========================================

function editAttendance(row) {

  const attendanceId =
    row.dataset.attendanceId;

  // Protect hard-coded record
  if (!attendanceId) {

    alert(
      "This attendance record is part of the original HTML data and cannot be edited."
    );

    return;
  }

  const records =
    getAttendance();

  const record =
    records.find(
      (item) =>
        item.id === attendanceId
    );

  if (!record) return;

  const member =
    prompt(
      "Enter Member Name:",
      record.memberName
    );

  if (member === null) return;

  const date =
    prompt(
      "Enter Attendance Date (YYYY-MM-DD):",
      record.date
    );

  if (date === null) return;

  const checkIn =
    prompt(
      "Enter Check-in Time (HH:MM):",
      record.checkIn
    );

  if (checkIn === null) return;

  const checkOut =
    prompt(
      "Enter Check-out Time (HH:MM):",
      record.checkOut
    );

  if (checkOut === null) return;

  const status =
    prompt(
      "Enter Status (present / absent / late):",
      record.status
    );

  if (status === null) return;

  const cleanStatus =
    status
      .toLowerCase()
      .trim();

  if (
    ![
      "present",
      "absent",
      "late"
    ].includes(cleanStatus)
  ) {

    alert(
      "Invalid status. Use present, absent or late."
    );

    return;
  }

  if (!member.trim() || !date.trim()) {

    alert(
      "Member and date cannot be empty."
    );

    return;
  }

  record.memberName =
    member.trim();

  record.date =
    date.trim();

  record.checkIn =
    checkIn.trim();

  record.checkOut =
    checkOut.trim();

  record.status =
    cleanStatus;

  saveAttendance(records);

  const newRow =
    createAttendanceRow(record);

  row.replaceWith(newRow);

  updateAttendanceSummary();

  filterAttendance();

  alert(
    "Attendance updated successfully."
  );
}

// ========================================
// DELETE ATTENDANCE
// ========================================

function deleteAttendance(row) {

  const attendanceId =
    row.dataset.attendanceId;

  // Protect hard-coded record
  if (!attendanceId) {

    alert(
      "This attendance record is part of the original HTML data and cannot be deleted."
    );

    return;
  }

  const records =
    getAttendance();

  const record =
    records.find(
      (item) =>
        item.id === attendanceId
    );

  if (!record) return;

  const confirmDelete =
    confirm(
      `Delete attendance ${record.id}?`
    );

  if (!confirmDelete) return;

  const updatedRecords =
    records.filter(
      (item) =>
        item.id !== attendanceId
    );

  saveAttendance(updatedRecords);

  row.remove();

  updateAttendanceSummary();

  alert(
    "Attendance deleted successfully."
  );
}

// ========================================
// TABLE ACTIONS
// ========================================

function setupAttendanceActions() {

  const tableBody =
    document.getElementById(
      "attendanceTableBody"
    );

  if (!tableBody) return;

  if (
    tableBody.dataset.actionsReady ===
    "true"
  ) {
    return;
  }

  tableBody.dataset.actionsReady =
    "true";

  tableBody.addEventListener(
    "click",
    function (event) {

      const row =
        event.target.closest("tr");

      if (!row) return;

      if (
        event.target.closest(
          ".view-attendance"
        )
      ) {

        viewAttendance(row);
      }

      if (
        event.target.closest(
          ".edit-attendance"
        )
      ) {

        editAttendance(row);
      }

      if (
        event.target.closest(
          ".delete-attendance"
        )
      ) {

        deleteAttendance(row);
      }
    }
  );
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupAttendanceEvents() {

  const markButton =
    document.getElementById(
      "markAttendanceBtn"
    );

  const closeButton =
    document.getElementById(
      "closeAttendanceModal"
    );

  const cancelButton =
    document.getElementById(
      "cancelAttendance"
    );

  const saveButton =
    document.getElementById(
      "saveAttendance"
    );

  const searchInput =
    document.getElementById(
      "attendanceSearch"
    );

  const dateFilter =
    document.getElementById(
      "attendanceDateFilter"
    );

  const statusFilter =
    document.getElementById(
      "attendanceStatusFilter"
    );

  if (markButton) {

    markButton.addEventListener(
      "click",
      openAttendanceModal
    );
  }

  if (closeButton) {

    closeButton.addEventListener(
      "click",closeAttendanceModal);
    }
    if(saveButton){
        saveButton.addEventListener("click",addAttendance);

    }
    if(searchInput){
        searchInput.addEventListener("input",filterAttendance);
    }
    if(dateFilter){
        dateFilter.addEventListener("change",filterAttendance);
    }
}
//=======================
//Strat Attendance page
//========================
async function startAttendancePage() {
    await loadComponents();
    loadSavedAttendance();
    updateAttendanceSummary();
    setupAttendanceActions();
    setupAttendanceEvents();
    
}
startAttendancePage();
