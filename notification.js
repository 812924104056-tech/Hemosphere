/* =========================================================
   HemoSphere
   notifications.js
   Notification Center
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const notificationList =
    document.getElementById("notificationList");

const emptyState =
    document.getElementById("emptyState");

const unreadCount =
    document.getElementById("unreadCount");

const sidebarNotificationCount =
    document.getElementById(
        "sidebarNotificationCount"
    );

const markAllBtn =
    document.getElementById("markAllBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.querySelector(".sidebar");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* =========================================================
   STORAGE KEY
========================================================= */

const STORAGE_KEY = "hemoSphereNotifications";
const LEGACY_STORAGE_KEY = "hemosphereNotifications";


/* =========================================================
   DEFAULT NOTIFICATIONS
========================================================= */

const defaultNotifications = [

    {
        id: "N001",
        type: "request",
        title: "Urgent Blood Request",
        message:
            'An urgent <strong>O+ blood</strong> request has been created near your registered location.',
        metaOne:
            '<i class="fa-solid fa-location-dot"></i> 3.2 km away',
        metaTwo:
            '<i class="fa-regular fa-clock"></i> 8 minutes ago',
        buttonText: "View Request",
        read: false
    },

    {
        id: "N002",
        type: "donation",
        title: "Donor Match Found",
        message:
            'A compatible donor has been found for your <strong>O+ request</strong>. Open the request to view details.',
        metaOne:
            '<i class="fa-solid fa-user-check"></i> 96% Match',
        metaTwo:
            '<i class="fa-regular fa-clock"></i> 18 minutes ago',
        buttonText: "View Match",
        read: false
    },

    {
        id: "N003",
        type: "request",
        title: "Donor Response Pending",
        message:
            'Your request <strong>HS-REQ-1024</strong> is waiting for a donor response.',
        metaOne:
            '<i class="fa-solid fa-route"></i> Request Tracking',
        metaTwo:
            '<i class="fa-regular fa-clock"></i> 35 minutes ago',
        buttonText: "Track Request",
        read: false
    },

    {
        id: "N004",
        type: "donation",
        title: "Donation Reminder",
        message:
            "Your donor profile is active. Keep your availability updated so nearby patients can reach you.",
        metaOne:
            '<i class="fa-solid fa-calendar-check"></i> Profile Reminder',
        metaTwo:
            '<i class="fa-regular fa-clock"></i> 1 hour ago',
        buttonText: "Update Profile",
        read: false
    },

    {
        id: "N005",
        type: "request",
        title: "Request Successfully Created",
        message:
            'Your blood request <strong>HS-REQ-1024</strong> has been registered successfully.',
        metaOne:
            '<i class="fa-solid fa-file-medical"></i> Request Created',
        metaTwo:
            '<i class="fa-regular fa-clock"></i> 2 hours ago',
        buttonText: "View Request",
        read: true
    }

];


/* =========================================================
   LOAD NOTIFICATIONS
========================================================= */

function loadNotifications() {

    let mainNotifications = [];
    let legacyNotifications = [];

    try {

        mainNotifications =
            JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || [];

    } catch (error) {

        mainNotifications = [];

    }

    try {

        legacyNotifications =
            JSON.parse(
                localStorage.getItem(
                    LEGACY_STORAGE_KEY
                )
            ) || [];

    } catch (error) {

        legacyNotifications = [];

    }


    /* Combine old + new notifications */

    let notifications = [
        ...legacyNotifications,
        ...mainNotifications
    ];


    /* First time user */

    if (notifications.length === 0) {

        notifications = [
            ...defaultNotifications
        ];

    }


    /* Remove duplicate notifications */

    const uniqueNotifications = [];

    const usedIds = new Set();

    notifications.forEach(
        (notification, index) => {

            const id =
                notification.id ||
                `NOTIFICATION-${Date.now()}-${index}`;

            if (usedIds.has(id)) {
                return;
            }

            usedIds.add(id);


            uniqueNotifications.push({

                id: id,

                type:
                    notification.type ||
                    "request",

                title:
                    notification.title ||
                    "HemoSphere Notification",

                message:
                    notification.message ||
                    "",

                metaOne:
                    notification.metaOne ||
                    (
                        notification.requestId
                            ? `<i class="fa-solid fa-file-medical"></i> ${notification.requestId}`
                            : `<i class="fa-solid fa-droplet"></i> HemoSphere`
                    ),

                metaTwo:
                    notification.metaTwo ||
                    `<i class="fa-regular fa-clock"></i> Just now`,

                buttonText:
                    notification.buttonText ||
                    (
                        notification.type === "donation"
                            ? "View Match"
                            : "View Request"
                    ),

                requestId:
                    notification.requestId ||
                    "",

                read:
                    notification.read === true

            });

        }
    );


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            uniqueNotifications
        )
    );


    /* Remove old duplicate storage */

    localStorage.removeItem(
        LEGACY_STORAGE_KEY
    );


    return uniqueNotifications;

}


/* =========================================================
   SAVE NOTIFICATIONS
========================================================= */

function saveNotifications(
    notifications
) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            notifications
        )
    );

}


/* =========================================================
   GET CURRENT NOTIFICATIONS
========================================================= */

function getNotifications() {

    return loadNotifications();

}


/* =========================================================
   GET UNREAD COUNT
========================================================= */

function getUnreadCount() {

    const notifications =
        getNotifications();

    return notifications.filter(
        notification =>
            notification.read === false
    ).length;

}
function getTotalNotificationCount() {

    const notifications =
        getNotifications();

    return notifications.length;

}


/* =========================================================
   UPDATE COUNTER
========================================================= */

function updateCounter() {

    const notifications =
        getNotifications();

    const totalCount =
        notifications.length;

    const unreadTotal =
        notifications.filter(
            notification =>
                notification.read === false
        ).length;


    /* Notification page unread value */

    if (unreadCount) {

        unreadCount.textContent =
            unreadTotal;

    }


    /* Sidebar notification badge = TOTAL */

    if (sidebarNotificationCount) {

        sidebarNotificationCount.textContent =
            totalCount;


        if (totalCount === 0) {

            sidebarNotificationCount.style.display =
                "none";

        } else {

            sidebarNotificationCount.style.display =
                "inline-flex";

        }

    }


    /* Other notification badges */

    const allNotificationBadges =
        document.querySelectorAll(
            ".notification-count"
        );


    allNotificationBadges.forEach(
        badge => {

            badge.textContent =
                totalCount;

            badge.style.display =
                totalCount > 0
                    ? "inline-flex"
                    : "none";

        }
    );

}


/* =========================================================
   ICON CLASS
========================================================= */

function getIconClass(
    type
) {

    switch (type) {

        case "request":
            return "emergency";

        case "donation":
            return "donation";

        default:
            return "neutral";

    }

}


/* =========================================================
   ICON
========================================================= */

function getIcon(
    notification
) {

    const title =
        notification.title.toLowerCase();


    if (
        title.includes("match")
    ) {

        return "fa-heart";

    }


    if (
        title.includes("pending")
    ) {

        return "fa-user-clock";

    }


    if (
        title.includes("reminder")
    ) {

        return "fa-hand-holding-heart";

    }


    if (
        title.includes("success")
    ) {

        return "fa-circle-check";

    }


    return "fa-droplet";

}


/* =========================================================
   RENDER NOTIFICATIONS
========================================================= */

function renderNotifications(
    filter = "all"
) {

    if (!notificationList) {
        return;
    }


    const notifications =
        getNotifications();


    let filtered =
        notifications;


    /* -----------------------------------------
       FILTER
    ----------------------------------------- */

    if (filter === "unread") {

        filtered =
            notifications.filter(
                notification =>
                    notification.read === false
            );

    }


    else if (
        filter === "request"
    ) {

        filtered =
            notifications.filter(
                notification =>
                    notification.type ===
                    "request"
            );

    }


    else if (
        filter === "donation"
    ) {

        filtered =
            notifications.filter(
                notification =>
                    notification.type ===
                    "donation"
            );

    }


    /* -----------------------------------------
       EMPTY STATE
    ----------------------------------------- */

    if (filtered.length === 0) {

        notificationList.innerHTML = "";

        if (emptyState) {

            emptyState.hidden =
                false;

        }

        updateCounter();

        return;

    }


    if (emptyState) {

        emptyState.hidden =
            true;

    }


    /* -----------------------------------------
       CREATE CARDS
    ----------------------------------------- */

    notificationList.innerHTML =
        filtered.map(
            notification =>
                createNotificationCard(
                    notification
                )
        ).join("");


    attachCardEvents();

    updateCounter();

}


/* =========================================================
   CREATE NOTIFICATION CARD
========================================================= */

function createNotificationCard(
    notification
) {

    const unreadClass =
        notification.read
            ? ""
            : "unread";


    const newBadge =
        notification.read
            ? ""
            : `<span class="new-badge">NEW</span>`;


    return `

        <article
            class="notification-card ${unreadClass}"
            data-id="${escapeHTML(
                notification.id
            )}"
            data-type="${escapeHTML(
                notification.type
            )}"
        >

            <div
                class="notification-icon
                ${getIconClass(
                    notification.type
                )}"
            >

                <i class="fa-solid ${getIcon(
                    notification
                )}"></i>

            </div>


            <div class="notification-body">

                <div class="notification-heading">

                    <h3>
                        ${escapeHTML(
                            notification.title
                        )}
                    </h3>

                    ${newBadge}

                </div>


                <p>
                    ${notification.message}
                </p>


                <div class="notification-meta">

                    <span>
                        ${notification.metaOne}
                    </span>

                    <span>
                        ${notification.metaTwo}
                    </span>

                </div>

            </div>


            <div class="notification-actions">

                <button
                    class="view-btn"
                    type="button"
                    data-action="view"
                >
                    ${escapeHTML(
                        notification.buttonText
                    )}
                </button>


                <button
                    class="delete-btn"
                    type="button"
                    aria-label="Delete notification"
                    data-action="delete"
                >

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   ATTACH CARD EVENTS
========================================================= */

function attachCardEvents() {

    const cards =
        document.querySelectorAll(
            ".notification-card"
        );


    cards.forEach(
        card => {

            const id =
                card.dataset.id;


            /* -------------------------------------
               CARD CLICK
            ------------------------------------- */

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {

                        return;

                    }


                    markAsRead(id);

                }
            );


            /* -------------------------------------
               VIEW BUTTON
            ------------------------------------- */

            const viewButton =
                card.querySelector(
                    '[data-action="view"]'
                );


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    () => {

                        markAsRead(id);

                        handleViewAction(
                            viewButton.textContent.trim()
                        );

                    }
                );

            }


            /* -------------------------------------
               DELETE BUTTON
            ------------------------------------- */

            const deleteButton =
                card.querySelector(
                    '[data-action="delete"]'
                );


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    () => {

                        deleteNotification(
                            id
                        );

                    }
                );

            }

        }
    );

}


/* =========================================================
   MARK AS READ
========================================================= */

function markAsRead(
    notificationId
) {

    const notifications =
        getNotifications();


    const notification =
        notifications.find(
            item =>
                item.id ===
                notificationId
        );


    if (!notification) {
        return;
    }


    notification.read =
        true;


    saveNotifications(
        notifications
    );


    const activeFilter =
        getActiveFilter();


    renderNotifications(
        activeFilter
    );

}


/* =========================================================
   MARK ALL AS READ
========================================================= */

function markAllAsRead() {

    const notifications =
        getNotifications();


    notifications.forEach(
        notification => {

            notification.read =
                true;

        }
    );


    saveNotifications(
        notifications
    );


    const activeFilter =
        getActiveFilter();


    renderNotifications(
        activeFilter
    );


    showToast(
        "All notifications marked as read.",
        "success"
    );

}


/* =========================================================
   DELETE NOTIFICATION
========================================================= */

function deleteNotification(
    notificationId
) {

    const notifications =
        getNotifications();


    const updated =
        notifications.filter(
            notification =>
                notification.id !==
                notificationId
        );


    saveNotifications(
        updated
    );


    const activeFilter =
        getActiveFilter();


    renderNotifications(
        activeFilter
    );


    showToast(
        "Notification removed.",
        "success"
    );

}


/* =========================================================
   CLEAR ALL
========================================================= */

function clearAllNotifications() {

    const notifications =
        getNotifications();


    if (notifications.length === 0) {

        showToast(
            "There are no notifications to clear.",
            "info"
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to clear all notifications?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([])
    );


    const activeFilter =
        getActiveFilter();


    renderNotifications(
        activeFilter
    );


    showToast(
        "All notifications cleared.",
        "success"
    );

}


/* =========================================================
   GET ACTIVE FILTER
========================================================= */

function getActiveFilter() {

    const active =
        document.querySelector(
            ".filter-btn.active"
        );


    return active
        ? active.dataset.filter
        : "all";

}


/* =========================================================
   FILTER BUTTONS
========================================================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderNotifications(
                    button.dataset.filter
                );

            }
        );

    }
);


/* =========================================================
   VIEW ACTIONS
========================================================= */

function handleViewAction(
    action
) {

    const cleanAction =
        action.toLowerCase();


    if (
        cleanAction.includes(
            "track request"
        )
    ) {

        window.location.href =
            "request-tracking.html";

        return;

    }


    if (
        cleanAction.includes(
            "view request"
        )
    ) {

        window.location.href =
            "request-details.html";

        return;

    }


    if (
        cleanAction.includes(
            "view match"
        )
    ) {

        window.location.href =
            "donor-matching.html";

        return;

    }


    if (
        cleanAction.includes(
            "update profile"
        )
    ) {

        window.location.href =
            "donor-profile.html";

        return;

    }

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        () => {

            if (sidebar) {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }

        }
    );

}


/* =========================================================
   CLOSE SIDEBAR WHEN NAV LINK CLICKED
========================================================= */

if (sidebar) {

    const sidebarLinks =
        sidebar.querySelectorAll(
            "a"
        );


    sidebarLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    sidebar.classList.remove(
                        "mobile-open"
                    );

                }
            );

        }
    );

}


/* =========================================================
   CLOSE SIDEBAR OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            window.innerWidth <= 650 &&
            sidebar &&
            mobileMenu &&
            sidebar.classList.contains(
                "mobile-open"
            )
        ) {

            const clickedInsideSidebar =
                sidebar.contains(
                    event.target
                );

            const clickedMenu =
                mobileMenu.contains(
                    event.target
                );


            if (
                !clickedInsideSidebar &&
                !clickedMenu
            ) {

                sidebar.classList.remove(
                    "mobile-open"
                );

            }

        }

    }
);


/* =========================================================
   TOAST MESSAGE
========================================================= */

function showToast(
    message,
    type = "success"
) {

    const existing =
        document.querySelector(
            ".hemo-toast"
        );


    if (existing) {

        existing.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `hemo-toast ${type}`;


    let icon =
        "fa-circle-check";


    if (type === "info") {

        icon =
            "fa-circle-info";

    }


    toast.innerHTML = `

        <div class="toast-icon">

            <i class="fa-solid ${icon}"></i>

        </div>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    document.body.appendChild(
        toast
    );


    /* Inline style so toast works
       without changing CSS file */

    toast.style.position =
        "fixed";

    toast.style.right =
        "25px";

    toast.style.bottom =
        "25px";

    toast.style.zIndex =
        "9999";

    toast.style.display =
        "flex";

    toast.style.alignItems =
        "center";

    toast.style.gap =
        "10px";

    toast.style.padding =
        "13px 17px";

    toast.style.borderRadius =
        "12px";

    toast.style.background =
        "#151922";

    toast.style.color =
        "#ffffff";

    toast.style.fontSize =
        "12px";

    toast.style.fontWeight =
        "600";

    toast.style.boxShadow =
        "0 12px 35px rgba(0,0,0,0.18)";

    toast.style.animation =
        "toastIn 0.3s ease";


    setTimeout(
        () => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateY(10px)";

            toast.style.transition =
                "0.3s ease";


            setTimeout(
                () => {

                    toast.remove();

                },
                300
            );

        },
        2500
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


/* =========================================================
   DEMO NOTIFICATION
========================================================= */

function addDemoNotification() {

    const notifications =
        getNotifications();


    const newNotification = {

        id:
            "N" +
            Date.now(),

        type:
            "request",

        title:
            "New Blood Request",

        message:
            'A new <strong>B+ blood</strong> request is waiting for a compatible donor.',

        metaOne:
            '<i class="fa-solid fa-location-dot"></i> 4.1 km away',

        metaTwo:
            '<i class="fa-regular fa-clock"></i> Just now',

        buttonText:
            "View Request",

        read:
            false

    };


    notifications.unshift(
        newNotification
    );


    saveNotifications(
        notifications
    );


    renderNotifications(
        getActiveFilter()
    );


    showToast(
        "New blood request received.",
        "success"
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeNotifications() {

    loadNotifications();

    renderNotifications(
        "all"
    );

    updateCounter();

}


/* =========================================================
   ADD CSS ANIMATION
========================================================= */

const toastAnimation =
    document.createElement(
        "style"
    );


toastAnimation.textContent = `

    @keyframes toastIn {

        from {

            opacity: 0;

            transform:
                translateY(15px);

        }

        to {

            opacity: 1;

            transform:
                translateY(0);

        }

    }

`;


document.head.appendChild(
    toastAnimation
);


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeNotifications
);


/* =========================================================
   GLOBAL FUNCTIONS
   For future backend integration/testing
========================================================= */

window.hemoSphereNotifications = {

    getAll:
        getNotifications,

    markAsRead:
        markAsRead,

    markAllAsRead:
        markAllAsRead,

    delete:
        deleteNotification,

    clearAll:
        clearAllNotifications,

    addDemo:
        addDemoNotification,

    unreadCount:
        getUnreadCount

};

/* =========================================================
   LOAD SAVED HEMOSPHERE NOTIFICATIONS
========================================================= */

function loadSavedNotifications() {

    const savedNotifications =
        JSON.parse(
            localStorage.getItem("hemoSphereNotifications")
        ) || [];

    const notificationList =
        document.getElementById("notificationList");

    const emptyState =
        document.getElementById("emptyState");

    if (!notificationList) return;


    /* No saved notifications */

    if (savedNotifications.length === 0) {
        return;
    }


    /* Add saved notifications */

    savedNotifications.forEach(notification => {

        const notificationCard =
            document.createElement("div");

        notificationCard.className =
            `notification-card ${notification.read ? "read" : "unread"}`;

        notificationCard.dataset.type =
            notification.type || "donation";

        notificationCard.innerHTML = `
            
            <div class="notification-icon donation">
                <i class="fa-solid fa-droplet"></i>
            </div>

            <div class="notification-content">

                <div class="notification-top">

                    <strong>
                        ${notification.title || "HemoSphere Notification"}
                    </strong>

                    <span class="notification-time">
                        Just now
                    </span>

                </div>

                <p>
                    ${notification.message || ""}
                </p>

                <div class="notification-actions">

                    <button
                        class="notification-action view-notification"
                        data-request-id="${notification.requestId || ""}">
                        <i class="fa-solid fa-arrow-right"></i>
                        View Request
                    </button>

                </div>

            </div>
        `;

        notificationList.prepend(notificationCard);

    });


    /* Hide empty state */

    if (emptyState) {
        emptyState.style.display = "none";
    }


    /* Update unread count */

    updateSavedNotificationCount();

}


/* =========================================================
   UPDATE NOTIFICATION COUNT
========================================================= */

function updateSavedNotificationCount() {

    const notifications =
        JSON.parse(
            localStorage.getItem("hemoSphereNotifications")
        ) || [];

    const unreadCount =
        notifications.filter(
            notification => !notification.read
        ).length;

    const unreadElement =
        document.getElementById("unreadCount");

    const sidebarCount =
        document.getElementById("sidebarNotificationCount");


    if (unreadElement) {
        unreadElement.textContent = unreadCount;
    }

    if (sidebarCount) {
        sidebarCount.textContent = unreadCount;
    }

}


/* =========================================================
   LOAD WHEN PAGE OPENS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadSavedNotifications();

});
/* =========================================================
   VIEW REQUEST FROM SAVED NOTIFICATION
========================================================= */

document.addEventListener("click", (event) => {

    const viewButton =
        event.target.closest(".view-notification");

    if (!viewButton) return;

    const requestId =
        viewButton.dataset.requestId;

    if (!requestId) {
        return;
    }

    /* Open Request Details page */

    window.location.href =
        `request-details.html?requestId=${encodeURIComponent(requestId)}`;

});