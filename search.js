/* =========================================================
   HEMOSPHERE — FIND BLOOD DONORS
   Search Page JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");

    const bloodGroup = document.getElementById("bloodGroup");
    const locationInput = document.getElementById("location");
    const radius = document.getElementById("radius");

    const searchBtn = document.getElementById("searchBtn");

    const donorList = document.getElementById("donorList");
    const donorCards = document.querySelectorAll(".donor-card");

    const resultCount = document.getElementById("resultCount");

    const emptyState = document.getElementById("emptyState");
    const resetSearch = document.getElementById("resetSearch");

    const clearFilter = document.getElementById("clearFilter");

    const filterChips =
        document.querySelectorAll(".filter-chip");

    const contactButtons =
        document.querySelectorAll(".contact-btn");

    const logoutBtn =
        document.getElementById("logoutBtn");


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    if (menuBtn && sidebar) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.toggle("open");

        });

    }


    /* Close sidebar after navigation */

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            if (window.innerWidth <= 850) {

                sidebar.classList.remove("open");

            }

        });

    });


    /* Close sidebar on Escape */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            if (sidebar) {

                sidebar.classList.remove("open");

            }

        }

    });


    /* =====================================================
       SEARCH FUNCTION
    ===================================================== */

    function performSearch() {

        const selectedBlood =
            bloodGroup.value.trim().toUpperCase();

        const enteredLocation =
            locationInput.value.trim().toLowerCase();


        let visibleCount = 0;


        donorCards.forEach(card => {

            const cardBlood =
                card.dataset.blood.toUpperCase();

            const cardLocation =
                card.dataset.location.toLowerCase();


            /* Blood group matching */

            const bloodMatch =
                selectedBlood === "" ||
                cardBlood === selectedBlood;


            /* Location matching */

            const locationMatch =
                enteredLocation === "" ||
                cardLocation.includes(enteredLocation);


            if (bloodMatch && locationMatch) {

                card.style.display = "grid";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        /* Update result count */

        if (resultCount) {

            resultCount.textContent =
                visibleCount;

        }


        /* Empty state */

        if (emptyState && donorList) {

            if (visibleCount === 0) {

                emptyState.classList.add("show");

                donorList.style.display = "none";

            } else {

                emptyState.classList.remove("show");

                donorList.style.display = "flex";

            }

        }


        /* Feedback */

        if (visibleCount > 0) {

            showToast(
                `${visibleCount} donor${visibleCount > 1 ? "s" : ""} found.`,
                "success"
            );

        } else {

            showToast(
                "No matching donors found. Try another search.",
                "info"
            );

        }

    }


    /* =====================================================
       SEARCH BUTTON
    ===================================================== */

    if (searchBtn) {

        searchBtn.addEventListener("click", () => {

            const originalHTML =
                searchBtn.innerHTML;


            searchBtn.disabled = true;

            searchBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Searching...</span>
            `;


            setTimeout(() => {

                performSearch();

                searchBtn.disabled = false;

                searchBtn.innerHTML =
                    originalHTML;

            }, 550);

        });

    }


    /* =====================================================
       ENTER KEY SEARCH
    ===================================================== */

    [bloodGroup, locationInput, radius].forEach(element => {

        if (!element) return;


        element.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                performSearch();

            }

        });

    });


    /* =====================================================
       QUICK BLOOD GROUP FILTERS
    ===================================================== */

    filterChips.forEach(chip => {

        chip.addEventListener("click", () => {

            const selectedBlood =
                chip.dataset.blood;


            /* Set dropdown */

            if (bloodGroup) {

                bloodGroup.value =
                    selectedBlood;

            }


            /* Active chip */

            filterChips.forEach(item => {

                item.classList.remove("active");

            });

            chip.classList.add("active");


            /* Search */

            performSearch();

        });

    });


    /* =====================================================
       BLOOD GROUP DROPDOWN
    ===================================================== */

    if (bloodGroup) {

        bloodGroup.addEventListener("change", () => {

            const selected =
                bloodGroup.value;


            filterChips.forEach(chip => {

                chip.classList.toggle(
                    "active",
                    chip.dataset.blood === selected
                );

            });


            /* If no group selected,
               remove active state */

            if (selected === "") {

                filterChips.forEach(chip => {

                    chip.classList.remove("active");

                });

            }

        });

    }


    /* =====================================================
       CLEAR FILTER
    ===================================================== */

    function clearSearch() {

        if (bloodGroup) {

            bloodGroup.value = "";

        }

        if (locationInput) {

            locationInput.value = "";

        }

        if (radius) {

            radius.value = "10";

        }


        filterChips.forEach(chip => {

            chip.classList.remove("active");

        });


        donorCards.forEach(card => {

            card.style.display = "grid";

        });


        if (resultCount) {

            resultCount.textContent =
                donorCards.length;

        }


        if (emptyState) {

            emptyState.classList.remove("show");

        }


        if (donorList) {

            donorList.style.display = "flex";

        }


        showToast(
            "Search filters have been cleared.",
            "info"
        );

    }


    if (clearFilter) {

        clearFilter.addEventListener(
            "click",
            clearSearch
        );

    }


    if (resetSearch) {

        resetSearch.addEventListener(
            "click",
            clearSearch
        );

    }


    /* =====================================================
       CONTACT DONOR
    ===================================================== */

    contactButtons.forEach(button => {

        button.addEventListener("click", () => {

            const donorName =
                button.dataset.name ||
                "Donor";


            showContactModal(donorName);

        });

    });


    /* =====================================================
       CONTACT MODAL
    ===================================================== */

    function showContactModal(donorName) {

        const existingModal =
            document.querySelector(".contact-modal");

        if (existingModal) {

            existingModal.remove();

        }


        const modal =
            document.createElement("div");

        modal.className =
            "contact-modal";


        modal.innerHTML = `

            <div class="contact-modal-overlay"></div>

            <div class="contact-modal-box">

                <button
                    class="modal-close"
                    aria-label="Close">

                    <i class="fa-solid fa-xmark"></i>

                </button>


                <div class="modal-icon">

                    <i class="fa-solid fa-phone"></i>

                </div>


                <span class="modal-label">
                    DONOR CONTACT
                </span>


                <h3>
                    Contact ${donorName}
                </h3>


                <p>
                    Choose an option to continue
                    with your blood donation request.
                </p>


                <div class="modal-actions">

                    <button
                        class="modal-action primary"
                        data-action="request">

                        <i class="fa-solid fa-hand-holding-droplet"></i>

                        Send Blood Request

                    </button>


                    <button
                        class="modal-action secondary"
                        data-action="message">

                        <i class="fa-regular fa-message"></i>

                        Send Message

                    </button>

                </div>


                <small class="modal-note">

                    <i class="fa-solid fa-shield-heart"></i>

                    Use donor contact only for genuine
                    blood donation needs.

                </small>

            </div>
        `;


        document.body.appendChild(modal);


        /* Animation */

        setTimeout(() => {

            modal.classList.add("show");

        }, 20);


        /* Close button */

        const closeBtn =
            modal.querySelector(".modal-close");

        const overlay =
            modal.querySelector(
                ".contact-modal-overlay"
            );


        function closeModal() {

            modal.classList.remove("show");

            setTimeout(() => {

                modal.remove();

            }, 250);

        }


        closeBtn.addEventListener(
            "click",
            closeModal
        );


        overlay.addEventListener(
            "click",
            closeModal
        );


        /* Modal actions */

        const modalActions =
            modal.querySelectorAll(
                ".modal-action"
            );


        modalActions.forEach(action => {

            action.addEventListener(
                "click",
                () => {

                    const type =
                        action.dataset.action;


                    closeModal();


                    if (type === "request") {

                        showToast(
                            `Blood request started for ${donorName}.`,
                            "success"
                        );


                        setTimeout(() => {

                            window.location.href =
                                "blood-request.html";

                        }, 900);

                    }


                    if (type === "message") {

                        showToast(
                            `Message option opened for ${donorName}.`,
                            "info"
                        );

                    }

                }
            );

        });

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            showToast(
                "Logging out...",
                "info"
            );


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 900);

        });

    }


    /* =====================================================
       TOAST NOTIFICATION
    ===================================================== */

    function showToast(message, type = "info") {

        const oldToast =
            document.querySelector(".hs-toast");

        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement("div");

        toast.className =
            `hs-toast ${type}`;


        let icon =
            "fa-circle-info";


        if (type === "success") {

            icon = "fa-circle-check";

        }


        if (type === "error") {

            icon = "fa-circle-exclamation";

        }


        toast.innerHTML = `

            <div class="toast-icon">

                <i class="fa-solid ${icon}"></i>

            </div>


            <div class="toast-content">

                <strong>
                    HemoSphere
                </strong>

                <span>
                    ${message}
                </span>

            </div>


            <button
                class="toast-close"
                aria-label="Close notification">

                <i class="fa-solid fa-xmark"></i>

            </button>

        `;


        document.body.appendChild(toast);


        setTimeout(() => {

            toast.classList.add("show");

        }, 30);


        const closeButton =
            toast.querySelector(".toast-close");


        closeButton.addEventListener(
            "click",
            () => closeToast(toast)
        );


        setTimeout(() => {

            closeToast(toast);

        }, 3500);

    }


    /* =====================================================
       CLOSE TOAST
    ===================================================== */

    function closeToast(toast) {

        if (!toast) return;

        toast.classList.remove("show");


        setTimeout(() => {

            if (toast) {

                toast.remove();

            }

        }, 250);

    }


    /* =====================================================
       DYNAMIC UX STYLES
    ===================================================== */

    const style =
        document.createElement("style");


    style.textContent = `

        /* ==============================
           TOAST
        ============================== */

        .hs-toast {

            position: fixed;

            right: 22px;

            bottom: 22px;

            z-index: 9999;

            width: min(360px, calc(100% - 30px));

            display: flex;

            align-items: center;

            gap: 10px;

            padding: 13px;

            border: 1px solid #e5e9f0;

            border-radius: 14px;

            background: rgba(255,255,255,0.98);

            box-shadow:
                0 18px 45px rgba(23,32,51,0.15);

            opacity: 0;

            transform: translateY(20px);

            transition:
                opacity .25s ease,
                transform .25s ease;

            font-family: "Inter", sans-serif;

        }


        .hs-toast.show {

            opacity: 1;

            transform: translateY(0);

        }


        .toast-icon {

            width: 35px;

            height: 35px;

            flex-shrink: 0;

            display: grid;

            place-items: center;

            border-radius: 10px;

            background: #eef2ff;

            color: #315bea;

            font-size: 13px;

        }


        .hs-toast.success .toast-icon {

            background: #eefaf5;

            color: #1f9d68;

        }


        .hs-toast.error .toast-icon {

            background: #fff0f3;

            color: #d9234f;

        }


        .toast-content {

            flex: 1;

        }


        .toast-content strong {

            display: block;

            margin-bottom: 3px;

            color: #182234;

            font-size: 10px;

            font-weight: 800;

        }


        .toast-content span {

            display: block;

            color: #778194;

            font-size: 9px;

            line-height: 1.5;

        }


        .toast-close {

            width: 28px;

            height: 28px;

            display: grid;

            place-items: center;

            border: 0;

            border-radius: 8px;

            background: transparent;

            color: #8b94a2;

            cursor: pointer;

        }


        .toast-close:hover {

            background: #f3f5f8;

            color: #182234;

        }


        /* ==============================
           CONTACT MODAL
        ============================== */

        .contact-modal {

            position: fixed;

            inset: 0;

            z-index: 9998;

            opacity: 0;

            visibility: hidden;

            transition:
                opacity .25s ease,
                visibility .25s ease;

        }


        .contact-modal.show {

            opacity: 1;

            visibility: visible;

        }


        .contact-modal-overlay {

            position: absolute;

            inset: 0;

            background:
                rgba(15, 22, 36, .48);

            backdrop-filter: blur(4px);

        }


        .contact-modal-box {

            position: absolute;

            top: 50%;

            left: 50%;

            width: min(420px, calc(100% - 30px));

            padding: 28px;

            border: 1px solid rgba(255,255,255,.5);

            border-radius: 22px;

            background: #ffffff;

            box-shadow:
                0 30px 80px rgba(15,22,36,.25);

            transform:
                translate(-50%, -46%)
                scale(.96);

            transition:
                transform .25s ease;

            text-align: center;

        }


        .contact-modal.show
        .contact-modal-box {

            transform:
                translate(-50%, -50%)
                scale(1);

        }


        .modal-close {

            position: absolute;

            top: 13px;

            right: 13px;

            width: 32px;

            height: 32px;

            display: grid;

            place-items: center;

            border: 0;

            border-radius: 9px;

            background: #f5f6f8;

            color: #778194;

            cursor: pointer;

            transition: .2s;

        }


        .modal-close:hover {

            background: #fff0f4;

            color: #d9234f;

        }


        .modal-icon {

            width: 54px;

            height: 54px;

            margin: 0 auto 14px;

            display: grid;

            place-items: center;

            border-radius: 16px;

            background: #fff0f4;

            color: #d9234f;

            font-size: 20px;

        }


        .modal-label {

            color: #d9234f;

            font-size: 8px;

            font-weight: 800;

            letter-spacing: 1.2px;

        }


        .contact-modal-box h3 {

            margin-top: 5px;

            color: #182234;

            font-size: 18px;

            font-weight: 800;

        }


        .contact-modal-box > p {

            margin: 7px auto 20px;

            max-width: 310px;

            color: #778194;

            font-size: 10px;

            line-height: 1.6;

        }


        .modal-actions {

            display: grid;

            gap: 8px;

        }


        .modal-action {

            min-height: 43px;

            display: flex;

            align-items: center;

            justify-content: center;

            gap: 8px;

            border-radius: 10px;

            font-family: inherit;

            font-size: 10px;

            font-weight: 700;

            cursor: pointer;

            transition: .2s;

        }


        .modal-action.primary {

            border: 0;

            background: #d9234f;

            color: white;

        }


        .modal-action.primary:hover {

            background: #b91d42;

            transform: translateY(-1px);

        }


        .modal-action.secondary {

            border: 1px solid #e1e5eb;

            background: white;

            color: #455064;

        }


        .modal-action.secondary:hover {

            border-color: #d7dce5;

            background: #f8f9fb;

        }


        .modal-note {

            display: block;

            margin-top: 17px;

            color: #929aa8;

            font-size: 8px;

            line-height: 1.5;

        }


        .modal-note i {

            margin-right: 3px;

            color: #315bea;

        }


        /* ==============================
           MOBILE
        ============================== */

        @media (max-width: 500px) {

            .hs-toast {

                right: 15px;

                bottom: 15px;

                width: calc(100% - 30px);

            }


            .contact-modal-box {

                padding: 23px 18px;

                border-radius: 18px;

            }

        }

    `;


    document.head.appendChild(style);


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener("resize", () => {

        if (
            window.innerWidth > 850 &&
            sidebar
        ) {

            sidebar.classList.remove("open");

        }

    });


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    if (resultCount) {

        resultCount.textContent =
            donorCards.length;

    }


    console.log(
        "HemoSphere Search Page loaded successfully."
    );

});
/* =========================================
   HemoSphere - Search / Find Donor
   search.js
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       DARK / LIGHT MODE
       ========================================= */

    const themeToggle =
        document.querySelector("#themeToggle") ||
        document.querySelector(".theme-toggle") ||
        document.querySelector("[data-theme-toggle]");

    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem("hemosphere-theme");

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }

    // Theme button
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {

            body.classList.toggle("dark-mode");

            const isDark = body.classList.contains("dark-mode");

            localStorage.setItem(
                "hemosphere-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();
        });
    }

    function updateThemeIcon() {

        if (!themeToggle) return;

        const icon = themeToggle.querySelector("i");

        if (body.classList.contains("dark-mode")) {

            if (icon) {
                icon.className = "fas fa-sun";
            }

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

        } else {

            if (icon) {
                icon.className = "fas fa-moon";
            }

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );
        }
    }

    updateThemeIcon();


    /* =========================================
       FIND DONOR PAGE NAVIGATION
       ========================================= */

    const dashboardBtn =
        document.querySelector(".dashboard-btn");

    if (dashboardBtn) {
        dashboardBtn.addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
    }


    /* =========================================
       SEARCH FORM
       ========================================= */

    const searchForm =
        document.querySelector("#searchForm") ||
        document.querySelector(".search-form");

    const bloodGroupInput =
        document.querySelector("#bloodGroup") ||
        document.querySelector("[name='bloodGroup']");

    const locationInput =
        document.querySelector("#location") ||
        document.querySelector("[name='location']");

    const donorCards =
        document.querySelectorAll(
            ".donor-card, .donor-result, .donor-item, .result-card"
        );


    if (searchForm) {

        searchForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const bloodGroup =
                bloodGroupInput
                    ? bloodGroupInput.value.trim().toLowerCase()
                    : "";

            const location =
                locationInput
                    ? locationInput.value.trim().toLowerCase()
                    : "";

            let visibleCount = 0;

            donorCards.forEach(card => {

                const cardText =
                    card.textContent.toLowerCase();

                const bloodMatch =
                    !bloodGroup ||
                    cardText.includes(bloodGroup);

                const locationMatch =
                    !location ||
                    cardText.includes(location);

                if (bloodMatch && locationMatch) {

                    card.style.display = "";

                    visibleCount++;

                } else {

                    card.style.display = "none";
                }
            });

            showSearchMessage(visibleCount);
        });
    }


    /* =========================================
       RESET SEARCH
       ========================================= */

    const resetButton =
        document.querySelector("#resetSearch") ||
        document.querySelector(".reset-btn");

    if (resetButton) {

        resetButton.addEventListener("click", () => {

            if (searchForm) {
                searchForm.reset();
            }

            donorCards.forEach(card => {
                card.style.display = "";
            });

            removeSearchMessage();
        });
    }


    /* =========================================
       SEARCH RESULT MESSAGE
       ========================================= */

    function showSearchMessage(count) {

        removeSearchMessage();

        const container =
            document.querySelector(".donor-list") ||
            document.querySelector(".results-container") ||
            document.querySelector(".search-results") ||
            document.querySelector("main");

        if (!container) return;

        const message = document.createElement("div");

        message.id = "searchMessage";

        if (count === 0) {

            message.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No donors found</h3>
                    <p>
                        Try another blood group or location.
                    </p>
                </div>
            `;

        } else {

            message.innerHTML = `
                <div class="search-result-count">
                    <i class="fas fa-check-circle"></i>
                    ${count} donor${count > 1 ? "s" : ""} found
                </div>
            `;
        }

        container.prepend(message);
    }


    function removeSearchMessage() {

        const message =
            document.querySelector("#searchMessage");

        if (message) {
            message.remove();
        }
    }


    /* =========================================
       DONOR CARD CLICK
       ========================================= */

    donorCards.forEach(card => {

        card.addEventListener("click", () => {

            const donorId =
                card.dataset.donorId;

            if (donorId) {

                localStorage.setItem(
                    "selectedDonor",
                    donorId
                );

                window.location.href =
                    "donor-profile.html";
            }
        });
    });


    /* =========================================
       NAVIGATION LINKS
       ========================================= */

    const navLinks = document.querySelectorAll(
        "[data-page]"
    );

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            const page =
                link.getAttribute("data-page");

            if (page) {
                window.location.href = page;
            }
        });
    });


    /* =========================================
       NOTIFICATION BUTTON
       ========================================= */

    const notificationBtn =
        document.querySelector("#notificationBtn") ||
        document.querySelector(".notification-btn");

    if (notificationBtn) {

        notificationBtn.addEventListener("click", () => {
            window.location.href =
                "notification.html";
        });
    }


    /* =========================================
       PROFILE BUTTON
       ========================================= */

    const profileBtn =
        document.querySelector("#profileBtn") ||
        document.querySelector(".profile-btn");

    if (profileBtn) {

        profileBtn.addEventListener("click", () => {
            window.location.href =
                "donor-profile.html";
        });
    }


    /* =========================================
       MOBILE MENU
       ========================================= */

    const menuBtn =
        document.querySelector("#menuBtn") ||
        document.querySelector(".menu-btn");

    const sidebar =
        document.querySelector(".sidebar");

    if (menuBtn && sidebar) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.toggle("active");

            menuBtn.classList.toggle("active");
        });
    }

});