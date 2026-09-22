/* =========================================================
   HEMOSPHERE
   DONOR MATCHING — JAVASCRIPT
   Integrated Version
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");

    const donorSearch = document.getElementById("donorSearch");
    const availabilityFilter =
        document.getElementById("availabilityFilter");

    const distanceFilter =
        document.getElementById("distanceFilter");

    const filterBtn =
        document.getElementById("filterBtn");

    const clearFilter =
        document.getElementById("clearFilter");

    const sortDonors =
        document.getElementById("sortDonors");

    const donorList =
        document.getElementById("donorList");

    const noResults =
        document.getElementById("noResults");

    const logoutBtn =
        document.getElementById("logoutBtn");


    /* =====================================================
       DONOR CARDS
    ===================================================== */

    let donorCards = Array.from(
        document.querySelectorAll(".donor-card")
    );


    /* =====================================================
       ACTIVE BLOOD REQUEST
    ===================================================== */

    let currentRequest = null;


    function getActiveRequest() {

        const requests =
            JSON.parse(
                localStorage.getItem(
                    "hemoSphereRequests"
                )
            ) || [];

        if (!Array.isArray(requests) || requests.length === 0) {
            return null;
        }

        /*
         * Get requestId from URL if available.
         * Example:
         * donor-matching.html?requestId=HS-123456
         */

        const urlParams =
            new URLSearchParams(
                window.location.search
            );

        const requestId =
            urlParams.get("requestId");


        if (requestId) {

            const matchedRequest =
                requests.find(
                    request =>
                        request.requestId === requestId
                );

            if (matchedRequest) {
                return matchedRequest;
            }

        }


        /*
         * If no requestId is supplied,
         * use the latest request.
         */

        return requests[requests.length - 1];

    }


    /* =====================================================
       UPDATE REQUEST SUMMARY
    ===================================================== */

    function loadRequestData() {

        currentRequest =
            getActiveRequest();


        /*
         * If no request exists,
         * keep the demo request already present in HTML.
         */

        if (!currentRequest) {
            updateNotificationCount();
            return;
        }


        const bloodGroup =
            currentRequest.bloodGroup || "O+";

        const units =
            currentRequest.units || 1;

        const city =
            currentRequest.city ||
            "Location unavailable";

        const urgency =
            currentRequest.urgency ||
            "Urgent";


        /* ---------------------------------------------
           Summary Blood Group
        --------------------------------------------- */

        const summaryItems =
            document.querySelectorAll(
                ".summary-item"
            );

        if (summaryItems[0]) {

            const value =
                summaryItems[0].querySelector("strong");

            if (value) {
                value.textContent =
                    bloodGroup;
            }

        }


        /* ---------------------------------------------
           Units
        --------------------------------------------- */

        if (summaryItems[1]) {

            const value =
                summaryItems[1].querySelector("strong");

            if (value) {

                value.textContent =
                    `${units} ${Number(units) === 1 ? "Unit" : "Units"}`;

            }

        }


        /* ---------------------------------------------
           Location
        --------------------------------------------- */

        if (summaryItems[2]) {

            const value =
                summaryItems[2].querySelector("strong");

            if (value) {
                value.textContent =
                    city;
            }

        }


        /* ---------------------------------------------
           Priority
        --------------------------------------------- */

        if (summaryItems[3]) {

            const value =
                summaryItems[3].querySelector("strong");

            if (value) {

                value.textContent =
                    formatUrgency(urgency);

            }

        }


        /* ---------------------------------------------
           Request Details Link
        --------------------------------------------- */

        const viewRequest =
            document.querySelector(
                ".view-request"
            );


        if (viewRequest) {

            if (currentRequest.requestId) {

                viewRequest.href =
                    `request-details.html?requestId=${encodeURIComponent(
                        currentRequest.requestId
                    )}`;

            } else {

                viewRequest.href =
                    "request-details.html";

            }

        }


        /*
         * Update active request title
         */

        const summaryHeading =
            document.querySelector(
                ".summary-title h3"
            );

        if (summaryHeading) {

            summaryHeading.textContent =
                "Emergency Blood Requirement";

        }


        /*
         * Update page text based on request
         */

        updateDonorCompatibility(
            bloodGroup
        );


        updateNotificationCount();

    }


    /* =====================================================
       FORMAT URGENCY
    ===================================================== */

    function formatUrgency(value) {

        const text =
            String(value)
                .trim()
                .toLowerCase();


        if (text === "critical") {
            return "Critical";
        }

        if (text === "high") {
            return "High";
        }

        if (text === "normal") {
            return "Normal";
        }

        if (text === "urgent") {
            return "Urgent";
        }

        return value || "Urgent";

    }


    /* =====================================================
       DONOR COMPATIBILITY
    ===================================================== */

    function updateDonorCompatibility(
        bloodGroup
    ) {

        /*
         * Current donor cards in HTML are O+ donors.
         *
         * For now we preserve the existing
         * demo donor dataset.
         *
         * The real donor database can be
         * connected later.
         */

        donorCards.forEach(card => {

            const bloodTag =
                card.querySelector(
                    ".blood-tag"
                );

            if (bloodTag) {

                /*
                 * Existing donor data remains O+.
                 * Do not overwrite donor blood group
                 * with request blood group.
                 */

            }

        });

    }


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    if (menuBtn && sidebar) {

        menuBtn.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );


        document.addEventListener(
            "click",
            event => {

                const clickedInsideSidebar =
                    sidebar.contains(event.target);

                const clickedMenu =
                    menuBtn.contains(event.target);


                if (
                    window.innerWidth <= 850 &&
                    !clickedInsideSidebar &&
                    !clickedMenu
                ) {

                    sidebar.classList.remove(
                        "open"
                    );

                }

            }
        );

    }


    /* =====================================================
       SEARCH + FILTER
    ===================================================== */

    function filterDonors() {

        const searchValue =
            donorSearch
                ? donorSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        const availabilityValue =
            availabilityFilter
                ? availabilityFilter.value
                : "all";


        const distanceValue =
            distanceFilter
                ? distanceFilter.value
                : "all";


        let visibleCount = 0;


        donorCards.forEach(card => {

            const donorName =
                card.dataset.name
                    ? card.dataset.name
                        .toLowerCase()
                    : "";


            const donorDistance =
                Number(
                    card.dataset.distance
                ) || 0;


            const donorAvailability =
                card.dataset.availability || "";


            /* Search */

            const matchesSearch =
                donorName.includes(
                    searchValue
                );


            /* Availability */

            let matchesAvailability = true;


            if (
                availabilityValue ===
                "available"
            ) {

                matchesAvailability =
                    donorAvailability ===
                    "available";

            }


            /* Nearby */

            if (
                availabilityValue ===
                "nearby"
            ) {

                matchesAvailability =
                    donorDistance <= 10;

            }


            /* Distance */

            let matchesDistance = true;


            if (
                distanceValue !== "all"
            ) {

                matchesDistance =
                    donorDistance <=
                    Number(distanceValue);

            }


            const shouldShow =
                matchesSearch &&
                matchesAvailability &&
                matchesDistance;


            if (shouldShow) {

                card.style.display = "";
                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        /* No results */

        if (noResults) {

            if (visibleCount === 0) {

                noResults.classList.add(
                    "show"
                );

            } else {

                noResults.classList.remove(
                    "show"
                );

            }

        }


        updateResultCount(
            visibleCount
        );

    }


    /* =====================================================
       RESULT COUNT
    ===================================================== */

    function updateResultCount(count) {

        const resultText =
            document.querySelector(
                ".results-header span"
            );


        if (!resultText) return;


        if (count === 0) {

            resultText.textContent =
                "NO MATCHES FOUND";

        } else {

            resultText.textContent =
                `${count} MATCH${count > 1 ? "ES" : ""} FOUND`;

        }

    }


    /* =====================================================
       LIVE SEARCH
    ===================================================== */

    if (donorSearch) {

        donorSearch.addEventListener(
            "input",
            filterDonors
        );

    }


    /* =====================================================
       FILTER BUTTON
    ===================================================== */

    if (filterBtn) {

        filterBtn.addEventListener(
            "click",
            filterDonors
        );

    }


    /* =====================================================
       FILTER CHANGE
    ===================================================== */

    if (availabilityFilter) {

        availabilityFilter.addEventListener(
            "change",
            filterDonors
        );

    }


    if (distanceFilter) {

        distanceFilter.addEventListener(
            "change",
            filterDonors
        );

    }


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    if (clearFilter) {

        clearFilter.addEventListener(
            "click",
            () => {

                if (donorSearch) {
                    donorSearch.value = "";
                }


                if (availabilityFilter) {

                    availabilityFilter.value =
                        "all";

                }


                if (distanceFilter) {

                    distanceFilter.value =
                        "all";

                }


                donorCards.forEach(card => {

                    card.style.display = "";

                });


                if (noResults) {

                    noResults.classList.remove(
                        "show"
                    );

                }


                updateResultCount(
                    donorCards.length
                );

            }
        );

    }


    /* =====================================================
       SORT DONORS
    ===================================================== */

    if (sortDonors) {

        sortDonors.addEventListener(
            "change",
            () => {

                const sortValue =
                    sortDonors.value;


                const cards =
                    Array.from(
                        donorList.querySelectorAll(
                            ".donor-card"
                        )
                    );


                cards.sort((a, b) => {

                    /* Best Match */

                    if (
                        sortValue ===
                        "match"
                    ) {

                        const scoreA =
                            getMatchScore(a);

                        const scoreB =
                            getMatchScore(b);

                        return scoreB -
                            scoreA;

                    }


                    /* Nearest */

                    if (
                        sortValue ===
                        "distance"
                    ) {

                        const distanceA =
                            Number(
                                a.dataset.distance
                            ) || 0;

                        const distanceB =
                            Number(
                                b.dataset.distance
                            ) || 0;

                        return distanceA -
                            distanceB;

                    }


                    /* Availability */

                    if (
                        sortValue ===
                        "availability"
                    ) {

                        const availableA =
                            a.dataset.availability ===
                            "available"
                                ? 1
                                : 0;

                        const availableB =
                            b.dataset.availability ===
                            "available"
                                ? 1
                                : 0;

                        return availableB -
                            availableA;

                    }


                    return 0;

                });


                cards.forEach(card => {

                    donorList.appendChild(
                        card
                    );

                });


                donorCards =
                    Array.from(
                        donorList.querySelectorAll(
                            ".donor-card"
                        )
                    );


                filterDonors();

            }
        );

    }


    /* =====================================================
       GET MATCH SCORE
    ===================================================== */

    function getMatchScore(card) {

        const scoreElement =
            card.querySelector(
                ".score-circle strong"
            );


        if (!scoreElement) {
            return 0;
        }


        const scoreText =
            scoreElement.textContent
                .replace("%", "")
                .trim();


        return Number(
            scoreText
        ) || 0;

    }


    /* =====================================================
       CONTACT DONOR
    ===================================================== */

    const contactButtons =
        document.querySelectorAll(
            ".contact-btn"
        );


    contactButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const donorName =
                    button.dataset.donor ||
                    "Donor";


                showContactModal(
                    donorName
                );

            }
        );

    });


    /* =====================================================
       CONTACT MODAL
    ===================================================== */

    function showContactModal(
        donorName
    ) {

        const oldModal =
            document.querySelector(
                ".contact-modal"
            );


        if (oldModal) {
            oldModal.remove();
        }


        const modal =
            document.createElement(
                "div"
            );


        modal.className =
            "contact-modal";


        modal.innerHTML = `

            <div class="contact-overlay"></div>

            <div class="contact-dialog">

                <button
                    class="close-contact"
                    aria-label="Close"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>


                <div class="contact-icon">

                    <i class="fa-solid fa-phone"></i>

                </div>


                <span class="contact-label">
                    CONTACT DONOR
                </span>


                <h3>
                    Contact ${donorName}
                </h3>


                <p>
                    You can contact this donor
                    regarding the active blood
                    request.
                </p>


                <div class="contact-actions">

                    <button
                        class="call-action"
                        id="callAction"
                    >
                        <i class="fa-solid fa-phone"></i>
                        Call Donor
                    </button>


                    <button
                        class="message-action"
                        id="messageAction"
                    >
                        <i class="fa-regular fa-message"></i>
                        Send Message
                    </button>

                </div>


                <small>
                    Please use donor contact
                    information responsibly.
                </small>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        const closeBtn =
            modal.querySelector(
                ".close-contact"
            );


        const overlay =
            modal.querySelector(
                ".contact-overlay"
            );


        closeBtn.addEventListener(
            "click",
            closeContactModal
        );


        overlay.addEventListener(
            "click",
            closeContactModal
        );


        /* Call */

        const callAction =
            modal.querySelector(
                "#callAction"
            );


        callAction.addEventListener(
            "click",
            () => {

                showToast(
                    `Calling ${donorName}...`,
                    "success"
                );


                closeContactModal();

            }
        );


        /* Message */

        const messageAction =
            modal.querySelector(
                "#messageAction"
            );


        messageAction.addEventListener(
            "click",
            () => {

                saveNotification(
                    `Message option opened for ${donorName}.`,
                    "request"
                );


                showToast(
                    `Message option opened for ${donorName}.`,
                    "info"
                );


                closeContactModal();

            }
        );


        document.addEventListener(
            "keydown",
            escapeHandler
        );


        function escapeHandler(event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeContactModal();

            }

        }


        function closeContactModal() {

            modal.remove();


            document.removeEventListener(
                "keydown",
                escapeHandler
            );

        }

    }


    /* =====================================================
       SAVE NOTIFICATION
    ===================================================== */

    function saveNotification(
        message,
        type = "request"
    ) {

        let notifications =
            JSON.parse(
                localStorage.getItem(
                    "hemoSphereNotifications"
                )
            ) || [];


        if (!Array.isArray(notifications)) {
            notifications = [];
        }


        notifications.push({

            id:
                "NOTIF-" +
                Date.now(),

            message:
                message,

            type:
                type,

            requestId:
                currentRequest
                    ? currentRequest.requestId
                    : "",

            read:
                false,

            createdAt:
                new Date().toISOString()

        });


        localStorage.setItem(
            "hemoSphereNotifications",
            JSON.stringify(
                notifications
            )
        );


        updateNotificationCount();

    }


    /* =====================================================
       NOTIFICATION COUNT
    ===================================================== */

    function updateNotificationCount() {

        const notifications =
            JSON.parse(
                localStorage.getItem(
                    "hemoSphereNotifications"
                )
            ) || [];


        if (!Array.isArray(notifications)) {
            return;
        }


        const unreadCount =
            notifications.filter(
                notification =>
                    notification.read === false
            ).length;


        const notificationCounts =
            document.querySelectorAll(
                ".notification-count"
            );


        notificationCounts.forEach(
            element => {

                element.textContent =
                    unreadCount;

            }
        );

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(
        message,
        type = "success"
    ) {

        const oldToast =
            document.querySelector(
                ".hemosphere-toast"
            );


        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `hemosphere-toast ${type}`;


        const icon =
            type === "success"
                ? "fa-circle-check"
                : "fa-circle-info";


        toast.innerHTML = `

            <i class="fa-solid ${icon}"></i>

            <span>
                ${message}
            </span>

        `;


        document.body.appendChild(
            toast
        );


        requestAnimationFrame(() => {

            toast.classList.add(
                "show"
            );

        });


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );


            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 2500);

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (confirmLogout) {

                    window.location.href =
                        "login.html";

                }

            }
        );

    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    const navLinks =
        document.querySelectorAll(
            ".nav-item"
        );


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 850 &&
                    sidebar
                ) {

                    sidebar.classList.remove(
                        "open"
                    );

                }

            }
        );

    });


    /* =====================================================
       ADD MODAL + TOAST STYLES
    ===================================================== */

    const dynamicStyle =
        document.createElement(
            "style"
        );


    dynamicStyle.textContent = `

        /* ==============================================
           CONTACT MODAL
        ============================================== */

        .contact-modal {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: grid;
            place-items: center;
            padding: 20px;
            animation: modalFade 0.2s ease;
        }


        .contact-overlay {
            position: absolute;
            inset: 0;
            background: rgba(18, 25, 39, 0.55);
            backdrop-filter: blur(5px);
        }


        .contact-dialog {
            position: relative;
            z-index: 2;
            width: min(390px, 100%);
            padding: 28px;
            border: 1px solid rgba(255,255,255,0.7);
            border-radius: 22px;
            background: white;
            text-align: center;
            box-shadow: 0 25px 70px rgba(18,25,39,0.2);
            animation: modalSlide 0.25s ease;
        }


        .close-contact {
            position: absolute;
            top: 14px;
            right: 14px;
            width: 31px;
            height: 31px;
            display: grid;
            place-items: center;
            border: 0;
            border-radius: 9px;
            background: #f4f5f7;
            color: #7c8593;
            cursor: pointer;
            transition: 0.2s;
        }


        .close-contact:hover {
            background: #fff0f3;
            color: #d9234f;
        }


        .contact-icon {
            width: 58px;
            height: 58px;
            margin: 0 auto 14px;
            display: grid;
            place-items: center;
            border-radius: 17px;
            background: #fff0f4;
            color: #d9234f;
            font-size: 19px;
        }


        .contact-label {
            color: #d9234f;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1px;
        }


        .contact-dialog h3 {
            margin-top: 6px;
            color: #182234;
            font-size: 19px;
            font-weight: 800;
        }


        .contact-dialog p {
            margin-top: 8px;
            color: #7b8595;
            font-size: 9px;
            line-height: 1.6;
        }


        .contact-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 20px;
        }


        .contact-actions button {
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            border-radius: 9px;
            font-family: inherit;
            font-size: 8px;
            font-weight: 750;
            cursor: pointer;
            transition: 0.2s;
        }


        .call-action {
            border: 0;
            background: #d9234f;
            color: white;
        }


        .call-action:hover {
            background: #b91d42;
            transform: translateY(-1px);
        }


        .message-action {
            border: 1px solid #e4e8ef;
            background: white;
            color: #4c5668;
        }


        .message-action:hover {
            background: #f8f9fb;
        }


        .contact-dialog small {
            display: block;
            margin-top: 15px;
            color: #a0a7b3;
            font-size: 7px;
            line-height: 1.5;
        }


        /* ==============================================
           TOAST
        ============================================== */

        .hemosphere-toast {
            position: fixed;
            right: 25px;
            bottom: 25px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 9px;
            min-width: 240px;
            padding: 12px 15px;
            border: 1px solid #dce7e2;
            border-radius: 11px;
            background: white;
            color: #263346;
            font-family: "Inter", sans-serif;
            font-size: 9px;
            font-weight: 650;
            box-shadow: 0 12px 35px rgba(18,25,39,0.14);
            transform: translateY(20px);
            opacity: 0;
            transition:
                transform 0.3s ease,
                opacity 0.3s ease;
        }


        .hemosphere-toast.show {
            transform: translateY(0);
            opacity: 1;
        }


        .hemosphere-toast i {
            font-size: 15px;
        }


        .hemosphere-toast.success i {
            color: #1f9d68;
        }


        .hemosphere-toast.info i {
            color: #315bea;
        }


        /* ==============================================
           DARK MODE MODAL
        ============================================== */

        body.dark-mode .contact-dialog {
            background: #182231;
            border-color: #2a3546;
        }


        body.dark-mode .close-contact {
            background: #222d3c;
            color: #94a3b8;
        }


        body.dark-mode .contact-dialog h3 {
            color: #f1f5f9;
        }


        body.dark-mode .contact-dialog p {
            color: #94a3b8;
        }


        body.dark-mode .message-action {
            background: #182231;
            border-color: #2a3546;
            color: #cbd5e1;
        }


        body.dark-mode .message-action:hover {
            background: #222d3c;
        }


        body.dark-mode .hemosphere-toast {
            background: #182231;
            border-color: #2a3546;
            color: #f1f5f9;
        }


        /* ==============================================
           ANIMATIONS
        ============================================== */

        @keyframes modalFade {

            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }

        }


        @keyframes modalSlide {

            from {
                opacity: 0;
                transform:
                    translateY(15px)
                    scale(0.97);
            }

            to {
                opacity: 1;
                transform:
                    translateY(0)
                    scale(1);
            }

        }


        @media (max-width: 500px) {

            .contact-dialog {
                padding: 24px 18px;
            }

            .contact-actions {
                grid-template-columns: 1fr;
            }

            .hemosphere-toast {
                right: 15px;
                left: 15px;
                bottom: 15px;
                min-width: 0;
            }

        }

    `;


    document.head.appendChild(
        dynamicStyle
    );


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    loadRequestData();

    updateResultCount(
        donorCards.length
    );

});