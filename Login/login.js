const loginId = document.getElementById("loginId");
const password = document.getElementById("password");

const adminRole = document.getElementById("adminRole");
const trainerRole = document.getElementById("trainerRole");
const memberRole = document.getElementById("memberRole");

const loginButton = document.querySelector(".reusable-button");

let selectedRole = "";

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

function validatePassword(password) {

    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }

    const uppercase = password.match(/[A-Z]/g) || [];
    if (uppercase.length < 2) {
        return "Password must contain at least 2 uppercase letters.";
    }

    const lowercase = password.match(/[a-z]/g) || [];
    if (lowercase.length < 2) {
        return "Password must contain at least 2 lowercase letters.";
    }

    const numbers = password.match(/[0-9]/g) || [];
    if (numbers.length < 2) {
        return "Password must contain at least 2 numbers.";
    }

    return "";
}

loginButton.addEventListener("click", function () {

    const userId = loginId.value.trim();
    const userPassword = password.value.trim();

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

    const passwordError = validatePassword(userPassword);

    if (passwordError !== "") {
        alert(passwordError);
        password.focus();
        return;
    }

    if (selectedRole === "") {
        alert("Please select your role.");
        return;
    }

    if (selectedRole === "admin") {
        window.location.href = "../admin-dashboard/admin.html";
    }

});