


// ========================================
// GYM MANAGEMENT SYSTEM
// STATISTICS MANAGEMENT
// ========================================


// ========================================
// STORAGE KEYS
// ========================================

const STATISTICS_STORAGE_KEY = "gymStatistics";
const ATTENDANCE_STORAGE_KEY = "attendance";

const POSSIBLE_MEMBER_KEYS = [
    "gymMembers",
    "members",
    "gymMembersData"
];

const POSSIBLE_MEMBERSHIP_KEYS = [
    "gymMemberships",
    "memberships",
    "gymMembershipData"
];

const POSSIBLE_PAYMENT_KEYS = [
    "gymPayments",
    "payments",
    "gymPaymentData"
];

const POSSIBLE_TRAINER_KEYS = [
    "gymTrainers",
    "trainers",
    "gymTrainerData"
];


// ========================================
// GET LOCAL STORAGE DATA
// ========================================

function getStorageData(possibleKeys) {

    for (const key of possibleKeys) {

        const data = localStorage.getItem(key);

        if (data) {

            try {

                const parsed = JSON.parse(data);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

            } catch (error) {

                console.error(
                    "Invalid localStorage data:",
                    key
                );

            }
        }
    }

    return [];
}


// ========================================
// GET MEMBERS
// ========================================

function getMembers() {

    return getStorageData(
        POSSIBLE_MEMBER_KEYS
    );
}


// ========================================
// GET MEMBERSHIPS
// ========================================

function getMemberships() {

    return getStorageData(
        POSSIBLE_MEMBERSHIP_KEYS
    );
}


// ========================================
// GET PAYMENTS
// ========================================

function getPayments() {

    return getStorageData(
        POSSIBLE_PAYMENT_KEYS
    );
}


// ========================================
// GET ATTENDANCE
// ========================================

function getAttendance() {

    return JSON.parse(
        localStorage.getItem(
            ATTENDANCE_STORAGE_KEY
        )
    ) || [];
}


// ========================================
// GET TRAINERS
// ========================================

function getTrainers() {

    return getStorageData(
        POSSIBLE_TRAINER_KEYS
    );
}


// ========================================
// SAFE NUMBER
// ========================================

function getNumber(value) {

    if (typeof value === "number") {
        return value;
    }

    if (!value) {
        return 0;
    }

    return Number(
        String(value)
            .replace(/Rs\.?/gi, "")
            .replace(/,/g, "")
            .replace(/PKR/gi, "")
            .trim()
    ) || 0;
}


// ========================================
// FIND ELEMENT
// ========================================

function getElement(selector) {

    return document.querySelector(selector);
}


// ========================================
// UPDATE TEXT
// ========================================

function updateText(selector, value) {

    const element =
        getElement(selector);

    if (element) {
        element.textContent = value;
    }
}


// ========================================
// TOTAL MEMBERS
// ========================================

function updateTotalMembers() {

    const members =
        getMembers();

    updateText(
        ".statistics-cards .stat-card:nth-child(1) h2",
        members.length
    );
}


// ========================================
// ACTIVE MEMBERSHIPS
// ========================================

function updateActiveMemberships() {

    const memberships =
        getMemberships();

    let activeCount = 0;

    memberships.forEach((membership) => {

        const status =
            String(
                membership.status ||
                membership.membershipStatus ||
                ""
            ).toLowerCase().trim();

        if (status === "active") {
            activeCount++;
        }

    });

    updateText(
        ".statistics-cards .stat-card:nth-child(2) h2",
        activeCount
    );
}


// ========================================
// MONTH DATE CHECK
// ========================================

function isCurrentMonth(dateValue) {

    if (!dateValue) {
        return false;
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
        return false;
    }

    const now =
        new Date();

    return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
}


// ========================================
// MONTHLY REVENUE
// ========================================

function calculateMonthlyRevenue() {

    const payments =
        getPayments();

    let total = 0;

    payments.forEach((payment) => {

        const status =
            String(
                payment.status ||
                payment.paymentStatus ||
                ""
            ).toLowerCase().trim();

        const paymentDate =
            payment.date ||
            payment.paymentDate ||
            payment.createdAt;

        // Paid payments only
        if (
            status &&
            ![
                "paid",
                "completed",
                "success",
                "successful"
            ].includes(status)
        ) {
            return;
        }

        if (
            paymentDate &&
            !isCurrentMonth(paymentDate)
        ) {
            return;
        }

        const amount =
            payment.amount ??
            payment.paymentAmount ??
            payment.price ??
            payment.total ??
            0;

        total += getNumber(amount);

    });

    return total;
}


// ========================================
// FORMAT RUPEES
// ========================================

function formatRupees(value) {

    return (
        "Rs. " +
        Number(value).toLocaleString("en-PK")
    );
}


// ========================================
// UPDATE REVENUE CARD
// ========================================

function updateRevenueCard() {

    const revenue =
        calculateMonthlyRevenue();

    updateText(
        ".statistics-cards .stat-card:nth-child(3) h2",
        formatRupees(revenue)
    );

    updateText(
        ".revenue-content h3",
        formatRupees(revenue)
    );
}


// ========================================
// TODAY DATE
// ========================================

function getTodayDate() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


// ========================================
// TODAY'S ATTENDANCE
// ========================================

function updateTodayAttendance() {

    const attendance =
        getAttendance();

    const today =
        getTodayDate();

    let count = 0;

    attendance.forEach((record) => {

        if (
            record.date === today
        ) {
            count++;
        }

    });

    updateText(
        ".statistics-cards .stat-card:nth-child(4) h2",
        count
    );
}


// ========================================
// MEMBER GROWTH
// ========================================

function updateMemberGrowth() {

    const members =
        getMembers();

    const bars =
        document.querySelectorAll(
            ".member-growth .chart-bar"
        );

    if (!bars.length) {
        return;
    }

    const monthlyCounts =
        new Array(12).fill(0);

    members.forEach((member) => {

        const date =
            member.joinDate ||
            member.registrationDate ||
            member.dateJoined ||
            member.createdAt ||
            member.date;

        if (!date) {
            return;
        }

        const memberDate =
            new Date(date);

        if (
            isNaN(
                memberDate.getTime()
            )
        ) {
            return;
        }

        monthlyCounts[
            memberDate.getMonth()
        ]++;

    });


    const maximum =
        Math.max(
            ...monthlyCounts,
            1
        );


    bars.forEach((bar, index) => {

        const span =
            bar.querySelector("span");

        if (!span) {
            return;
        }

        const count =
            monthlyCounts[index];

        let height =
            (count / maximum) * 100;

        // Keep zero values visible
        if (
            count === 0
        ) {
            height = 3;
        }

        span.style.height =
            height + "%";

        span.title =
            count +
            " new member" +
            (count === 1 ? "" : "s");

    });
}


// ========================================
// MEMBERSHIP STATISTICS
// ========================================

function updateMembershipStatistics() {

    const memberships =
        getMemberships();

    const total =
        memberships.length;

    const categories = {
        premium: 0,
        standard: 0,
        basic: 0
    };


    memberships.forEach((membership) => {

        const type =
            String(
                membership.type ||
                membership.plan ||
                membership.membershipType ||
                membership.membershipPlan ||
                ""
            ).toLowerCase().trim();

        if (
            type.includes("premium")
        ) {
            categories.premium++;

        } else if (
            type.includes("standard")
        ) {
            categories.standard++;

        } else if (
            type.includes("basic")
        ) {
            categories.basic++;
        }

    });


    const items =
        document.querySelectorAll(
            ".membership-list .membership-item"
        );

    const progressBars =
        document.querySelectorAll(
            ".membership-list .membership-progress span"
        );


    const values = [
        categories.premium,
        categories.standard,
        categories.basic
    ];


    items.forEach((item, index) => {

        const percentage =
            total > 0
                ? Math.round(
                    (values[index] / total) * 100
                )
                : 0;

        const strong =
            item.querySelector("strong");

        if (strong) {
            strong.textContent =
                percentage + "%";
        }

        if (
            progressBars[index]
        ) {
            progressBars[index].style.width =
                percentage + "%";
        }

    });
}


// ========================================
// REVENUE CHART
// ========================================

function updateRevenueChart() {

    const payments =
        getPayments();

    const bars =
        document.querySelectorAll(
            ".revenue-bars span"
        );

    if (!bars.length) {
        return;
    }


    const monthlyRevenue =
        new Array(12).fill(0);


    payments.forEach((payment) => {

        const paymentDate =
            payment.date ||
            payment.paymentDate ||
            payment.createdAt;

        if (!paymentDate) {
            return;
        }

        const date =
            new Date(paymentDate);

        if (
            isNaN(
                date.getTime()
            )
        ) {
            return;
        }


        const status =
            String(
                payment.status ||
                payment.paymentStatus ||
                ""
            ).toLowerCase().trim();


        if (
            status &&
            ![
                "paid",
                "completed",
                "success",
                "successful"
            ].includes(status)
        ) {
            return;
        }


        const amount =
            payment.amount ??
            payment.paymentAmount ??
            payment.price ??
            payment.total ??
            0;


        monthlyRevenue[
            date.getMonth()
        ] += getNumber(amount);

    });


    const maximum =
        Math.max(
            ...monthlyRevenue,
            1
        );


    // Existing HTML has 7 bars.
    // Show the latest 7 months.

    const currentMonth =
        new Date().getMonth();


    bars.forEach((bar, index) => {

        const monthIndex =
            (
                currentMonth -
                (bars.length - 1 - index) +
                12
            ) % 12;


        const amount =
            monthlyRevenue[monthIndex];


        let height =
            (amount / maximum) * 100;


        if (
            amount === 0
        ) {
            height = 3;
        }


        bar.style.height =
            height + "%";


        bar.title =
            formatRupees(amount);

    });
}


// ========================================
// TRAINER STATISTICS
// ========================================

function updateTrainerStatistics() {

    const trainers =
        getTrainers();

    let available = 0;
    let limited = 0;
    let busy = 0;


    trainers.forEach((trainer) => {

        const status =
            String(
                trainer.status ||
                trainer.availability ||
                trainer.trainerStatus ||
                ""
            ).toLowerCase().trim();


        if (
            status === "available"
        ) {

            available++;

        } else if (
            status === "limited" ||
            status.includes("limited")
        ) {

            limited++;

        } else if (
            status === "busy" ||
            status.includes("assigned")
        ) {

            busy++;

        }

    });


    const trainerStats =
        document.querySelectorAll(
            ".trainer-stats > div"
        );


    if (
        trainerStats.length >= 3
    ) {

        trainerStats[0]
            .querySelector("strong")
            .textContent =
            available;


        trainerStats[1]
            .querySelector("strong")
            .textContent =
            limited;


        trainerStats[2]
            .querySelector("strong")
            .textContent =
            busy;

    }
}


// ========================================
// UPDATE REPORT DATE
// ========================================

function updateReportDate() {

    const dateElement =
        document.querySelector(
            ".report-date"
        );

    if (!dateElement) {
        return;
    }


    const now =
        new Date();


    const month =
        now.toLocaleString(
            "en-US",
            {
                month: "long"
            }
        );


    const year =
        now.getFullYear();


    dateElement.innerHTML = `
        <i class="fa-solid fa-calendar-days"></i>
        ${month} ${year}
    `;
}


// ========================================
// UPDATE ALL STATISTICS
// ========================================

function updateStatistics() {

    updateTotalMembers();

    updateActiveMemberships();

    updateRevenueCard();

    updateTodayAttendance();

    updateMemberGrowth();

    updateMembershipStatistics();

    updateRevenueChart();

    updateTrainerStatistics();

    updateReportDate();

    console.log(
        "Statistics updated successfully."
    );
}


// ========================================
// LISTEN FOR STORAGE CHANGES
// ========================================

window.addEventListener(
    "storage",
    function () {

        updateStatistics();

    }
);


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateStatistics();

    }
);
