


/* =========================
   TRAINER NAVBAR JS
========================= */

function initTrainerNavbar() {

    /* =========================
       SEARCH
    ========================= */

    const searchInput = document.getElementById("trainerSearch");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchValue = this.value.trim().toLowerCase();

            const tableRows = document.querySelectorAll(
                ".trainer-table-container tbody tr"
            );

            tableRows.forEach(row => {

                const customerName =
                    row.querySelector("td strong");

                if (!customerName) {
                    return;
                }

                const name =
                    customerName.textContent.toLowerCase();

                if (searchValue === "") {

                    row.style.display = "";

                    customerName.style.color = "";

                }

                else if (name.includes(searchValue)) {

                    row.style.display = "";

                    customerName.style.color = "#f5b900";

                }

                else {

                    row.style.display = "none";

                }

            });

        });

    }


    /* =========================
       NOTIFICATION
    ========================= */

    const notification =
        document.querySelector(".navbar-notification");

    if (notification) {

        notification.addEventListener("click", function () {

            alert("You have 3 new notifications.");

        });

    }


    /* =========================
       TRAINER PROFILE
    ========================= */

    const profile =
        document.querySelector(".navbar-profile");

    if (profile) {

        profile.addEventListener("click", function () {

            alert("Trainer Profile clicked.");

        });

    }

}
