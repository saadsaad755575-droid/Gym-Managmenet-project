const TRAINER_STORAGE_KEY = "gymTrainers";


// ========================================
// LOAD CSS
// ========================================

function loadCSS(href, id) {

    if (!document.getElementById(id)) {

        const link =
            document.createElement("link");

        link.id = id;
        link.rel = "stylesheet";
        link.href = href;

        document.head.appendChild(link);

    }

}


// ========================================
// LOAD COMPONENTS
// ========================================

async function loadComponents() {

    try {

        // =========================
        // FONT AWESOME
        // =========================

        loadCSS(
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
            "font-awesome-css"
        );


        // =========================
        // SIDEBAR
        // =========================

        const sidebar =
            document.getElementById("sidebar");


        if (sidebar) {

            const sidebarResponse =
                await fetch(
                    "/components/sidebar/sidebar.html"
                );


            if (!sidebarResponse.ok) {

                throw new Error(
                    "Sidebar could not be loaded."
                );

            }


            const sidebarHTML =
                await sidebarResponse.text();


            const sidebarDocument =
                new DOMParser().parseFromString(
                    sidebarHTML,
                    "text/html"
                );


            const sidebarElement =
                sidebarDocument.querySelector(
                    ".sidebar"
                );


            if (sidebarElement) {

                // Fix logo/profile image paths

                sidebarElement
                    .querySelectorAll("img")
                    .forEach(function (img) {

                        const src =
                            img.getAttribute("src");


                        if (
                            src &&
                            src.includes("../../assets/")
                        ) {

                            img.src =
                                "/assets/" +
                                src.split("../../assets/")[1];

                        }

                    });


                sidebar.innerHTML =
                    sidebarElement.outerHTML;

            }


            loadCSS(
                "/components/sidebar/sidebar.css",
                "sidebar-component-css"
            );

        }


        // =========================
        // NAVBAR
        // =========================

        const navbar =
            document.getElementById("navbar");


        if (navbar) {

            const navbarResponse =
                await fetch(
                    "/components/navbar/navbar.html"
                );


            if (!navbarResponse.ok) {

                throw new Error(
                    "Navbar could not be loaded."
                );

            }


            const navbarHTML =
                await navbarResponse.text();


            const navbarDocument =
                new DOMParser().parseFromString(
                    navbarHTML,
                    "text/html"
                );


            const navbarElement =
                navbarDocument.querySelector(
                    ".navbar"
                );


            if (navbarElement) {

                // Fix admin profile image path

                const profileImage =
                    navbarElement.querySelector("img");


                if (profileImage) {

                    const src =
                        profileImage.getAttribute("src");


                    if (
                        src &&
                        src.includes("../../assets/")
                    ) {

                        profileImage.src =
                            "/assets/" +
                            src.split("../../assets/")[1];

                    }

                }


                navbar.innerHTML =
                    navbarElement.outerHTML;

            }


            loadCSS(
                "/components/navbar/navbar.css",
                "navbar-component-css"
            );

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
// GET SAVED TRAINERS
// ========================================

function getSavedTrainers() {

    const savedTrainers =
        localStorage.getItem(
            TRAINER_STORAGE_KEY
        );


    if (savedTrainers) {

        try {

            return JSON.parse(
                savedTrainers
            );

        }

        catch (error) {

            console.error(
                "Trainer data could not be loaded:",
                error
            );

        }

    }


    // =========================
    // FIRST TIME
    // =========================

    const tableBody =
        document.getElementById(
            "trainerTableBody"
        );


    if (!tableBody) {

        return [];

    }


    const rows =
        tableBody.querySelectorAll("tr");


    const trainers = [];


    rows.forEach(function (row) {

        const cells =
            row.querySelectorAll("td");


        if (cells.length < 8) {

            return;

        }


        const nameElement =
            row.querySelector(
                ".trainer-info strong"
            );


        const typeElement =
            row.querySelector(
                ".trainer-info small"
            );


        const statusElement =
            row.querySelector(
                ".status"
            );


        let status = "busy";


        if (statusElement) {

            if (
                statusElement.classList.contains(
                    "available"
                )
            ) {

                status = "available";

            }

            else if (
                statusElement.classList.contains(
                    "limited"
                )
            ) {

                status = "limited";

            }

            else {

                status = "busy";

            }

        }


        const trainer = {

            id:
                cells[0].innerText.trim(),

            name:
                nameElement
                    ? nameElement.innerText.trim()
                    : "",

            type:
                typeElement
                    ? typeElement.innerText.trim()
                    : "",

            qualification:
                cells[2].innerText.trim(),

            experience:
                cells[3].innerText.trim(),

            skills:
                cells[4].innerText.trim(),

            services:
                cells[5].innerText.trim(),

            timing:
                cells[6].innerText.trim(),

            status:
                status

        };


        trainers.push(
            trainer
        );

    });


    // Save initial #001 #002 #003

    saveTrainers(
        trainers
    );


    return trainers;

}


// ========================================
// SAVE TRAINERS
// ========================================

function saveTrainers(trainers) {

    localStorage.setItem(
        TRAINER_STORAGE_KEY,
        JSON.stringify(trainers)
    );

}


// ========================================
// GET NEXT TRAINER ID
// ========================================

function getNextTrainerId(trainers) {

    let highestId = 0;


    trainers.forEach(function (trainer) {

        const number =
            parseInt(
                trainer.id.replace("#", ""),
                10
            );


        if (
            !isNaN(number) &&
            number > highestId
        ) {

            highestId = number;

        }

    });


    return (
        "#" +
        String(
            highestId + 1
        ).padStart(3, "0")
    );

}


// ========================================
// GET STATUS TEXT
// ========================================

function getStatusText(status) {

    if (status === "available") {

        return "Available";

    }


    if (status === "limited") {

        return "Limited Slot";

    }


    return "Assigned / Busy";

}


// ========================================
// CREATE TRAINER ROW
// ========================================

function createTrainerRow(trainer) {

    const row =
        document.createElement("tr");


    row.dataset.trainerId =
        trainer.id;


    row.innerHTML = `

        <td>
            ${trainer.id}
        </td>


        <td>

            <div class="trainer-info">

                <div class="trainer-icon">

                    <i class="fa-solid fa-user"></i>

                </div>


                <div>

                    <strong>
                        ${trainer.name}
                    </strong>

                    <small>
                        ${trainer.type}
                    </small>

                </div>

            </div>

        </td>


        <td>
            ${trainer.qualification}
        </td>


        <td>
            ${trainer.experience}
        </td>


        <td>
            ${trainer.skills}
        </td>


        <td>
            ${trainer.services}
        </td>


        <td>
            ${trainer.timing}
        </td>


        <td>

            <span class="status ${trainer.status}">

                ${getStatusText(trainer.status)}

            </span>

        </td>


        <td>

            <button
                class="action-btn view-btn"
                title="View"
            >

                <i class="fa-solid fa-eye"></i>

            </button>


            <button
                class="action-btn edit-btn"
                title="Edit"
            >

                <i class="fa-solid fa-pen"></i>

            </button>


            <button
                class="action-btn delete-btn"
                title="Delete"
            >

                <i class="fa-solid fa-trash"></i>

            </button>

        </td>

    `;


    return row;

}


// ========================================
// RENDER TRAINERS
// ========================================

function renderTrainers(trainers) {

    const tableBody =
        document.getElementById(
            "trainerTableBody"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = "";


    trainers.forEach(function (trainer) {

        const row =
            createTrainerRow(
                trainer
            );


        tableBody.appendChild(
            row
        );

    });


    filterTrainers();

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

        const rowText =
            row.innerText
                .toLowerCase();


        const statusElement =
            row.querySelector(".status");


        const matchesSearch =
            rowText.includes(
                searchText
            );


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

    const tableBody =
        document.getElementById(
            "trainerTableBody"
        );


    if (!tableBody) {

        return;

    }


    tableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".view-btn"
                );


            if (!button) {

                return;

            }


            const row =
                button.closest("tr");


            if (!row) {

                return;

            }


            const trainerId =
                row.dataset.trainerId;


            const trainers =
                getSavedTrainers();


            const trainer =
                trainers.find(
                    function (item) {

                        return (
                            item.id === trainerId
                        );

                    }
                );


            if (!trainer) {

                return;

            }


            alert(

                "Trainer Profile:\n\n" +

                "ID: " +
                trainer.id +

                "\nName: " +
                trainer.name +

                "\nType: " +
                trainer.type +

                "\nQualification: " +
                trainer.qualification +

                "\nExperience: " +
                trainer.experience +

                "\nSkills: " +
                trainer.skills +

                "\nServices: " +
                trainer.services +

                "\nAvailable Timing: " +
                trainer.timing +

                "\nStatus: " +
                getStatusText(
                    trainer.status
                )

            );

        }
    );

}


// ========================================
// EDIT TRAINER
// ========================================

function setupEditButtons() {

    const tableBody =
        document.getElementById(
            "trainerTableBody"
        );


    if (!tableBody) {

        return;

    }


    tableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".edit-btn"
                );


            if (!button) {

                return;

            }


            const row =
                button.closest("tr");


            if (!row) {

                return;

            }


            const trainerId =
                row.dataset.trainerId;


            const trainers =
                getSavedTrainers();


            const trainerIndex =
                trainers.findIndex(
                    function (item) {

                        return (
                            item.id === trainerId
                        );

                    }
                );


            if (trainerIndex === -1) {

                return;

            }


            const trainer =
                trainers[trainerIndex];


            // =========================
            // TRAINER NAME
            // =========================

            const trainerName =
                prompt(
                    "Enter Trainer Name:",
                    trainer.name
                );


            if (!trainerName) {

                return;

            }


            // =========================
            // TRAINER TYPE
            // =========================

            const trainerType =
                prompt(
                    "Enter Trainer Type:",
                    trainer.type
                );


            if (!trainerType) {

                return;

            }


            // =========================
            // QUALIFICATION
            // =========================

            const qualification =
                prompt(
                    "Enter Qualification:",
                    trainer.qualification
                );


            if (!qualification) {

                return;

            }


            // =========================
            // EXPERIENCE
            // =========================

            const experience =
                prompt(
                    "Enter Experience:",
                    trainer.experience
                );


            if (!experience) {

                return;

            }


            // =========================
            // SKILLS
            // =========================

            const skills =
                prompt(
                    "Enter Skills:",
                    trainer.skills
                );


            if (!skills) {

                return;

            }


            // =========================
            // SERVICES
            // =========================

            const services =
                prompt(
                    "Enter Services:",
                    trainer.services
                );


            if (!services) {

                return;

            }


            // =========================
            // AVAILABLE TIMING
            // =========================

            const timing =
                prompt(
                    "Enter Available Timing:",
                    trainer.timing
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
                    "busy",

                    trainer.status

                );


            if (
                !status ||
                ![
                    "available",
                    "limited",
                    "busy"
                ].includes(
                    status
                        .toLowerCase()
                        .trim()
                )
            ) {

                alert(
                    "Please enter a valid status:\n" +
                    "available, limited or busy"
                );

                return;

            }


            // =========================
            // UPDATE TRAINER
            // =========================

            trainers[trainerIndex] = {

                id:
                    trainer.id,

                name:
                    trainerName,

                type:
                    trainerType,

                qualification:
                    qualification,

                experience:
                    experience,

                skills:
                    skills,

                services:
                    services,

                timing:
                    timing,

                status:
                    status
                        .toLowerCase()
                        .trim()

            };


            // =========================
            // SAVE
            // =========================

            saveTrainers(
                trainers
            );


            // =========================
            // REFRESH TABLE
            // =========================

            renderTrainers(
                trainers
            );


            alert(
                trainer.name+"has been deleted"
            );
        }
    );
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
            // GET SAVED TRAINERS
            // =========================

            const trainers =
                getSavedTrainers();


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
                    status
                        .toLowerCase()
                        .trim()
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
            // GENERATE ID
            // =========================

            const trainerId =
                getNextTrainerId(
                    trainers
                );


            // =========================
            // CREATE TRAINER OBJECT
            // =========================

            const newTrainer = {

                id:
                    trainerId,

                name:
                    trainerName,

                type:
                    trainerType,

                qualification:
                    qualification,

                experience:
                    experience,

                skills:
                    skills,

                services:
                    services,

                timing:
                    timing,

                status:
                    trainerStatus

            };


            // =========================
            // ADD TO ARRAY
            // =========================

            trainers.push(
                newTrainer
            );


            // =========================
            // SAVE TO LOCAL STORAGE
            // =========================

            saveTrainers(
                trainers
            );


            // =========================
            // DISPLAY
            // =========================

            renderTrainers(
                trainers
            );


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

    // =========================
    // LOAD COMPONENTS
    // =========================

    await loadComponents();


    // =========================
    // LOAD TRAINERS
    // =========================

    const trainers =
        getSavedTrainers();


    renderTrainers(
        trainers
    );


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


