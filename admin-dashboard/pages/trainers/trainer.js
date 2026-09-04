
// ========================================
// LOAD COMPONENTS
// ========================================

async function loadComponents() {

    try {

        // =========================
        // LOAD SIDEBAR
        // =========================

        const sidebar =
            document.getElementById("sidebar");

        if (sidebar) {

            const sidebarResponse =
                await fetch("../../components/sidebar/sidebar.html");

            if (!sidebarResponse.ok) {

                throw new Error("Sidebar could not be loaded.");

            }

            sidebar.innerHTML =
                await sidebarResponse.text();

        }


        // =========================
        // LOAD NAVBAR
        // =========================

        const navbar =
            document.getElementById("navbar");

        if (navbar) {

            const navbarResponse =
                await fetch("../../components/navbar/navbar.html" );

            if (!navbarResponse.ok) {

                throw new Error("Navbar could not be loaded.");

            }

            navbar.innerHTML =
                await navbarResponse.text();

        }

    }

    catch (error) {

        console.error(
            "Component loading error:",
            error
        );

    }

}



// ========================================
// SEARCH & STATUS FILTER
// ========================================

function filterTrainers() {

    const searchInput =
        document.getElementById(
            "trainerSearch"
        );

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );

    const tableBody =
        document.getElementById(
            "trainerTableBody"
        );


    if (
        !searchInput ||
        !statusFilter ||
        !tableBody
    ) {

        return;

    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value
            .toLowerCase()
            .trim();


    const rows =
        tableBody.querySelectorAll("tr");


    rows.forEach(function (row) {

        // =========================
        // ROW TEXT
        // =========================

        const rowText =
            row.innerText
                .toLowerCase();


        // =========================
        // TRAINER STATUS
        // =========================

        const statusElement =
            row.querySelector(".status");


        let trainerStatus = "";


        if (statusElement) {

            trainerStatus =
                statusElement.innerText
                    .toLowerCase()
                    .trim();

        }


        // =========================
        // SEARCH MATCH
        // =========================

        const matchesSearch =
            rowText.includes(searchText);


        // =========================
        // STATUS MATCH
        // =========================

        let matchesStatus = true;


        if (
            selectedStatus !== "all"
        ) {

            matchesStatus =
                statusElement
                    ? statusElement.classList.contains(
                        selectedStatus
                    )
                    : false;

        }


        // =========================
        // SHOW / HIDE ROW
        // =========================

        if (
            matchesSearch &&
            matchesStatus
        ) {

            row.style.display = "";

        }
        else {

            row.style.display = "none";

        }

    });

}



// ========================================
// VIEW TRAINER
// ========================================

function setupViewButtons() {

    const buttons =
        document.querySelectorAll(
            ".view-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const row =
                    button.closest("tr");


                if (!row) {
                    return;
                }


                const nameElement =
                    row.querySelector(
                        ".trainer-info strong"
                    );


                const trainerName =
                    nameElement
                        ? nameElement.innerText
                        : "Trainer";


                alert(
                    "Trainer Profile:\n\n" +
                    trainerName
                );

            }
        );

    });

}



// ========================================
// EDIT TRAINER
// ========================================

function setupEditButtons() {

    const buttons =
        document.querySelectorAll(
            ".edit-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const row =
                    button.closest("tr");


                if (!row) {
                    return;
                }


                const nameElement =
                    row.querySelector(
                        ".trainer-info strong"
                    );


                const trainerName =
                    nameElement
                        ? nameElement.innerText
                        : "Trainer";


                alert(
                    "Edit Trainer:\n\n" +
                    trainerName
                );

            }
        );

    });

}



// ========================================
// DELETE TRAINER
// ========================================

function setupDeleteButtons() {

    const buttons =
        document.querySelectorAll(
            ".delete-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const row =
                    button.closest("tr");


                if (!row) {
                    return;
                }


                const nameElement =
                    row.querySelector(
                        ".trainer-info strong"
                    );


                const trainerName =
                    nameElement
                        ? nameElement.innerText
                        : "this trainer";


                const confirmDelete =
                    confirm(
                        "Are you sure you want to delete " +
                        trainerName +
                        "?"
                    );


                if (confirmDelete) {

                    row.remove();


                    alert(
                        trainerName +
                        " has been deleted."
                    );

                }

            }
        );

    });

}



// ========================================
// ADD TRAINER
// ========================================

function setupAddTrainerButton() {

    const addTrainerBtn =
        document.getElementById(
            "addTrainerBtn"
        );


    if (!addTrainerBtn) {
        return;
    }


    addTrainerBtn.addEventListener(
        "click",
        function () {


            // =========================
            // TRAINER NAME
            // =========================

            const trainerName =
                prompt(
                    "Enter Trainer Name:"
                );


            if (!trainerName) {
                return;
            }


            // =========================
            // TRAINER TYPE
            // =========================

            const trainerType =
                prompt(
                    "Enter Trainer Type:"
                );


            if (!trainerType) {
                return;
            }


            // =========================
            // QUALIFICATION
            // =========================

            const qualification =
                prompt(
                    "Enter Qualification:"
                );


            if (!qualification) {
                return;
            }


            // =========================
            // EXPERIENCE
            // =========================

            const experience =
                prompt(
                    "Enter Experience:"
                );


            if (!experience) {
                return;
            }


            // =========================
            // SKILLS
            // =========================

            const skills =
                prompt(
                    "Enter Skills:"
                );


            if (!skills) {
                return;
            }


            // =========================
            // SERVICES
            // =========================

            const services =
                prompt(
                    "Enter Services:"
                );


            if (!services) {
                return;
            }


            // =========================
            // AVAILABLE TIMING
            // =========================

            const timing =
                prompt(
                    "Enter Available Timing:"
                );


            if (!timing) {
                return;
            }


            // =========================
            // STATUS
            // =========================

            const status =
                prompt(
                    "Enter Status:\n\n" +
                    "available\n" +
                    "limited\n" +
                    "busy"
                );


            if (
                !status ||
                ![
                    "available",
                    "limited",
                    "busy"
                ].includes(
                    status.toLowerCase().trim()
                )
            ) {

                alert(
                    "Please enter a valid status:\n" +
                    "available, limited or busy"
                );

                return;

            }


            const trainerStatus =
                status
                    .toLowerCase()
                    .trim();


            // =========================
            // STATUS TEXT
            // =========================

            let statusText = "";


            if (
                trainerStatus === "available"
            ) {

                statusText =
                    "Available";

            }
            else if (
                trainerStatus === "limited"
            ) {

                statusText =
                    "Limited Slot";

            }
            else {

                statusText =
                    "Assigned / Busy";

            }


            // =========================
            // TABLE BODY
            // =========================

            const tableBody =
                document.getElementById(
                    "trainerTableBody"
                );


            if (!tableBody) {
                return;
            }


            // =========================
            // TRAINER ID
            // =========================

            const trainerCount =
                tableBody.querySelectorAll(
                    "tr"
                ).length + 1;


            const trainerId =
                "#" +
                String(
                    trainerCount
                ).padStart(3, "0");


            // =========================
            // CREATE NEW ROW
            // =========================

            const newRow =
                document.createElement("tr");


            newRow.innerHTML = `

                <td>
                    ${trainerId}
                </td>


                <td>

                    <div class="trainer-info">

                        <div class="trainer-icon">

                            <i
                                class="fa-solid fa-user"
                            ></i>

                        </div>


                        <div>

                            <strong>
                                ${trainerName}
                            </strong>

                            <small>
                                ${trainerType}
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${qualification}
                </td>


                <td>
                    ${experience}
                </td>


                <td>
                    ${skills}
                </td>


                <td>
                    ${services}
                </td>


                <td>
                    ${timing}
                </td>


                <td>

                    <span
                        class="status ${trainerStatus}"
                    >
                        ${statusText}
                    </span>

                </td>


                <td>

                    <button
                        class="action-btn view-btn"
                        title="View"
                    >

                        <i
                            class="fa-solid fa-eye"
                        ></i>

                    </button>


                    <button
                        class="action-btn edit-btn"
                        title="Edit"
                    >

                        <i
                            class="fa-solid fa-pen"
                        ></i>

                    </button>


                    <button
                        class="action-btn delete-btn"
                        title="Delete"
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                    </button>

                </td>

            `;


            // =========================
            // ADD ROW TO TABLE
            // =========================

            tableBody.appendChild(
                newRow
            );


            // =========================
            // SETUP NEW BUTTONS
            // =========================

            setupViewButtons();

            setupEditButtons();

            setupDeleteButtons();


            // =========================
            // SUCCESS MESSAGE
            // =========================

            alert(
                trainerName +
                " has been added successfully!"
            );

        }
    );

}



// ========================================
// START TRAINER PAGE
// ========================================

async function startTrainerPage() {

    // Load Sidebar + Navbar

    await loadComponents();


    // =========================
    // SEARCH
    // =========================

    const searchInput =
        document.getElementById(
            "trainerSearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterTrainers
        );

    }


    // =========================
    // STATUS FILTER
    // =========================

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterTrainers
        );

    }


    // =========================
    // BUTTONS
    // =========================

    setupViewButtons();

    setupEditButtons();

    setupDeleteButtons();

    setupAddTrainerButton();

}



// ========================================
// RUN
// ========================================

startTrainerPage();
