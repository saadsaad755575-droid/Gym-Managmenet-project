
/* =========================
   TRAINER SIDEBAR JS
========================= */

function initTrainerSidebar() {

    /* =========================
       NAVIGATION ITEMS
    ========================= */

    const navItems = document.querySelectorAll(
        ".trainer-navigation ul li"
    );

    navItems.forEach(item => {

        const link = item.querySelector("a");

        if (!link) return;

        link.addEventListener("click", function (event) {

            // Dashboard ke actual link ko normally open hone dein
            const href = this.getAttribute("href");

            if (href === "#") {
                event.preventDefault();
            }

            // Active item change
            navItems.forEach(navItem => {
                navItem.classList.remove("active");
            });

            item.classList.add("active");

        });

    });


    /* =========================
       LOGOUT
    ========================= */

    const logout = document.querySelector(".sidebar-logout a");

    if (logout) {

        logout.addEventListener("click", function (event) {

            event.preventDefault();

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {

                window.location.href = "../../login/login.html";

            }

        });

    }

}


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    initTrainerSidebar()
);
