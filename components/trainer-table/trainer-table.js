

/* =========================
   TRAINER TABLE JS
========================= */

function initTrainerTable() {

    const table = document.querySelector(
        ".trainer-table-container table"
    );

    if (!table) {
        return;
    }


    /* =========================
       VIEW / EDIT BUTTONS
    ========================= */

    const actionButtons = table.querySelectorAll(
        ".table-action"
    );

    actionButtons.forEach(button => {

        button.addEventListener("click", function () {

            const row = this.closest("tr");

            if (!row) {
                return;
            }


            /* =========================
               GET MEMBER DATA
            ========================= */

            const nameElement =
                row.querySelector("td strong");

            const idElement =
                row.querySelector("td small");

            const cells =
                row.querySelectorAll("td");


            if (!nameElement || !idElement) {
                return;
            }


            const memberName =
                nameElement.textContent.trim();

            const memberId =
                idElement.textContent.trim();

            const goal =
                cells[1].textContent.trim();

            const workout =
                cells[2].textContent.trim();

            const progress =
                cells[3].textContent.trim();

            const attendance =
                cells[4].textContent.trim();

            const status =
                cells[5].textContent.trim();


            /* =========================
               OPEN MODAL
            ========================= */

            openTrainerMemberModal(
                memberName,
                memberId,
                goal,
                workout,
                progress,
                attendance,
                status
            );

        });

    });

}


/* =========================
   OPEN MEMBER MODAL
========================= */

function openTrainerMemberModal(
    memberName,
    memberId,
    goal,
    workout,
    progress,
    attendance,
    status
) {

    const modal =
        document.getElementById("trainerModal");

    if (!modal) {
        return;
    }


    /* Member Name */

    const modalName =
        modal.querySelector(".member-name");

    if (modalName) {
        modalName.textContent = memberName;
    }


    /* Member ID */

    const modalId =
        modal.querySelector(".member-id");

    if (modalId) {
        modalId.textContent = memberId;
    }


    /* Goal */

    const modalGoal =
        modal.querySelector(".member-goal");

    if (modalGoal) {
        modalGoal.textContent = goal;
    }


    /* Workout */

    const modalWorkout =
        modal.querySelector(".member-workout");

    if (modalWorkout) {
        modalWorkout.textContent = workout;
    }


    /* Progress */

    const modalProgress =
        modal.querySelector(".member-progress");

    if (modalProgress) {
        modalProgress.textContent = progress;
    }


    /* Attendance */

    const modalAttendance =
        modal.querySelector(".member-attendance");

    if (modalAttendance) {
        modalAttendance.textContent = attendance;
    }


    /* Status */

    const modalStatus =
        modal.querySelector(".member-status");

    if (modalStatus) {
        modalStatus.textContent = status;
    }


    /* Show Modal */

    modal.style.display = "flex";

}
