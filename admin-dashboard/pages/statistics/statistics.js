

// ========================================
// COMPONENT LOADER
// ========================================

function loadComponent(elementId, filePath) {

    const element = document.getElementById(elementId);

    if (!element) return;

    fetch(filePath)
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    `Component could not be loaded: ${filePath}`
                );
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


// ========================================
// STORAGE KEYS
// ========================================

const MEMBER_STORAGE_KEY = "gymMembers";
const MEMBERSHIP_STORAGE_KEY = "gymMemberships";
const PAYMENT_STORAGE_KEY = "gymPayments";
const ATTENDANCE_STORAGE_KEY = "gymAttendance";
const TRAINER_STORAGE_KEY = "gymTrainers";


// ========================================
// LOAD DATA SAFELY
// ========================================

function getArrayFromStorage(key) {

    try {

        const data = JSON.parse(
            localStorage.getItem(key)
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {

        console.error(
            `Error reading ${key}:`,
            error
        );

        return [];
    }
}


function getMembers() {

    return getArrayFromStorage(
        MEMBER_STORAGE_KEY
    );
}


function getMemberships() {

    return getArrayFromStorage(
        MEMBERSHIP_STORAGE_KEY
    );
}


function getPayments() {

    return getArrayFromStorage(
        PAYMENT_STORAGE_KEY
    );
}


function getAttendance() {

    return getArrayFromStorage(
        ATTENDANCE_STORAGE_KEY
    );
}


function getTrainers() {

    return getArrayFromStorage(
        TRAINER_STORAGE_KEY
    );
}


// ========================================
// GET ELEMENT
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
// NUMBER CONVERTER
// ========================================

function getNumber(value) {

    if (typeof value === "number") {

        return value;

    }

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }

    return Number(
        String(value)
            .replace(/Rs\.?/gi, "")
            .replace(/PKR/gi, "")
            .replace(/,/g, "")
            .trim()
    ) || 0;
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

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    memberships.forEach(membership => {

        const paymentStatus =
            String(
                membership.paymentStatus || ""
            )
            .trim()
            .toLowerCase();


        const expiryDateValue =
            membership.expiryDate ||
            "";


        let isExpired = false;


        if (expiryDateValue) {

            const expiryDate =
                new Date(
                    `${expiryDateValue}T00:00:00`
                );

            if (
                !isNaN(
                    expiryDate.getTime()
                )
            ) {

                isExpired =
                    expiryDate < today;

            }

        }


        /*
         * Membership is considered active when:
         *
         * 1. Payment is Paid
         * 2. Expiry date has not passed
         *
         */

        if (
            paymentStatus === "paid" &&
            !isExpired
        ) {

            activeCount++;

        }

    });


    updateText(
        ".statistics-cards .stat-card:nth-child(2) h2",
        activeCount
    );
}


// ========================================
// CURRENT MONTH CHECK
// ========================================

function isCurrentMonth(dateValue) {

    if (!dateValue) {

        return false;

    }


    const date =
        new Date(dateValue);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return false;

    }


    const now =
        new Date();


    return (
        date.getMonth() ===
            now.getMonth() &&

        date.getFullYear() ===
            now.getFullYear()
    );
}


// ========================================
// MONTHLY REVENUE
// ========================================

function calculateMonthlyRevenue() {

    const payments =
        getPayments();

    let total = 0;


    payments.forEach(payment => {

        const status =
            String(
                payment.status || ""
            )
            .trim()
            .toLowerCase();


        /*
         * Only Paid payments count
         * as revenue.
         */

        if (
            status !== "paid"
        ) {

            return;

        }


        const paymentDate =
            payment.paymentDate ||
            payment.date ||
            payment.createdAt;


        /*
         * If payment has a date,
         * only current month's
         * payments are counted.
         */

        if (
            paymentDate &&
            !isCurrentMonth(paymentDate)
        ) {

            return;

        }


        const amount =
            payment.amount ||
            payment.paymentAmount ||
            payment.price ||
            payment.total ||
            0;


        total +=
            getNumber(amount);

    });


    return total;
}


// ========================================
// FORMAT RUPEES
// ========================================

function formatRupees(value) {

    return (
        "Rs. " +
        Number(value)
            .toLocaleString("en-PK")
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


    return `${year}-${month}-${day}`;
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


    attendance.forEach(record => {

        const recordDate =
            record.date ||
            record.attendanceDate ||
            record.createdAt;


        if (!recordDate) {

            return;

        }


        if (
            String(recordDate)
                .substring(0, 10) ===
            today
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


    members.forEach(member => {

        const dateValue =
            member.joinDate ||
            member.registrationDate ||
            member.dateJoined ||
            member.createdAt ||
            member.date;


        if (!dateValue) {

            return;

        }


        const date =
            new Date(dateValue);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return;

        }


        monthlyCounts[
            date.getMonth()
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
            (
                count === 1
                    ? ""
                    : "s"
            );

    });
}


// ========================================
// MEMBERSHIP STATISTICS
// ========================================

function updateMembershipStatistics() {

    const memberships =
        getMemberships();


    const categories = {

        premium: 0,

        standard: 0,

        basic: 0

    };


    memberships.forEach(membership => {

        const plan =
            String(
                membership.plan ||
                membership.membershipPlan ||
                membership.type ||
                membership.membershipType ||
                ""
            )
            .trim()
            .toLowerCase();


        if (
            plan.includes("premium")
        ) {

            categories.premium++;

        }

        else if (
            plan.includes("standard")
        ) {

            categories.standard++;

        }

        else if (
            plan.includes("basic")
        ) {

            categories.basic++;

        }

    });


    const total =
        memberships.length;


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
                    (
                        values[index] /
                        total
                    ) * 100
                )
                : 0;


        const strong =
            item.querySelector(
                "strong"
            );


        if (strong) {

            strong.textContent =
                percentage + "%";

        }


        if (
            progressBars[index]
        ) {

            progressBars[index]
                .style.width =
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


    payments.forEach(payment => {

        const status =
            String(
                payment.status || ""
            )
            .trim()
            .toLowerCase();


        if (
            status !== "paid"
        ) {

            return;

        }


        const paymentDate =
            payment.paymentDate ||
            payment.date ||
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


        const amount =
            payment.amount ||
            payment.paymentAmount ||
            payment.price ||
            payment.total ||
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


    const currentMonth =
        new Date().getMonth();


    bars.forEach((bar, index) => {

        const monthIndex =
            (
                currentMonth -
                (
                    bars.length -
                    1 -
                    index
                ) +
                12
            ) % 12;


        const amount =
            monthlyRevenue[
                monthIndex
            ];


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


    trainers.forEach(trainer => {

        const status =
            String(
                trainer.status ||
                trainer.availability ||
                trainer.trainerStatus ||
                ""
            )
            .trim()
            .toLowerCase();


        if (
            status === "available"
        ) {

            available++;

        }

        else if (
            status.includes("limited")
        ) {

            limited++;

        }

        else if (
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
// REPORT DATE
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


    /*
     * Debug information
     * visible in browser console.
     */

    console.log(
        "Members:",
        getMembers()
    );

    console.log(
        "Memberships:",
        getMemberships()
    );

    console.log(
        "Payments:",
        getPayments()
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

        loadComponent(
            "sidebar",
            "../../../components/sidebar/sidebar.html"
        );


        loadComponent(
            "navbar",
            "../../../components/navbar/navbar.html"
        );


        updateStatistics();

    }
); 
