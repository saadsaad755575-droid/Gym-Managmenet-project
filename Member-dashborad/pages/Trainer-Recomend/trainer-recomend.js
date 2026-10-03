
// ========================================
// MEMBER TRAINER RECOMMENDATION
// ========================================


// ========================================
// LOCAL STORAGE KEYS
// ========================================

const MEMBERS_KEY = "gymMembers";
const TRAINERS_KEY = "gymTrainers";
const REQUESTS_KEY = "trainerChangeRequests";


// ========================================
// ELEMENTS
// ========================================

const memberGoal =
    document.getElementById("memberGoal");

const assignedTrainerCard =
    document.getElementById("assignedTrainerCard");

const changeTrainerBtn =
    document.getElementById("changeTrainerBtn");

const trainerSearchPanel =
    document.getElementById("trainerSearchPanel");

const findTrainerBtn =
    document.getElementById("findTrainerBtn");

const trainerDay =
    document.getElementById("trainerDay");

const trainerTime =
    document.getElementById("trainerTime");

const recommendedTrainer =
    document.getElementById("recommendedTrainer");

const alternativeTrainers =
    document.getElementById("alternativeTrainers");

const noTrainerMessage =
    document.getElementById("noTrainerMessage");

const trainerRequestStatus =
    document.getElementById("trainerRequestStatus");

const requestStatusTitle =
    document.getElementById("requestStatusTitle");

const requestStatusMessage =
    document.getElementById("requestStatusMessage");


// ========================================
// CURRENT MEMBER
// ========================================

let currentMember = null;


// ========================================
// GET DATA
// ========================================

function getStorageData(key) {

    const data =
        localStorage.getItem(key);

    if (!data) {
        return [];
    }

    try {

        const parsed =
            JSON.parse(data);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            `Could not read ${key}:`,
            error
        );

        return [];

    }
}


// ========================================
// FIND CURRENT MEMBER
// ========================================

function findCurrentMember() {

    const members =
        getStorageData(MEMBERS_KEY);


    const memberId =
        localStorage.getItem("loggedInMemberId") ||
        localStorage.getItem("currentMemberId");


    const memberName =
        localStorage.getItem("loggedInMemberName");


    if (memberId) {

        const foundMember =
            members.find(function (member) {

                return String(member.id) ===
                    String(memberId);

            });


        if (foundMember) {

            currentMember =
                foundMember;

            return;

        }

    }


    if (memberName) {

        const foundMember =
            members.find(function (member) {

                return String(member.name || "")
                    .toLowerCase() ===
                    String(memberName)
                        .toLowerCase();

            });


        if (foundMember) {

            currentMember =
                foundMember;

            return;

        }

    }


    // Fallback
    if (members.length > 0) {

        currentMember =
            members[0];

    }

}


// ========================================
// FITNESS GOAL
// ========================================

function displayMemberGoal() {

    if (!memberGoal) {
        return;
    }


    if (!currentMember) {

        memberGoal.textContent =
            "Fitness Goal";

        return;

    }


    const goal =
        currentMember.fitnessGoal ||
        currentMember.goal ||
        currentMember.memberGoal ||
        "Not Set";


    memberGoal.textContent =
        goal;

}


// ========================================
// CURRENT TRAINER
// ========================================

function displayAssignedTrainer() {

    if (!assignedTrainerCard) {
        return;
    }


    if (!currentMember) {

        assignedTrainerCard.innerHTML = `

            <div class="trainer-loading">
                <i class="fa-solid fa-user-slash"></i>
                Member information not found.
            </div>

        `;

        return;

    }


    const trainerId =
        currentMember.trainerId ||
        currentMember.assignedTrainerId;


    const trainerName =
        currentMember.trainerName ||
        currentMember.assignedTrainerName;


    if (!trainerId && !trainerName) {

        assignedTrainerCard.innerHTML = `

            <div class="trainer-loading">

                <i class="fa-solid fa-user-slash"></i>

                <span>
                    No trainer is currently assigned.
                </span>

            </div>

        `;

        return;

    }


    const trainers =
        getStorageData(TRAINERS_KEY);


    const trainer =
        trainers.find(function (item) {

            return String(item.id) ===
                String(trainerId);

        });


    const finalName =
        trainer?.name ||
        trainer?.trainerName ||
        trainerName ||
        "Assigned Trainer";


    const qualification =
        trainer?.qualification ||
        "Professional Trainer";


    const status =
        trainer?.status ||
        "Assigned";


    assignedTrainerCard.innerHTML = `

        <div class="trainer-card-content">

            <div class="trainer-avatar">

                <i class="fa-solid fa-user-tie"></i>

            </div>


            <div class="trainer-details">

                <span class="trainer-status">
                    CURRENT TRAINER
                </span>

                <h3>
                    ${escapeHTML(finalName)}
                </h3>

                <p>
                    ${escapeHTML(qualification)}
                </p>

                <span class="trainer-availability">
                    ${escapeHTML(status)}
                </span>

            </div>

        </div>

    `;

}


// ========================================
// CHECK TRAINER STATUS
// ========================================

function isTrainerAvailable(trainer) {

    const status =
        String(
            trainer.status ||
            trainer.availabilityStatus ||
            ""
        ).toLowerCase();


    if (!status) {

        // Agar Admin Trainer Management
        // mein status field nahi hai,
        // trainer ko available maanenge.

        return true;

    }


    return (
        status === "available" ||
        status === "limited slots" ||
        status === "limited"
    );

}


// ========================================
// GET TRAINER DAYS
// ========================================

function getTrainerDays(trainer) {

    let days =
        trainer.availableDays ||
        trainer.availabilityDays ||
        trainer.workingDays ||
        trainer.days ||
        trainer.availableDay;


    if (!days) {

        return [];

    }


    if (Array.isArray(days)) {

        return days.map(function (day) {

            return String(day)
                .toLowerCase();

        });

    }


    return String(days)
        .split(",")
        .map(function (day) {

            return day
                .trim()
                .toLowerCase();

        });

}


// ========================================
// CHECK DAY
// ========================================

function matchesDay(trainer, selectedDay) {

    const days =
        getTrainerDays(trainer);


    // Agar trainer ke Admin data mein
    // day information nahi hai,
    // to day ki wajah se hide nahi hoga.

    if (days.length === 0) {

        return true;

    }


    return days.includes(
        String(selectedDay).toLowerCase()
    );

}


// ========================================
// TIME TO MINUTES
// ========================================

function timeToMinutes(time) {

    if (!time) {
        return null;
    }


    const parts =
        String(time).split(":");


    if (parts.length < 2) {
        return null;
    }


    return (
        Number(parts[0]) * 60 +
        Number(parts[1])
    );

}


// ========================================
// CHECK TIME
// ========================================

function matchesTime(trainer, selectedTime) {

    if (!selectedTime) {

        return true;

    }


    const start =
        trainer.startTime ||
        trainer.availableStartTime ||
        trainer.fromTime ||
        trainer.start;


    const end =
        trainer.endTime ||
        trainer.availableEndTime ||
        trainer.toTime ||
        trainer.end;


    // Agar timing Admin Trainer
    // Management mein nahi hai,
    // to time ki wajah se hide nahi hoga.

    if (!start || !end) {

        return true;

    }


    const selected =
        timeToMinutes(selectedTime);

    const startMinutes =
        timeToMinutes(start);

    const endMinutes =
        timeToMinutes(end);


    if (
        selected === null ||
        startMinutes === null ||
        endMinutes === null
    ) {

        return true;

    }


    return (
        selected >= startMinutes &&
        selected <= endMinutes
    );

}


// ========================================
// FIND MATCHING TRAINERS
// ========================================

function findMatchingTrainers() {

    const trainers =
        getStorageData(TRAINERS_KEY);


    const selectedDay =
        trainerDay.value;


    const selectedTime =
        trainerTime.value;


    return trainers.filter(function (trainer) {

        if (!isTrainerAvailable(trainer)) {

            return false;

        }


        if (
            !matchesDay(
                trainer,
                selectedDay
            )
        ) {

            return false;

        }


        if (
            !matchesTime(
                trainer,
                selectedTime
            )
        ) {

            return false;

        }


        // Current trainer ko
        // recommendation mein dobara show nahi karna.

        const currentTrainerId =
            currentMember?.trainerId ||
            currentMember?.assignedTrainerId;


        if (
            currentTrainerId &&
            String(trainer.id) ===
                String(currentTrainerId)
        ) {

            return false;

        }


        return true;

    });

}


// ========================================
// TRAINER NAME
// ========================================

function getTrainerName(trainer) {

    return (
        trainer.name ||
        trainer.trainerName ||
        trainer.fullName ||
        "Trainer"
    );

}


// ========================================
// TRAINER QUALIFICATION
// ========================================

function getQualification(trainer) {

    return (
        trainer.qualification ||
        trainer.experience ||
        "Professional Trainer"
    );

}


// ========================================
// TRAINER SKILLS
// ========================================

function getSkills(trainer) {

    return (
        trainer.skills ||
        trainer.services ||
        "Fitness Training"
    );

}


// ========================================
// CREATE TRAINER CARD
// ========================================

function createTrainerCard(
    trainer,
    isRecommended = false
) {

    const name =
        getTrainerName(trainer);

    const qualification =
        getQualification(trainer);

    const skills =
        getSkills(trainer);

    const status =
        trainer.status ||
        "Available";


    return `

        <div class="trainer-card">

            <div class="trainer-card-content">

                <div class="trainer-avatar">

                    <i class="fa-solid fa-user-tie"></i>

                </div>


                <div class="trainer-details">

                    ${
                        isRecommended
                        ? `
                            <span class="trainer-status">
                                RECOMMENDED TRAINER
                            </span>
                          `
                        : `
                            <span class="trainer-status">
                                AVAILABLE TRAINER
                            </span>
                          `
                    }


                    <h3>
                        ${escapeHTML(name)}
                    </h3>


                    <p>
                        ${escapeHTML(
                            qualification
                        )}
                    </p>


                    <p>
                        ${escapeHTML(
                            skills
                        )}
                    </p>


                    <span class="trainer-availability">
                        ${escapeHTML(status)}
                    </span>


                    <button
                        type="button"
                        class="request-trainer-btn select-trainer-btn"
                        data-trainer-id="${escapeHTML(
                            trainer.id
                        )}"
                    >

                        <i class="fa-solid fa-user-check"></i>

                        Request This Trainer

                    </button>

                </div>

            </div>

        </div>

    `;

}


// ========================================
// DISPLAY TRAINERS
// ========================================

function displayTrainers(trainers) {

    recommendedTrainer.innerHTML = "";

    alternativeTrainers.innerHTML = "";

    noTrainerMessage.style.display =
        "none";


    if (!trainers.length) {

        noTrainerMessage.style.display =
            "flex";

        return;

    }


    // First trainer = recommended

    recommendedTrainer.innerHTML =
        createTrainerCard(
            trainers[0],
            true
        );


    // Remaining trainers

    if (trainers.length > 1) {

        alternativeTrainers.innerHTML = `

            <div class="section-heading">

                <div>

                    <span class="section-label">
                        OTHER OPTIONS
                    </span>

                    <h3>
                        Alternative Trainers
                    </h3>

                </div>

            </div>

        `;


        trainers
            .slice(1)
            .forEach(function (trainer) {

                alternativeTrainers.innerHTML +=
                    createTrainerCard(
                        trainer,
                        false
                    );

            });

    }

}


// ========================================
// SEND TRAINER REQUEST
// ========================================

function requestTrainer(trainerId) {

    if (!currentMember) {

        alert(
            "Member information could not be found."
        );

        return;

    }


    const trainers =
        getStorageData(TRAINERS_KEY);


    const trainer =
        trainers.find(function (item) {

            return String(item.id) ===
                String(trainerId);

        });


    if (!trainer) {

        alert(
            "Selected trainer was not found."
        );

        return;

    }


    const requests =
        getStorageData(REQUESTS_KEY);


    const request = {

        requestId:
            "TR-" +
            Date.now(),

        memberId:
            currentMember.id,

        memberName:
            currentMember.name ||
            currentMember.memberName ||
            "Member",

        currentTrainerId:
            currentMember.trainerId ||
            currentMember.assignedTrainerId ||
            "",

        currentTrainerName:
            currentMember.trainerName ||
            currentMember.assignedTrainerName ||
            "",

        requestedTrainerId:
            trainer.id,

        requestedTrainerName:
            getTrainerName(trainer),

        day:
            trainerDay.value,

        time:
            trainerTime.value,

        requestDate:
            new Date().toISOString(),

        status:
            "Pending"

    };


    requests.push(request);


    localStorage.setItem(
        REQUESTS_KEY,
        JSON.stringify(requests)
    );


    showRequestStatus(
        request
    );


    alert(
        "Trainer change request sent successfully. Waiting for Admin approval."
    );

}


// ========================================
// REQUEST STATUS
// ========================================

function showRequestStatus(request) {

    if (!trainerRequestStatus) {
        return;
    }


    trainerRequestStatus.style.display =
        "flex";


    if (request.status === "Pending") {

        requestStatusTitle.textContent =
            "Request Pending";

        requestStatusMessage.textContent =
            `Your request for ${request.requestedTrainerName} is waiting for Admin approval.`;

    }


    if (request.status === "Approved") {

        requestStatusTitle.textContent =
            "Request Approved";

        requestStatusMessage.textContent =
            `Your trainer has been changed to ${request.requestedTrainerName}.`;

    }


    if (request.status === "Rejected") {

        requestStatusTitle.textContent =
            "Request Rejected";

        requestStatusMessage.textContent =
            "Your trainer change request was rejected by Admin.";

    }

}


// ========================================
// CHECK EXISTING REQUEST
// ========================================

function checkRequestStatus() {

    if (!currentMember) {
        return;
    }


    const requests =
        getStorageData(REQUESTS_KEY);


    const memberRequests =
        requests
            .filter(function (request) {

                return String(
                    request.memberId
                ) === String(
                    currentMember.id
                );

            })
            .sort(function (a, b) {

                return new Date(
                    b.requestDate
                ) - new Date(
                    a.requestDate
                );

            });


    if (!memberRequests.length) {

        return;

    }


    const latestRequest =
        memberRequests[0];


    showRequestStatus(
        latestRequest
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// CHANGE TRAINER BUTTON
// ========================================

if (changeTrainerBtn) {

    changeTrainerBtn.addEventListener(
        "click",
        function () {

            if (
                trainerSearchPanel.style.display ===
                "none"
            ) {

                trainerSearchPanel.style.display =
                    "block";

            } else {

                trainerSearchPanel.style.display =
                    "none";

            }

        }
    );

}


// ========================================
// FIND TRAINER BUTTON
// ========================================

if (findTrainerBtn) {

    findTrainerBtn.addEventListener(
        "click",
        function () {

            if (!trainerDay.value) {

                alert(
                    "Please select a day."
                );

                return;

            }


            if (!trainerTime.value) {

                alert(
                    "Please select a time."
                );

                return;

            }


            const trainers =
                findMatchingTrainers();


            displayTrainers(
                trainers
            );

        }
    );

}


// ========================================
// TRAINER REQUEST BUTTONS
// ========================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".select-trainer-btn"
            );


        if (!button) {
            return;
        }


        const trainerId =
            button.dataset.trainerId;


        if (!trainerId) {
            return;
        }


        requestTrainer(
            trainerId
        );

    }
);


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Load Member Sidebar

        loadComponent(
            "member-sidebar",
            "../../../components/member-sidebar/member-sidebar.html"
        );


        // Load Member Navbar

        loadComponent(
            "member-navbar",
            "../../../components/member-navbar/member-navbar.html"
        );
        // Find logged-in member

        findCurrentMember();


        // Display member information

        displayMemberGoal();


        displayAssignedTrainer();


        // Show latest request

        checkRequestStatus();

    }
);


// ========================================
// COMPONENT LOADER
// ========================================

function loadComponent(
    elementId,
    filePath
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    fetch(filePath)
        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    `Component could not be loaded: ${filePath}`
                );

            }

            return response.text();

        })
        .then(function (data) {

            element.innerHTML =
                data;

        })
        .catch(function (error) {

            console.error(
                error
            );

        });

}

