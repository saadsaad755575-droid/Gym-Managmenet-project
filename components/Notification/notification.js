

/* =========================
   NOTIFICATION COMPONENT
========================= */


/* =========================
   LOCAL STORAGE KEY
========================= */

const NOTIFICATION_KEY = "trainerNotifications";


/* =========================
   GET NOTIFICATIONS
========================= */

function getNotifications() {

    return JSON.parse(
        localStorage.getItem(NOTIFICATION_KEY)
    ) || [];

}


/* =========================
   SAVE NOTIFICATIONS
========================= */

function saveNotifications(notifications) {

    localStorage.setItem(
        NOTIFICATION_KEY,
        JSON.stringify(notifications)
    );

}


/* =========================
   CREATE NOTIFICATION
   REUSABLE FUNCTION
========================= */

function createNotification(
    type,
    title,
    message,
    icon = "fa-bell"
) {

    const notifications =
        getNotifications();


    const notification = {

        id:
            Date.now().toString() +
            Math.random()
                .toString(36)
                .substring(2),

        type: type,

        title: title,

        message: message,

        icon: icon,

        read: false,

        createdAt:
            new Date().toISOString()

    };


    notifications.unshift(
        notification
    );


    saveNotifications(
        notifications
    );


    /*
       Agar Notifications page
       already open ho to update event
       send hoga.
    */

    window.dispatchEvent(
        new CustomEvent(
            "notificationCreated",
            {
                detail: notification
            }
        )
    );

}


/* =========================
   MARK NOTIFICATION AS READ
========================= */

function markNotificationAsRead(id) {

    const notifications =
        getNotifications();


    const notification =
        notifications.find(
            item => item.id === id
        );


    if (!notification) return;


    notification.read = true;


    saveNotifications(
        notifications
    );


    window.dispatchEvent(
        new CustomEvent(
            "notificationUpdated"
        )
    );

}


/* =========================
   MARK ALL AS READ
========================= */

function markAllNotificationsAsRead() {

    const notifications =
        getNotifications();


    notifications.forEach(
        notification => {

            notification.read = true;

        }
    );


    saveNotifications(
        notifications
    );


    window.dispatchEvent(
        new CustomEvent(
            "notificationUpdated"
        )
    );

}


/* =========================
   DELETE NOTIFICATION
========================= */

function deleteNotification(id) {

    const notifications =
        getNotifications();


    const updatedNotifications =
        notifications.filter(
            notification =>
                notification.id !== id
        );


    saveNotifications(
        updatedNotifications
    );


    window.dispatchEvent(
        new CustomEvent(
            "notificationUpdated"
        )
    );

}


/* =========================
   DELETE ALL NOTIFICATIONS
========================= */

function deleteAllNotifications() {

    localStorage.removeItem(
        NOTIFICATION_KEY
    );


    window.dispatchEvent(
        new CustomEvent(
            "notificationUpdated"
        )
    );

}


/* =========================
   GET UNREAD COUNT
========================= */

function getUnreadNotificationCount() {

    const notifications =
        getNotifications();


    return notifications.filter(
        notification =>
            !notification.read
    ).length;

}
