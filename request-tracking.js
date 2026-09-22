
/* =========================================================
   HEMOSPHERE
   REQUEST TRACKING — JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const logoutBtn = document.getElementById("logoutBtn");
    const shareBtn = document.getElementById("shareBtn");



    /* =====================================================
       MOBILE SIDEBAR
    ====================================================== */

    if (menuBtn && sidebar) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.toggle("open");

            const icon = menuBtn.querySelector("i");

            if (sidebar.classList.contains("open")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });


        /* Close sidebar when clicking outside */

        document.addEventListener("click", (event) => {

            const clickedInsideSidebar =
                sidebar.contains(event.target);

            const clickedMenu =
                menuBtn.contains(event.target);

            if (
                !clickedInsideSidebar &&
                !clickedMenu &&
                sidebar.classList.contains("open")
            ) {

                sidebar.classList.remove("open");

                const icon = menuBtn.querySelector("i");

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });

    }



    /* =====================================================
       CLOSE SIDEBAR AFTER NAVIGATION
    ====================================================== */

    const navLinks =
        document.querySelectorAll(".nav-item");

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 850) {

                sidebar.classList.remove("open");

                const icon =
                    menuBtn?.querySelector("i");

                if (icon) {

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }

            }

        });

    });



    /* =====================================================
       REQUEST INFORMATION
    ====================================================== */

    const requestId =
        "HS-REQ-2026-0842";



    /* =====================================================
       SHARE REQUEST
    ====================================================== */

    if (shareBtn) {

        shareBtn.addEventListener("click", async () => {

            const shareData = {

                title: "HemoSphere Blood Request",

                text:
                    `Blood request ${requestId} is currently active.`
            };


            /* Modern Web Share API */

            if (
                navigator.share &&
                window.isSecureContext
            ) {

                try {

                    await navigator.share(shareData);

                    showToast(
                        "Request shared successfully",
                        "success"
                    );

                } catch (error) {

                    if (error.name !== "AbortError") {

                        showToast(
                            "Unable to share request",
                            "error"
                        );

                    }

                }

            }

            /* Clipboard fallback */

            else {

                const shareText =
                    `HemoSphere Blood Request\nRequest ID: ${requestId}`;

                copyToClipboard(shareText);

            }

        });

    }



    /* =====================================================
       COPY TO CLIPBOARD
    ====================================================== */

    async function copyToClipboard(text) {

        try {

            await navigator.clipboard.writeText(text);

            showToast(
                "Request details copied",
                "success"
            );

        } catch (error) {

            showToast(
                "Copy failed. Please try again.",
                "error"
            );

        }

    }



    /* =====================================================
       LOGOUT
    ====================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            const confirmLogout =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                /*
                 * If you later add backend authentication,
                 * clear session/token here.
                 */

                localStorage.removeItem("hemoSphereUser");
                sessionStorage.removeItem("hemoSphereUser");

                showToast(
                    "Logged out successfully",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 900);

            }

        });

    }



    /* =====================================================
       PROGRESS ANIMATION
    ====================================================== */

    const progressFill =
        document.querySelector(".progress-fill");

    const progressPercent =
        document.querySelector(".progress-percent");


    if (progressFill) {

        const progressValue = 75;

        /*
         * Reset width before animation
         */

        progressFill.style.width = "0%";

        requestAnimationFrame(() => {

            setTimeout(() => {

                progressFill.style.width =
                    `${progressValue}%`;

            }, 200);

        });


        /*
         * Animated percentage number
         */

        if (progressPercent) {

            animateNumber(
                progressPercent,
                0,
                progressValue,
                1000
            );

        }

    }



    /* =====================================================
       ANIMATE NUMBER
    ====================================================== */

    function animateNumber(
        element,
        start,
        end,
        duration
    ) {

        const startTime =
            performance.now();


        function update(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const value =
                Math.floor(
                    start +
                    (end - start) * progress
                );


            element.textContent =
                `${value}%`;


            if (progress < 1) {

                requestAnimationFrame(update);

            }

        }


        requestAnimationFrame(update);

    }



    /* =====================================================
       LATEST UPDATE TIME
    ====================================================== */

    const updatedTime =
        document.querySelector(".updated-time");


    if (updatedTime) {

        updatedTime.innerHTML = `
            <i class="fa-regular fa-clock"></i>
            Updated just now
        `;

    }



    /* =====================================================
       DONOR MATCHING STATISTICS
    ====================================================== */

    const matchStats =
        document.querySelectorAll(".match-stat strong");


    matchStats.forEach((numberElement) => {

        const finalValue =
            parseInt(numberElement.textContent);


        if (!isNaN(finalValue)) {

            numberElement.textContent = "0";

            animateNumberValue(
                numberElement,
                0,
                finalValue,
                800
            );

        }

    });



    /* =====================================================
       MATCH NUMBER ANIMATION
    ====================================================== */

    function animateNumberValue(
        element,
        start,
        end,
        duration
    ) {

        const startTime =
            performance.now();


        function update(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const value =
                Math.floor(
                    start +
                    (end - start) * progress
                );


            element.textContent =
                value;


            if (progress < 1) {

                requestAnimationFrame(update);

            }

        }


        requestAnimationFrame(update);

    }



    /* =====================================================
       TIMELINE INTERACTION
    ====================================================== */

    const timelineItems =
        document.querySelectorAll(".timeline-item");


    timelineItems.forEach((item) => {

        item.addEventListener("mouseenter", () => {

            item.style.transition =
                "transform 0.2s ease";

            item.style.transform =
                "translateX(3px)";

        });


        item.addEventListener("mouseleave", () => {

            item.style.transform =
                "translateX(0)";

        });

    });



    /* =====================================================
       ACTIVE REQUEST STATUS
    ====================================================== */

    const activeStatus =
        document.querySelector(".tracking-status");


    if (activeStatus) {

        activeStatus.setAttribute(
            "title",
            "Your blood request is currently active"
        );

    }



    /* =====================================================
       TOAST NOTIFICATION
    ====================================================== */

    function showToast(message, type = "success") {

        /*
         * Remove existing toast
         */

        const oldToast =
            document.querySelector(".hs-toast");

        if (oldToast) {

            oldToast.remove();

        }


        /* Create toast */

        const toast =
            document.createElement("div");

        toast.className =
            `hs-toast ${type}`;


        const icon =
            type === "success"
                ? "fa-circle-check"
                : "fa-circle-exclamation";


        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;


        document.body.appendChild(toast);


        /* Animation */

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });


        /* Remove */

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 2600);

    }



    /* =====================================================
       TOAST CSS
    ====================================================== */

    const toastStyle =
        document.createElement("style");


    toastStyle.textContent = `

        .hs-toast {
            position: fixed;

            right: 25px;
            bottom: 25px;

            z-index: 9999;

            display: flex;
            align-items: center;

            gap: 9px;

            min-width: 230px;

            padding: 12px 15px;

            border: 1px solid #dfe4eb;

            border-radius: 11px;

            background: #ffffff;

            color: #182234;

            box-shadow:
                0 15px 40px
                rgba(24, 34, 52, 0.14);

            font-family: "Inter", sans-serif;

            font-size: 11px;
            font-weight: 650;

            opacity: 0;

            transform:
                translateY(15px)
                scale(0.97);

            transition:
                opacity 0.25s ease,
                transform 0.25s ease;
        }


        .hs-toast.show {
            opacity: 1;

            transform:
                translateY(0)
                scale(1);
        }


        .hs-toast i {
            font-size: 15px;
        }


        .hs-toast.success i {
            color: #1f9d68;
        }


        .hs-toast.error i {
            color: #d9234f;
        }


        @media (max-width: 500px) {

            .hs-toast {
                left: 15px;
                right: 15px;
                bottom: 15px;

                min-width: auto;

                font-size: 10px;
            }

        }

    `;


    document.head.appendChild(toastStyle);



    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * ESC closes mobile sidebar
             */

            if (
                event.key === "Escape" &&
                sidebar &&
                sidebar.classList.contains("open")
            ) {

                sidebar.classList.remove("open");

                const icon =
                    menuBtn?.querySelector("i");

                if (icon) {

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }

            }

        }
    );



    /* =====================================================
       PAGE LOAD EFFECT
    ====================================================== */

    document.body.classList.add(
        "tracking-page-loaded"
    );


    console.log(
        "HemoSphere Request Tracking loaded successfully."
    );

});