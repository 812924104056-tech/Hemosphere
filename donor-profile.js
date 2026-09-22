/* =========================================================
   HEMOSPHERE — DONOR PROFILE
   Final JavaScript / UX Interactions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");

    const availabilityToggle =
        document.getElementById("availabilityToggle");

    const availabilityText =
        document.getElementById("availabilityText");

    const saveProfileBtn =
        document.getElementById("saveProfileBtn");

    const editPersonalBtn =
        document.getElementById("editPersonalBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const contactOptions =
        document.querySelectorAll(".contact-option");


    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const AVAILABILITY_KEY =
        "hemoSphereDonorAvailability";

    const CONTACT_KEY =
        "hemoSphereContactPreference";


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    if (menuBtn && sidebar) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.toggle("open");

        });

    }


    /* =====================================================
       CLOSE SIDEBAR WHEN NAVIGATION IS CLICKED
    ===================================================== */

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            if (
                window.innerWidth <= 850 &&
                sidebar
            ) {
                sidebar.classList.remove("open");
            }

        });

    });


    /* =====================================================
       LOAD SAVED DONOR SETTINGS
    ===================================================== */

    loadDonorSettings();


    function loadDonorSettings() {

        /* ---------- Availability ---------- */

        const savedAvailability =
            localStorage.getItem(AVAILABILITY_KEY);

        if (
            availabilityToggle &&
            availabilityText
        ) {

            if (savedAvailability === "unavailable") {

                availabilityToggle.checked = false;

                updateAvailabilityUI(false);

            } else {

                availabilityToggle.checked = true;

                updateAvailabilityUI(true);

            }

        }


        /* ---------- Contact Preference ---------- */

        const savedContact =
            localStorage.getItem(CONTACT_KEY);

        if (savedContact) {

            contactOptions.forEach(option => {

                const radio =
                    option.querySelector("input");

                if (
                    radio &&
                    radio.value === savedContact
                ) {

                    contactOptions.forEach(item => {
                        item.classList.remove("active");
                    });

                    option.classList.add("active");
                    radio.checked = true;

                }

            });

        }

    }


    /* =====================================================
       DONOR AVAILABILITY
    ===================================================== */

    if (
        availabilityToggle &&
        availabilityText
    ) {

        availabilityToggle.addEventListener(
            "change",
            () => {

                const isAvailable =
                    availabilityToggle.checked;

                updateAvailabilityUI(
                    isAvailable
                );


                if (isAvailable) {

                    localStorage.setItem(
                        AVAILABILITY_KEY,
                        "available"
                    );

                    showToast(
                        "You are now available for blood requests.",
                        "success"
                    );

                } else {

                    localStorage.setItem(
                        AVAILABILITY_KEY,
                        "unavailable"
                    );

                    showToast(
                        "Your donor availability has been turned off.",
                        "info"
                    );

                }

            }
        );

    }


    /* =====================================================
       UPDATE AVAILABILITY UI
    ===================================================== */

    function updateAvailabilityUI(
        isAvailable
    ) {

        if (
            !availabilityText ||
            !availabilityToggle
        ) {
            return;
        }


        if (isAvailable) {

            availabilityText.textContent =
                "Available";

            availabilityText.style.color =
                "";

        } else {

            availabilityText.textContent =
                "Currently Unavailable";

            availabilityText.style.color =
                "#e48a27";

        }

    }


    /* =====================================================
       CONTACT PREFERENCE
    ===================================================== */

    contactOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                contactOptions.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                option.classList.add(
                    "active"
                );


                const radio =
                    option.querySelector(
                        "input"
                    );


                if (radio) {

                    radio.checked = true;

                    localStorage.setItem(
                        CONTACT_KEY,
                        radio.value
                    );

                }

            }
        );

    });


    /* =====================================================
       EDIT PERSONAL DETAILS
    ===================================================== */

    if (editPersonalBtn) {

        editPersonalBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Profile editing will be available soon.",
                    "info"
                );

            }
        );

    }


    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    if (saveProfileBtn) {

        saveProfileBtn.addEventListener(
            "click",
            () => {

                const originalHTML =
                    saveProfileBtn.innerHTML;


                /* Save availability */

                if (availabilityToggle) {

                    localStorage.setItem(
                        AVAILABILITY_KEY,
                        availabilityToggle.checked
                            ? "available"
                            : "unavailable"
                    );

                }


                /* Save contact preference */

                const selectedContact =
                    document.querySelector(
                        '.contact-option input:checked'
                    );


                if (selectedContact) {

                    localStorage.setItem(
                        CONTACT_KEY,
                        selectedContact.value
                    );

                }


                /* Button loading state */

                saveProfileBtn.disabled = true;

                saveProfileBtn.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                `;


                /* Simulate save */

                setTimeout(() => {

                    saveProfileBtn.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Saved Successfully
                    `;


                    showToast(
                        "Your donor profile has been updated successfully.",
                        "success"
                    );


                    /* Restore button */

                    setTimeout(() => {

                        saveProfileBtn.disabled =
                            false;

                        saveProfileBtn.innerHTML =
                            originalHTML;

                    }, 1800);

                }, 900);

            }
        );

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

                    showToast(
                        "Logging out...",
                        "info"
                    );


                    setTimeout(() => {

                        window.location.href =
                            "login.html";

                    }, 1000);

                }

            }
        );

    }


    /* =====================================================
       TOAST NOTIFICATION
    ===================================================== */

    function showToast(
        message,
        type = "info"
    ) {

        /* Remove previous toast */

        const oldToast =
            document.querySelector(
                ".hs-toast"
            );


        if (oldToast) {
            oldToast.remove();
        }


        /* Create toast */

        const toast =
            document.createElement("div");

        toast.className =
            `hs-toast ${type}`;


        /* Icon */

        let icon =
            "fa-circle-info";


        if (type === "success") {

            icon =
                "fa-circle-check";

        }


        if (type === "error") {

            icon =
                "fa-circle-exclamation";

        }


        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fa-solid ${icon}"></i>
            </div>

            <div class="toast-content">
                <strong>HemoSphere</strong>

                <span>${message}</span>
            </div>

            <button
                class="toast-close"
                aria-label="Close notification"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;


        document.body.appendChild(toast);


        /* Show animation */

        setTimeout(() => {

            toast.classList.add("show");

        }, 50);


        /* Close button */

        const closeBtn =
            toast.querySelector(
                ".toast-close"
            );


        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                () => {

                    closeToast(toast);

                }
            );

        }


        /* Auto close */

        setTimeout(() => {

            closeToast(toast);

        }, 3500);

    }


    /* =====================================================
       CLOSE TOAST
    ===================================================== */

    function closeToast(toast) {

        if (!toast) return;


        toast.classList.remove(
            "show"
        );


        setTimeout(() => {

            if (toast.parentNode) {

                toast.remove();

            }

        }, 300);

    }


    /* =====================================================
       TOAST STYLES
    ===================================================== */

    const toastStyle =
        document.createElement("style");


    toastStyle.textContent = `

        .hs-toast {

            position: fixed;

            right: 25px;
            bottom: 25px;

            z-index: 9999;

            width: min(
                370px,
                calc(100% - 30px)
            );

            display: flex;

            align-items: center;

            gap: 11px;

            padding: 13px 14px;

            border: 1px solid #e4e8ee;

            border-radius: 14px;

            background: rgba(
                255,
                255,
                255,
                0.98
            );

            box-shadow:
                0 18px 45px
                rgba(
                    20,
                    30,
                    50,
                    0.15
                );

            transform:
                translateY(25px);

            opacity: 0;

            transition:
                opacity 0.3s ease,
                transform 0.3s ease;

            font-family:
                "Inter",
                sans-serif;
        }


        .hs-toast.show {

            transform:
                translateY(0);

            opacity: 1;

        }


        .toast-icon {

            width: 36px;
            height: 36px;

            flex-shrink: 0;

            display: grid;

            place-items: center;

            border-radius: 10px;

            background: #eef2ff;

            color: #315bea;

            font-size: 14px;

        }


        .hs-toast.success
        .toast-icon {

            background: #eefaf5;

            color: #1f9d68;

        }


        .hs-toast.error
        .toast-icon {

            background: #fff0f3;

            color: #d9234f;

        }


        .toast-content {

            flex: 1;

            min-width: 0;

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

            color: #9098a6;

            cursor: pointer;

        }


        .toast-close:hover {

            background: #f5f6f8;

            color: #182234;

        }


        .save-btn:disabled {

            cursor: wait;

            opacity: 0.8;

        }


        /* Dark Mode */

        body.dark-mode
        .hs-toast {

            background: #182231;

            border-color: #2a3546;

            box-shadow:
                0 18px 45px
                rgba(
                    0,
                    0,
                    0,
                    0.35
                );

        }


        body.dark-mode
        .toast-content strong {

            color: #f1f5f9;

        }


        body.dark-mode
        .toast-content span {

            color: #94a3b8;

        }


        body.dark-mode
        .toast-close {

            color: #94a3b8;

        }


        body.dark-mode
        .toast-close:hover {

            background: #222d3d;

            color: #f1f5f9;

        }


        @media (max-width: 500px) {

            .hs-toast {

                right: 15px;

                bottom: 15px;

                width:
                    calc(100% - 30px);

            }

        }

    `;


    document.head.appendChild(
        toastStyle
    );


    /* =====================================================
       ESC KEY — CLOSE SIDEBAR
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sidebar
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }
    );


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 850 &&
                sidebar
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }
    );


    /* =====================================================
       PAGE READY
    ===================================================== */

    console.log(
        "HemoSphere Donor Profile loaded successfully."
    );

});