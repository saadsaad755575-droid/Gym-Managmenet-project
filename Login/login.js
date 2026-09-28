
/* =========================
   LOGIN JS
========================= */


/* =========================
   LOGIN ELEMENTS
========================= */

const loginId =
    document.getElementById("loginId");

const password =
    document.getElementById("password");

const adminRole =
    document.getElementById("adminRole");

const trainerRole =
    document.getElementById("trainerRole");

const memberRole =
    document.getElementById("memberRole");

const loginButton =
    document.querySelector(".reusable-button");

let selectedRole = "";


/* =========================
   LOGIN MESSAGE
========================= */

let loginMessage =
    document.getElementById("loginMessage");


if (!loginMessage) {

    loginMessage =
        document.createElement("p");

    loginMessage.id ="loginMessage";

    loginMessage.style.marginTop ="10px";

    loginMessage.style.fontSize = "14px";

    loginMessage.style.fontWeight = "500";

    loginMessage.style.textAlign ="center";

    password.parentElement.appendChild( loginMessage );
}


/* =========================
   SHOW MESSAGE
========================= */

function showLoginMessage(
    message,type = "error"
) {

    loginMessage.textContent = message;


    if (type === "success") {

        loginMessage.style.color = "#22c55e";

    } else {

        loginMessage.style.color = "#f5b900";

    }

}


/* =========================
   CLEAR MESSAGE
========================= */

function clearLoginMessage() {
    loginMessage.textContent = "";

}


/* =========================
   ROLE SELECTION
========================= */

adminRole.addEventListener(
    "click",
    function () {

        selectedRole = "admin";

        adminRole.classList.add("selected");

        trainerRole.classList.remove("selected");

        memberRole.classList.remove("selected");

        clearLoginMessage();

    }
);


trainerRole.addEventListener(
    "click",
    function () {

        selectedRole = "trainer";

        trainerRole.classList.add("selected");

        adminRole.classList.remove("selected");

        memberRole.classList.remove("selected");

        clearLoginMessage();

    }
);


memberRole.addEventListener(
    "click",
    function () {

        selectedRole = "member";

        memberRole.classList.add("selected");

        adminRole.classList.remove("selected");

        trainerRole.classList.remove("selected");

        clearLoginMessage();

    }
);


/* =========================
   PASSWORD VALIDATION
========================= */

function validatePassword(
    passwordValue
) {

    if (passwordValue.length < 6) {

        return "Password must be at least 6 characters long.";

    }


    const uppercase =
        passwordValue.match(/[A-Z]/g) || [];


    if (uppercase.length < 2) {

        return "Password must contain at least 2 uppercase letters.";

    }


    const lowercase =
        passwordValue.match(/[a-z]/g) || [];


    if (lowercase.length < 2) {

        return "Password must contain at least 2 lowercase letters.";

    }


    const numbers =
        passwordValue.match(/[0-9]/g) || [];


    if (numbers.length < 2) {

        return "Password must contain at least 2 numbers.";

    }


    return "";

}


/* =========================
   LOGIN
========================= */

loginButton.addEventListener(
    "click",
    function () {

        clearLoginMessage();


        const userId = loginId.value.trim();


        const userPassword =password.value.trim();


        /* =========================
           BASIC VALIDATION
        ========================= */

        if (userId === "") {

            showLoginMessage(
                "Please enter your Email / Member ID."
            );

            loginId.focus();

            return;

        }


        if (userPassword === "") {

            showLoginMessage(
                "Please enter your password."
            );

            password.focus();

            return;

        }


        /* =========================
           ROLE VALIDATION
        ========================= */

        if (selectedRole === "") {

            showLoginMessage(
                "Please select your role."
            );

            return;

        }


        /* ==================================================
           TRAINER LOGIN
        ================================================== */

        if (selectedRole === "trainer") {

            const trainerEmail =userId.toLowerCase();


            /* =========================
               AHMED KHAN
            ========================= */

            if (
                trainerEmail === "ahmed@gmail.com"
            ) {

                localStorage.setItem(
                    "loggedInTrainer", "Ahmed Khan"
                );
                localStorage.setItem(
                    "currentTrainer","Ahmed Khan"
                );

                localStorage.setItem(
                    "loggedInTrainerEmail", "ahmed@gmail.com"
                );


                window.location.href =
                    "../Trainer-dashboard/trainer.html";

                return;

            }


            /* =========================
               USMAN AHMED
            ========================= */

            if (
                trainerEmail === "usman@gmail.com"
            ) {

                localStorage.setItem(
                    "loggedInTrainer","Usman Ahmed"
                );
                localStorage.getItem(
                    "currentTrainer", "Usman Ahmed"
                );

                localStorage.setItem(
                    "loggedInTrainerEmail","usman@gmail.com"
                );


                window.location.href =
                    "../Trainer-dashboard/trainer.html";

                return;

            }


            showLoginMessage(
                "Trainer email not found. Please enter a valid trainer email."
            );

            loginId.focus();

            return;

        }


        /* ==================================================
           ADMIN LOGIN
        ================================================== */

        if (selectedRole === "admin") {

            const passwordError =
                validatePassword(userPassword);


            if (passwordError !== "") {

                showLoginMessage(passwordError);

                password.focus();

                return;

            }


            window.location.href =
                "../admin-dashboard/admin.html";

            return;

        }


        /* ==================================================
           MEMBER LOGIN
        ================================================== */

        if (selectedRole === "member") {


            /* =========================
               GET MEMBERS
            ========================= */

            const storedMembers =
                localStorage.getItem("gymMembers");


            if (!storedMembers) {

                showLoginMessage("No member records found.");

                return;

            }


            let members;


            try {

                members =
                    JSON.parse(storedMembers);

            } catch (error) {

                showLoginMessage("Member data is invalid.");

                return;

            }


            if (!Array.isArray(members)) {

                showLoginMessage("Member data format is invalid.");

                return;

            }


            /* =========================
               FIND MEMBER BY ID
            ========================= */

            const currentMember =
                members.find(
                    function (member) {

                        const memberId =
                            String(
                                member.id || member.memberId ||
                                member.customerId || ""
                            )
                            .trim().toLowerCase();


                        return (
                            memberId === userId.toLowerCase()
                        );

                    }
                );


            /* =========================
               MEMBER ID NOT FOUND
            ========================= */

            if (!currentMember) {

                showLoginMessage(
                    "Member ID not found. Please enter a valid Member ID."
                );

                loginId.focus();

                return;

            }


            /* ==================================================
               FIRST TIME MEMBER LOGIN
            ================================================== */

            const savedPassword =
                String(
                    currentMember.password || currentMember.memberPassword ||
                    currentMember.loginPassword || ""
                );


            /*
               PASSWORD NOT CREATED YET
            */

            if (savedPassword === "") {

                const passwordError =
                    validatePassword( userPassword);


                if (passwordError !== "") {

                    showLoginMessage(passwordError);

                    password.focus();

                    return;

                }


                /*
                   SAVE MEMBER CREATED PASSWORD
                */

                currentMember.password = userPassword;


                /*
                   UPDATE MEMBERS ARRAY
                */

                const memberIndex =
                    members.findIndex(
                        function (member) {

                            return (
                                member ===currentMember
                            );

                        }
                    );


                if (memberIndex !== -1) {

                    members[memberIndex] =currentMember;

                }


                localStorage.setItem(
                    "gymMembers",
                    JSON.stringify(members)
                );


                /*
                   SAVE LOGIN MEMBER
                */

                const actualMemberId =
                    currentMember.id ||currentMember.memberId ||
                    currentMember.customerId;


                const actualMemberName =
                    currentMember.name ||currentMember.memberName ||
                    currentMember.fullName ||"";


                localStorage.setItem(
                    "loggedInMemberId",String(actualMemberId)
                );


                localStorage.setItem(
                    "loggedInMemberName",actualMemberName
                );


                showLoginMessage(
                    "Password created successfully. Opening Member Dashboard...",
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "../Member-dashborad/member.html";

                    },
                    700
                );


                return;

            }


            /* ==================================================
               EXISTING MEMBER LOGIN
            ================================================== */

            if (
                savedPassword !== userPassword
            ) {

                showLoginMessage(
                    "Incorrect Member ID or password."
                );

                password.focus();

                return;

            }


            /* =========================
               SAVE LOGGED-IN MEMBER
            ========================= */

            const actualMemberId =
                currentMember.id ||currentMember.memberId ||
                currentMember.customerId;


            const actualMemberName =
                currentMember.name ||currentMember.memberName ||
                currentMember.fullName ||"";


            localStorage.setItem(
                "loggedInMemberId",
                String(actualMemberId)
            );


            localStorage.setItem(
                "loggedInMemberName",
                actualMemberName
            );


            /* =========================
               OPEN MEMBER DASHBOARD
            ========================= */

            window.location.href =
                "../Member-dashborad/member.html";

            return;

        }

    }
);
