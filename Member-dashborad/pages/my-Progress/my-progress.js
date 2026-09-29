/* =========================================================
   MEMBER MY PROGRESS JS
========================================================= */

const PROGRESS_STORAGE_KEY = "trainerCustomerProgress";
const MEMBER_STORAGE_KEY = "gymMembers";

let memberProgressChart = null;


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadMemberSidebar();

    loadMemberNavbar();

    loadMemberProgress();

});


/* =========================================================
   LOAD MEMBER SIDEBAR
========================================================= */

function loadMemberSidebar() {

    loadComponent(
        "member-sidebar",
        "../../../components/member-sidebar/member-sidebar.html"
    ).then(function () {

        if (typeof initializeMemberSidebar === "function") {
            initializeMemberSidebar();
        }

    }).catch(function (error) {

        console.error("Member Sidebar Error:", error);

    });

}


/* =========================================================
   LOAD MEMBER NAVBAR
========================================================= */

function loadMemberNavbar() {

    loadComponent(
        "member-navbar",
        "../../../components/member-navbar/member-navbar.html"
    ).then(function () {

        if (typeof initMemberNavbar === "function") {
            initMemberNavbar();
        }

    }).catch(function (error) {

        console.error("Member Navbar Error:", error);

    });

}


/* =========================================================
   LOAD COMPONENT
========================================================= */

function loadComponent(containerId, filePath) {

    return fetch(filePath)
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Component not found: " + filePath
                );
            }

            return response.text();

        })
        .then(function (html) {

            const container =
                document.getElementById(containerId);

            if (!container) {
                throw new Error(
                    "Container not found: " + containerId
                );
            }

            container.innerHTML = html;

        });

}


/* =========================================================
   LOAD MEMBER PROGRESS
========================================================= */

function loadMemberProgress() {

    const member = getCurrentMember();

    if (!member) {

        showNoProgress(
            "Member information was not found."
        );

        console.error(
            "No member data found in localStorage."
        );

        return;
    }


    console.log("Current Member:", member);


    const memberId = getMemberId(member);

    if (!memberId) {

        showNoProgress(
            "Member ID was not found."
        );

        console.error(
            "Current member does not have a valid ID."
        );

        return;
    }


    console.log("Current Member ID:", memberId);


    const allProgress =
        getProgressRecords();


    console.log(
        "All Trainer Progress Records:",
        allProgress
    );


    /* =====================================================
       ONLY CURRENT MEMBER'S PROGRESS
    ===================================================== */

    const memberRecords =
        allProgress.filter(function (record) {

            return String(record.customerId) ===
                   String(memberId);

        });


    console.log(
        "Member Progress Records:",
        memberRecords
    );


    if (memberRecords.length === 0) {

        showNoProgress(
            "No progress record has been added by your trainer yet."
        );

        return;
    }


    /* =====================================================
       SORT BY DATE
    ===================================================== */

    memberRecords.sort(function (a, b) {

        return new Date(a.date) - new Date(b.date);

    });


    /* =====================================================
       UPDATE ALL SECTIONS
    ===================================================== */

    updateOverview(memberRecords);

    updateGoal(memberRecords);

    updateMeasurements(memberRecords);

    updateProgressHistory(memberRecords);

    updateTrainerNotes(memberRecords);

    createProgressChart(memberRecords);

}


/* =========================================================
   GET CURRENT MEMBER
========================================================= */

function getCurrentMember() {

    /*
       Main project storage:
       gymMembers
    */

    const storedMembers =
        localStorage.getItem(MEMBER_STORAGE_KEY);


    if (storedMembers) {

        try {

            const members =
                JSON.parse(storedMembers);


            if (Array.isArray(members) &&
                members.length > 0) {

                /*
                   Current project member profile
                   is using the first stored member.
                */

                return members[0];

            }


            /*
               In case gymMembers contains
               a single object instead of an array.
            */

            if (
                typeof members === "object" &&
                members !== null
            ) {

                return members;

            }

        } catch (error) {

            console.error(
                "Error reading gymMembers:",
                error
            );

        }

    }


    /* =====================================================
       FALLBACK STORAGE OPTIONS
    ===================================================== */

    const possibleKeys = [
        "loggedInMember",
        "currentMember",
        "memberData"
    ];


    for (let i = 0; i < possibleKeys.length; i++) {

        const data =
            localStorage.getItem(possibleKeys[i]);


        if (!data) {
            continue;
        }


        try {

            const parsedData =
                JSON.parse(data);


            if (Array.isArray(parsedData)) {

                if (parsedData.length > 0) {
                    return parsedData[0];
                }

            } else if (
                typeof parsedData === "object" &&
                parsedData !== null
            ) {

                return parsedData;

            }

        } catch (error) {

            console.error(
                "Error reading " +
                possibleKeys[i] +
                ":",
                error
            );

        }

    }


    return null;

}


/* =========================================================
   GET MEMBER ID
========================================================= */

function getMemberId(member) {

    return (
        member.id ||
        member.memberId ||
        member.customerId ||
        member.customerID ||
        member.MemberID
    );

}


/* =========================================================
   GET PROGRESS RECORDS
========================================================= */

function getProgressRecords() {

    const storedProgress =
        localStorage.getItem(
            PROGRESS_STORAGE_KEY
        );


    if (!storedProgress) {

        console.log(
            "No trainerCustomerProgress found."
        );

        return [];

    }


    try {

        const progress =
            JSON.parse(storedProgress);


        if (!Array.isArray(progress)) {

            console.error(
                "trainerCustomerProgress is not an array."
            );

            return [];

        }


        return progress;

    } catch (error) {

        console.error(
            "Error parsing trainerCustomerProgress:",
            error
        );

        return [];

    }

}


/* =========================================================
   UPDATE OVERVIEW CARDS
========================================================= */

function updateOverview(records) {

    const firstRecord =
        records[0];

    const latestRecord =
        records[records.length - 1];


    const startingWeight =
        Number(firstRecord.startingWeight);


    const currentWeight =
        Number(latestRecord.weight);


    const targetWeight =
        Number(firstRecord.targetWeight);


    const progress =
        calculateProgress(
            firstRecord,
            latestRecord
        );


    setText(
        "memberStartingWeight",
        formatNumber(startingWeight) + " kg"
    );


    setText(
        "memberCurrentWeight",
        formatNumber(currentWeight) + " kg"
    );


    setText(
        "memberTargetWeight",
        formatNumber(targetWeight) + " kg"
    );


    setText(
        "memberOverallProgress",
        progress + "%"
    );

}


/* =========================================================
   UPDATE GOAL SECTION
========================================================= */

function updateGoal(records) {

    const firstRecord =
        records[0];

    const latestRecord =
        records[records.length - 1];


    setText(
        "memberGoalType",
        firstRecord.goalType || "Not specified"
    );


    setText(
        "memberGoalStatus",
        latestRecord.goalStatus || "In Progress"
    );


    setText(
        "memberGoalDetails",
        firstRecord.goalDetails ||
        "No goal details added by trainer."
    );

}


/* =========================================================
   CALCULATE PROGRESS
========================================================= */

function calculateProgress(
    startingRecord,
    currentRecord
) {

    const start =
        Number(startingRecord.startingWeight);


    const target =
        Number(startingRecord.targetWeight);


    const current =
        Number(currentRecord.weight);


    if (
        !Number.isFinite(start) ||
        !Number.isFinite(target) ||
        !Number.isFinite(current) ||
        start === target
    ) {

        return 0;

    }


    const totalDistance =
        Math.abs(start - target);


    const achievedDistance =
        Math.abs(start - current);


    let percentage =
        (achievedDistance / totalDistance) * 100;


    percentage =
        Math.max(
            0,
            Math.min(100, percentage)
        );


    return Math.round(percentage);

}


/* =========================================================
   UPDATE MEASUREMENTS
========================================================= */

function updateMeasurements(records) {

    const firstRecord =
        records[0];

    const latestRecord =
        records[records.length - 1];


    const measurements = [

        {
            name: "Weight",
            start: firstRecord.startingWeight,
            current: latestRecord.weight,
            unit: "kg"
        },

        {
            name: "Chest",
            start: firstRecord.chest,
            current: latestRecord.chest,
            unit: "in"
        },

        {
            name: "Waist",
            start: firstRecord.waist,
            current: latestRecord.waist,
            unit: "in"
        },

        {
            name: "Arms",
            start: firstRecord.arms,
            current: latestRecord.arms,
            unit: "in"
        }

    ];


    const tbody =
        document.getElementById(
            "memberMeasurementsBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    measurements.forEach(function (item) {

        const start =
            formatMeasurement(
                item.start,
                item.unit
            );


        const current =
            formatMeasurement(
                item.current,
                item.unit
            );


        const change =
            calculateMeasurementChange(
                item.start,
                item.current,
                item.unit
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${item.name}</strong>
            </td>

            <td>
                ${start}
            </td>

            <td>
                ${current}
            </td>

            <td>
                ${change}
            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =========================================================
   FORMAT MEASUREMENT
========================================================= */

function formatMeasurement(value, unit) {

    if (
        value === "" ||
        value === null ||
        value === undefined ||
        value === "-" ||
        !Number.isFinite(Number(value))
    ) {

        return "—";

    }


    return (
        formatNumber(Number(value)) +
        " " +
        unit
    );

}


/* =========================================================
   CALCULATE MEASUREMENT CHANGE
========================================================= */

function calculateMeasurementChange(
    start,
    current,
    unit
) {

    if (
        start === "" ||
        current === "" ||
        start === null ||
        current === null ||
        start === undefined ||
        current === undefined
    ) {

        return "—";

    }


    const startNumber =
        Number(start);


    const currentNumber =
        Number(current);


    if (
        !Number.isFinite(startNumber) ||
        !Number.isFinite(currentNumber)
    ) {

        return "—";

    }


    const difference =
        currentNumber - startNumber;


    if (difference === 0) {

        return "0 " + unit;

    }


    const sign =
        difference > 0 ? "+" : "";


    return (
        sign +
        formatNumber(difference) +
        " " +
        unit
    );

}


/* =========================================================
   UPDATE PROGRESS HISTORY
========================================================= */

function updateProgressHistory(records) {

    const tbody =
        document.getElementById(
            "memberProgressTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    /*
       Latest record first
    */

    const history =
        [...records].reverse();


    history.forEach(function (record) {

        const row =
            document.createElement("tr");


        const formattedDate =
            formatDate(record.date);


        const weight =
            Number.isFinite(Number(record.weight))
                ? formatNumber(Number(record.weight)) + " kg"
                : "—";


        const goal =
            record.goalType || "—";


        const status =
            record.goalStatus || "In Progress";


        const notes =
            record.notes || "No notes";


        row.innerHTML = `

            <td>
                ${formattedDate}
            </td>

            <td>
                ${weight}
            </td>

            <td>
                ${escapeHTML(goal)}
            </td>

            <td>
                <span class="status-badge">
                    ${escapeHTML(status)}
                </span>
            </td>

            <td>
                ${escapeHTML(notes)}
            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =========================================================
   UPDATE TRAINER NOTES
========================================================= */

function updateTrainerNotes(records) {

    const notesBox =
        document.getElementById(
            "memberTrainerNotes"
        );


    if (!notesBox) {
        return;
    }


    const latestRecord =
        records[records.length - 1];


    if (
        latestRecord.notes &&
        latestRecord.notes.trim() !== ""
    ) {

        notesBox.textContent =
            latestRecord.notes;

    } else {

        notesBox.textContent =
            "No trainer notes have been added yet.";

    }

}


/* =========================================================
   CREATE PROGRESS CHART
========================================================= */

function createProgressChart(records) {

    const canvas =
        document.getElementById(
            "memberProgressChart"
        );


    const emptyMessage =
        document.getElementById(
            "memberChartEmpty"
        );


    if (!canvas) {
        return;
    }


    if (records.length === 0) {

        if (emptyMessage) {
            emptyMessage.style.display = "block";
        }

        return;

    }


    if (emptyMessage) {
        emptyMessage.style.display = "none";
    }


    if (memberProgressChart) {

        memberProgressChart.destroy();

    }


    const labels =
        records.map(function (record) {

            return formatDate(record.date);

        });


    const currentWeights =
        records.map(function (record) {

            return Number(record.weight);

        });


    const targetWeight =
        Number(records[0].targetWeight);


    const targetWeights =
        records.map(function () {

            return targetWeight;

        });


    memberProgressChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {
                            label: "Current Weight",

                            data: currentWeights,

                            borderWidth: 3,

                            tension: 0.35,

                            fill: false,

                            pointRadius: 5,

                            pointHoverRadius: 7
                        },

                        {
                            label: "Target Weight",

                            data: targetWeights,

                            borderWidth: 2,

                            borderDash: [6, 6],

                            tension: 0,

                            fill: false,

                            pointRadius: 0
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {
                                color: "#ffffff"
                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {
                                color: "#a7aaad"
                            },

                            grid: {
                                color: "rgba(255,255,255,0.06)"
                            }

                        },

                        y: {

                            ticks: {
                                color: "#a7aaad"
                            },

                            grid: {
                                color: "rgba(255,255,255,0.06)"
                            },

                            title: {

                                display: true,

                                text: "Weight (kg)",

                                color: "#ffffff"

                            }

                        }

                    }

                }

            }
        );

}



/* =========================================================
   NO PROGRESS STATE
========================================================= */

function showNoProgress(message) {

    setText(
        "memberStartingWeight",
        "—"
    );

    setText(
        "memberCurrentWeight",
        "—"
    );

    setText(
        "memberTargetWeight",
        "—"
    );

    setText(
        "memberOverallProgress",
        "0%"
    );


    setText(
        "memberGoalType",
        "No progress data"
    );

    setText(
        "memberGoalStatus",
        "Not available"
    );

    setText(
        "memberGoalDetails",
        message
    );


    /* =====================================================
       PROGRESS HISTORY
    ===================================================== */

    const historyBody =
        document.getElementById(
            "memberProgressTableBody"
        );


    if (historyBody) {

        historyBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center; padding:30px;"
                >

                    ${escapeHTML(message)}

                </td>

            </tr>

        `;

    }


    /* =====================================================
       TRAINER NOTES
    ===================================================== */

    const notes =
        document.getElementById(
            "memberTrainerNotes"
        );


    if (notes) {

        notes.textContent =
            "No trainer notes available.";

    }


    /* =====================================================
       MEASUREMENTS
    ===================================================== */

    const measurementBody =
        document.getElementById(
            "memberMeasurementsBody"
        );


    if (measurementBody) {

        measurementBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center; padding:30px;"
                >

                    No measurement data available.

                </td>

            </tr>

        `;

    }


    /* =====================================================
       CHART
    ===================================================== */

    const chart =
        document.getElementById(
            "memberProgressChart"
        );


    if (chart) {

        chart.style.display = "none";

    }


    const chartEmpty =
        document.getElementById(
            "memberChartEmpty"
        );


    if (chartEmpty) {

        chartEmpty.style.display = "block";

        chartEmpty.textContent =
            "No progress history available yet.";

    }

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(elementId, value) {

    const element =
        document.getElementById(elementId);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "—";

    }


    return Number.isInteger(number)
        ? number.toString()
        : number.toFixed(1);

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {

        return "—";

    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {

        return dateValue;

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


/* =========================================================
   ESCAPE HTML
   
========================================================= */

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
