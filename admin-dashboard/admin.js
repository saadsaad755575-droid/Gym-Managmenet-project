/* =========================================
   LOAD REUSABLE COMPONENTS
========================================= */

function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Component not found: " + filePath);
            }
            return response.text();
        })
        .then(function (data) {
            const element = document.getElementById(elementId);

            if (element) {
                element.innerHTML = data;
            }

            if (elementId === "cards") {
                updateDashboardCards();
            }
        })
        .catch(function (error) {
            console.error(error);
        });
}

loadComponent("sidebar", "../components/sidebar/sidebar.html");
loadComponent("navbar", "../components/navbar/navbar.html");
loadComponent("cards", "../components/card/card.html");
loadComponent("table", "../components/table/table.html");


/* =========================================
   LOCAL STORAGE HELPERS
========================================= */

function getStorageArray(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Storage error:", key, error);
        return [];
    }
}

function getElement(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = getElement(id);

    if (element) {
        element.textContent = value;
    }
}

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

function formatRupees(amount) {
    return "Rs. " + Math.round(amount).toLocaleString("en-PK");
}

function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function parseDate(value) {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}


/* =========================================
   UPDATE MAIN DASHBOARD CARDS
========================================= */

function updateDashboardCards() {
    const members = getStorageArray("gymMembers");
    const memberships = getStorageArray("gymMemberships");
    const payments = getStorageArray("gymPayments");
    const attendance = getStorageArray("gymAttendance");

    // TOTAL MEMBERS
    setText("totalMembersCard", members.length);

    // TOTAL TRAINERS
    let trainers = getStorageArray("gymTrainers");

    if (trainers.length === 0) {
        const trainerNames = members
            .map(function (member) {
                return String(member.trainer || "").trim();
            })
            .filter(function (trainer) {
                return trainer &&
                    trainer.toLowerCase() !== "not assigned";
            });

        trainers = [...new Set(trainerNames)];
    }

    setText("totalTrainersCard", trainers.length);

    // ACTIVE MEMBERSHIPS
    let activeMemberships;

    if (memberships.length > 0) {
        activeMemberships = memberships.filter(function (membership) {
            return getMembershipStatus(membership) === "active";
        }).length;
    } else {
        activeMemberships = members.filter(function (member) {
            return normalize(member.status) === "active";
        }).length;
    }

    setText("activeMembershipsCard", activeMemberships);

    // PENDING PAYMENTS
    const pendingPayments = payments.filter(function (payment) {
        return normalize(payment.status) === "pending";
    }).length;

    setText("pendingPaymentsCard", pendingPayments);

    // EXPIRED MEMBERSHIPS
    let expiredMemberships;

    if (memberships.length > 0) {
        expiredMemberships = memberships.filter(function (membership) {
            return getMembershipStatus(membership) === "expired";
        }).length;
    } else {
        expiredMemberships = members.filter(function (member) {
            return normalize(member.status) === "expired";
        }).length;
    }

    setText("expiredMembershipsCard", expiredMemberships);

    // TODAY'S ATTENDANCE
    const today = getLocalDateKey(new Date());

    const todayAttendance = attendance.filter(function (record) {
        const attendanceDate =
            record.date ||
            record.attendanceDate ||
            record.checkInDate;

        if (!attendanceDate) {
            return false;
        }

        return String(attendanceDate).startsWith(today);
    });

    setText("todayAttendanceCard", todayAttendance.length);
}


/* =========================================
   MEMBERSHIP STATUS HELPER
========================================= */

function getMembershipStatus(membership) {
    const today = getLocalDateKey(new Date());

    const paymentStatus = normalize(
        membership.paymentStatus || membership.status
    );

    if (paymentStatus === "pending") {
        return "pending";
    }

    if (
        paymentStatus === "overdue" ||
        paymentStatus === "expired"
    ) {
        return "expired";
    }

    const expiryDate = membership.expiryDate;

    if (expiryDate && String(expiryDate).slice(0, 10) < today) {
        return "expired";
    }

    if (
        paymentStatus === "active" ||
        paymentStatus === "paid" ||
        paymentStatus === "completed" ||
        paymentStatus === "success"
    ) {
        return "active";
    }

    // When status is missing, use the expiry date if available.
    if (expiryDate) {
        return "active";
    }

    return "unknown";
}


/* =========================================
   MEMBERSHIP OVERVIEW CHART
========================================= */

function updateMembershipChart() {
    const memberships = getStorageArray("gymMemberships");
    const members = getStorageArray("gymMembers");

    let active = 0;
    let expired = 0;
    let pending = 0;
    let total = 0;

    if (memberships.length > 0) {
        memberships.forEach(function (membership) {
            const status = getMembershipStatus(membership);

            if (status === "active") {
                active++;
            } else if (status === "expired") {
                expired++;
            } else if (status === "pending") {
                pending++;
            }
        });

        total = memberships.length;
    } else {
        // Fallback for projects storing status on gymMembers.
        members.forEach(function (member) {
            const status = normalize(member.status);

            if (status === "active") {
                active++;
            } else if (status === "expired") {
                expired++;
            } else if (status === "pending") {
                pending++;
            }
        });

        total = members.length;
    }

    setText("membershipTotal", total);
    setText("membershipActive", active);
    setText("membershipExpired", expired);
    setText("membershipPending", pending);

    const donut = document.querySelector(".membership-donut");

    if (donut) {
        if (total === 0) {
            donut.style.background =
                "conic-gradient(#393939 0deg 360deg)";
        } else {
            const activeDegrees = (active / total) * 360;
            const expiredDegrees = (expired / total) * 360;
            const pendingDegrees = (pending / total) * 360;

            const firstStop = activeDegrees;
            const secondStop = firstStop + expiredDegrees;
            const thirdStop = secondStop + pendingDegrees;

            donut.style.background =
                "conic-gradient(" +
                "#d4af37 0deg " + firstStop + "deg, " +
                "#ef5350 " + firstStop + "deg " + secondStop + "deg, " +
                "#f0a43a " + secondStop + "deg " + thirdStop + "deg, " +
                "#393939 " + thirdStop + "deg 360deg)";
        }
    }
}


/* =========================================
   MONTHLY REVENUE CHART
========================================= */

function getPaymentDate(payment) {
    return (
        payment.paymentDate ||
        payment.date ||
        payment.createdAt ||
        payment.transactionDate ||
        ""
    );
}

function getPaymentAmount(payment) {
    const amount = Number(
        payment.amount ??
        payment.totalAmount ??
        payment.price ??
        0
    );

    return Number.isFinite(amount) ? amount : 0;
}

function isPaidPayment(payment) {
    const status = normalize(payment.status);

    return [
        "paid",
        "completed",
        "success",
        "successful"
    ].includes(status);
}

function getLastSixMonths() {
    const months = [];
    const now = new Date();

    for (let offset = 5; offset >= 0; offset--) {
        const date = new Date(
            now.getFullYear(),
            now.getMonth() - offset,
            1
        );

        months.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            label: date.toLocaleString("en-US", {
                month: "short"
            }),
            total: 0
        });
    }

    return months;
}

function updateRevenueChart() {
    const payments = getStorageArray("gymPayments");
    const memberships = getStorageArray("gymMemberships");
    const months = getLastSixMonths();

    // Prefer payment records when available.
    // If no payment records exist, use paid membership records.
    let revenueRecords = payments;

    if (revenueRecords.length === 0) {
        revenueRecords = memberships;
    }

    revenueRecords.forEach(function (record) {
        const status = normalize(
            record.status || record.paymentStatus
        );

        const paid = [
            "paid",
            "completed",
            "success",
            "successful"
        ].includes(status);

        if (!paid) {
            return;
        }

        const dateValue =
            getPaymentDate(record) ||
            record.startDate;

        const date = parseDate(dateValue);

        if (!date) {
            return;
        }

        const monthData = months.find(function (item) {
            return (
                item.year === date.getFullYear() &&
                item.month === date.getMonth()
            );
        });

        if (monthData) {
            monthData.total += getPaymentAmount(record);
        }
    });

    const currentMonth = months[months.length - 1];

    setText(
        "monthlyRevenueValue",
        formatRupees(currentMonth ? currentMonth.total : 0)
    );

    // Update the month labels dynamically.
    const monthLabels = document.querySelectorAll(".chart-months span");

    monthLabels.forEach(function (label, index) {
        if (months[index]) {
            label.textContent = months[index].label;
        }
    });

    renderRevenuePoints(months);
}

function renderRevenuePoints(months) {
    const chartArea = document.querySelector(".chart-area");

    if (!chartArea || !months.length) {
        return;
    }

    const values = months.map(function (month) {
        return month.total;
    });

    const maxValue = Math.max(...values, 1);

    const xPositions = [5, 23, 41, 59, 77, 95];

    // Keep all six points visible, including when revenue is zero.
    const yPositions = values.map(function (value) {
        return 10 + (value / maxValue) * 75;
    });

    chartArea.style.position = "relative";

    let svg = chartArea.querySelector(".dynamic-revenue-svg");

    if (!svg) {
        svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        svg.setAttribute("class", "dynamic-revenue-svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "none");

        svg.style.position = "absolute";
        svg.style.inset = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.overflow = "visible";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "1";

        chartArea.appendChild(svg);
    }

    // Hide the old static line; the SVG draws the live line.
    const oldLine = chartArea.querySelector(".chart-line");

    if (oldLine) {
        oldLine.style.display = "none";
    }

    // Remove old SVG drawing.
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    const polyline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
    );

    const points = months.map(function (month, index) {
        return xPositions[index] + "," + (100 - yPositions[index]);
    }).join(" ");

    polyline.setAttribute("points", points);
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "#d4af37");
    polyline.setAttribute("stroke-width", "2.5");
    polyline.setAttribute("vector-effect", "non-scaling-stroke");

    svg.appendChild(polyline);

    // Position the existing CSS dots to match the real values.
    months.forEach(function (month, index) {
        const point = chartArea.querySelector(".point-" + (index + 1));

        if (!point) {
            return;
        }

        point.style.position = "absolute";
        point.style.left = xPositions[index] + "%";
        point.style.bottom = yPositions[index] + "%";
        point.style.transform = "translate(-50%, 50%)";
        point.style.zIndex = "2";
        point.title =
            month.label + " revenue: " + formatRupees(month.total);
    });
}


/* =========================================
   TRAINER STATUS OVERVIEW CHART
========================================= */

function getTrainerStatus(trainer) {
    const rawStatus = normalize(
        trainer.status ||
        trainer.availability ||
        trainer.trainerStatus ||
        trainer.workStatus
    );

    if (
        rawStatus.includes("limited") ||
        rawStatus.includes("partial") ||
        rawStatus.includes("slot")
    ) {
        return "limited";
    }

    if (
        rawStatus.includes("available") ||
        rawStatus === "free"
    ) {
        return "available";
    }

    if (
        rawStatus.includes("busy") ||
        rawStatus.includes("assigned") ||
        rawStatus.includes("unavailable") ||
        rawStatus.includes("occupied")
    ) {
        return "busy";
    }

    return "unknown";
}

function updateTrainerChart() {
    const trainers = getStorageArray("gymTrainers");

    let available = 0;
    let limited = 0;
    let busy = 0;

    trainers.forEach(function (trainer) {
        const status = getTrainerStatus(trainer);

        if (status === "available") {
            available++;
        } else if (status === "limited") {
            limited++;
        } else if (status === "busy") {
            busy++;
        }
    });

    setText("trainerTotal", trainers.length);
    setText("trainerAvailable", available);
    setText("trainerLimited", limited);
    setText("trainerBusy", busy);

    const donut = document.querySelector(".trainer-donut");

    if (donut) {
        const total = trainers.length;

        if (total === 0) {
            donut.style.background =
                "conic-gradient(#393939 0deg 360deg)";
        } else {
            const availableDegrees = (available / total) * 360;
            const limitedDegrees = (limited / total) * 360;
            const busyDegrees = (busy / total) * 360;

            const firstStop = availableDegrees;
            const secondStop = firstStop + limitedDegrees;
            const thirdStop = secondStop + busyDegrees;

            donut.style.background =
                "conic-gradient(" +
                "#d4af37 0deg " + firstStop + "deg, " +
                "#f0a43a " + firstStop + "deg " + secondStop + "deg, " +
                "#ef5350 " + secondStop + "deg " + thirdStop + "deg, " +
                "#393939 " + thirdStop + "deg 360deg)";
        }
    }
}


/* =========================================
   PENDING PAYMENTS TABLE
========================================= */

function renderPendingPayments() {
    const tbody = getElement("pendingPaymentsTableBody");

    if (!tbody) {
        return;
    }

    const payments = getStorageArray("gymPayments");

    const pending = payments.filter(function (payment) {
        return normalize(payment.status) === "pending";
    });

    tbody.innerHTML = "";

    if (pending.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="3">No pending payments found</td></tr>';
        return;
    }

    pending.slice(0, 5).forEach(function (payment) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = payment.memberName || payment.memberId || "Member";

        const amountCell = document.createElement("td");
        amountCell.textContent = formatRupees(getPaymentAmount(payment));

        const statusCell = document.createElement("td");
        statusCell.textContent = payment.status || "Pending";

        row.appendChild(nameCell);
        row.appendChild(amountCell);
        row.appendChild(statusCell);

        tbody.appendChild(row);
    });
}


/* =========================================
   TODAY'S ATTENDANCE TABLE
========================================= */

function renderTodayAttendance() {
    const tbody = getElement("todayAttendanceTableBody");

    if (!tbody) {
        return;
    }

    const attendance = getStorageArray("gymAttendance");
    const members = getStorageArray("gymMembers");
    const today = getLocalDateKey(new Date());

    const records = attendance.filter(function (record) {
        const recordDate =
            record.date ||
            record.attendanceDate ||
            record.checkInDate ||
            "";

        return String(recordDate).startsWith(today);
    });

    tbody.innerHTML = "";

    if (records.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="3">No attendance recorded today</td></tr>';
        return;
    }

    records.slice(0, 5).forEach(function (record) {
        const row = document.createElement("tr");

        const member = members.find(function (item) {
            return String(item.id || item.memberId) ===
                String(record.memberId || record.id);
        });

        const nameCell = document.createElement("td");
        nameCell.textContent =
            record.memberName ||
            (member && (member.name || member.memberName)) ||
            record.memberId ||
            "Member";

        const timeCell = document.createElement("td");
        timeCell.textContent =
            record.checkInTime ||
            record.time ||
            record.checkIn ||
            "--";

        const statusCell = document.createElement("td");
        statusCell.textContent = record.status || "Present";

        row.appendChild(nameCell);
        row.appendChild(timeCell);
        row.appendChild(statusCell);

        tbody.appendChild(row);
    });
}


/* =========================================
   REFRESH ALL DASHBOARD STATISTICS
========================================= */

function renderDashboardStatistics() {
    updateMembershipChart();
    updateRevenueChart();
    updateTrainerChart();
    renderPendingPayments();
    renderTodayAttendance();
}

function refreshDashboard() {
    updateDashboardCards();
    renderDashboardStatistics();
}


/* =========================================
   QUICK ACTIONS
========================================= */

function navigateToPage(path) {
    window.location.href = path;
}

const addNewMemberBtn = getElement("addNewMemberBtn");

if (addNewMemberBtn) {
    addNewMemberBtn.addEventListener("click", function () {
        navigateToPage(
            "../admin-dashboard/pages/trainers/Member/Member.html"
        );
    });
}

const addNewTrainerBtn = getElement("addNewTrainerBtn");

if (addNewTrainerBtn) {
    addNewTrainerBtn.addEventListener("click", function () {
        navigateToPage(
            "../admin-dashboard/pages/trainers/trainer.html"
        );
    });
}

const newMembershipBtn = getElement("newMembershipBtn");

if (newMembershipBtn) {
    newMembershipBtn.addEventListener("click", function () {
        navigateToPage(
            "../admin-dashboard/pages/membership/membership.html"
        );
    });
}

const markAttendanceBtn = getElement("markAttendanceBtn");

if (markAttendanceBtn) {
    markAttendanceBtn.addEventListener("click", function () {
        navigateToPage(
            "../admin-dashboard/pages/Attendance/Attendance.html"
        );
    });
}


/* =========================================
   AUTO REFRESH
========================================= */

refreshDashboard();

window.addEventListener("storage", function () {
    refreshDashboard();
});

window.addEventListener("focus", function () {
    refreshDashboard();
});

window.addEventListener("pageshow", function () {
    refreshDashboard();
});

 
