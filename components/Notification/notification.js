/* =========================
   NOTIFICATION COMPONENT
========================= */


/* =========================
   STORAGE KEYS
========================= */

const NOTIFICATION_KEY =
    "trainerNotifications";

const MEMBER_NOTIFICATION_KEY =
    "memberNotifications";


/* =========================
   GET TRAINER NOTIFICATIONS
========================= */

function getNotifications() {

    try {

        return JSON.parse(
            localStorage.getItem(
                NOTIFICATION_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Error reading trainer notifications:",
            error
        );

        return [];

    }

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

    try {

        return JSON.parse(
            localStorage.getItem(
                MEMBER_NOTIFICATION_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Error reading member notifications:",
            error
        );

        return [];

    }

}


/* =========================
   SAVE MEMBER NOTIFICATIONS
========================= */

function saveMemberNotifications(
    notifications
) {

    localStorage.setItem(
        MEMBER_NOTIFICATION_KEY,
        JSON.stringify(
            notifications
        )
    );

}


/* =========================
   FIND MEMBER
========================= */

function findMemberForNotification(
    title,
    message
) {

    const members =
        JSON.parse(
            localStorage.getItem(
                "gymMembers"
            )
        ) || [];


    if (!Array.isArray(members)) {

        return null;

    }


    const notificationText =
        `${title || ""} ${message || ""}`
            .toLowerCase();


    const matchedMember =
        members.find(
            function (member) {

                const memberName =
                    member.name ||
                    member.fullName ||
                    member.memberName ||
                    member.customerName ||
                    `${member.firstName || ""} ${member.lastName || ""}`
                        .trim();


                if (!memberName) {

                    return false;

                }


                return notificationText.includes(
                    String(memberName)
                        .toLowerCase()
                );

            }
        );


    return matchedMember || null;

}


/* =========================
   GET CURRENT TRAINER NAME
========================= */

function getCurrentTrainerName() {

    return (
        localStorage.getItem(
            "loggedInTrainer"
        ) ||

        localStorage.getItem(
            "currentTrainer"
        ) ||

        "Trainer"
    );

}


/* =========================
   CREATE NOTIFICATION
========================= */

function createNotification(
    title,
    message,
    type = "general",
    icon = "fa-bell",
    targetMemberId = "",
    targetMemberName = "",
    trainerName = ""
) {


    /* =========================
       TRAINER NOTIFICATION
    ========================= */

    const notifications =
        getNotifications();


    const trainerNotification = {

        id:
            Date.now().toString() +
            Math.random()
                .toString(36)
                .substring(2),

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


    notifications.unshift(
        trainerNotification
    );


    saveNotifications(
        notifications
    );


    /* =========================
       FIND MEMBER
    ========================= */

    let matchedMember =
        null;


    if (targetMemberId) {

        const members =
            JSON.parse(
                localStorage.getItem(
                    "gymMembers"
                )
            ) || [];


        if (Array.isArray(members)) {

            matchedMember =
                members.find(
                    function (member) {

                        const memberId =
                            member.memberId ||
                            member.id ||
                            member.memberID;


                        return String(
                            memberId || ""
                        ).trim() ===
                        String(
                            targetMemberId
                        ).trim();

                    }
                );

        }

    }

    if (!matchedMember) {

        matchedMember =
            findMemberForNotification(
                title,
                message
            );

    }


    /* =========================
       FINAL MEMBER ID
    ========================= */

    if (matchedMember) {

        targetMemberId =
            matchedMember.memberId ||
            matchedMember.id ||
            matchedMember.memberID ||
            "";

        targetMemberName =
            targetMemberName ||

            matchedMember.name ||

            matchedMember.fullName ||

            matchedMember.memberName ||

            matchedMember.customerName ||

            `${matchedMember.firstName || ""} ${matchedMember.lastName || ""}`
                .trim();

    }


    /* =========================
       CREATE MEMBER NOTIFICATION
    ========================= */

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
                String(
                    targetMemberId
                ),

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
        ========================= */

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


    /* =========================
       TRAINER EVENT
    ========================= */

    window.dispatchEvent(
        new CustomEvent(
            "notificationCreated",
            {
                detail:
                    trainerNotification
            }
        )
    );


    return trainerNotification;

}


/* =========================
   MARK ONE TRAINER NOTIFICATION READ
========================= */

function markNotificationAsRead(id) {

    const notifications =
        getNotifications();


    const notification =
        notifications.find(
            item =>
                item.id === id
        );


    if (!notification) {

        return;

    }


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
        function (notification) {

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

function markMemberNotificationAsRead(
    id
) {

    const notifications =
        getMemberNotifications();


    const notification =
        notifications.find(
            item =>
                item.id === id
        );


    if (!notification) {

        return;

    }


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
        function (notification) {

            if (
                !memberId ||
                String(
                    notification.memberId
                ) ===
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

function deleteMemberNotification(
    id
) {

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
        function (notification) {

            const memberMatch =
                !memberId ||
                String(
                    notification.memberId
                ) ===
                String(memberId);


            return (
                memberMatch &&
                !notification.read
            );

        }
    ).length;

}

