// ========================================
// COMPONENT LOADER
// ========================================

function loadComponent(elementId, filePath) {

    const element =
        document.getElementById(elementId);

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

            console.error(
                "Component Loading Error:",
                error
            );

        });

}


// ========================================
// TRAINER REQUESTS MANAGEMENT
// ========================================

const TRAINER_REQUESTS_KEY =
    "trainerChangeRequests";


// ========================================
// ELEMENTS
// ========================================

const tableBody =
    document.getElementById(
        "trainerRequestsTableBody"
    );

const emptyState =
    document.getElementById(
        "emptyRequestState"
    );

const statusFilter =
    document.getElementById(
        "requestStatusFilter"
    );

const pendingRequests =
    document.getElementById(
        "pendingRequests"
    );

const approvedRequests =
    document.getElementById(
        "approvedRequests"
    );

const rejectedRequests =
    document.getElementById(
        "rejectedRequests"
    );


// ========================================
// GET TRAINER REQUESTS
// ========================================

function getTrainerRequests() {

    const savedRequests =
        localStorage.getItem(
            TRAINER_REQUESTS_KEY
        );

    if (!savedRequests) {
        return [];
    }

    try {

        const requests =
            JSON.parse(savedRequests);

        return Array.isArray(requests)
            ? requests
            : [];

    }

    catch (error) {

        console.error(
            "Trainer requests data could not be read:",
            error
        );

        return [];

    }

}


// ========================================
// SAVE TRAINER REQUESTS
// ========================================

function saveTrainerRequests(requests) {

    localStorage.setItem(
        TRAINER_REQUESTS_KEY,
        JSON.stringify(requests)
    );

}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary(requests) {

    const pending =
        requests.filter(
            request =>
                request.status === "Pending"
        ).length;

    const approved =
        requests.filter(
            request =>
                request.status === "Approved"
        ).length;

    const rejected =
        requests.filter(
            request =>
                request.status === "Rejected"
        ).length;


    if (pendingRequests) {
        pendingRequests.textContent =
            pending;
    }

    if (approvedRequests) {
        approvedRequests.textContent =
            approved;
    }

    if (rejectedRequests) {
        rejectedRequests.textContent =
            rejected;
    }

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
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


// ========================================
// DISPLAY REQUESTS
// ========================================

function displayRequests() {

    if (!tableBody) return;

    const requests =
        getTrainerRequests();


    updateSummary(
        requests
    );


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    let filteredRequests =
        requests;


    if (selectedStatus !== "all") {

        const formattedStatus =
            selectedStatus
                .charAt(0)
                .toUpperCase() +
            selectedStatus.slice(1);


        filteredRequests =
            requests.filter(
                request =>
                    request.status ===
                    formattedStatus
            );

    }


    tableBody.innerHTML = "";


    if (filteredRequests.length === 0) {

        if (emptyState) {

            emptyState.style.display =
                "flex";

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    filteredRequests.forEach(
        function (request) {

            const row =
                document.createElement("tr");


            const statusClass =
                String(
                    request.status ||
                    "Pending"
                ).toLowerCase();


            const requestId =
                request.requestId ||
                request.id ||
                "";


            row.innerHTML = `

                <td>

                    <span class="request-id">

                        ${
                            escapeHTML(
                                requestId
                            )
                        }

                    </span>

                </td>


                <td>

                    <div class="member-info">

                        <span class="member-name">

                            ${
                                escapeHTML(
                                    request.memberName ||
                                    "-"
                                )
                            }

                        </span>


                        <span class="member-id">

                            ${
                                escapeHTML(
                                    String(
                                        request.memberId ||
                                        "-"
                                    )
                                )
                            }

                        </span>

                    </div>

                </td>


                <td>

                    <div class="trainer-info">

                        <span class="trainer-name">

                            ${
                                escapeHTML(
                                    request.currentTrainerName ||
                                    "-"
                                )
                            }

                        </span>

                    </div>

                </td>


                <td>

                    <div class="trainer-info">

                        <span class="trainer-name">

                            ${
                                escapeHTML(
                                    request.requestedTrainerName ||
                                    "-"
                                )
                            }

                        </span>

                    </div>

                </td>


                <td>

                    ${
                        formatDate(
                            request.requestDate
                        )
                    }

                </td>


                <td>

                    <span
                        class="status ${statusClass}"
                    >

                        ${
                            escapeHTML(
                                request.status ||
                                "Pending"
                            )
                        }

                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="action-btn approve"
                            title="Approve Request"
                            data-action="approve"
                            data-id="${escapeHTML(
                                String(requestId)
                            )}"
                            ${
                                request.status !==
                                "Pending"
                                    ? "disabled"
                                    : ""
                            }
                        >

                            <i
                                class="fa-solid fa-check"
                            ></i>

                        </button>


                        <button
                            class="action-btn reject"
                            title="Reject Request"
                            data-action="reject"
                            data-id="${escapeHTML(
                                String(requestId)
                            )}"
                            ${
                                request.status !==
                                "Pending"
                                    ? "disabled"
                                    : ""
                            }
                        >

                            <i
                                class="fa-solid fa-xmark"
                            ></i>

                        </button>

                    </div>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// APPROVE REQUEST
// ========================================

function approveRequest(requestId) {

    const requests =
        getTrainerRequests();


    const requestIndex =
        requests.findIndex(
            function (request) {

                const id =
                    request.requestId ||
                    request.id ||
                    "";

                return String(id) ===
                    String(requestId);

            }
        );


    if (requestIndex === -1) {

        alert(
            "Trainer request was not found."
        );

        return;

    }


    const request =
        requests[requestIndex];


    if (
        request.status !==
        "Pending"
    ) {

        alert(
            "This request has already been processed."
        );

        return;

    }


    const confirmApproval =
        confirm(
            "Are you sure you want to approve this trainer change request?"
        );


    if (!confirmApproval) {
        return;
    }


    // ========================================
    // GET MEMBERS
    // ========================================

    let members = [];


    try {

        members =
            JSON.parse(
                localStorage.getItem(
                    "gymMembers"
                )
            ) || [];

    }

    catch (error) {

        console.error(
            "Member data could not be read:",
            error
        );

        alert(
            "Member data could not be processed."
        );

        return;

    }


    if (!Array.isArray(members)) {

        alert(
            "Member data is invalid."
        );

        return;

    }


    // ========================================
    // FIND MEMBER
    // ========================================

    const memberIndex =
        members.findIndex(
            function (member) {

                return String(
                    member.id
                ) ===
                String(
                    request.memberId
                );

            }
        );


    if (memberIndex === -1) {

        alert(
            "The requested member could not be found."
        );

        return;

    }


    // ========================================
    // GET REQUESTED TRAINER
    // ========================================

    const requestedTrainerId =
        request.requestedTrainerId ||
        request.trainerId ||
        "";


    const requestedTrainerName =
        request.requestedTrainerName ||
        request.trainerName ||
        "";


    if (
        !requestedTrainerId &&
        !requestedTrainerName
    ) {

        alert(
            "Requested trainer information was not found."
        );

        return;

    }


    // ========================================
    // UPDATE MEMBER
    // ========================================

    const member =
        members[memberIndex];


    member.trainerId =
        requestedTrainerId ||
        member.trainerId ||
        "";


    member.trainerName =
        requestedTrainerName ||
        member.trainerName ||
        "";


    member.assignedTrainerId =
        requestedTrainerId ||
        member.assignedTrainerId ||
        "";


    member.assignedTrainerName =
        requestedTrainerName ||
        member.assignedTrainerName ||
        "";
     member.trainer =
     request.requestedTrainerName ||
     request.trainerName ||
     member.trainer ||
     "Not Assigned";


    // ========================================
    // SAVE MEMBERS
    // ========================================

    localStorage.setItem(
        "gymMembers",
        JSON.stringify(
            members
        )
    );


    // ========================================
    // UPDATE REQUEST
    // ========================================

    requests[requestIndex].status =
        "Approved";


    requests[requestIndex].processedDate =
        new Date().toISOString();


    saveTrainerRequests(
        requests
    );


    // ========================================
    // REFRESH
    // ========================================

    displayRequests();


    alert(
        "Trainer change request approved successfully."
    );

}


// ========================================
// REJECT REQUEST
// ========================================

function rejectRequest(requestId) {

    const requests =
        getTrainerRequests();


    const requestIndex =
        requests.findIndex(
            function (request) {

                const id =
                    request.requestId ||
                    request.id ||
                    "";

                return String(id) ===
                    String(requestId);

            }
        );


    if (requestIndex === -1) {

        alert(
            "Trainer request was not found."
        );

        return;

    }


    const request =
        requests[requestIndex];


    if (
        request.status !==
        "Pending"
    ) {

        alert(
            "This request has already been processed."
        );

        return;

    }


    const confirmRejection =
        confirm(
            "Are you sure you want to reject this trainer change request?"
        );


    if (!confirmRejection) {
        return;
    }


    requests[requestIndex].status =
        "Rejected";


    requests[requestIndex].processedDate =
        new Date().toISOString();


    saveTrainerRequests(
        requests
    );


    displayRequests();


    alert(
        "Trainer change request rejected."
    );

}


// ========================================
// ACTION BUTTONS
// ========================================

if (tableBody) {

    tableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".action-btn"
                );


            if (!button) {
                return;
            }


            if (button.disabled) {
                return;
            }


            const action =
                button.dataset.action;


            const requestId =
                button.dataset.id;


            if (
                action ===
                "approve"
            ) {

                approveRequest(
                    requestId
                );

            }


            if (
                action ===
                "reject"
            ) {

                rejectRequest(
                    requestId
                );

            }

        }
    );

}


// ========================================
// STATUS FILTER
// ========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        function () {

            displayRequests();

        }
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
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


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Sidebar

        loadComponent(
            "sidebar",
            "../../../components/sidebar/sidebar.html"
        );


        // Navbar

        loadComponent(
            "navbar",
            "../../../components/navbar/navbar.html"
        );


        // Requests

        displayRequests();

    }
); 
