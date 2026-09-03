/* =========================
   LOAD REUSABLE COMPONENTS
========================= */

function loadComponent(elementId, filePath) {

    fetch(filePath)
        .then(response => {

            if (!response.ok) {
                throw new Error("Component not found: " + filePath);
            }

            return response.text();

        })

        .then(data => {

            document.getElementById(elementId).innerHTML = data;

        })

        .catch(error => {

            console.error(error);

        });

}


/* =========================
   SIDEBAR
========================= */
loadComponent(
    "sidebar",
    "../components/sidebar/sidebar.html"
);

/* =========================
   NAVBAR
========================= */

loadComponent(
    "navbar",
    "../components/navbar/navbar.html"
);


/* =========================
   CARDS
========================= */

loadComponent(
    "cards",
    "../components/card/card.html"
);


/* =========================
   TABLE
========================= */

loadComponent(
    "table",
    "../components/table/table.html"
);
