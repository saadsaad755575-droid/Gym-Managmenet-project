
/* =========================================
   TRAINER DIET TRACKING
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const DIET_TRACKING_STORAGE_KEY = "memberDietProofs";
const TRAINER_STORAGE_KEY = "loggedInTrainer";


/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadTrainerSidebar();

    loadTrainerNavbar();

    initializeDietTracking();

});


/* =========================================
   LOAD COMPONENT
========================================= */

function loadComponent(elementId, filePath, callback) {

    const element =
        document.getElementById(elementId);

    if (!element) {

        console.error(
            "Component container not found:",
            elementId
        );

        return;
    }


    fetch(filePath)

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Component could not be loaded: " +
                    filePath
                );

            }

            return response.text();

        })

        .then(function (html) {

            element.innerHTML = html;

            if (callback) {
                callback();
            }

        })

        .catch(function (error) {

            console.error(error);

            element.innerHTML = `
                <div style="
                    padding:20px;
                    color:#ff6b6b;
                ">
                    Component could not be loaded.
                </div>
            `;

        });

}


/* =========================================
   LOAD TRAINER SIDEBAR
========================================= */

function loadTrainerSidebar() {

    loadComponent(
        "trainer-sidebar",
        "../../../components/trainer.sidebar/trainer.sidebar.html",
        function () {

            if (
                typeof initializeTrainerSidebar ===
                "function"
            ) {

                initializeTrainerSidebar();

            }

        }
    );

}


/* =========================================
   LOAD TRAINER NAVBAR
========================================= */

function loadTrainerNavbar() {

    loadComponent(
        "trainer-navbar",
        "../../../components/trainer-navbar/trainer-navbar.html",
        function () {

            if (
                typeof initTrainerNavbar ===
                "function"
            ) {

                initTrainerNavbar();

            }

        }
    );

}


/* =========================================
   INITIALIZE PAGE
========================================= */

function initializeDietTracking() {

    setCurrentDate();

    loadDietTrackingRecords();

    initializeFilters();

    initializeModal();

}


/* =========================================
   CURRENT DATE
========================================= */

function setCurrentDate() {

    const dateElement =
        document.getElementById("currentDate");

    if (!dateElement) return;


    const today = new Date();


    const formattedDate =
        today.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    dateElement.textContent =
        formattedDate;

}


/* =========================================
   GET CURRENT TRAINER
========================================= */

function getCurrentTrainer() {

    const trainer =
        localStorage.getItem(
            TRAINER_STORAGE_KEY
        );


    return trainer || "";

}


/* =========================================
   GET TRACKING RECORDS
========================================= */

function getTrackingRecords() {

    try {

        return JSON.parse(
            localStorage.getItem(
                DIET_TRACKING_STORAGE_KEY
            ) || "[]"
        );

    } catch (error) {

        console.error(
            "Unable to read memberDietProofs:",
            error
        );

        return [];

    }

}


/* =========================================
   FILTER BY CURRENT TRAINER
========================================= */

function filterByTrainer(records) {

    const currentTrainer =
        getCurrentTrainer();


    if (!currentTrainer) {

        return records;

    }


    return records.filter(
        function (record) {

            /*
                Existing records without
                trainerName remain visible.
            */

            if (!record.trainerName) {

                return true;

            }


            return (
                String(record.trainerName)
                    .trim()
                    .toLowerCase()
                ===
                String(currentTrainer)
                    .trim()
                    .toLowerCase()
            );

        }
    );

}


/* =========================================
   LOAD TRACKING RECORDS
========================================= */

function loadDietTrackingRecords() {

    let trackingRecords = [];

    try {
        trackingRecords =
            JSON.parse(
                localStorage.getItem("memberDietProofs") || "[]"
            );
    } catch (error) {

        console.error(
            "Unable to read diet tracking records:",
            error
        );

        trackingRecords = [];
    }
    console.log(
        "Diet Tracking Records:",
        trackingRecords
    );

    renderTrackingTable(trackingRecords);

    updateSummaryCards(trackingRecords);
}


/* =========================================
   GET DISPLAY STATUS
========================================= */

function getDisplayStatus(record) {

    const status =
        String(
            record.status || ""
        )
            .trim()
            .toLowerCase();


    /*
        Member submitted proof.
        Trainer has not reviewed it yet.
        Therefore show Pending.
    */

    if (
        status === "" ||
        status === "submitted" ||
        status === "pending"
    ) {

        return "Pending";

    }


    if (status === "followed") {

        return "Followed";

    }


    if (
        status === "not followed" ||
        status === "not-followed"
    ) {

        return "Not Followed";

    }


    return "Pending";

}


/* =========================================
   RENDER TRACKING TABLE
========================================= */

function renderTrackingTable(records) {

    const tableBody =
        document.getElementById(
            "dietTrackingTableBody"
        );


    if (!tableBody) {

        console.error(
            "dietTrackingTableBody not found."
        );

        return;

    }


    tableBody.innerHTML = "";


    if (!records.length) {

        tableBody.innerHTML = `

            <tr class="empty-row">

                <td colspan="9">

                    <div class="empty-state">

                        <i class="fa-solid fa-chart-simple"></i>

                        <h3>
                            No Diet Tracking Records
                        </h3>

                        <p>
                            Member diet submissions will appear here.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    records.forEach(
        function (record, index) {

            const row =
                document.createElement("tr");


            const memberName =
                record.memberName ||
                record.customer ||
                record.customerName ||
                "Unknown Member";


            const mealName =
                record.meal ||
                record.mealType ||
                "Meal";


            const food =
                record.food ||
                record.foodItem ||
                "—";


            const date =
                record.date ||
                "—";


            const time =
                record.time ||
                record.submittedTime ||
                "—";


            const status =
                getDisplayStatus(record);


            const submission =
                record.proof ||
                record.submitted ||
                record.submission
                    ? "Submitted"
                    : "Not Submitted";


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(memberName)}
                </td>

                <td>
                    ${escapeHTML(mealName)}
                </td>

                <td>
                    ${escapeHTML(food)}
                </td>

                <td>
                    ${escapeHTML(date)}
                </td>

                <td>
                    ${escapeHTML(time)}
                </td>

                <td>

                    <span class="submission-badge">

                        <i class="fa-solid fa-circle-check"></i>

                        ${submission}

                    </span>

                </td>

                <td>
                    ${createStatusBadge(status)}
                </td>

                <td>

                    <button
                        type="button"
                        class="view-btn"
                        data-record-id="${record.id}"
                    >

                        <i class="fa-solid fa-eye"></i>

                        View

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );


    attachViewButtons(records);

}


/* =========================================
   STATUS BADGE
========================================= */

function createStatusBadge(status) {

    const normalizedStatus =
        String(status)
            .trim()
            .toLowerCase();


    if (
        normalizedStatus ===
        "followed"
    ) {

        return `

            <span class="status-badge status-followed">

                <i class="fa-solid fa-check"></i>

                Followed

            </span>

        `;

    }


    if (
        normalizedStatus === "not followed" ||
        normalizedStatus === "not-followed"
    ) {

        return `

            <span class="status-badge status-not-followed">

                <i class="fa-solid fa-xmark"></i>

                Not Followed

            </span>

        `;

    }


    return `

        <span class="status-badge status-pending">

            <i class="fa-solid fa-clock"></i>

            Pending

        </span>

    `;

}


/* =========================================
   SUMMARY CARDS
========================================= */

function updateSummaryCards(records) {

    const totalMeals =
        records.length;


    const followedMeals =
        records.filter(
            function (record) {

                return (
                    getDisplayStatus(record)
                    ===
                    "Followed"
                );

            }
        ).length;


    const notFollowedMeals =
        records.filter(
            function (record) {

                return (
                    getDisplayStatus(record)
                    ===
                    "Not Followed"
                );

            }
        ).length;


    const pendingMeals =
        records.filter(
            function (record) {

                return (
                    getDisplayStatus(record)
                    ===
                    "Pending"
                );

            }
        ).length;


    const totalElement =
        document.getElementById(
            "totalMeals"
        );

    const followedElement =
        document.getElementById(
            "followedMeals"
        );

    const notFollowedElement =
        document.getElementById(
            "notFollowedMeals"
        );

    const pendingElement =
        document.getElementById(
            "pendingMeals"
        );


    if (totalElement) {

        totalElement.textContent =
            totalMeals;

    }


    if (followedElement) {

        followedElement.textContent =
            followedMeals;

    }


    if (notFollowedElement) {

        notFollowedElement.textContent =
            notFollowedMeals;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pendingMeals;

    }

}


/* =========================================
   VIEW BUTTONS
========================================= */

function attachViewButtons(records) {

    const buttons =
        document.querySelectorAll(
            ".view-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const recordId =
                        this.getAttribute(
                            "data-record-id"
                        );


                    const record =
                        records.find(
                            function (item) {

                                return (
                                    String(item.id)
                                    ===
                                    String(recordId)
                                );

                            }
                        );


                    if (record) {

                        openTrackingDetails(
                            record
                        );

                    }

                }
            );

        }
    );

}


/* =========================================
   OPEN TRACKING DETAILS
========================================= */

function openTrackingDetails(record) {

    const memberElement =
        document.getElementById(
            "detailMember"
        );

    const mealElement =
        document.getElementById(
            "detailMeal"
        );

    const foodElement =
        document.getElementById(
            "detailFood"
        );

    const dateElement =
        document.getElementById(
            "detailDate"
        );

    const timeElement =
        document.getElementById(
            "detailTime"
        );

    const statusElement =
        document.getElementById(
            "detailStatus"
        );

    const feedbackElement =
        document.getElementById(
            "detailFeedback"
        );


    if (memberElement) {

        memberElement.textContent =
            record.memberName ||
            record.customer ||
            record.customerName ||
            "Unknown Member";

    }


    if (mealElement) {

        mealElement.textContent =
            record.meal ||
            record.mealType ||
            "—";

    }


    if (foodElement) {

        foodElement.textContent =
            record.food ||
            record.foodItem ||
            "—";

    }


    if (dateElement) {

        dateElement.textContent =
            record.date ||
            "—";

    }


    if (timeElement) {

        timeElement.textContent =
            record.time ||
            record.submittedTime ||
            "—";

    }


    if (statusElement) {

        statusElement.textContent =
            getDisplayStatus(record);

    }


    if (feedbackElement) {

        feedbackElement.textContent =
            record.feedback ||
            "No feedback submitted.";

    }


    const modal =
        document.getElementById(
            "trackingDetailsModal"
        );


    if (modal) {

        modal.classList.add("show");

    }


    window.currentDietTrackingRecord =
        record;

}


/* =========================================
   INITIALIZE MODAL
========================================= */

function initializeModal() {

    const modal =
        document.getElementById(
            "trackingDetailsModal"
        );


    const closeButton =
        document.getElementById(
            "closeTrackingModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeTrackingModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeTrackingModal();

                }

            }
        );

    }


    const followedButton =
        document.getElementById(
            "markFollowedBtn"
        );


    if (followedButton) {

        followedButton.addEventListener(
            "click",
            function () {

                updateTrackingStatus(
                    "Followed"
                );

            }
        );

    }


    const notFollowedButton =
        document.getElementById(
            "markNotFollowedBtn"
        );


    if (notFollowedButton) {

        notFollowedButton.addEventListener(
            "click",
            function () {

                updateTrackingStatus(
                    "Not Followed"
                );

            }
        );

    }

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeTrackingModal() {

    const modal =
        document.getElementById(
            "trackingDetailsModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================================
   UPDATE TRACKING STATUS
========================================= */

function updateTrackingStatus(newStatus) {

    const record =
        window.currentDietTrackingRecord;


    if (!record) {

        return;

    }


    let trackingRecords =
        getTrackingRecords();


    const index =
        trackingRecords.findIndex(
            function (item) {

                return (
                    String(item.id)
                    ===
                    String(record.id)
                );

            }
        );


    if (index === -1) {

        console.error(
            "Tracking record not found."
        );

        return;

    }


    trackingRecords[index].status =
        newStatus;


    trackingRecords[index].reviewedBy =
        getCurrentTrainer();


    trackingRecords[index].reviewedAt =
        new Date().toISOString();


    localStorage.setItem(
        DIET_TRACKING_STORAGE_KEY,
        JSON.stringify(trackingRecords)
    );


    closeTrackingModal();

    window.currentDietTrackingRecord =
        null;


    loadDietTrackingRecords();

}


/* =========================================
   FILTERS
========================================= */

function initializeFilters() {

    const searchInput =
        document.getElementById(
            "memberSearch"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const dateFilter =
        document.getElementById(
            "trackingDate"
        );


    const resetButton =
        document.getElementById(
            "resetFilters"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (dateFilter) {

        dateFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                if (searchInput) {

                    searchInput.value = "";

                }


                if (statusFilter) {

                    statusFilter.value = "all";

                }


                if (dateFilter) {

                    dateFilter.value = "";

                }


                loadDietTrackingRecords();

            }
        );

    }

}


/* =========================================
   APPLY FILTERS
========================================= */

function applyFilters() {

    let trackingRecords =
        getTrackingRecords();


    trackingRecords =
        filterByTrainer(
            trackingRecords
        );


    const searchInput =
        document.getElementById(
            "memberSearch"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const dateFilter =
        document.getElementById(
            "trackingDate"
        );


    const searchValue =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const selectedDate =
        dateFilter
            ? dateFilter.value
            : "";


    trackingRecords =
        trackingRecords.filter(
            function (record) {

                const memberName =
                    String(
                        record.memberName ||
                        record.customer ||
                        record.customerName ||
                        ""
                    )
                        .toLowerCase();


                const displayStatus =
                    getDisplayStatus(record);


                const recordDate =
                    String(
                        record.date ||
                        ""
                    );


                const matchesSearch =
                    !searchValue ||
                    memberName.includes(
                        searchValue
                    );


                const matchesStatus =
                    selectedStatus === "all" ||
                    displayStatus ===
                    selectedStatus;


                const matchesDate =
                    !selectedDate ||
                    recordDate ===
                    selectedDate;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesDate
                );

            }
        );


    renderTrackingTable(
        trackingRecords
    );


    updateSummaryCards(
        trackingRecords
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g,"&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

} 
