

/* =========================
   TRAINER PROFILE JS
========================= */

function initTrainerProfile() {

    /* =========================
       GET PROFILE ELEMENT
    ========================== */

    const profile =
        document.querySelector(".trainer-profile-card");

    if (!profile) {
        console.error("Trainer profile not found.");
        return;
    }


    /* =========================
       GET LOGGED-IN TRAINER
    ========================== */

    const loggedInTrainer =
        localStorage.getItem("loggedInTrainer") ||
        "Ahmed Khan";


    /* =========================
       TRAINER DATA
    ========================== */

    const trainers = {

        "Ahmed Khan": {

            name: "Ahmed Khan",

            type: "Senior Fitness Trainer",

            id: "TRN-001",

            qualification: "Certified Fitness Trainer",

            experience: "5 Years",

            specialization: "Strength & Fitness",

            availability: "Available",

            skills: [
                "Strength Training",
                "Cardio",
                "Weight Management",
                "Fitness Conditioning"
            ],

            services: [
                "Personal Training",
                "Workout Planning",
                "Group Training",
                "Fitness Assessment"
            ]

        },


        "Usman Ahmed": {

            name: "Usman Ahmed",

            type: "Fitness Coach",

            id: "TRN-003",

            qualification: "Fitness Diploma",

            experience: "6 Years",

            specialization: "Bodybuilding & Fitness",

            availability: "Assigned / Busy",

            skills: [
                "Bodybuilding",
                "Strength Training",
                "Fitness Conditioning",
                "Weight Training"
            ],

            services: [
                "Weight Training",
                "Workout Planning",
                "Bodybuilding Training",
                "Fitness Assessment"
            ]

        }

    };


    /* =========================
       FIND TRAINER
    ========================== */

    const trainer =
        trainers[loggedInTrainer];


    if (!trainer) {

        console.error(
            "Trainer profile not found for:",
            loggedInTrainer
        );

        return;

    }


    /* =========================
       BASIC INFORMATION
    ========================== */

    const nameElement =
        document.getElementById(
            "trainerProfileName"
        );

    const typeElement =
        document.getElementById(
            "trainerProfileType"
        );

    const idElement =
        document.getElementById(
            "trainerProfileId"
        );


    if (nameElement) {
        nameElement.textContent =
            trainer.name;
    }

    if (typeElement) {
        typeElement.textContent =
            trainer.type;
    }

    if (idElement) {
        idElement.textContent =
            trainer.id;
    }


    /* =========================
       PROFESSIONAL INFORMATION
    ========================== */

    const qualificationElement =
        document.getElementById(
            "trainerProfileQualification"
        );

    const experienceElement =
        document.getElementById(
            "trainerProfileExperience"
        );

    const specializationElement =
        document.getElementById(
            "trainerProfileSpecialization"
        );

    const availabilityElement =
        document.getElementById(
            "trainerProfileAvailability"
        );


    if (qualificationElement) {

        qualificationElement.textContent =
            trainer.qualification;

    }


    if (experienceElement) {

        experienceElement.textContent =
            trainer.experience;

    }


    if (specializationElement) {

        specializationElement.textContent =
            trainer.specialization;

    }


    if (availabilityElement) {

        availabilityElement.textContent =
            trainer.availability;

    }


    /* =========================
       SKILLS
    ========================== */

    const skillsContainer =
        document.getElementById(
            "trainerProfileSkills"
        );


    if (skillsContainer) {

        skillsContainer.innerHTML = "";

        trainer.skills.forEach(skill => {

            const tag =
                document.createElement("span");

            tag.textContent = skill;

            skillsContainer.appendChild(tag);

        });

    }


    /* =========================
       SERVICES
    ========================== */

    const servicesContainer =
        document.getElementById(
            "trainerProfileServices"
        );


    if (servicesContainer) {

        servicesContainer.innerHTML = "";

        trainer.services.forEach(service => {

            const tag =
                document.createElement("span");

            tag.textContent = service;

            servicesContainer.appendChild(tag);

        });

    }


    /* =========================
       PROFILE LOADED
    ========================== */

    profile.classList.add(
        "profile-loaded"
    );


    console.log(
        "Trainer Profile loaded:",
        trainer.name
    );

}
