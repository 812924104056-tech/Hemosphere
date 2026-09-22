/* =========================================================
   HEMOSPHERE
   REQUEST DETAILS — JAVASCRIPT
   Dynamic Request Integration
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

const acceptRequest = document.getElementById("acceptRequest");
const messageRequester = document.getElementById("messageRequester");
const logoutBtn = document.getElementById("logoutBtn");

const mapBtn = document.querySelector(".map-btn");


/* =========================================================
   GET REQUEST ID FROM URL
========================================================= */

const urlParams = new URLSearchParams(window.location.search);

const requestId =
    urlParams.get("requestId") || "HS-REQ-2048";


/* =========================================================
   CURRENT REQUEST
========================================================= */

let currentRequest = null;


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("open");

    });

}


/* Close sidebar when clicking navigation */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {

    item.addEventListener("click", () => {

        if (window.innerWidth <= 850 && sidebar) {

            sidebar.classList.remove("open");

        }

    });

});


/* Close sidebar when clicking outside */

document.addEventListener("click", (event) => {

    if (
        window.innerWidth <= 850 &&
        sidebar &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {

        sidebar.classList.remove("open");

    }

});


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

function showToast(message, type = "success") {

    const oldToast =
        document.querySelector(".hs-toast");

    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement("div");

    toast.className =
        `hs-toast ${type}`;


    let icon = "fa-circle-check";

    if (type === "error") {

        icon = "fa-circle-exclamation";

    }

    if (type === "info") {

        icon = "fa-circle-info";

    }


    toast.innerHTML = `

        <div class="toast-icon">
            <i class="fa-solid ${icon}"></i>
        </div>

        <div class="toast-content">

            <strong>HemoSphere</strong>

            <span>
                ${message}
            </span>

        </div>

        <button class="toast-close">

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("show");

    }, 50);


    const closeBtn =
        toast.querySelector(".toast-close");


    if (closeBtn) {

        closeBtn.addEventListener("click", () => {

            removeToast(toast);

        });

    }


    setTimeout(() => {

        removeToast(toast);

    }, 4000);

}


/* Remove toast */

function removeToast(toast) {

    if (!toast) return;

    toast.classList.remove("show");

    setTimeout(() => {

        if (toast.parentElement) {

            toast.remove();

        }

    }, 300);

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {

        return "Today";

    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return "Today";

    }


    return date.toLocaleString("en-IN", {

        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"

    });

}


/* =========================================================
   FORMAT URGENCY
========================================================= */

function formatUrgency(urgency) {

    if (!urgency) {

        return "Urgent";

    }


    const value =
        String(urgency).toLowerCase();


    if (value === "critical") {

        return "Critical";

    }

    if (value === "urgent") {

        return "Urgent";

    }

    if (value === "normal") {

        return "Normal";

    }

    return urgency;

}


/* =========================================================
   LOAD CURRENT REQUEST
========================================================= */

function loadCurrentRequest() {

    const requests =
        JSON.parse(
            localStorage.getItem("hemoSphereRequests")
        ) || [];


    if (!Array.isArray(requests) || requests.length === 0) {

        console.log(
            "No saved blood requests found."
        );

        return null;

    }


    let request =
        requests.find(
            item =>
                item.requestId === requestId
        );


    /*
       If URL does not contain a valid request,
       use the latest request.
    */

    if (!request) {

        request =
            requests[requests.length - 1];

    }


    if (!request) {

        return null;

    }


    currentRequest = request;


    /* =====================================================
       BASIC VALUES
    ===================================================== */

    const bloodGroup =
        request.bloodGroup || "O+";

    const units =
        Number(request.units) || 1;

    const hospital =
        request.hospitalName || "Hospital information unavailable";

    const city =
        request.city || "Location unavailable";

    const patient =
        request.patientName || "Patient information unavailable";

    const urgency =
        formatUrgency(request.urgency);

    const requester =
        request.requesterName || "Requester";

    const requesterPhone =
        request.requesterPhone || "";


    /* =====================================================
       REQUEST META
    ===================================================== */

    const metaBlocks =
        document.querySelectorAll(".request-meta > div");


    if (metaBlocks[0]) {

        const value =
            metaBlocks[0].querySelector("strong");

        if (value) {

            value.textContent =
                `#${request.requestId || requestId}`;

        }

    }


    if (metaBlocks[1]) {

        const value =
            metaBlocks[1].querySelector("strong");

        if (value) {

            value.textContent =
                formatDate(request.createdAt);

        }

    }


    if (metaBlocks[2]) {

        const value =
            metaBlocks[2].querySelector("strong");

        if (value) {

            value.textContent =
                getResponseWindow(request);

        }

    }


    /* =====================================================
       HERO STATUS
    ===================================================== */

    const heroStatus =
        document.querySelector(".hero-status");


    if (heroStatus) {

        heroStatus.innerHTML = `

            <span class="status-dot"></span>

            <span>${urgency} Request</span>

        `;

    }


    /* =====================================================
       BLOOD REQUIREMENT
    ===================================================== */

    const bloodType =
        document.querySelector(".blood-type");


    if (bloodType) {

        bloodType.textContent =
            bloodGroup;

    }


    const bloodRequirement =
        document.querySelector(".blood-requirement");


    if (bloodRequirement) {

        const strong =
            bloodRequirement.querySelector("strong");

        const span =
            bloodRequirement.querySelector("span");


        if (strong) {

            strong.textContent =
                getBloodGroupName(bloodGroup);

        }


        if (span) {

            span.textContent =
                `${units} unit${units > 1 ? "s" : ""} required`;

        }

    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    updateProgress();


    /* =====================================================
       PATIENT INFORMATION
       Exact HTML structure:
       patient-grid > patient-item
    ===================================================== */

    const patientItems =
        document.querySelectorAll(
            ".patient-grid .patient-item"
        );


    if (patientItems[0]) {

        const strong =
            patientItems[0].querySelector("strong");

        if (strong) {

            strong.textContent =
                patient;

        }

    }


    /*
       Age is not stored in blood-request.js,
       so existing static age is preserved.
    */


    if (patientItems[2]) {

        const strong =
            patientItems[2].querySelector("strong");

        if (strong) {

            strong.textContent =
                bloodGroup;

        }

    }


    if (patientItems[3]) {

        const strong =
            patientItems[3].querySelector("strong");

        if (strong) {

            strong.textContent =
                `${units} Unit${units > 1 ? "s" : ""}`;

        }

    }


    /* =====================================================
       HOSPITAL INFORMATION
    ===================================================== */

    const hospitalInfo =
        document.querySelector(".hospital-info");


    if (hospitalInfo) {

        const hospitalName =
            hospitalInfo.querySelector("strong");

        const hospitalAddress =
            hospitalInfo.querySelector("p");


        if (hospitalName) {

            hospitalName.textContent =
                hospital;

        }


        if (hospitalAddress) {

            hospitalAddress.textContent =
                `Location: ${city}`;

        }

    }


    /* =====================================================
       REQUEST MESSAGE
    ===================================================== */

    const messageText =
        document.querySelector(".message-box p");


    if (messageText) {

        messageText.textContent =
            `The patient requires ${bloodGroup} blood urgently. ` +
            `${units} unit${units > 1 ? "s" : ""} are needed at ` +
            `${hospital}, ${city}. Donors who are eligible and ` +
            `available are requested to respond as soon as possible.`;

    }


    /* =====================================================
       TIMELINE
    ===================================================== */

    const timelineItems =
        document.querySelectorAll(".timeline-item");


    if (timelineItems[0]) {

        const time =
            timelineItems[0].querySelector("span");

        if (time) {

            time.textContent =
                formatDate(request.createdAt);

        }

    }


    if (timelineItems[1]) {

        const span =
            timelineItems[1].querySelector("span");

        if (span) {

            span.textContent =
                `Nearby compatible donors are being alerted for ${bloodGroup} blood.`;

        }

    }


    /* =====================================================
       URGENCY CARD
    ===================================================== */

    const urgencyTitle =
        document.querySelector(".urgency-card h3");


    if (urgencyTitle) {

        if (urgency.toLowerCase() === "critical") {

            urgencyTitle.textContent =
                "Critical Support Needed";

        } else if (urgency.toLowerCase() === "normal") {

            urgencyTitle.textContent =
                "Blood Support Needed";

        } else {

            urgencyTitle.textContent =
                "Urgent Support Needed";

        }

    }


    /* =====================================================
       CONTACT DATA
       Store current requester for modal use
    ===================================================== */

    window.hemoSphereRequester = {

        name: requester,

        phone: requesterPhone

    };


    console.log(
        "HemoSphere Current Request:",
        request
    );


    return request;

}


/* =========================================================
   RESPONSE WINDOW
========================================================= */

function getResponseWindow(request) {

    if (!request || !request.requiredDate) {

        return "Within 2 hours";

    }


    const requiredDate =
        new Date(request.requiredDate);


    if (isNaN(requiredDate.getTime())) {

        return "Within 2 hours";

    }


    const now =
        new Date();


    const difference =
        requiredDate.getTime() -
        now.getTime();


    if (difference <= 0) {

        return "As soon as possible";

    }


    const hours =
        Math.ceil(
            difference / (1000 * 60 * 60)
        );


    if (hours <= 2) {

        return "Within 2 hours";

    }


    if (hours < 24) {

        return `Within ${hours} hours`;

    }


    const days =
        Math.ceil(hours / 24);


    return `Within ${days} day${days > 1 ? "s" : ""}`;

}


/* =========================================================
   BLOOD GROUP NAME
========================================================= */

function getBloodGroupName(group) {

    const names = {

        "A+": "A Positive",
        "A-": "A Negative",
        "B+": "B Positive",
        "B-": "B Negative",
        "AB+": "AB Positive",
        "AB-": "AB Negative",
        "O+": "O Positive",
        "O-": "O Negative"

    };


    return names[group] || group;

}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateProgress() {

    if (!currentRequest) return;


    const units =
        Number(currentRequest.units) || 1;


    const response =
        getSavedDonorResponse(
            currentRequest.requestId
        );


    const donatedUnits =
        response ? 1 : 0;


    const percentage =
        Math.min(
            100,
            (donatedUnits / units) * 100
        );


    const progress =
        document.querySelector(
            ".progress-bar span"
        );


    const progressText =
        document.querySelector(
            ".progress-top strong"
        );


    if (progress) {

        progress.style.width =
            `${percentage}%`;

    }


    if (progressText) {

        progressText.textContent =
            `${donatedUnits} / ${units} units`;

    }

}


/* =========================================================
   GET SAVED DONOR RESPONSE
========================================================= */

function getSavedDonorResponse(id) {

    const responses =
        JSON.parse(
            localStorage.getItem(
                "hemoSphereDonorResponses"
            )
        ) || [];


    if (Array.isArray(responses)) {

        const response =
            responses.find(
                item =>
                    item.requestId === id
            );

        if (response) {

            return response;

        }

    }


    /*
       Backward compatibility with
       previous single-response storage.
    */

    const oldResponse =
        JSON.parse(
            localStorage.getItem(
                "hemoSphereDonorResponse"
            )
        );


    if (
        oldResponse &&
        oldResponse.requestId === id
    ) {

        return oldResponse;

    }


    return null;

}


/* =========================================================
   CONFIRMATION MODAL
========================================================= */

function showConfirmModal() {

    const oldModal =
        document.querySelector(
            ".confirm-modal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    const modal =
        document.createElement("div");


    modal.className =
        "confirm-modal";


    const bloodGroup =
        currentRequest?.bloodGroup || "O+";

    const units =
        Number(currentRequest?.units) || 1;

    const hospital =
        currentRequest?.hospitalName ||
        "HemoSphere Emergency Request";


    modal.innerHTML = `

        <div class="modal-overlay"></div>

        <div class="modal-box">

            <button
                class="modal-close"
                id="closeModal"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div class="modal-icon">

                <i class="fa-solid fa-hand-holding-droplet"></i>

            </div>


            <span class="modal-label">
                DONOR RESPONSE
            </span>


            <h3>
                Confirm your response
            </h3>


            <p>
                Are you available to help with this
                blood request?
            </p>


            <div class="modal-request">

                <div class="modal-blood">
                    ${bloodGroup}
                </div>

                <div>

                    <strong>
                        ${units} unit${units > 1 ? "s" : ""} required
                    </strong>

                    <span>
                        ${hospital}
                    </span>

                </div>

            </div>


            <div class="modal-actions">

                <button
                    class="modal-cancel"
                    id="cancelDonate"
                >
                    Not Now
                </button>


                <button
                    class="modal-confirm"
                    id="confirmDonate"
                >

                    <i class="fa-solid fa-check"></i>

                    Yes, I Can Donate

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    setTimeout(() => {

        modal.classList.add("visible");

    }, 20);


    const closeModal =
        document.getElementById(
            "closeModal"
        );


    const cancelDonate =
        document.getElementById(
            "cancelDonate"
        );


    const confirmDonate =
        document.getElementById(
            "confirmDonate"
        );


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            () => {

                closeConfirmationModal(
                    modal
                );

            }
        );

    }


    if (cancelDonate) {

        cancelDonate.addEventListener(
            "click",
            () => {

                closeConfirmationModal(
                    modal
                );

            }
        );

    }


    if (confirmDonate) {

        confirmDonate.addEventListener(
            "click",
            () => {

                confirmDonation(modal);

            }
        );

    }


    const overlay =
        modal.querySelector(
            ".modal-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            () => {

                closeConfirmationModal(
                    modal
                );

            }
        );

    }

}


/* =========================================================
   CLOSE CONFIRMATION MODAL
========================================================= */

function closeConfirmationModal(modal) {

    if (!modal) return;


    modal.classList.remove("visible");


    setTimeout(() => {

        if (modal.parentElement) {

            modal.remove();

        }

    }, 250);

}


/* =========================================================
   CONFIRM DONATION
========================================================= */

function confirmDonation(modal) {

    const confirmBtn =
        document.getElementById(
            "confirmDonate"
        );


    if (!confirmBtn) return;


    if (!currentRequest) {

        closeConfirmationModal(modal);

        showToast(
            "Request information could not be found.",
            "error"
        );

        return;

    }


    confirmBtn.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Updating...

    `;


    confirmBtn.disabled = true;


    setTimeout(() => {

        const request =
            currentRequest;


        /* =================================================
           DONOR RESPONSE
        ================================================= */

        const donorResponse = {

            requestId:
                request.requestId,

            donorName:
                "Moulishwaran",

            bloodGroup:
                request.bloodGroup,

            units: 1,

            hospitalName:
                request.hospitalName,

            patientName:
                request.patientName,

            status:
                "Response Sent",

            responseTime:
                new Date().toISOString()

        };


        /* =================================================
           SAVE RESPONSE PER REQUEST
        ================================================= */

        let responses =
            JSON.parse(
                localStorage.getItem(
                    "hemoSphereDonorResponses"
                )
            ) || [];


        if (!Array.isArray(responses)) {

            responses = [];

        }


        const existingIndex =
            responses.findIndex(
                item =>
                    item.requestId ===
                    request.requestId
            );


        if (existingIndex !== -1) {

            responses[existingIndex] =
                donorResponse;

        } else {

            responses.push(
                donorResponse
            );

        }


        localStorage.setItem(
            "hemoSphereDonorResponses",
            JSON.stringify(responses)
        );


        /* Backward compatibility */

        localStorage.setItem(
            "hemoSphereDonorResponse",
            JSON.stringify(
                donorResponse
            )
        );


        /* =================================================
           UPDATE REQUEST STATUS
        ================================================= */

        let requests =
            JSON.parse(
                localStorage.getItem(
                    "hemoSphereRequests"
                )
            ) || [];


        if (Array.isArray(requests)) {

            requests =
                requests.map(item => {

                    if (
                        item.requestId ===
                        request.requestId
                    ) {

                        return {

                            ...item,

                            status:
                                "Donor Response Received"

                        };

                    }


                    return item;

                });


            localStorage.setItem(
                "hemoSphereRequests",
                JSON.stringify(requests)
            );

        }


        /* =================================================
           SAVE NOTIFICATION
        ================================================= */

        saveNotification({

            type: "donation",

            title:
                "Donation response sent",

            message:
                `Your donor response for ${request.requestId} has been sent successfully.`,

            requestId:
                request.requestId

        });


        /* =================================================
           CLOSE MODAL
        ================================================= */

        closeConfirmationModal(
            modal
        );


        /* =================================================
           UPDATE BUTTON
        ================================================= */

        if (acceptRequest) {

            acceptRequest.innerHTML = `

                <i class="fa-solid fa-circle-check"></i>

                Donation Response Sent

            `;


            acceptRequest.disabled =
                true;


            acceptRequest.classList.add(
                "accepted"
            );

        }


        /* =================================================
           UPDATE PROGRESS
        ================================================= */

        updateProgress();


        /* =================================================
           UPDATE HERO STATUS
        ================================================= */

        const heroStatus =
            document.querySelector(
                ".hero-status"
            );


        if (heroStatus) {

            heroStatus.innerHTML = `

                <span class="status-dot"></span>

                Response Sent

            `;

        }


        /* =================================================
           UPDATE TIMELINE
        ================================================= */

        const timelineItems =
            document.querySelectorAll(
                ".timeline-item"
            );


        if (timelineItems[2]) {

            timelineItems[2]
                .classList.add("active");


            const strong =
                timelineItems[2]
                    .querySelector("strong");


            const span =
                timelineItems[2]
                    .querySelector("span");


            if (strong) {

                strong.textContent =
                    "Donor response received";

            }


            if (span) {

                span.textContent =
                    "Your donation response has been recorded.";

            }

        }


        showToast(
            "Your donor response has been saved successfully.",
            "success"
        );


    }, 1000);

}


/* =========================================================
   SAVE NOTIFICATION
========================================================= */

function saveNotification(data) {

    let notifications =
        JSON.parse(
            localStorage.getItem(
                "hemoSphereNotifications"
            )
        ) || [];


    if (!Array.isArray(notifications)) {

        notifications = [];

    }


    notifications.unshift({

        id:
            "N-" + Date.now(),

        type:
            data.type || "request",

        title:
            data.title || "HemoSphere Update",

        message:
            data.message || "",

        requestId:
            data.requestId || "",

        time:
            new Date().toISOString(),

        read:
            false

    });


    localStorage.setItem(
        "hemoSphereNotifications",
        JSON.stringify(notifications)
    );


    updateNotificationCount();

}


/* =========================================================
   UPDATE NOTIFICATION COUNT
========================================================= */

function updateNotificationCount() {

    const notifications =
        JSON.parse(
            localStorage.getItem(
                "hemoSphereNotifications"
            )
        ) || [];


    const unreadCount =
        Array.isArray(notifications)
            ? notifications.filter(
                notification =>
                    notification.read === false
            ).length
            : 0;


    const countElements =
        document.querySelectorAll(
            ".notification-count"
        );


    countElements.forEach(element => {

        element.textContent =
            unreadCount;

        element.style.display =
            unreadCount > 0
                ? "inline-flex"
                : "none";

    });

}


/* =========================================================
   I CAN DONATE BUTTON
========================================================= */

if (acceptRequest) {

    acceptRequest.addEventListener(
        "click",
        () => {

            if (acceptRequest.disabled) {

                return;

            }


            showConfirmModal();

        }
    );

}


/* =========================================================
   CONTACT REQUESTER
========================================================= */

if (messageRequester) {

    messageRequester.addEventListener(
        "click",
        () => {

            showContactModal();

        }
    );

}


/* =========================================================
   CONTACT MODAL
========================================================= */

function showContactModal() {

    const oldModal =
        document.querySelector(
            ".contact-modal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    const requester =
        window.hemoSphereRequester || {

            name:
                currentRequest?.requesterName ||
                "Requester",

            phone:
                currentRequest?.requesterPhone ||
                ""

        };


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "contact-modal";


    modal.innerHTML = `

        <div class="modal-overlay"></div>

        <div class="modal-box contact-box">

            <button
                class="modal-close"
                id="closeContact"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div class="modal-icon contact-icon">

                <i class="fa-regular fa-message"></i>

            </div>


            <span class="modal-label">
                CONTACT REQUESTER
            </span>


            <h3>
                Contact ${requester.name}
            </h3>


            <p>
                Choose how you would like to
                contact the requester.
            </p>


            <div class="contact-options">

                <button
                    class="contact-option"
                    id="callOption"
                >

                    <span class="contact-option-icon">

                        <i class="fa-solid fa-phone"></i>

                    </span>

                    <span>

                        <strong>
                            Call
                        </strong>

                        <small>
                            Contact by phone
                        </small>

                    </span>

                    <i class="fa-solid fa-chevron-right"></i>

                </button>


                <button
                    class="contact-option"
                    id="messageOption"
                >

                    <span class="contact-option-icon">

                        <i class="fa-regular fa-comment"></i>

                    </span>

                    <span>

                        <strong>
                            Message
                        </strong>

                        <small>
                            Send a quick message
                        </small>

                    </span>

                    <i class="fa-solid fa-chevron-right"></i>

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    setTimeout(() => {

        modal.classList.add(
            "visible"
        );

    }, 20);


    const closeContact =
        document.getElementById(
            "closeContact"
        );


    const overlay =
        modal.querySelector(
            ".modal-overlay"
        );


    const callOption =
        document.getElementById(
            "callOption"
        );


    const messageOption =
        document.getElementById(
            "messageOption"
        );


    if (closeContact) {

        closeContact.addEventListener(
            "click",
            () => {

                closeContactModal(
                    modal
                );

            }
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            () => {

                closeContactModal(
                    modal
                );

            }
        );

    }


    if (callOption) {

        callOption.addEventListener(
            "click",
            () => {

                if (requester.phone) {

                    showToast(
                        `Requester contact: ${requester.phone}`,
                        "info"
                    );

                } else {

                    showToast(
                        "Phone contact is available after request verification.",
                        "info"
                    );

                }


                closeContactModal(
                    modal
                );

            }
        );

    }


    if (messageOption) {

        messageOption.addEventListener(
            "click",
            () => {

                if (currentRequest) {

                    saveNotification({

                        type:
                            "request",

                        title:
                            "Requester contact opened",

                        message:
                            `You opened contact options for ${requester.name}.`,

                        requestId:
                            currentRequest.requestId

                    });

                }


                showToast(
                    "Message option selected successfully.",
                    "success"
                );


                closeContactModal(
                    modal
                );

            }
        );

    }

}


/* =========================================================
   CLOSE CONTACT MODAL
========================================================= */

function closeContactModal(modal) {

    if (!modal) return;


    modal.classList.remove(
        "visible"
    );


    setTimeout(() => {

        if (modal.parentElement) {

            modal.remove();

        }

    }, 250);

}


/* =========================================================
   RESPONSE COUNTDOWN
========================================================= */

let remainingSeconds =
    (1 * 60 * 60) +
    (48 * 60) +
    32;


function updateCountdown() {

    const countdown =
        document.querySelector(
            ".time-box strong"
        );


    if (!countdown) {

        return;

    }


    if (remainingSeconds <= 0) {

        countdown.textContent =
            "Expired";

        countdown.style.color =
            "#778194";

        return;

    }


    const hours =
        Math.floor(
            remainingSeconds / 3600
        );


    const minutes =
        Math.floor(
            (remainingSeconds % 3600) / 60
        );


    const seconds =
        remainingSeconds % 60;


    const formattedHours =
        String(hours).padStart(2, "0");


    const formattedMinutes =
        String(minutes).padStart(2, "0");


    const formattedSeconds =
        String(seconds).padStart(2, "0");


    countdown.textContent =
        `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;


    remainingSeconds--;

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);


/* =========================================================
   VIEW MAP
========================================================= */

if (mapBtn) {

    mapBtn.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            showToast(
                "Map location will be available in the next version.",
                "info"
            );

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                showToast(
                    "Logging out from HemoSphere...",
                    "info"
                );


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1200);

            }

        }
    );

}


/* =========================================================
   DYNAMIC UI STYLES
========================================================= */

const dynamicStyles =
    document.createElement(
        "style"
    );


dynamicStyles.textContent = `

/* =====================================================
   TOAST
===================================================== */

.hs-toast {

    position: fixed;

    top: 24px;
    right: 24px;

    z-index: 9999;

    min-width: 300px;
    max-width: 390px;

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 13px 14px;

    border: 1px solid #dfe5ee;

    border-radius: 13px;

    background: #ffffff;

    box-shadow:
        0 18px 50px
        rgba(24, 34, 52, 0.15);

    transform:
        translateY(-20px)
        translateX(20px);

    opacity: 0;

    transition:
        opacity .3s ease,
        transform .3s ease;

    font-family:
        "Inter",
        sans-serif;

}


.hs-toast.show {

    opacity: 1;

    transform:
        translateY(0)
        translateX(0);

}


.toast-icon {

    width: 35px;
    height: 35px;

    flex-shrink: 0;

    display: grid;

    place-items: center;

    border-radius: 10px;

    background: #eefaf5;

    color: #1f9d68;

    font-size: 13px;

}


.hs-toast.error .toast-icon {

    background: #fff1f4;

    color: #d9234f;

}


.hs-toast.info .toast-icon {

    background: #eef2ff;

    color: #315bea;

}


.toast-content {

    flex: 1;

}


.toast-content strong {

    display: block;

    color: #182234;

    font-size: 10px;

    font-weight: 800;

}


.toast-content span {

    display: block;

    margin-top: 3px;

    color: #778194;

    font-size: 8px;

    line-height: 1.4;

}


.toast-close {

    width: 25px;
    height: 25px;

    display: grid;

    place-items: center;

    border: 0;

    background: transparent;

    color: #8b94a3;

    cursor: pointer;

}


/* =====================================================
   MODAL
===================================================== */

.confirm-modal,
.contact-modal {

    position: fixed;

    inset: 0;

    z-index: 10000;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 20px;

    visibility: hidden;

    opacity: 0;

    transition:
        opacity .25s ease;

}


.confirm-modal.visible,
.contact-modal.visible {

    visibility: visible;

    opacity: 1;

}


.modal-overlay {

    position: absolute;

    inset: 0;

    background:
        rgba(12, 18, 30, 0.48);

    backdrop-filter:
        blur(4px);

}


.modal-box {

    position: relative;

    z-index: 2;

    width:
        min(420px, 100%);

    padding: 26px;

    border:
        1px solid #e5e9f0;

    border-radius: 20px;

    background: white;

    box-shadow:
        0 30px 80px
        rgba(12, 18, 30, 0.22);

    transform:
        translateY(15px)
        scale(.97);

    transition:
        transform .25s ease;

}


.confirm-modal.visible .modal-box,
.contact-modal.visible .modal-box {

    transform:
        translateY(0)
        scale(1);

}


.modal-close {

    position: absolute;

    top: 14px;
    right: 14px;

    width: 30px;
    height: 30px;

    display: grid;

    place-items: center;

    border:
        1px solid #e5e9f0;

    border-radius: 9px;

    background: white;

    color: #778194;

    cursor: pointer;

}


.modal-icon {

    width: 48px;
    height: 48px;

    margin-bottom: 15px;

    display: grid;

    place-items: center;

    border-radius: 14px;

    background: #fff1f4;

    color: #d9234f;

    font-size: 18px;

}


.contact-icon {

    background: #eef2ff;

    color: #315bea;

}


.modal-label {

    color: #778194;

    font-size: 7px;

    font-weight: 800;

    letter-spacing: 1px;

}


.modal-box h3 {

    margin-top: 5px;

    color: #182234;

    font-size: 18px;

    font-weight: 800;

}


.modal-box > p {

    margin-top: 7px;

    color: #778194;

    font-size: 9px;

    line-height: 1.6;

}


/* =====================================================
   MODAL REQUEST
===================================================== */

.modal-request {

    display: flex;

    align-items: center;

    gap: 11px;

    margin-top: 17px;

    padding: 12px;

    border:
        1px solid #f0d9df;

    border-radius: 12px;

    background: #fff8fa;

}


.modal-blood {

    width: 43px;
    height: 43px;

    display: grid;

    place-items: center;

    border-radius: 12px;

    background: #d9234f;

    color: white;

    font-size: 13px;

    font-weight: 800;

}


.modal-request strong {

    display: block;

    color: #182234;

    font-size: 9px;

}


.modal-request span {

    display: block;

    margin-top: 4px;

    color: #778194;

    font-size: 8px;

}


/* =====================================================
   MODAL ACTIONS
===================================================== */

.modal-actions {

    display: grid;

    grid-template-columns:
        1fr 1.5fr;

    gap: 9px;

    margin-top: 19px;

}


.modal-actions button {

    min-height: 42px;

    border-radius: 10px;

    font-family: inherit;

    font-size: 9px;

    font-weight: 750;

    cursor: pointer;

}


.modal-cancel {

    border:
        1px solid #e5e9f0;

    background: white;

    color: #687386;

}


.modal-confirm {

    border: 0;

    background:
        linear-gradient(
            135deg,
            #d9234f,
            #ec456c
        );

    color: white;

}


.modal-confirm:disabled {

    opacity: .7;

    cursor: wait;

}


/* =====================================================
   CONTACT OPTIONS
===================================================== */

.contact-options {

    display: flex;

    flex-direction: column;

    gap: 9px;

    margin-top: 18px;

}


.contact-option {

    width: 100%;

    display: flex;

    align-items: center;

    gap: 11px;

    padding: 11px;

    border:
        1px solid #e5e9f0;

    border-radius: 12px;

    background: white;

    text-align: left;

    cursor: pointer;

    transition: .2s;

}


.contact-option:hover {

    border-color: #d5dbe5;

    background: #fafbfd;

    transform:
        translateY(-1px);

}


.contact-option-icon {

    width: 37px;
    height: 37px;

    flex-shrink: 0;

    display: grid;

    place-items: center;

    border-radius: 10px;

    background: #eef2ff;

    color: #315bea;

}


.contact-option > span:nth-child(2) {

    flex: 1;

}


.contact-option strong {

    display: block;

    color: #182234;

    font-size: 9px;

}


.contact-option small {

    display: block;

    margin-top: 3px;

    color: #778194;

    font-size: 7px;

}


.contact-option > i {

    color: #a0a8b5;

    font-size: 8px;

}


/* =====================================================
   ACCEPTED BUTTON
===================================================== */

.primary-action.accepted {

    background: #eefaf5;

    color: #1f9d68;

    border:
        1px solid #ccebdc;

    box-shadow: none;

    cursor: default;

}


/* =====================================================
   DARK MODE
===================================================== */

body.dark-mode .hs-toast {

    background: #182231;

    border-color: #2a3546;

}


body.dark-mode .toast-content strong {

    color: #f1f5f9;

}


body.dark-mode .toast-content span {

    color: #94a3b8;

}


body.dark-mode .toast-close {

    color: #94a3b8;

}


body.dark-mode .modal-box {

    background: #182231;

    border-color: #2a3546;

}


body.dark-mode .modal-box h3 {

    color: #f1f5f9;

}


body.dark-mode .modal-box > p {

    color: #94a3b8;

}


body.dark-mode .modal-close {

    background: #202c3c;

    border-color: #344154;

    color: #cbd5e1;

}


body.dark-mode .modal-request {

    background: #251a21;

    border-color: #49303a;

}


body.dark-mode .modal-request strong {

    color: #f1f5f9;

}


body.dark-mode .modal-request span {

    color: #94a3b8;

}


body.dark-mode .modal-cancel {

    background: #202c3c;

    border-color: #344154;

    color: #cbd5e1;

}


body.dark-mode .contact-option {

    background: #202c3c;

    border-color: #344154;

}


body.dark-mode .contact-option:hover {

    background: #263447;

}


body.dark-mode .contact-option strong {

    color: #f1f5f9;

}


body.dark-mode .contact-option small {

    color: #94a3b8;

}


body.dark-mode .contact-option > i {

    color: #94a3b8;

}


body.dark-mode .primary-action.accepted {

    background: #142d24;

    border-color: #285842;

    color: #35c98a;

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {

    .hs-toast {

        top: 15px;

        right: 15px;

        left: 15px;

        min-width: auto;

        max-width: none;

    }


    .modal-box {

        padding: 21px;

        border-radius: 17px;

    }


    .modal-actions {

        grid-template-columns: 1fr;

    }

}

`;


document.head.appendChild(
    dynamicStyles
);


/* =========================================================
   RESTORE SAVED RESPONSE
========================================================= */

function restoreSavedResponse() {

    if (!currentRequest) return;


    const savedResponse =
        getSavedDonorResponse(
            currentRequest.requestId
        );


    if (!savedResponse) {

        return;

    }


    if (acceptRequest) {

        acceptRequest.innerHTML = `

            <i class="fa-solid fa-circle-check"></i>

            Donation Response Sent

        `;


        acceptRequest.disabled =
            true;


        acceptRequest.classList.add(
            "accepted"
        );

    }


    updateProgress();


    const heroStatus =
        document.querySelector(
            ".hero-status"
        );


    if (heroStatus) {

        heroStatus.innerHTML = `

            <span class="status-dot"></span>

            Response Sent

        `;

    }

}


/* =========================================================
   KEYBOARD ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {

            return;

        }


        const confirmModal =
            document.querySelector(
                ".confirm-modal"
            );


        const contactModal =
            document.querySelector(
                ".contact-modal"
            );


        if (confirmModal) {

            closeConfirmationModal(
                confirmModal
            );

        }


        if (contactModal) {

            closeContactModal(
                contactModal
            );

        }

    }
);


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCurrentRequest();

        restoreSavedResponse();

        updateNotificationCount();


        console.log(
            "HemoSphere Request Details loaded:",
            requestId
        );

    }
);