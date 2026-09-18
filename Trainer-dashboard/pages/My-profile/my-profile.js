/* =========================
   MY PROFILE JS
========================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =========================
       STORAGE
    ========================== */

    const TRAINER_STORAGE_KEY = "gymTrainers";


    /* =========================
       ELEMENTS
    ========================== */

    const profileName =
        document.getElementById("profileName");

    const profileType =
        document.getElementById("profileType");

    const profileId =
        document.getElementById("profileId");

    const trainerName =
        document.getElementById("trainerName");

    const trainerType =
        document.getElementById("trainerType");

    const trainerQualification =
        document.getElementById("trainerQualification");

    const trainerExperience =
        document.getElementById("trainerExperience");

    const trainerTiming =
        document.getElementById("trainerTiming");

    const trainerStatus =
        document.getElementById("trainerStatus");

    const trainerSkills =
        document.getElementById("trainerSkills");

    const trainerServices =
        document.getElementById("trainerServices");

    const profileMessage =
        document.getElementById("profileMessage");

    const editProfile =
        document.getElementById("editProfile");

    const saveProfile =
        document.getElementById("saveProfile");

    const deleteProfile =
        document.getElementById("deleteProfile");


    /* =========================
       CURRENT TRAINER
    ========================== */

    const loggedInTrainer =
        localStorage.getItem("loggedInTrainer") || "";


    /* =========================
       GET TRAINERS
    ========================== */

    function getTrainers() {

        return JSON.parse(
            localStorage.getItem(TRAINER_STORAGE_KEY)
        ) || [];

    }


    /* =========================
       SAVE TRAINERS
    ========================== */

    function saveTrainers(trainers) {

        localStorage.setItem(
            TRAINER_STORAGE_KEY,
            JSON.stringify(trainers)
        );

    }


    /* =========================
       SHOW MESSAGE
    ========================== */

    function showMessage(message) {

        profileMessage.textContent = message;

    }


    /* =========================
       FIND CURRENT TRAINER
    ========================== */

    function getCurrentTrainer() {

        const trainers = getTrainers();

        return trainers.find(trainer =>
            String(trainer.name || "")
                .trim()
                .toLowerCase()
            ===
            loggedInTrainer
                .trim()
                .toLowerCase()
        );

    }


    /* =========================
       LOAD PROFILE
    ========================== */

    function loadProfile() {

        const trainer =
            getCurrentTrainer();


        if (!trainer) {

            showMessage(
                "Trainer profile could not be found."
            );

            return;

        }


        /* =========================
           HEADER DATA
        ========================== */

        profileName.textContent =
            trainer.name || "-";

        profileType.textContent =
            trainer.type || "-";

        profileId.textContent =
            "Trainer ID: " +
            (trainer.id || "-");


        /* =========================
           FORM DATA
        ========================== */

        trainerName.value =
            trainer.name || "";

        trainerType.value =
            trainer.type || "";

        trainerQualification.value =
            trainer.qualification || "";

        trainerExperience.value =
            trainer.experience || "";

        trainerTiming.value =
            trainer.timing || "";

        trainerStatus.value =
            trainer.status || "";

        trainerSkills.value =
            trainer.skills || "";

        trainerServices.value =
            trainer.services || "";


        /* =========================
           READ ONLY MODE
        ========================== */

        setEditMode(false);

    }


    /* =========================
       EDIT MODE
    ========================== */

    function setEditMode(enabled) {

        trainerName.disabled =
            !enabled;

        trainerQualification.disabled =
            !enabled;

        trainerExperience.disabled =
            !enabled;

        trainerTiming.disabled =
            !enabled;

        trainerStatus.disabled =
            !enabled;

        trainerSkills.disabled =
            !enabled;

        trainerServices.disabled =
            !enabled;


        trainerType.disabled = true;

    }


    /* =========================
       EDIT PROFILE
    ========================== */

    editProfile.addEventListener(
        "click",
        () => {

            showMessage("");

            setEditMode(true);

            trainerName.focus();

        }
    );


    /* =========================
       SAVE PROFILE
    ========================== */

    saveProfile.addEventListener(
        "click",
        () => {

            const trainers =
                getTrainers();


            const trainerIndex =
                trainers.findIndex(trainer =>
                    String(trainer.name || "")
                        .trim()
                        .toLowerCase()
                    ===
                    loggedInTrainer
                        .trim()
                        .toLowerCase()
                );


            if (trainerIndex === -1) {

                showMessage(
                    "Trainer profile could not be found."
                );

                return;

            }


            /* =========================
               VALIDATION
            ========================== */

            if (
                trainerName.value.trim() === ""
            ) {

                showMessage(
                    "Please enter your full name."
                );

                trainerName.focus();

                return;

            }


            if (
                trainerQualification.value.trim() === ""
            ) {

                showMessage(
                    "Please enter your qualification."
                );

                trainerQualification.focus();

                return;

            }


            if (
                trainerExperience.value.trim() === ""
            ) {

                showMessage(
                    "Please enter your experience."
                );

                trainerExperience.focus();

                return;

            }


            if (
                trainerTiming.value.trim() === ""
            ) {

                showMessage(
                    "Please enter your working hours."
                );

                trainerTiming.focus();

                return;

            }


            if (
                trainerStatus.value === ""
            ) {

                showMessage(
                    "Please select your status."
                );

                trainerStatus.focus();

                return;

            }


            if (
                trainerSkills.value.trim() === ""
            ) {

                showMessage(
                    "Please enter your skills."
                );

                trainerSkills.focus();

                return;

            }


            if (
                trainerServices.value.trim() === ""
            ) {

                showMessage(
                    "Please enter your services."
                );

                trainerServices.focus();

                return;

            }


            /* =========================
               UPDATE EXISTING TRAINER
            ========================== */

            trainers[trainerIndex].name =
                trainerName.value.trim();

            trainers[trainerIndex].qualification =
                trainerQualification.value.trim();

            trainers[trainerIndex].experience =
                trainerExperience.value.trim();

            trainers[trainerIndex].timing =
                trainerTiming.value.trim();

            trainers[trainerIndex].status =
                trainerStatus.value;

            trainers[trainerIndex].skills =
                trainerSkills.value.trim();

            trainers[trainerIndex].services =
                trainerServices.value.trim();


            /* =========================
               SAVE
            ========================== */

            saveTrainers(trainers);


            

            showMessage(
                "Profile updated successfully."
            );


            /* =========================
               REFRESH PROFILE
            ========================== */

            loadProfile();

        }
    );


    /* =========================
       DELETE PROFILE
    ========================== */

    deleteProfile.addEventListener(
        "click",
        () => {

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete your profile?"
                );


            if (!confirmDelete) {

                return;

            }


            const trainers =
                getTrainers();


            const updatedTrainers =
                trainers.filter(trainer =>
                    String(trainer.name || "")
                        .trim()
                        .toLowerCase()
                    !==
                    loggedInTrainer
                        .trim()
                        .toLowerCase()
                );


            saveTrainers(
                updatedTrainers
            );


            localStorage.removeItem(
                "loggedInTrainer"
            );

            localStorage.removeItem(
                "loggedInTrainerEmail"
            );


            window.location.href =
                "../login/login.html";

        }
    );


    /* =========================
       LOAD TRAINER SIDEBAR
    ========================== */

    function loadComponent(
        elementId,
        filePath
    ) {

        const element =
            document.getElementById(elementId);


        if (!element) return;


        fetch(filePath)
            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Could not load ${filePath}`
                    );

                }

                return response.text();

            })
            .then(data => {

                element.innerHTML = data;


                if (
                    elementId ===
                    "trainer-sidebar"
                ) {

                    if (
                        typeof initTrainerSidebar ===
                        "function"
                    ) {

                        initTrainerSidebar();

                    }

                }


                if (
                    elementId ===
                    "trainer-navbar"
                ) {

                    if (
                        typeof initTrainerNavbar ===
                        "function"
                    ) {

                        initTrainerNavbar();

                    }

                }

            })
            .catch(error => {

                console.error(error);

                element.innerHTML =
                    `<p style="
                        color:#f5b900;
                        padding:20px;
                    ">
                        Component could not be loaded.
                    </p>`;

            });

    }


    /* =========================
       INITIALIZE COMPONENTS
    ========================== */

    loadComponent(
        "trainer-sidebar",
        "/components/trainer.sidebar/trainer.sidebar.html"
    );

    loadComponent(
        "trainer-navbar",
        "/components/trainer-navbar/trainer-navbar.html"
    );


    /* =========================
       INITIAL PROFILE LOAD
    ========================== */

    if (!loggedInTrainer) {

        showMessage(
            "No logged-in trainer found."
        );

        return;

    }


    loadProfile();

});
