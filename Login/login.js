

/* =========================
   LOGIN JS
========================= */

const loginId = document.getElementById("loginId");
const password = document.getElementById("password");

const adminRole = document.getElementById("adminRole");
const trainerRole = document.getElementById("trainerRole");
const memberRole = document.getElementById("memberRole");

const loginButton = document.querySelector(".reusable-button");

let selectedRole = "";


/* =========================
   ROLE SELECTION
========================= */

adminRole.addEventListener("click", function () {

    selectedRole = "admin";

    adminRole.classList.add("selected");
    trainerRole.classList.remove("selected");
    memberRole.classList.remove("selected");

});


trainerRole.addEventListener("click", function () {

    selectedRole = "trainer";

    trainerRole.classList.add("selected");
    adminRole.classList.remove("selected");
    memberRole.classList.remove("selected");

});


memberRole.addEventListener("click", function () {

    selectedRole = "member";

    memberRole.classList.add("selected");
    adminRole.classList.remove("selected");
    trainerRole.classList.remove("selected");

});


/* =========================
   PASSWORD VALIDATION
========================= */

function validatePassword(password) {

    if (password.length < 6) {

        return "Password must be at least 6 characters long.";

    }


    const uppercase =
        password.match(/[A-Z]/g) || [];

    if (uppercase.length < 2) {

        return "Password must contain at least 2 uppercase letters.";

    }


    const lowercase =
        password.match(/[a-z]/g) || [];

    if (lowercase.length < 2) {

        return "Password must contain at least 2 lowercase letters.";

    }


    const numbers =
        password.match(/[0-9]/g) || [];

    if (numbers.length < 2) {

        return "Password must contain at least 2 numbers.";

    }


    return "";

}


/* =========================
   LOGIN
========================= */

loginButton.addEventListener("click", function () {

    const userId = loginId.value.trim();

    const userPassword = password.value.trim();


    /* =========================
       BASIC VALIDATION
    ========================= */

    if (userId === "") {

        alert("Please enter your Email / Member ID.");

        loginId.focus();

        return;

    }


    if (userPassword === "") {

        alert("Please enter your password.");

        password.focus();

        return;

    }


    /* =========================
       ROLE VALIDATION
    ========================= */

    if (selectedRole === "") {

        alert("Please select your role.");

        return;

    }


    /* ==================================================
       TRAINER LOGIN
       Email se trainer identify hoga.
       Password trainer ke liye verify nahi hoga.
    ================================================== */

    if (selectedRole === "trainer") {

        const trainerEmail = userId.toLowerCase();


        /* =========================
           AHMED KHAN
        ========================= */

        if (trainerEmail === "ahmed@gmail.com") {

            localStorage.setItem(
                "loggedInTrainer","Ahmed Khan");

            localStorage.setItem(
                "loggedInTrainerEmail","ahmed@gmail.com");


            window.location.href ="../Trainer-dashboard/trainer.html";

            return;

        }


        /* =========================
           USMAN AHMED
        ========================= */

        if (trainerEmail === "usman@gmail.com") {

            localStorage.setItem("loggedInTrainer","Usman Ahmed");

            localStorage.setItem("loggedInTrainerEmail","usman@gmail.com");


            window.location.href ="../Trainer-dashboard/trainer.html";

            return;

        }


        /* =========================
           INVALID TRAINER EMAIL
        ========================= */

        alert(
            "Trainer email not found. Please enter a valid trainer email."
        );

        loginId.focus();

        return;

    }


    /* =========================
       PASSWORD VALIDATION
       ADMIN / MEMBER
    ========================= */

    const passwordError =
        validatePassword(userPassword);


    if (passwordError !== "") {

        alert(passwordError);

        password.focus();

        return;

    }


    /* =========================
       ADMIN LOGIN
    ========================= */

    if (selectedRole === "admin") {

        window.location.href ="../admin-dashboard/admin.html";

        return;

    }

});
