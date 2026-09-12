
/* =========================
   TRAINER PROFILE JS
========================= */

function initTrainerProfile() {

    /* =========================
       GET PROFILE
    ========================= */

    const profile =
        document.querySelector(".trainer-profile-card");

    if (!profile) {
        console.error("Trainer profile not found.");
        return;
    }


    /* =========================
       PROFILE LOADED
    ========================= */

    profile.classList.add("profile-loaded");

    console.log("Trainer Profile initialized successfully.");

}
