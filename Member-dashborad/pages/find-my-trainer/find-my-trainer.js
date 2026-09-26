/* =========================================================
   FIND MY TRAINER JS
   Member Dashboard
========================================================= */


/* =========================================================
   DOM CONTENT LOADED
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadMemberComponents();

    loadTrainers();

    setupTrainerEvents();

});


/* =========================================================
   LOAD MEMBER SIDEBAR + NAVBAR
========================================================= */

function loadMemberComponents() {

    loadComponent(
        "member-sidebar",
        "../../../components/member-sidebar/member-sidebar.html"
    );


    loadComponent(
        "member-navbar",
        "../../../components/member-navbar/member-navbar.html"
    );

}


/* =========================================================
   LOAD COMPONENT
========================================================= */

function loadComponent(containerId, filePath) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(
            "Component container not found:",
            containerId
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

        .then(function (data) {

            container.innerHTML = data;


            /*=======
             * Member Navbar initialization
             =========*/

            if (
                containerId === "member-navbar" &&
                typeof initMemberNavbar === "function"
            ) {

                initMemberNavbar();

            }

        })

        .catch(function (error) {

            console.error(error);

            container.innerHTML =
                "<p>Component could not be loaded.</p>";

        });

}


/* =========================================================
   LOAD TRAINERS
========================================================= */

function loadTrainers() {

    const trainers = getExistingTrainerData();


    console.log(
        "Existing Trainer Data:",
        trainers
    );


    if (!trainers || trainers.length === 0) {

        showNoTrainerMessage();

        updateTrainerCount(0);

        return;

    }


    populateSpecializationFilter(trainers);

    renderTrainerCards(trainers);

}


/* =========================================================
   GET EXISTING TRAINER DATA
========================================================= */

function getExistingTrainerData() {



    const possibleKeys = [

        "gymTrainers","trainers","gymTrainer","trainerData",

        "trainerProfiles"

    ];


    for (let key of possibleKeys) {

        const storedData =
            localStorage.getItem(key);


        if (!storedData) {
            continue;
        }


        try {

            const parsedData =
                JSON.parse(storedData);


            /*
             * If data is already an array
             */

            if (Array.isArray(parsedData)) {

                return parsedData;

            }

            if (
                typeof parsedData === "object" &&
                parsedData !== null
            ) {

                return [parsedData];

            }

        }

        catch (error) {

            console.error(
                "Invalid trainer data in localStorage:",
                key,error
            );

        }

    }


    return [];

}


/* =========================================================
   POPULATE SPECIALIZATION FILTER
========================================================= */

function populateSpecializationFilter(trainers) {

    const select =
        document.getElementById(
            "trainerSpecializationFilter"
        );


    if (!select) {
        return;
    }


    const specializations = [];


    trainers.forEach(function (trainer) {

        const specialization =
            trainer.specialization || trainer.trainerSpecialization ||
            trainer.trainerType ||trainer.speciality ||
            trainer.skills;


        if (
            specialization &&
            !specializations.includes(specialization)
        ) {

            specializations.push(
                specialization
            );

        }

    });


    specializations.sort();


    specializations.forEach(function (specialization) {

        const option = document.createElement("option");


        option.value = specialization;

        option.textContent = specialization;


        select.appendChild(option);

    });

}


/* =========================================================
   RENDER TRAINER CARDS
========================================================= */

function renderTrainerCards(trainers) {

    const cardsContainer = document.getElementById("trainerCards");


    const noTrainerMessage = document.getElementById("noTrainerMessage");


    if (!cardsContainer) {
        return;
    }


    cardsContainer.innerHTML = "";


    if (!trainers || trainers.length === 0) {

        if (noTrainerMessage) {
            noTrainerMessage.style.display = "flex";
        }

        updateTrainerCount(0);

        return;

    }


    if (noTrainerMessage) {
        noTrainerMessage.style.display = "none";
    }


    trainers.forEach(function (trainer, index) {

        const card =
            createTrainerCard(
                trainer,
                index
            );


        cardsContainer.appendChild(card);

    });


    updateTrainerCount(trainers.length);

}


/* =========================================================
   CREATE TRAINER CARD
========================================================= */

function createTrainerCard(trainer, index) {

    const card =
        document.createElement("div");


    card.className = "trainer-card";


    /*
     * Existing trainer fields
     */

    const name =
        trainer.name ||trainer.trainerName ||
        trainer.fullName ||"Trainer";


    const specialization =
        trainer.specialization ||trainer.trainerSpecialization ||
        trainer.trainerType || trainer.speciality ||
        "Fitness Trainer";


    const trainerId =
        trainer.id ||trainer.trainerId ||
        trainer.employeeId || "-";


    const experience =
        trainer.experience ||trainer.trainerExperience ||
        trainer.yearsOfExperience || "-";


    const skills =
        trainer.skills || trainer.skillsServices ||
        trainer.services || trainer.specialization ||
        "-";


    const availability =
        trainer.availability ||trainer.status ||
        trainer.trainerAvailability ||
        "Available";


    const isAvailable =
        String(availability)
            .toLowerCase() .includes("available");


    card.innerHTML = `

        <div class="trainer-card-top">

            <div class="trainer-card-avatar">

                <i class="fa-solid fa-user-tie"></i>

            </div>


            <div>

                <h3 class="trainer-card-name">
                    ${escapeHTML(name)}
                </h3>


                <p class="trainer-card-specialization">
                    ${escapeHTML(specialization)}
                </p>


                <span
                    class="trainer-availability
                    ${isAvailable ? "available" : "unavailable"}">

                    <i class="fa-solid
                        ${isAvailable
                            ? "fa-circle-check"
                            : "fa-circle-xmark"}">
                    </i>

                    ${escapeHTML(availability)}

                </span>

            </div>

        </div>


        <div class="trainer-card-details">


            <div class="trainer-card-detail">

                <i class="fa-solid fa-id-card"></i>

                <strong>
                    ID: ${escapeHTML(trainerId)}
                </strong>

            </div>


            <div class="trainer-card-detail">

                <i class="fa-solid fa-briefcase"></i>

                <strong>
                    Experience:
                    ${escapeHTML(experience)}
                </strong>

            </div>


            <div class="trainer-card-detail">

                <i class="fa-solid fa-dumbbell"></i>

                <strong>
                    ${escapeHTML(skills)}
                </strong>

            </div>


        </div>


        <div class="trainer-card-actions">


            <button
                type="button"
                class="view-trainer-btn"
                data-index="${index}">

                <i class="fa-solid fa-eye"></i>

                View Profile

            </button>


            <button
                type="button"
                class="select-trainer-card-btn"
                data-index="${index}">

                <i class="fa-solid fa-user-check"></i>

                Select

            </button>


        </div>`;


    return card;

}


/* =========================================================
   SETUP TRAINER EVENTS
========================================================= */

function setupTrainerEvents() {


    const searchInput =
        document.getElementById(
            "trainerSearchInput"
        );


    const specializationFilter =
        document.getElementById(
            "trainerSpecializationFilter"
        );


    const availabilityFilter =
        document.getElementById(
            "trainerAvailabilityFilter"
        );


    const closeButton =
        document.getElementById(
            "closeTrainerProfile"
        );


    const modal =
        document.getElementById(
            "trainerProfileModal"
        );


    /* -----------------------------------------
       SEARCH
    ----------------------------------------- */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyTrainerFilters
        );

    }


    /* -----------------------------------------
       SPECIALIZATION
    ----------------------------------------- */

    if (specializationFilter) {

        specializationFilter.addEventListener(
            "change",
            applyTrainerFilters
        );

    }


    /* -----------------------------------------
       AVAILABILITY
    ----------------------------------------- */

    if (availabilityFilter) {

        availabilityFilter.addEventListener(
            "change",
            applyTrainerFilters
        );

    }


    /* -----------------------------------------
       CLOSE MODAL
    ----------------------------------------- */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeTrainerModal
        );

    }


    /* -----------------------------------------
       CLICK OUTSIDE MODAL
    ----------------------------------------- */

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {

                    closeTrainerModal();

                }

            }
        );

    }


    /* -----------------------------------------
       CARD BUTTON EVENTS
    ----------------------------------------- */

    const cardsContainer =
        document.getElementById(
            "trainerCards"
        );


    if (cardsContainer) {

        cardsContainer.addEventListener(
            "click",
            handleTrainerCardClick
        );

    }

}


/* =========================================================
   FILTER TRAINERS
========================================================= */

function applyTrainerFilters() {

    const trainers =
        getExistingTrainerData();


    const searchInput =
        document.getElementById(
            "trainerSearchInput"
        );


    const specializationFilter =
        document.getElementById(
            "trainerSpecializationFilter"
        );


    const availabilityFilter =
        document.getElementById(
            "trainerAvailabilityFilter"
        );


    const searchValue =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const specializationValue =
        specializationFilter
            ? specializationFilter.value
            : "all";


    const availabilityValue =
        availabilityFilter
            ? availabilityFilter.value
                .toLowerCase()
            : "all";


    const filteredTrainers =
        trainers.filter(function (trainer) {


            const name =
                trainer.name ||
                trainer.trainerName ||
                trainer.fullName ||
                "";


            const specialization =
                trainer.specialization ||
                trainer.trainerSpecialization ||
                trainer.trainerType ||
                trainer.speciality ||
                "";


            const availability =
                trainer.availability ||
                trainer.status ||
                trainer.trainerAvailability ||
                "";


            const searchableText =
                (
                    name +
                    " " +
                    specialization
                )
                    .toLowerCase();


            const matchesSearch =
                searchableText.includes(
                    searchValue
                );


            const matchesSpecialization =
                specializationValue === "all" ||
                specialization === specializationValue;


            const normalizedAvailability =
                String(availability)
                    .toLowerCase();


            const matchesAvailability =
                availabilityValue === "all" ||

                (
                    availabilityValue === "available" &&
                    normalizedAvailability.includes("available")
                ) ||

                (
                    availabilityValue === "unavailable" &&
                    !normalizedAvailability.includes("available")
                );


            return (
                matchesSearch &&
                matchesSpecialization &&
                matchesAvailability
            );

        });


    renderTrainerCards(
        filteredTrainers
    );

}


/* =========================================================
   HANDLE CARD BUTTON CLICK
========================================================= */

function handleTrainerCardClick(event) {

    const button =
        event.target.closest("button");


    if (!button) {
        return;
    }


    const index =
        Number(button.dataset.index);


    const trainers =
        getExistingTrainerData();


    const trainer =
        trainers[index];


    if (!trainer) {
        return;
    }


    /* -----------------------------------------
       VIEW PROFILE
    ----------------------------------------- */

    if (
        button.classList.contains(
            "view-trainer-btn"
        )
    ) {

        openTrainerProfile(trainer);

        return;

    }


    /* -----------------------------------------
       SELECT TRAINER
    ----------------------------------------- */

    if (
        button.classList.contains(
            "select-trainer-card-btn"
        )
    ) {

        selectTrainer(trainer);

    }

}


/* =========================================================
   OPEN TRAINER PROFILE
========================================================= */

function openTrainerProfile(trainer) {

    const modal =
        document.getElementById(
            "trainerProfileModal"
        );


    if (!modal) {
        return;
    }


    const name =
        trainer.name ||
        trainer.trainerName ||
        trainer.fullName ||
        "Trainer";


    const specialization =
        trainer.specialization ||
        trainer.trainerSpecialization ||
        trainer.trainerType ||
        trainer.speciality ||
        "-";


    const trainerId =
        trainer.id ||
        trainer.trainerId ||
        trainer.employeeId ||
        "-";


    const experience =
        trainer.experience ||
        trainer.trainerExperience ||
        trainer.yearsOfExperience ||
        "-";


    const skills =
        trainer.skills ||
        trainer.skillsServices ||
        trainer.services ||
        trainer.specialization ||
        "-";


    const availability =
        trainer.availability ||
        trainer.status ||
        trainer.trainerAvailability ||
        "-";


    document.getElementById(
        "profileTrainerName"
    ).textContent = name;


    document.getElementById(
        "profileTrainerSpecialization"
    ).textContent = specialization;


    document.getElementById(
        "profileTrainerId"
    ).textContent = trainerId;


    document.getElementById(
        "profileTrainerExperience"
    ).textContent = experience;


    document.getElementById(
        "profileTrainerSkill"
    ).textContent = skills;


    document.getElementById(
        "profileTrainerAvailability"
    ).textContent = availability;


    modal.dataset.trainerId =
        trainerId;


    modal._selectedTrainer =
        trainer;


    modal.classList.add("show");


    const selectButton =
        document.getElementById(
            "selectTrainerBtn"
        );


    if (selectButton) {

        selectButton.onclick =
            function () {

                selectTrainer(trainer);

            };

    }

}


/* =========================================================
   CLOSE TRAINER MODAL
========================================================= */

function closeTrainerModal() {

    const modal =
        document.getElementById(
            "trainerProfileModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove("show");

}


/* =========================================================
   SELECT TRAINER
========================================================= */

function selectTrainer(trainer) {



    const member =
        getLoggedInMember();


    if (!member) {

        alert(
            "Member information not found."
        );

        return;

    }


    console.log(
        "Selected Trainer:",
        trainer
    );

    const trainerName =
        trainer.name || trainer.trainerName ||
        trainer.fullName || "";


    const trainerId =
        trainer.id || trainer.trainerId ||
        trainer.employeeId || "";


    member.trainerName = trainerName;


    member.trainerId = trainerId;

    const members =
        JSON.parse(
            localStorage.getItem("gymMembers")
        ) || [];


    const memberId =
        member.id || member.memberId ||
        member.customerId;


    const memberIndex =
        members.findIndex(function (item) {

            const itemId =
                item.id ||item.memberId ||
                item.customerId;


            return (
                String(itemId) === String(memberId)
            );

        });


    if (memberIndex !== -1) {

        members[memberIndex] = {

            ...members[memberIndex],

            trainerName:trainerName,

            trainerId: trainerId

        };


        localStorage.setItem(
            "gymMembers",JSON.stringify(members)
        );

    }

    localStorage.setItem("loggedInMember",JSON.stringify(member)
    );


    closeTrainerModal();


    alert(
        "Trainer selected successfully."
    );

    loadTrainers();

}


/* =========================================================
   GET LOGGED-IN MEMBER
========================================================= */

function getLoggedInMember() {

    const loggedInMember =
        localStorage.getItem("loggedInMember");


    if (loggedInMember) {

        try {

            return JSON.parse(loggedInMember);

        }

        catch (error) {

            console.error("Invalid loggedInMember data.",
                error);

        }

    }

    const loggedInMemberId =
        localStorage.getItem("loggedInMemberId");


    const members =
        JSON.parse( localStorage.getItem("gymMembers")
        ) || [];


    if (loggedInMemberId) {

        return members.find(function (member) {

            const id =
                member.id || member.memberId ||
                member.customerId;


            return (
                String(id) === String(loggedInMemberId)
            );
        }) || null;

    }


    return null;

}


/* =========================================================
   UPDATE TRAINER COUNT
========================================================= */

function updateTrainerCount(count) {

    const resultCount =
        document.getElementById("trainerResultCount");


    if (!resultCount) {
        return;
    }


    resultCount.textContent =
        count + (
            count === 1
                ? " Trainer Found": " Trainers Found"
        );

}


/* ===============================
   SHOW NO TRAINER MESSAGE
============================= */

function showNoTrainerMessage() {

    const message = document.getElementById(
            "noTrainerMessage"
        );


    if (message) {

        message.style.display = "flex";

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

} 
