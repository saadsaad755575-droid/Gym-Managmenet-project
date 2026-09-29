
/* =========================
   NOTIFICATION COMPONENT
========================= */

const NOTIFICATION_KEY = "trainerNotifications";
const MEMBER_NOTIFICATION_KEY = "memberNotifications";


/* =========================
   GET TRAINER NOTIFICATIONS
========================= */

function getNotifications() {

    return JSON.parse(
        localStorage.getItem(NOTIFICATION_KEY)
    ) || [];

}


/* =========================
   SAVE TRAINER NOTIFICATIONS
========================= */

function saveNotifications(notifications) {

    localStorage.setItem(
        NOTIFICATION_KEY,
        JSON.stringify(notifications)
    );

}


/* =========================
   GET MEMBER NOTIFICATIONS
========================= */

function getMemberNotifications() {

    return JSON.parse(
        localStorage.getItem(
            MEMBER_NOTIFICATION_KEY
        )
    ) || [];

}


/* =========================
   SAVE MEMBER NOTIFICATIONS
========================= */

function saveMemberNotifications(notifications) {

    localStorage.setItem(
        MEMBER_NOTIFICATION_KEY,
        JSON.stringify(notifications)
    );

}


/* =========================
   FIND MEMBER FROM NOTIFICATION
========================= */

function findMemberForNotification(
    title,
    message
) {

    const members =
        JSON.parse(
            localStorage.getItem("gymMembers")
        ) || [];


    if (!Array.isArray(members)) {
        return null;
    }


    const notificationText =
        `${title} ${message}`.toLowerCase();


    const matchedMembers =
        members.filter(member => {

            const memberName =
                member.name ||
                member.fullName ||
                member.memberName ||
                member.customerName ||
                `${member.firstName || ""} ${member.lastName || ""}`.trim();


            if (!memberName) {
                return false;
            }


            return notificationText.includes(
                String(memberName).toLowerCase()
            );

        });

if (!targetMemberId) {

        const matchedMember =
            findMemberForNotification(
                title,
                message
            );


        if (matchedMember) {

            targetMemberId =
                matchedMember.memberId;

            targetMemberName =
                matchedMember.memberName;

        }

    }


    /* =========================
       CREATE MEMBER NOTIFICATION
       ONLY WHEN MEMBER IS FOUND
    ========================== */

    if (targetMemberId) {

        const memberNotifications =
            getMemberNotifications();


        const memberNotification = {

            id:
                Date.now().toString() +
                Math.random()
                    .toString(36)
                    .substring(2),

            memberId:
                String(targetMemberId),

            memberName:
                targetMemberName || "",

            trainerName:
                trainerName ||
                getCurrentTrainerName(),

            type:
                type,

            title:
                title,

            message:
                message,

            icon:
                icon,

            read:
                false,

            createdAt:
                new Date().toISOString()

        };


        memberNotifications.unshift(
            memberNotification
        );


        saveMemberNotifications(
            memberNotifications
        );


        /* =========================
           MEMBER EVENT
        ========================== */

        window.dispatchEvent(
            new CustomEvent(
                "memberNotificationCreated",
                {
                    detail:
                        memberNotification
                }
            )
        );

    }

}


/* =========================
   MARK ONE TRAINER NOTIFICATION READ
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
   MARK ALL TRAINER NOTIFICATIONS READ
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
   DELETE ONE TRAINER NOTIFICATION
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
   DELETE ALL TRAINER NOTIFICATIONS
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
   UNREAD TRAINER COUNT
========================= */

function getUnreadNotificationCount() {

    const notifications =
        getNotifications();


    return notifications.filter(
        notification =>
            !notification.read
    ).length;

}


/* =========================
   MARK ONE MEMBER NOTIFICATION READ
========================= */

function markMemberNotificationAsRead(id) {

    const notifications =
        getMemberNotifications();


    const notification =
        notifications.find(
            item => item.id === id
        );


    if (!notification) return;


    notification.read = true;


    saveMemberNotifications(
        notifications
    );


    window.dispatchEvent(
        new CustomEvent(
            "memberNotificationUpdated"
        )
    );

}


/* =========================
   MARK ALL MEMBER NOTIFICATIONS READ
========================= */

function markAllMemberNotificationsAsRead(
    memberId = ""
) {

    const notifications =
        getMemberNotifications();


    notifications.forEach(
        notification => {

            if (
                !memberId ||
                String(notification.memberId) ===
                String(memberId)
            ) {

                notification.read = true;

            }

        }
    );


    saveMemberNotifications(
        notifications
    );


    window.dispatchEvent(
        new CustomEvent(
            "memberNotificationUpdated"
        )
    );

}


/* =========================
   DELETE ONE MEMBER NOTIFICATION
========================= */

function deleteMemberNotification(id) {

    const notifications =
        getMemberNotifications();


    const updatedNotifications =
        notifications.filter(
            notification =>
                notification.id !== id
        );


    saveMemberNotifications(
        updatedNotifications
    );


    window.dispatchEvent(
        new CustomEvent(
            "memberNotificationUpdated"
        )
    );

}


/* =========================
   UNREAD MEMBER COUNT
========================= */

function getUnreadMemberNotificationCount(
    memberId = ""
) {

    const notifications =
        getMemberNotifications();


    return notifications.filter(
        notification => {

            const memberMatch =
                !memberId ||
                String(notification.memberId) ===
                String(memberId);

            return (
                memberMatch &&
                !notification.read
            );

        }
    ).length;

}
