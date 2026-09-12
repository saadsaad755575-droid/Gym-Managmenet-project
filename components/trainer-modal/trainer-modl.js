/* =========================
   TRAINER MODAL JS
========================= */

function initTrainerModal() {

    /* =========================
       GET MODAL ELEMENTS
    ========================= */

    const modal =
        document.getElementById("trainerModal");

    const closeButton =
        document.getElementById("trainerModalClose");

    const cancelButton =
        document.getElementById("trainerModalCancel");

    const saveButton =
        document.getElementById("trainerModalSave");

    const notes =
        document.getElementById("trainerNotes");


    /* =========================
       CHECK MODAL
    ========================= */

    if (!modal) {
        return;
    }


    /* =========================
       CLOSE MODAL
    ========================= */

    function closeTrainerModal() {

        modal.style.display = "none";

    }


    /* =========================
       CLOSE BUTTON
    ========================= */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeTrainerModal
        );

    }


    /* =========================
       CANCEL BUTTON
    ========================= */

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeTrainerModal
        );

    }


    /* =========================
       CLICK OUTSIDE MODAL
    ========================= */

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {

            closeTrainerModal();

        }

    });


    /* =========================
       SAVE CHANGES
    ========================= */

    if (saveButton) {

        saveButton.addEventListener("click", function () {

            const noteValue =
                notes ? notes.value.trim() : "";

            if (noteValue !== "") {

                localStorage.setItem(
                    "trainerNotes",
                    noteValue
                );

            }

            else {

                localStorage.removeItem(
                    "trainerNotes"
                );

            }


            alert("Member information saved successfully.");

            closeTrainerModal();

        });

    }


    /* =========================
       LOAD SAVED NOTES
    ========================= */

    if (notes) {

        const savedNotes =
            localStorage.getItem("trainerNotes");

        if (savedNotes) {

            notes.value = savedNotes;

        }

    }


    /* =========================
       HIDE MODAL INITIALLY
    ========================= */

    modal.style.display = "none";

}


/* =========================
   OPEN TRAINER MEMBER MODAL
========================= */

function openTrainerMemberModal(
    memberName,
    memberId,
    memberGoal,
    workoutPlan,
    workoutDays,
    progress,
    attendance,
    status
) {

    const modal =
        document.getElementById("trainerModal");

    if (!modal) {
        return;
    }


    /* =========================
       MEMBER INFORMATION
    ========================= */

    const name =
        document.getElementById("memberName");

    const id =
        document.getElementById("memberId");

    const goal =
        document.getElementById("memberGoal");

    const statusElement =
        modal.querySelector(".modal-status");


    if (name) {
        name.textContent = memberName;
    }

    if (id) {
        id.textContent = memberId;
    }

    if (goal) {
        goal.textContent = memberGoal;
    }

    if (statusElement) {
        statusElement.textContent = status;
    }


    /* =========================
       WORKOUT INFORMATION
    ========================= */

    const workout =
        document.getElementById("workoutPlan");

    const days =
        document.getElementById("workoutDays");


    if (workout) {
        workout.textContent = workoutPlan;
    }

    if (days) {
        days.textContent = workoutDays;
    }


    /* =========================
       PROGRESS
    ========================= */

    const progressValue =
        document.getElementById("progressValue");

    const progressFill =
        modal.querySelectorAll(".progress-fill")[0];


    if (progressValue) {
        progressValue.textContent = progress;
    }

    if (progressFill) {
        progressFill.style.width = progress;
    }


    /* =========================
       ATTENDANCE
    ========================= */

    const attendanceValue =
        document.getElementById("attendanceValue");

    const attendanceFill =
        modal.querySelectorAll(".progress-fill")[1];


    if (attendanceValue) {
        attendanceValue.textContent = attendance;
    }

    if (attendanceFill) {
        attendanceFill.style.width = attendance;
    }


    /* =========================
       SHOW MODAL
    ========================= */

    modal.style.display = "flex";

}
