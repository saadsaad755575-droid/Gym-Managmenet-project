

// ========================================
// SETTINGS STORAGE
// ========================================

const SETTINGS_STORAGE_KEY = "gymSettings";


// ========================================
// DEFAULT SETTINGS
// ========================================

const DEFAULT_SETTINGS = {

    profile: {
        name: "Admin",
        email: "admin@gym.com",
        phone: "+92 300 1234567"
    },

    notifications: {
        email: true,
        payment: true,
        membership: true
    },

    preferences: {
        language: "English",
        timezone: "Pakistan Standard Time (PKT)",
        dateFormat: "DD MMM YYYY",
        theme: "Dark"
    }

};


// ========================================
// GET SETTINGS
// ========================================

function getSettings() {

    try {

        const savedSettings =
            localStorage.getItem(SETTINGS_STORAGE_KEY);

        if (!savedSettings) {
            return JSON.parse(
                JSON.stringify(DEFAULT_SETTINGS)
            );
        }

        const parsedSettings =
            JSON.parse(savedSettings);

        return {

            ...DEFAULT_SETTINGS,

            ...parsedSettings,

            profile: {
                ...DEFAULT_SETTINGS.profile,
                ...(parsedSettings.profile || {})
            },

            notifications: {
                ...DEFAULT_SETTINGS.notifications,
                ...(parsedSettings.notifications || {})
            },

            preferences: {
                ...DEFAULT_SETTINGS.preferences,
                ...(parsedSettings.preferences || {})
            }

        };

    } catch (error) {

        console.error(
            "Error loading settings:",
            error
        );

        return JSON.parse(
            JSON.stringify(DEFAULT_SETTINGS)
        );
    }
}


// ========================================
// SAVE SETTINGS
// ========================================

function saveSettings(settings) {

    localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
    );

}


// ========================================
// LOAD SETTINGS INTO FORM
// ========================================

function loadSettings() {

    const settings = getSettings();


    // ------------------------------------
    // PROFILE
    // ------------------------------------

    document.getElementById("adminName").value =
        settings.profile.name;

    document.getElementById("adminEmail").value =
        settings.profile.email;

    document.getElementById("adminPhone").value =
        settings.profile.phone;


    // Update profile display name
    const profileName =
        document.querySelector(".profile-info h3");

    if (profileName) {
        profileName.textContent =
            settings.profile.name;
    }


    // ------------------------------------
    // NOTIFICATIONS
    // ------------------------------------

    const notificationSwitches =
        document.querySelectorAll(
            ".notification-item input[type='checkbox']"
        );


    if (notificationSwitches.length >= 3) {

        notificationSwitches[0].checked =
            settings.notifications.email;

        notificationSwitches[1].checked =
            settings.notifications.payment;

        notificationSwitches[2].checked =
            settings.notifications.membership;
    }


    // ------------------------------------
    // SYSTEM PREFERENCES
    // ------------------------------------

    document.getElementById("language").value =
        settings.preferences.language;

    document.getElementById("timezone").value =
        settings.preferences.timezone;

    document.getElementById("dateFormat").value =
        settings.preferences.dateFormat;

    document.getElementById("theme").value =
        settings.preferences.theme;

}


// ========================================
// COLLECT SETTINGS FROM FORM
// ========================================

function collectSettings() {

    const notificationSwitches =
        document.querySelectorAll(
            ".notification-item input[type='checkbox']"
        );


    return {

        profile: {

            name:
                document.getElementById("adminName").value.trim(),

            email:
                document.getElementById("adminEmail").value.trim(),

            phone:
                document.getElementById("adminPhone").value.trim()

        },


        notifications: {

            email:
                notificationSwitches[0]?.checked || false,

            payment:
                notificationSwitches[1]?.checked || false,

            membership:
                notificationSwitches[2]?.checked || false

        },


        preferences: {

            language:
                document.getElementById("language").value,

            timezone:
                document.getElementById("timezone").value,

            dateFormat:
                document.getElementById("dateFormat").value,

            theme:
                document.getElementById("theme").value

        }

    };

}


// ========================================
// VALIDATE PROFILE
// ========================================

function validateProfile(settings) {

    if (!settings.profile.name) {

        alert("Please enter your full name.");

        return false;
    }


    if (!settings.profile.email) {

        alert("Please enter your email address.");

        return false;
    }


    if (!settings.profile.email.includes("@")) {

        alert("Please enter a valid email address.");

        return false;
    }


    if (!settings.profile.phone) {

        alert("Please enter your phone number.");

        return false;
    }


    return true;
}


// ========================================
// SAVE CHANGES
// ========================================

function handleSaveSettings() {

    const settings =
        collectSettings();


    if (!validateProfile(settings)) {
        return;
    }


    saveSettings(settings);


    // Update profile name immediately
    const profileName =
        document.querySelector(".profile-info h3");

    if (profileName) {

        profileName.textContent =
            settings.profile.name;
    }


    alert(
        "Settings saved successfully."
    );
}


// ========================================
// CANCEL CHANGES
// ========================================

function handleCancelSettings() {

    const savedSettings =
        localStorage.getItem(
            SETTINGS_STORAGE_KEY
        );


    if (!savedSettings) {

        loadSettings();

        return;
    }


    loadSettings();


    alert(
        "Changes have been cancelled."
    );
}


// ========================================
// PASSWORD SHOW / HIDE
// ========================================

function setupPasswordToggle() {

    const passwordEye =
        document.querySelector(
            ".password-eye"
        );


    const currentPassword =
        document.getElementById(
            "currentPassword"
        );


    if (!passwordEye || !currentPassword) {
        return;
    }


    passwordEye.addEventListener(
        "click",
        function () {

            if (
                currentPassword.type ===
                "password"
            ) {

                currentPassword.type =
                    "text";

                passwordEye.classList.remove(
                    "fa-eye"
                );

                passwordEye.classList.add(
                    "fa-eye-slash"
                );

            } else {

                currentPassword.type =
                    "password";

                passwordEye.classList.remove(
                    "fa-eye-slash"
                );

                passwordEye.classList.add(
                    "fa-eye"
                );
            }

        }
    );

}


// ========================================
// CHANGE PASSWORD
// ========================================

function setupPasswordChange() {

    const saveButton =
        document.querySelector(
            ".save-btn"
        );


    if (!saveButton) {
        return;
    }


    saveButton.addEventListener(
        "click",
        function () {

            const currentPassword =
                document.getElementById(
                    "currentPassword"
                ).value.trim();

            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value.trim();

            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value.trim();


            // If password fields are empty,
            // normal settings will be saved.
            if (
                !currentPassword &&
                !newPassword &&
                !confirmPassword
            ) {

                handleSaveSettings();

                return;
            }


            // --------------------------------
            // PASSWORD VALIDATION
            // --------------------------------

            if (!currentPassword) {

                alert(
                    "Please enter your current password."
                );

                return;
            }


            if (!newPassword) {

                alert(
                    "Please enter your new password."
                );

                return;
            }


            if (newPassword.length < 6) {

                alert(
                    "New password must be at least 6 characters."
                );

                return;
            }


            if (newPassword !== confirmPassword) {

                alert(
                    "New password and confirm password do not match."
                );

                return;
            }


            /*
                Password handling is kept separate
                from general settings.

                For the final project demo, the
                password is stored locally.
            */

            const settings =
                getSettings();


            settings.security = {

                password:
                    newPassword,

                passwordUpdatedAt:
                    new Date().toISOString()

            };


            saveSettings(settings);


            document.getElementById(
                "currentPassword"
            ).value = "";

            document.getElementById(
                "newPassword"
            ).value = "";

            document.getElementById(
                "confirmPassword"
            ).value = "";


            alert(
                "Password changed successfully."
            );

        }
    );

}


// ========================================
// SETTINGS MENU
// ========================================

function setupSettingsMenu() {

    const menuItems =
        document.querySelectorAll(
            ".settings-menu-item"
        );


    menuItems.forEach(item => {

        item.addEventListener(
            "click",
            function () {

                menuItems.forEach(menuItem => {

                    menuItem.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );

            }
        );

    });

}


// ========================================
// INITIALIZE SETTINGS
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSettings();

        setupPasswordToggle();

        setupPasswordChange();

        setupSettingsMenu();


        const cancelButton =
            document.querySelector(
                ".cancel-btn"
            );


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                handleCancelSettings
            );

        }

    }
);