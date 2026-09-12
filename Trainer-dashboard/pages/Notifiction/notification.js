

/* =========================
   NOTIFICATIONS PAGE
========================= */


/* =========================
   LOAD REUSABLE COMPONENTS
========================= */

function loadComponent(elementId, filePath) {

    const element =
        document.getElementById(elementId);

    if (!element) return;

    fetch(filePath)
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    `Could not load ${filePath}`
                );
            }

            return response.text();

        })
        .then(data => {

            element.innerHTML = data;

        })
        .catch(error => {

            console.error(error);

        });
}


loadComponent(
    "trainer-sidebar",
    "../../../components/trainer.sidebar/trainer.sidebar.html"
);

loadComponent(
    "trainer-navbar",
    "../../../components/trainer-navbar/trainer-navbar.html"
);
loadComponent(
    "trainer-modal-container",
    "../../../components/trainer-modal/trainer-modal.html"
);



/* =========================
   LOCAL STORAGE
========================= */

const NOTIFICATION_KEY =
    "trainerNotifications";


let notifications =
    JSON.parse(
        localStorage.getItem(
            NOTIFICATION_KEY
        )
    ) || [];


/* =========================
   DOM ELEMENTS
========================= */

const notificationsList =
    document.getElementById(
        "notificationsList"
    );

const totalNotifications =
    document.getElementById(
        "totalNotifications"
    );

const unreadNotifications =
    document.getElementById(
        "unreadNotifications"
    );

const readNotifications =
    document.getElementById(
        "readNotifications"
    );

const notificationFilter =
    document.getElementById(
        "notificationFilter"
    );

const notificationType =
    document.getElementById(
        "notificationType"
    );

const markAllRead =
    document.getElementById(
        "markAllRead"
    );


/* =========================
   SAVE NOTIFICATIONS
========================= */

function saveNotifications() {

    localStorage.setItem(
        NOTIFICATION_KEY,
        JSON.stringify(notifications)
    );

}





/* =========================
   RENDER NOTIFICATIONS
========================= */

function renderNotifications() {

    if (!notificationsList) return;


    const selectedFilter =
        notificationFilter
            ? notificationFilter.value
            : "all";


    const selectedType =
        notificationType
            ? notificationType.value
            : "all";


    let filteredNotifications =
        notifications.filter(notification => {

            const filterMatch =
                selectedFilter === "all" ||
                (
                    selectedFilter === "unread" &&
                    !notification.read
                ) ||
                (
                    selectedFilter === "read" &&
                    notification.read
                );


            const typeMatch =
                selectedType === "all" ||
                notification.type === selectedType;


            return (
                filterMatch &&
                typeMatch
            );

        });


    notificationsList.innerHTML = "";


    if (
        filteredNotifications.length === 0
    ) {

        notificationsList.innerHTML = `

            <div class="notifications-empty">

                <i class="fa-regular fa-bell-slash"></i>

                <h3>
                    No Notifications
                </h3>

                <p>
                    You're all caught up.
                </p>

            </div>

        `;

        return;
    }


    filteredNotifications.forEach(
        notification => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                `notification-item ${
                    notification.read
                        ? ""
                        : "unread"
                }`;


            item.innerHTML = `

                <div class="notification-icon">

                    <i class="fa-solid ${escapeHTML(
                        notification.icon
                    )}"></i>

                </div>


                <div class="notification-content">

                    <h3>
                        ${escapeHTML(
                            notification.title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            notification.message
                        )}
                    </p>

                    <span class="notification-time">
                        ${formatNotificationTime(
                            notification.createdAt
                        )}
                    </span>

                </div>


                <div class="notification-status">

                    ${
                        notification.read
                            ? `
                                <span class="notification-read-label">
                                    Read
                                </span>
                            `
                            : `
                                <span
                                    class="notification-unread-dot"
                                    title="Unread">
                                </span>
                            `
                    }

                </div>


                <div class="notification-actions">

                    ${
                        !notification.read
                            ? `
                                <button
                                    type="button"
                                    class="notification-action-icon"
                                    title="Mark as Read"
                                    onclick="markNotificationAsRead('${notification.id}')">

                                    <i class="fa-solid fa-check"></i>

                                </button>
                            `
                            : ""
                    }


                    <button
                        type="button"
                        class="notification-action-icon"
                        title="Delete"
                        onclick="deleteNotification('${notification.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            `;


            /*
             * Clicking the notification itself
             * marks it as read.
             */

            item.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".notification-actions"
                        )
                    ) {
                        return;
                    }


                    markNotificationAsRead(
                        notification.id
                    );

                }
            );


            notificationsList.appendChild(
                item
            );

        }
    );

}


/* =========================
   MARK ONE AS READ
========================= */

function markNotificationAsRead(id) {

    const notification =
        notifications.find(
            item => item.id === id
        );


    if (!notification) return;


    notification.read = true;


    saveNotifications();

    renderNotifications();

    updateNotificationSummary();

}


/* =========================
   MARK ALL AS READ
========================= */

if (markAllRead) {

    markAllRead.addEventListener(
        "click",
        () => {

            notifications.forEach(
                notification => {

                    notification.read = true;

                }
            );


            saveNotifications();

            renderNotifications();

            updateNotificationSummary();

        }
    );

}


/* =========================
   DELETE NOTIFICATION
========================= */

function deleteNotification(id) {

    notifications =
        notifications.filter(
            notification =>
                notification.id !== id
        );


    saveNotifications();

    renderNotifications();

    updateNotificationSummary();

}


/* =========================
   UPDATE SUMMARY
========================= */

function updateNotificationSummary() {

    const total =
        notifications.length;


    const unread =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    const read =
        notifications.filter(
            notification =>
                notification.read
        ).length;


    if (totalNotifications) {

        totalNotifications.textContent =
            total;

    }


    if (unreadNotifications) {

        unreadNotifications.textContent =
            unread;

    }


    if (readNotifications) {

        readNotifications.textContent =
            read;

    }

}


/* =========================
   FILTER EVENTS
========================= */

if (notificationFilter) {

    notificationFilter.addEventListener(
        "change",
        renderNotifications
    );

}


if (notificationType) {

    notificationType.addEventListener(
        "change",
        renderNotifications
    );

}


/* =========================
   TIME FORMAT
========================= */

function formatNotificationTime(
    dateString
) {

    if (!dateString) return "";


    const date =
        new Date(dateString);


    const now =
        new Date();


    const difference =
        now.getTime() -
        date.getTime();


    const minutes =
        Math.floor(
            difference / 60000
        );


    if (minutes < 1) {

        return "Just now";

    }


    if (minutes < 60) {

        return `${minutes} minute${
            minutes === 1
                ? ""
                : "s"
        } ago`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return `${hours} hour${
            hours === 1
                ? ""
                : "s"
        } ago`;

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {

        return `${days} day${
            days === 1
                ? ""
                : "s"
        } ago`;

    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================
   INITIAL LOAD
========================= */

renderNotifications();

updateNotificationSummary();
