// ========================================
// REPORTS STORAGE
// ========================================

const REPORTS_STORAGE_KEY = "gymReports";

const MEMBER_STORAGE_KEY = "gymMembers";
const MEMBERSHIP_STORAGE_KEY = "gymMemberships";
const PAYMENT_STORAGE_KEY = "gymPayments";
const ATTENDANCE_STORAGE_KEY = "gymAttendance";


// ========================================
// GET DATA FROM LOCAL STORAGE
// ========================================

function getStorageData(key) {
    try {
        const data = localStorage.getItem(key);

        if (!data) {
            return [];
        }

        const parsedData = JSON.parse(data);

        return Array.isArray(parsedData) ? parsedData : [];

    } catch (error) {
        console.error(`Error reading ${key}:`, error);
        return [];
    }
}


// ========================================
// LOAD ALL DATA
// ========================================

function getMembers() {
    return getStorageData(MEMBER_STORAGE_KEY);
}

function getMemberships() {
    return getStorageData(MEMBERSHIP_STORAGE_KEY);
}

function getPayments() {
    return getStorageData(PAYMENT_STORAGE_KEY);
}

function getAttendance() {
    return getStorageData(ATTENDANCE_STORAGE_KEY);
}


// ========================================
// REPORT SUMMARY
// ========================================

function updateReportSummary() {

    const members = getMembers();
    const memberships = getMemberships();
    const payments = getPayments();
    const attendance = getAttendance();


    // ------------------------------------
    // TOTAL MEMBERS
    // ------------------------------------

    const totalMembers = members.length;


    // ------------------------------------
    // ACTIVE MEMBERSHIPS
    // ------------------------------------

    const activeMemberships = memberships.filter(membership => {

        const status = String(
            membership.status || ""
        ).toLowerCase();

        return status === "active";

    }).length;


    // ------------------------------------
    // PENDING PAYMENTS
    // ------------------------------------

    const pendingPayments = payments.filter(payment => {

        const status = String(
            payment.status || ""
        ).toLowerCase();

        return (
            status === "pending" ||
            status === "unpaid" ||
            status === "due"
        );

    }).length;


    // ------------------------------------
    // ATTENDANCE RATE
    // ------------------------------------

    let attendanceRate = 0;

    if (attendance.length > 0) {

        const presentRecords = attendance.filter(record => {

            const status = String(
                record.status || ""
            ).toLowerCase();

            return status === "present";

        }).length;

        attendanceRate = Math.round(
            (presentRecords / attendance.length) * 100
        );
    }


    // ------------------------------------
    // UPDATE HTML
    // ------------------------------------

    const summaryItems =
        document.querySelectorAll(".summary-item strong");


    if (summaryItems.length >= 4) {

        summaryItems[0].textContent = totalMembers;

        summaryItems[1].textContent = activeMemberships;

        summaryItems[2].textContent = pendingPayments;

        summaryItems[3].textContent =
            attendanceRate + "%";
    }


    // ------------------------------------
    // SAVE CALCULATED REPORT SUMMARY
    // ------------------------------------

    const reportSummary = {

        totalMembers,

        activeMemberships,

        pendingPayments,

        attendanceRate,

        updatedAt: new Date().toISOString()

    };


    localStorage.setItem(
        REPORTS_STORAGE_KEY,
        JSON.stringify(reportSummary)
    );
}


// ========================================
// GENERATE MEMBER REPORT
// ========================================

function generateMemberReport() {

    const members = getMembers();

    if (members.length === 0) {

        showReportMessage(
            "No member records found."
        );

        return;
    }

    let reportRows = "";

    members.forEach((member, index) => {

        reportRows += `
            <tr>
                <td>${index + 1}</td>
                <td>${member.id || "-"}</td>
                <td>${member.name || "-"}</td>
                <td>${member.email || "-"}</td>
                <td>${member.phone || "-"}</td>
                <td>${member.status || "-"}</td>
            </tr>
        `;
    });


    openReportWindow(
        "Member Report",
        `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
                ${reportRows}
            </tbody>
        </table>
        `
    );
}


// ========================================
// GENERATE MEMBERSHIP REPORT
// ========================================

function generateMembershipReport() {

    const memberships = getMemberships();

    if (memberships.length === 0) {

        showReportMessage(
            "No membership records found."
        );

        return;
    }

    let reportRows = "";

    memberships.forEach((membership, index) => {

        reportRows += `
            <tr>
                <td>${index + 1}</td>
                <td>${membership.id || "-"}</td>
                <td>${membership.memberName || membership.name || "-"}</td>
                <td>${membership.plan || membership.type || "-"}</td>
                <td>${membership.startDate || "-"}</td>
                <td>${membership.endDate || "-"}</td>
                <td>${membership.status || "-"}</td>
            </tr>
        `;
    });


    openReportWindow(
        "Membership Report",
        `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Member</th>
                    <th>Plan</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
                ${reportRows}
            </tbody>
        </table>
        `
    );
}


// ========================================
// GENERATE PAYMENT REPORT
// ========================================

function generatePaymentReport() {

    const payments = getPayments();

    if (payments.length === 0) {

        showReportMessage(
            "No payment records found."
        );

        return;
    }

    let reportRows = "";

    payments.forEach((payment, index) => {

        reportRows += `
            <tr>
                <td>${index + 1}</td>
                <td>${payment.id || "-"}</td>
                <td>${payment.memberName || payment.name || "-"}</td>
                <td>Rs. ${payment.amount || 0}</td>
                <td>${payment.date || "-"}</td>
                <td>${payment.status || "-"}</td>
            </tr>
        `;
    });


    openReportWindow(
        "Payment Report",
        `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Member</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
                ${reportRows}
            </tbody>
        </table>
        `
    );
}


// ========================================
// GENERATE ATTENDANCE REPORT
// ========================================

function generateAttendanceReport() {

    const attendance = getAttendance();

    if (attendance.length === 0) {

        showReportMessage(
            "No attendance records found."
        );

        return;
    }

    let reportRows = "";

    attendance.forEach((record, index) => {

        reportRows += `
            <tr>
                <td>${index + 1}</td>
                <td>${record.id || "-"}</td>
                <td>${record.memberId || "-"}</td>
                <td>${record.memberName || "-"}</td>
                <td>${record.date || "-"}</td>
                <td>${record.checkIn || "-"}</td>
                <td>${record.checkOut || "-"}</td>
                <td>${record.status || "-"}</td>
            </tr>
        `;
    });


    openReportWindow(
        "Attendance Report",
        `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Member ID</th>
                    <th>Member Name</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
                ${reportRows}
            </tbody>
        </table>
        `
    );
}


// ========================================
// OPEN REPORT WINDOW
// ========================================

function openReportWindow(title, content) {

    const reportWindow = window.open(
        "",
        "_blank",
        "width=1200,height=750"
    );


    reportWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>${title}</title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    background: #f5f5f5;
                    color: #222;
                }

                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }

                h1 {
                    margin: 0;
                }

                .date {
                    color: #666;
                    font-size: 14px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                }

                th,
                td {
                    padding: 12px;
                    border: 1px solid #ddd;
                    text-align: left;
                }

                th {
                    background: #222;
                    color: white;
                }

                tr:nth-child(even) {
                    background: #f8f8f8;
                }

                .print-btn {
                    padding: 10px 18px;
                    border: none;
                    cursor: pointer;
                    background: #222;
                    color: white;
                    border-radius: 5px;
                }

                @media print {

                    .print-btn {
                        display: none;
                    }

                    body {
                        background: white;
                    }
                }

            </style>

        </head>


        <body>

            <div class="report-header">

                <div>

                    <h1>${title}</h1>

                    <div class="date">
                        Generated:
                        ${new Date().toLocaleDateString()}
                    </div>

                </div>

                <button
                    class="print-btn"
                    onclick="window.print()"
                >
                    Print Report
                </button>

            </div>

            ${content}

        </body>

        </html>

    `);


    reportWindow.document.close();
}


// ========================================
// REPORT MESSAGE
// ========================================

function showReportMessage(message) {

    alert(message);
}


// ========================================
// CONNECT VIEW REPORT BUTTONS
// ========================================

function setupReportButtons() {

    const reportButtons =
        document.querySelectorAll(".report-btn");


    if (reportButtons.length < 4) {
        return;
    }


    // Member Report
    reportButtons[0].addEventListener(
        "click",
        generateMemberReport
    );


    // Membership Report
    reportButtons[1].addEventListener(
        "click",
        generateMembershipReport
    );


    // Payment Report
    reportButtons[2].addEventListener(
        "click",
        generatePaymentReport
    );


    // Attendance Report
    reportButtons[3].addEventListener(
        "click",
        generateAttendanceReport
    );
}


// ========================================
// GENERATE REPORT BUTTON
// ========================================

function setupGenerateButton() {

    const generateButton =
        document.querySelector(".generate-btn");


    if (!generateButton) {
        return;
    }


    generateButton.addEventListener(
        "click",
        function () {

            updateReportSummary();

            alert(
                "Report summary generated successfully."
            );

        }
    );
}


// ========================================
// AUTOMATIC UPDATE
// ========================================

function refreshReports() {

    updateReportSummary();

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        refreshReports();

        setupReportButtons();

        setupGenerateButton();

    }
);
