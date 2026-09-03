
const menuItems = document.querySelectorAll(".sidebar .menu-item");

menuItems.forEach(function (item) {

    item.addEventListener("click", function (event) {
        if (item.classList.contains("logout")) {
            return;
        }
        menuItems.forEach(function (menu) {
            menu.classList.remove("active");
        });
        item.classList.add("active");

    });

});

const logoutButton = document.querySelector(".sidebar .logout");

if (logoutButton) {

    logoutButton.addEventListener("click", function (event) {

        event.preventDefault();

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (confirmLogout) {
            window.location.href = "../../login/index.html";
        }

    });

}
