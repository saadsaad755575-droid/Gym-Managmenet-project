/* ========================================
   MEMBER NOTIFICATIONS
======================================== */


/* ========================================
   STORAGE
======================================== */

const MEMBER_NOTIFICATION_KEY =
    "memberNotifications";


/* ========================================
   PAGE LOAD
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMemberComponents();

    }
);


/* ========================================
   LOAD COMPONENTS
======================================== */

async function loadMemberComponents() {

    try {

        await loadComponent(
            "member-sidebar",
            "../../../components/member-sidebar/member-sidebar.html"
        );


        await loadComponent(
            "member-navbar",
            "../../../components/member-navbar/member-navbar.html"
        );


        /* ================================
           INITIALIZE SIDEBAR
        ================================= */

        if (
            typeof initializeMemberSidebar ===
            "function"
        ) {

            initializeMemberSidebar();

        }


        /* ================================
           INITIALIZE NAVBAR
        ================================= */

        if (
            typeof initMemberNavbar ===
            "function"
        ) {

            initMemberNavbar();

        }


        /* ================================
           LOAD NOTIFICATIONS
        ================================= */

        renderNotifications();

        updateNotificationSummary();

    }

    catch (error) {

        console.error(
            "Member components could not be loaded:",
            error
        );

    }

}


/* ========================================
   LOAD COMPONENT
======================================== */

async function loadComponent(
    elementId,
    filePath
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        console.error(
            `Container "${elementId}" not found.`
        );

        return;

    }


    try {

        const response =
            await fetch(filePath);


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const html =
            await response.text();


        element.innerHTML =
            html;

    }

    catch (error) {

        console.error(
            `Component could not be loaded: ${filePath}`,
            error
        );


        element.innerHTML = `

            <div
                style="
                    color:#ff5555;
                    padding:20px;
                    text-align:center;
                "
            >

                Component could not be loaded.

            </div>

        `;

    }

}


/* ========================================
   GET LOGGED-IN MEMBER ID
======================================== */

function getLoggedInMemberId() {

    return String(
        localStorage.getItem(
            "loggedInMemberId"
        ) || ""
    ).trim();

}


/* ========================================
   GET MEMBER NOTIFICATIONS
======================================== */

function getMemberNotifications() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    MEMBER_NOTIFICATION_KEY
                )
            );


        if (Array.isArray(data)) {

            return data;

        }

    }

    catch (error) {

        console.error(
            "Error reading member notifications:",
            error
        );

    }


    return [];

}


/* ========================================
   SAVE MEMBER NOTIFICATIONS
======================================== */

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


/* ========================================
   GET CURRENT MEMBER NOTIFICATIONS
======================================== */

function getCurrentMemberNotifications() {

    const memberId =
        getLoggedInMemberId();


    if (!memberId) {

        return [];

    }


    const notifications =
        getMemberNotifications();


    return notifications.filter(
        function (notification) {

            return (
                String(
                    notification.memberId || ""
                ).trim() ===
                memberId
            );

        }
    );

}


/* ========================================
   DOM ELEMENTS
======================================== */

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


/* ========================================
   RENDER NOTIFICATIONS
======================================== */

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


    let notifications =
        getCurrentMemberNotifications();


    notifications =
        notifications.filter(
            function (notification) {

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
                    notification.type ===
                    selectedType;


                return (
                    filterMatch &&
                    typeMatch
                );

            }
        );


    notificationsList.innerHTML = "";


    if (
        notifications.length === 0
    ) {

        notificationsList.innerHTML = `

            <div class="notifications-empty">

                <i
                    class="fa-regular fa-bell-slash"
                ></i>

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


    notifications.forEach(
        function (notification) {


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

                    <i class="fa-solid ${
                        escapeHTML(
                            notification.icon ||
                            "fa-bell"
                        )
                    }"></i>

                </div>


                <div class="notification-content">

                    <h3>
                        ${escapeHTML(
                            notification.title ||
                            "Notification"
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            notification.message ||
                            ""
                        )}
                    </p>


                    ${
                        notification.trainerName
                            ? `
                                <span
                                    class="notification-time"
                                >
                                    Trainer:
                                    ${escapeHTML(
                                        notification.trainerName
                                    )}
                                </span>
                            `
                            : ""
                    }


                    <span
                        class="notification-time"
                    >
                        ${formatNotificationTime(
                            notification.createdAt
                        )}
                    </span>

                </div>


                <div class="notification-status">

                    ${
                        notification.read

                            ? `
                                <span
                                    class="notification-read-label"
                                >
                                    Read
                                </span>
                            `

                            : `
                                <span
                                    class="notification-unread-dot"
                                    title="Unread"
                                ></span>
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
                                    onclick="
                                        markNotificationAsRead(
                                            '${escapeHTML(
                                                notification.id
                                            )}'
                                        )
                                    "
                                >

                                    <i
                                        class="fa-solid fa-check"
                                    ></i>

                                </button>
                            `

                            : ""
                    }


                    <button
                        type="button"
                        class="notification-action-icon"
                        title="Delete"
                        onclick="
                            deleteNotification(
                                '${escapeHTML(
                                    notification.id
                                )}'
                            )
                        "
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                    </button>


                </div>

            `;


            /* ================================
               CLICK NOTIFICATION
            ================================= */

            item.addEventListener(
                "click",
                function (event) {

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


/* ========================================
   MARK ONE AS READ
======================================== */

function markNotificationAsRead(id) {

    const notifications =
        getMemberNotifications();


    const notification =
        notifications.find(
            function (item) {

                return (
                    item.id === id &&
                    String(
                        item.memberId || ""
                    ).trim() ===
                    getLoggedInMemberId()
                );

            }
        );


    if (!notification) return;


    notification.read = true;


    saveMemberNotifications(
        notifications
    );


    renderNotifications();

    updateNotificationSummary();

}


/* ========================================
   MARK ALL AS READ
======================================== */

if (markAllRead) {

    markAllRead.addEventListener(
        "click",
        function () {

            const memberId =
                getLoggedInMemberId();


            const notifications =
                getMemberNotifications();


            notifications.forEach(
                function (notification) {

                    if (
                        String(
                            notification.memberId ||
                            ""
                        ).trim() ===
                        memberId
                    ) {

                        notification.read = true;

                    }

                }
            );


            saveMemberNotifications(
                notifications
            );


            renderNotifications();

            updateNotificationSummary();

        }
    );

}


/* ========================================
   DELETE NOTIFICATION
======================================== */

function deleteNotification(id) {

    const memberId =
        getLoggedInMemberId();


    let notifications =
        getMemberNotifications();


    notifications =
        notifications.filter(
            function (notification) {

                return !(
                    notification.id === id &&
                    String(
                        notification.memberId ||
                        ""
                    ).trim() ===
                    memberId
                );

            }
        );


    saveMemberNotifications(
        notifications
    );


    renderNotifications();

    updateNotificationSummary();

}


/* ========================================
   UPDATE SUMMARY
======================================== */

function updateNotificationSummary() {

    const notifications =
        getCurrentMemberNotifications();


    const total =
        notifications.length;


    const unread =
        notifications.filter(
            function (notification) {

                return !notification.read;

            }
        ).length;


    const read =
        notifications.filter(
            function (notification) {

                return notification.read;

            }
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


/* ========================================
   FILTER EVENTS
======================================== */

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


/* ========================================
   TIME FORMAT
======================================== */

function formatNotificationTime(
    dateString
) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(dateString);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


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


/* ========================================
   ESCAPE HTML
======================================== */
function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ========================================
   FORMAT NOTIFICATION TIME
======================================== */

function formatNotificationTime(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);
    const now = new Date();

    const difference =
        now.getTime() - date.getTime();

    const minutes =
        Math.floor(difference / 60000);


    if (minutes < 1) {
        return "Just now";
    }


    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }


    const hours =
        Math.floor(minutes / 60);


    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }


    const days =
        Math.floor(hours / 24);


    if (days < 7) {
        return `${days} day${days === 1 ? "" : "s"} ago`;
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


/* ========================================
   INITIAL RENDER
======================================== */

renderNotifications();

updateNotificationSummary();
