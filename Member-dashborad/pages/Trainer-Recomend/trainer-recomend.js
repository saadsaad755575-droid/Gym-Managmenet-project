
/* ========================================
   EXPERT / TRAINER RECOMMENDATION PAGE
======================================== */


/* ========================================
   STORAGE KEYS
======================================== */

const MEMBER_STORAGE_KEY = "gymMembers";
const TRAINER_STORAGE_KEY = "gymTrainers";


/* ========================================
   PAGE LOAD
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =========================
           LOAD MEMBER SIDEBAR
        ========================== */

        loadComponent(
            "member-sidebar",
            "../../../components/member-sidebar/member-sidebar.html"
        );


        /* =========================
           LOAD MEMBER NAVBAR
        ========================== */

        loadComponent(
            "member-navbar",
            "../../../components/member-navbar/member-navbar.html"
        );


        /* =========================
           LOAD EXPERT PAGE
        ========================== */

        loadExpertPage();

    }
);



/* ========================================
   LOAD COMPONENT
======================================== */

function loadComponent(
    containerId, filePath
) {

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

            const container =
                document.getElementById(containerId);


            if (!container) {

                console.error(
                    "Container not found:", containerId
                );

                return;

            }


            /* =========================
               INSERT COMPONENT
            ========================== */

            container.innerHTML = data;


            /* =========================
               INITIALIZE SIDEBAR
            ========================== */

            if (
                containerId === "member-sidebar" &&
                typeof initializeMemberSidebar === "function"
            ) {

                initializeMemberSidebar();

            }


            /* =========================
               INITIALIZE NAVBAR
            ========================== */

            if (
                containerId === "member-navbar" &&
                typeof initMemberNavbar === "function"
            ) {

                initMemberNavbar();

            }

        })

        .catch(function (error) {

            console.error(
                "Component Loading Error:",
                error
            );

        });

}



/* ========================================
   MAIN EXPERT PAGE
======================================== */

function loadExpertPage() {

    try {

        /* =========================
           GET MEMBERS
        ========================== */

        const members =
            getStorageArray(
                MEMBER_STORAGE_KEY
            );


        /* =========================
           GET TRAINERS
        ========================== */

        const trainers =
            getStorageArray(
                TRAINER_STORAGE_KEY
            );


        /* =========================
           CHECK MEMBER DATA
        ========================== */

        if (members.length === 0) {

            showNoTrainerMessage(
                "No member data found."
            );

            return;

        }


        /* =========================
           CURRENT MEMBER
        ========================== */

        const currentMember = getCurrentMember(members);


        if (!currentMember) {

            showNoTrainerMessage(
                "Current member could not be found."
            );

            return;

        }


        /* =========================
           MEMBER FITNESS GOAL
        ========================== */

        const memberGoal = getMemberGoal(currentMember);


        displayMemberGoal(memberGoal);


        /* =========================
           ASSIGNED TRAINER
        ========================== */

        const assignedTrainerName =
            getAssignedTrainerName(
                currentMember
            );


        const assignedTrainer =
            findTrainerByName(
                trainers, assignedTrainerName
            );


        renderAssignedTrainer(
            assignedTrainer,assignedTrainerName
        );


        /* =========================
           FIND RECOMMENDED TRAINER
        ========================== */

        const recommendation =
            getTrainerRecommendations(
                trainers, memberGoal, assignedTrainer
            );


        /* =========================
           MAIN RECOMMENDATION
        ========================== */

        if (
            recommendation && recommendation.primary
        ) {

            renderRecommendedTrainer(
                recommendation.primary,memberGoal
            );

        }
        else {

            clearRecommendedTrainer();

        }


        /* =========================
           ALTERNATIVE TRAINERS
        ========================== */

        renderAlternativeTrainers(
            recommendation
                ? recommendation.alternatives
                : [],memberGoal
        );


        /* =========================
           NO TRAINER MESSAGE
        ========================== */

        if (
            !recommendation ||
            (
                !recommendation.primary &&
                recommendation.alternatives.length === 0
            )
        ) {

            showNoTrainerMessage(
                "No trainer currently matches your fitness goal."
            );

        }
        else {

            hideNoTrainerMessage();

        }

    }
    catch (error) {

        console.error(
            "Expert Page Error:", error
        );

    }

}



/* ========================================
   GET STORAGE ARRAY
======================================== */

function getStorageArray(key) {

    try {

        const data = localStorage.getItem(key);


        if (!data) {

            return [];

        }


        const parsed = JSON.parse(data);


        return Array.isArray(parsed)
            ? parsed: [];

    }
    catch (error) {

        console.error(
            "Invalid localStorage data:",
            key, error
        );

        return [];

    }

}



/* ========================================
   GET CURRENT MEMBER
======================================== */

function getCurrentMember(members) {

    const loggedInMemberId =
        localStorage.getItem(
            "loggedInMemberId"
        );


    const memberId =
        localStorage.getItem("memberId" );


    const currentMemberId =
        localStorage.getItem(
            "currentMemberId"
        );


    const possibleIds = [

        loggedInMemberId,
        memberId,
        currentMemberId

    ].filter(Boolean);


    /* =========================
       FIND BY LOGIN ID
    ========================== */

    if (possibleIds.length > 0) {

        const foundMember =
            members.find(
                function (member) {

                    const id =
                        String(
                            member.id ||
                            member.memberId ||
                            member.customerId ||
                            ""
                        )
                        .trim()
                        .toLowerCase();


                    return possibleIds.some(
                        function (savedId) {

                            return (
                                id ===
                                String(savedId)
                                    .trim()
                                    .toLowerCase()
                            );

                        }
                    );

                }
            );


        if (foundMember) {

            return foundMember;

        }

    }


    /* =========================
       FALLBACK
    ========================== */

    return members[0] || null;

}



/* ========================================
   GET MEMBER GOAL
======================================== */

function getMemberGoal(member) {

    return (

        member.fitnessGoal ||

        member.goal ||

        member.fitness_goal ||

        "Fitness & General Training"

    );

}



/* ========================================
   DISPLAY MEMBER GOAL
======================================== */

function displayMemberGoal(goal) {

    const goalElement =
        document.getElementById(
            "memberGoal"
        );


    if (!goalElement) {

        return;

    }


    goalElement.textContent =
        goal || "Fitness & General Training";

}



/* ========================================
   GET ASSIGNED TRAINER NAME
======================================== */

function getAssignedTrainerName(member) {

    return (

        member.trainer ||

        member.assignedTrainer ||

        member.trainerName ||

        ""

    );

}



/* ========================================
   FIND TRAINER BY NAME
======================================== */

function findTrainerByName(
    trainers,
    trainerName
) {

    if (!trainerName) {

        return null;

    }


    const target =
        normalizeText(
            trainerName
        );


    return trainers.find(
        function (trainer) {

            const name =
                normalizeText(
                    trainer.name ||
                    trainer.trainerName ||
                    ""
                );


            return name === target;

        }
    ) || null;

}



/* ========================================
   NORMALIZE TEXT
======================================== */

function normalizeText(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}



/* ========================================
   GET TRAINER RECOMMENDATIONS
======================================== */

function getTrainerRecommendations(
    trainers,
    memberGoal,
    assignedTrainer
) {

    if (!trainers.length) {

        return {
            primary: null,
            alternatives: []
        };

    }


    const assignedName =
        normalizeText(
            assignedTrainer
                ? (
                    assignedTrainer.name ||
                    assignedTrainer.trainerName ||
                    ""
                )
                : ""
        );


    /* =========================
       BUILD TRAINER SCORES
    ========================== */

    const scoredTrainers =
        trainers
            .map(
                function (trainer) {

                    return scoreTrainer(
                        trainer,
                        memberGoal
                    );

                }
            )
            .filter(Boolean);


    /* =========================
       REMOVE ASSIGNED TRAINER
       FROM RECOMMENDATIONS
    ========================== */

    const candidates =
        scoredTrainers.filter(
            function (item) {

                return (
                    normalizeText(
                        item.name
                    ) !== assignedName
                );

            }
        );


    /* =========================
       SORT TRAINERS
    ========================== */

    candidates.sort(
        function (a, b) {

            /* First: matching score */

            if (
                b.score !== a.score
            ) {

                return b.score - a.score;

            }


            /* Second: availability */

            if (
                b.availabilityRank !==
                a.availabilityRank
            ) {

                return (
                    b.availabilityRank -
                    a.availabilityRank
                );

            }


            /* Third: experience */

            return (
                b.experience -
                a.experience
            );

        }
    );


    /* =========================
       PRIMARY TRAINER
    ========================== */

    const primary =
        candidates[0] || null;


    /* =========================
       ALTERNATIVES
    ========================== */

    const alternatives =
        candidates.slice(1, 5);


    return {

        primary: primary,

        alternatives: alternatives

    };

}



/* ========================================
   SCORE TRAINER
======================================== */

function scoreTrainer(
    trainer,
    memberGoal
) {

    const name =
        trainer.name ||
        trainer.trainerName ||"Trainer";


    const specialization =
        trainer.type || trainer.specialization ||
        trainer.trainerType ||"";


    const skills =
        trainer.skills ||"";


    const services =
        trainer.services ||"";


    const qualification =
        trainer.qualification ||"";


    const experience =
        parseExperience(
            trainer.experience
        );


    const availability =
        getAvailability(trainer.status);


    const searchableText =
        normalizeText(
            [
        specialization,skills,
                services,qualification
            ].join(" ")
        );


    const goal = normalizeText(
            memberGoal
        );


    const keywords =
        getGoalKeywords(goal);


    let score = 0;

    let matchCount = 0;


    /* =========================
       GOAL MATCHING
    ========================== */

    keywords.forEach(
        function (keyword) {

            if (
                searchableText.includes(keyword)
            ) {

                score += 25;

                matchCount++;

            }

        }
    );


    /* =========================
       AVAILABILITY
    ========================== */

    if (
        availability.type === "available"
    ) {

        score += 15;

    }
    else if (
        availability.type === "limited"
    ) {

        score += 5;

    }
    else {

        score -= 5;

    }


    /* =========================
       EXPERIENCE
    ========================== */

    if (experience >= 5) {

        score += 10;

    }
    else if (experience >= 3) {

        score += 6;

    }
    else if (experience >= 1) {

        score += 3;

    }


    /* =========================
       QUALIFICATION
    ========================== */

    if (qualification) {

        score += 3;

    }


    return {

        trainer: trainer,

        name: name,

        specialization:
            specialization || "Fitness Trainer",

        skills:
            skills ||"General Fitness",

        services:
            services ||"Personal Training",

        qualification:
            qualification ||"Fitness Professional",

        experience: experience,

        availability:availability,

        availabilityRank:availability.rank,

        score: score,

        matchCount: matchCount

    };

}



/* ========================================
   GET GOAL KEYWORDS
======================================== */

function getGoalKeywords(goal) {

    const keywords = [];


    /* =========================
       WEIGHT LOSS
    ========================== */

    if (
        goal.includes("weight") &&
        goal.includes("loss")
    ) {

        keywords.push(
            "weight loss",
            "fat loss",
            "cardio",
            "fitness"
        );

    }


    /* =========================
       MUSCLE / BODYBUILDING
    ========================== */

    if (
        goal.includes("muscle") ||
        goal.includes("bodybuild") ||
        goal.includes("mass")
    ) {

        keywords.push(
            "muscle",
            "bodybuilding",
            "strength",
            "weight training"
        );

    }


    /* =========================
       STRENGTH
    ========================== */

    if (
        goal.includes("strength")
    ) {

        keywords.push(
            "strength",
            "weight training",
            "bodybuilding"
        );

    }


    /* =========================
       FITNESS
    ========================== */

    if (
        goal.includes("fitness") ||
        goal.includes("general")
    ) {

        keywords.push(
            "fitness",
            "strength",
            "training"
        );

    }


    /* =========================
       DIET / NUTRITION
    ========================== */

    if (
        goal.includes("diet") ||
        goal.includes("nutrition")
    ) {

        keywords.push(
            "diet",
            "nutrition",
            "fitness"
        );

    }


    /* =========================
       CARDIO / ENDURANCE
    ========================== */

    if (
        goal.includes("cardio") ||
        goal.includes("endurance") ||
        goal.includes("stamina")
    ) {

        keywords.push(
            "cardio",
            "endurance",
            "stamina",
            "fitness"
        );

    }


    /* =========================
       DEFAULT
    ========================== */

    if (keywords.length === 0) {

        keywords.push(
            "fitness",
            "training",
            "strength"
        );

    }


    return [
        ...new Set(keywords)
    ];

}



/* ========================================
   PARSE EXPERIENCE
======================================== */

function parseExperience(
    experience
) {

    if (!experience) {

        return 0;

    }


    const match =
        String(experience).match(/\d+/);


    return match
        ? Number(match[0]) : 0;

}



/* ========================================
   GET AVAILABILITY
======================================== */

function getAvailability(status) {

    const value = normalizeText(status);


    if (
        value === "available" ||
        value === "active" ||
        value === "free" ||
        value === "open"
    ) {

        return {

            type: "available",

            label: "Available",

            rank: 3

        };

    }


    if (
        value === "limited" ||
        value === "partially available" ||
        value === "partial"
    ) {

        return {

            type: "limited",

            label: "Limited Availability",rank: 2

        };

    }


    return {

        type: "busy",

        label: "Busy",
        rank: 1

    };

}



/* ========================================
   RENDER ASSIGNED TRAINER
======================================== */

function renderAssignedTrainer(
    trainer,assignedTrainerName
) {

    const container =
        document.getElementById(
            "assignedTrainerCard"
        );


    if (!container) {

        return;

    }


    if (!assignedTrainerName) {

        container.innerHTML = `

            <div class="trainer-loading">

                <i class="fa-solid fa-user-slash"></i>

                No trainer has been assigned yet.

            </div>`;

        return;

    }


    if (!trainer) {

        container.innerHTML = `

            <div class="trainer-loading">

                <i class="fa-solid fa-circle-exclamation"></i>

                Assigned trainer:

                <strong>
                    ${escapeHTML(
                        assignedTrainerName
                    )}
                </strong>

                <br>

                <small>
                    Trainer profile information is not available.
                </small>

            </div> `;

        return;

    }


    const availability =
        getAvailability(
            trainer.status
        );


    container.innerHTML = createTrainerCard(
        trainer, availability,
        false
    );

}



/* ========================================
   RENDER RECOMMENDED TRAINER
======================================== */

function renderRecommendedTrainer(
    trainerData, memberGoal
) {

    const container =
        document.getElementById(
            "recommendedTrainer"
        );


    if (!container) {

        return;

    }


    const matchReason =
        getMatchReason(
            trainerData,
            memberGoal
        );


    container.innerHTML = `

        <div class="expert-trainer-card">

            <div class="recommended-badge">

                <i class="fa-solid fa-star fa-beat"></i>

                Recommended For You

            </div>


            ${createTrainerCardContent(
                trainerData,
                true
            )}


            <div class="match-reason">

                <i class="fa-solid fa-bullseye"></i>

                <div>

                    <strong>
                        Why this trainer?
                    </strong>

                    <p>
                        ${escapeHTML(matchReason)}
                    </p>

                </div>

            </div>

        </div>`;

}



/* ========================================
   RENDER ALTERNATIVE TRAINERS
======================================== */

function renderAlternativeTrainers(
    trainers, memberGoal
) {

    const container =
        document.getElementById(
            "alternativeTrainers"
        );


    if (!container) {

        return;

    }


    if (!trainers.length) {

        container.innerHTML = "";

        return;

    }


    let html = `

        <div class="section-heading">

            <div>

                <span class="section-label">

                    <i class="fa-solid fa-users"></i>

                    OTHER OPTIONS

                </span>

                <h3>
                    Alternative Trainers
                </h3>

            </div>

        </div>`;


    trainers.forEach(
        function (trainerData) {

            html += `

                <div class="expert-trainer-card">

                    ${createTrainerCardContent(
                        trainerData,
                        false
                    )}

                    <div class="match-reason">

                        <i class="fa-solid fa-bullseye"></i>

                        <div>

                            <strong>
                                Goal Match
                            </strong>

                            <p>
                                ${escapeHTML(
                                    getMatchReason(
                                        trainerData,
                                        memberGoal
                                    )
                                )}
                            </p>

                        </div>

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}



/* ========================================
   CREATE TRAINER CARD
======================================== */

function createTrainerCard(
    trainer,
    availability,recommended
) {

    const data =
        buildTrainerData(
            trainer, availability
        );


    return `

        <div class="expert-trainer-card">

            ${recommended
                ? `
                    <div class="recommended-badge">

                        <i class="fa-solid fa-star fa-beat"></i>

                        Recommended For You

                    </div>
                `
                : ""
            }


            ${createTrainerCardContent(
                data,
                false
            )}

        </div> `;

}



/* ========================================
   BUILD TRAINER DATA
======================================== */

function buildTrainerData(
    trainer,
    availability
) {

    return {

        name:
            trainer.name ||
            trainer.trainerName ||
            "Trainer",

        specialization:
            trainer.type ||
            trainer.specialization ||
            trainer.trainerType ||
            "Fitness Trainer",

        skills:
            trainer.skills ||
            "General Fitness",

        services:
            trainer.services ||
            "Personal Training",

        qualification:
            trainer.qualification ||
            "Fitness Professional",

        experience:
            parseExperience(
                trainer.experience
            ),

        availability:
            availability ||
            getAvailability(  trainer.status)

    };

}



/* ========================================
   CREATE CARD CONTENT
======================================== */

function createTrainerCardContent(
    trainerData,
    showExtra
) {

    const avatarLetter =
        String(
            trainerData.name ||
            "T"
        )
        .trim().charAt(0).toUpperCase();


    return `

        <div class="trainer-card-top">


            <div class="trainer-avatar">

                ${escapeHTML(
                    avatarLetter
                )}

            </div>


            <div>

                <h3 class="trainer-name">

                    ${escapeHTML(
                        trainerData.name
                    )}

                </h3>


                <p class="trainer-specialization">

                    ${escapeHTML(
                        trainerData.specialization
                    )}

                </p>

            </div>


            <span
                class="
                    trainer-availability
                    ${trainerData.availability.type}">

                <i class="fa-solid fa-circle"></i>

                ${escapeHTML(
                    trainerData.availability.label
                )}

            </span>

        </div>


        <div class="trainer-info-grid">


            <div class="trainer-info-item">

                <i class="fa-solid fa-dumbbell"></i>

                <div>

                    <span>
                        Skills
                    </span>

                    <strong>
                        ${escapeHTML(
                            trainerData.skills
                        )}
                    </strong>

                </div>

            </div>


            <div class="trainer-info-item">

                <i class="fa-solid fa-list-check"></i>

                <div>

                    <span>
                        Services
                    </span>

                    <strong>
                        ${escapeHTML(
                            trainerData.services
                        )}
                    </strong>

                </div>

            </div>


            <div class="trainer-info-item">

                <i class="fa-solid fa-award"></i>

                <div>

                    <span>
                        Qualification
                    </span>

                    <strong>
                        ${escapeHTML(
                            trainerData.qualification
                        )}
                    </strong>

                </div>

            </div>


            <div class="trainer-info-item">

                <i class="fa-solid fa-clock"></i>

                <div>

                    <span>
                        Experience
                    </span>

                    <strong>
                        ${trainerData.experience > 0
                            ? escapeHTML(
                                String(
                                    trainerData.experience
                                )
                              ) + " Years"
                            : "Not specified"
                        }
                    </strong>

                </div>

            </div>


        </div>`;

}



/* ========================================
   GET MATCH REASON
======================================== */

function getMatchReason(
    trainerData,
    memberGoal
) {

    const goal =
        normalizeText(
            memberGoal
        );


    const trainerText =
        normalizeText(
            [
                trainerData.specialization,
                trainerData.skills,
                trainerData.services].join(" ")
        );


    if (
        goal.includes("weight") && goal.includes("loss")
    ) {

        if (
            trainerText.includes("weight loss") ||
            trainerText.includes("fat loss") ||
            trainerText.includes("cardio")
        ) {

            return (
                "This trainer specializes in areas related to weight loss and fitness."
            );

        }

    }


    if (
        goal.includes("muscle") ||
        goal.includes("bodybuild") || goal.includes("mass")
    ) {

        if (
            trainerText.includes("muscle") ||
            trainerText.includes("bodybuild") ||
            trainerText.includes("strength")
        ) {

            return (
                "This trainer has skills related to muscle building and strength training."
            );

        }

    }


    if (
        goal.includes("strength")
    ) {

        if (
            trainerText.includes("strength") ||
            trainerText.includes("weight training")
        ) {

            return (
                "This trainer has experience in strength and weight training."
            );

        }

    }


    if (
        goal.includes("diet") ||
        goal.includes("nutrition")
    ) {

        if (
            trainerText.includes("diet") ||
            trainerText.includes("nutrition")
        ) {

            return (
                "This trainer has specialization related to diet and nutrition."
            );

        }

    }


    if (
        goal.includes("cardio") ||
        goal.includes("endurance") ||
        goal.includes("stamina")
    ) {

        if (
            trainerText.includes("cardio") ||
            trainerText.includes("endurance") ||
            trainerText.includes("stamina")
        ) {

            return (
                "This trainer matches your cardio, endurance and stamina goals."
            );

        }

    }


    return (
        "This trainer has relevant fitness experience and training skills for your goal."
    );

}



/* ========================================
   CLEAR RECOMMENDATION
======================================== */

function clearRecommendedTrainer() {

    const container =
        document.getElementById(
            "recommendedTrainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="trainer-loading">

            <i class="fa-solid fa-circle-info"></i>

            No suitable trainer recommendation is available right now.

        </div>

    `;

}



/* ========================================
   NO TRAINER MESSAGE
======================================== */

function showNoTrainerMessage(
    message
) {

    const element =
        document.getElementById(
            "noTrainerMessage"
        );


    if (!element) {

        return;

    }


    element.style.display ="flex";


    const paragraph = element.querySelector("p");


    if (paragraph) {

        paragraph.textContent =message ||
            "No matching trainer found.";

    }

}



/* ========================================
   HIDE NO TRAINER MESSAGE
======================================== */

function hideNoTrainerMessage() {

    const element =
        document.getElementById(
            "noTrainerMessage"
        );


    if (!element) {

        return;

    }


    element.style.display ="none";

}



/* ========================================
   ESCAPE HTML
======================================== */

function escapeHTML(value) {

    return String(value || "")
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
