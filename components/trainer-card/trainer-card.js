
/* =========================
   TRAINER CARD JS
========================= */

function initTrainerCards() {

    const cards = document.querySelectorAll(
        ".trainer-card"
    );

    if (!cards.length) {
        return;
    }


    /* =========================
       CARD CLICK
    ========================= */

    cards.forEach(card => {

        card.addEventListener("click", function () {

            cards.forEach(item => {
                item.classList.remove("selected");
            });

            this.classList.add("selected");

        });

    });

}



