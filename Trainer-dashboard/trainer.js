/* =========================
   TRAINER DASHBOARD JS
========================= */

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // LOAD TRAINER SIDEBAR
    // =========================

    loadComponent(
        "trainer-sidebar",
        "../../components/trainer.sidebar/trainer.sidebar.html"
    );


    // =========================
    // LOAD TRAINER NAVBAR
    // =========================

    loadComponent(
        "trainer-navbar",
        "../../components/trainer-navbar/trainer-navbar.html"
    );


    // =========================
    // LOAD TRAINER CA upRDS
    // =========================

    loadComponent(
        "trainer-cards",
        "../../components/trainer-card/trainer-card.html"
    );


    // =========================
    // LOAD TRAINER TABLE
    // =========================

    loadComponent(
        "trainer-table",
        "../../components/trainer-table/trainer-table.html"
    );


    // =========================
    // LOAD TRAINER MODAL
    // =========================

    loadComponent(
        "trainer-modal",
        "../../components/trainer-modal/trainer-modal.html"
    );


    // =========================
    // LOAD TRAINER PROFILE
    // =========================

    loadComponent(
        "trainer-profile",
        "../../components/trainer-profile/trainer-profile.html"
    );

});


/* =========================
   LOAD COMPONENT FUNCTION
========================= */

function loadComponent(containerId, filePath) {

    const container = document.getElementById(containerId);

    if (!container) {

        console.error(
            "Container not found:",
            containerId
        );

        return;
    }


    fetch(filePath)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    `Failed to load: ${filePath}`
                );

            }

            return response.text();

        })


        .then(data => {

            // =========================
            // LOAD COMPONENT HTML
            // =========================

            container.innerHTML = data;


            // =========================
            // INITIALIZE COMPONENT JS
            // =========================

            if (containerId === "trainer-navbar") {

                if (typeof initTrainerNavbar === "function") {

                    initTrainerNavbar();

                }

            }


            if (containerId === "trainer-sidebar") {

                if (typeof initTrainerSidebar === "function") {

                    initTrainerSidebar();

                }

            }


            if (containerId === "trainer-table") {

                if (typeof initTrainerTable === "function") {

                    initTrainerTable();

                }

            }
            


            // =========================
            // TRAINER MODAL
            // =========================

            if (containerId === "trainer-modal") {

                if (typeof initTrainerModal === "function") {

                    initTrainerModal();

                }

            }
            //==================
            //Trainer Card
            //==============
            if(containerId === "trainer-card"){
                if (typeof initTrainerCard === "function"){
                    initTrainerCard();
                }
            }

            if (containerId === "trainer-profile"){
                if(typeof initTrainerProfile === "function"){
                    initTrainerProfile();
                }
            }

        })


        .catch(error => {

            console.error(error);

            container.innerHTML = `
                <p style="
                    color: #f5b900;
                    padding: 20px;
                ">
                    Component could not be loaded.
                </p>
            `;

        });

}
