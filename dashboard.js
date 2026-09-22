document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       HEMOSPHERE DASHBOARD JS
       ===================================================== */

    // -----------------------------
    // USER INFORMATION
    // -----------------------------
    const userName = "Moulishwaran";

    const welcomeName = document.getElementById("welcomeName");
    const topUserName = document.getElementById("topUserName");
    const sideUserName = document.getElementById("sideUserName");

    if (welcomeName) welcomeName.textContent = userName;
    if (topUserName) topUserName.textContent = userName;
    if (sideUserName) sideUserName.textContent = userName;


    // -----------------------------
    // REQUEST DATA
    // -----------------------------
    let requests = [];

    try {
        requests = JSON.parse(
            localStorage.getItem("hemoSphereRequests")
        ) || [];
    } catch (error) {
        console.error("Unable to read request data:", error);
        requests = [];
    }


    // -----------------------------
    // REQUEST COUNT
    // -----------------------------
    const requestCount = document.getElementById("requestCount");

    if (requestCount) {
        requestCount.textContent = requests.length;
    }


    // -----------------------------
    // RECENT REQUESTS
    // -----------------------------
    const recentRequests =
        document.getElementById("recentRequests");

    if (recentRequests) {

        if (requests.length === 0) {

            recentRequests.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fa-regular fa-folder-open"></i>
                    </div>

                    <h3>No Recent Requests</h3>

                    <p>
                        Your recent blood requests will appear here.
                    </p>

                    <a href="blood-request.html" class="empty-action">
                        <i class="fa-solid fa-plus"></i>
                        Create Request
                    </a>
                </div>
            `;

        } else {

            recentRequests.innerHTML = "";

            const latestRequests =
                requests.slice(-4).reverse();

            latestRequests.forEach((request) => {

                const item = document.createElement("div");

                item.className = "request-item";

                const bloodGroup =
                    request.bloodGroup || "--";

                const hospital =
                    request.hospital || "Blood Request";

                const city =
                    request.city || "Location unavailable";

                const units =
                    request.units || 1;

                const status =
                    request.status || "Active";

                item.innerHTML = `
                    <div class="request-blood">
                        ${bloodGroup}
                    </div>

                    <div class="request-info">
                        <strong>
                            ${hospital}
                        </strong>

                        <span>
                            ${city} · ${units} unit(s)
                        </span>
                    </div>

                    <span class="request-status">
                        ${status}
                    </span>
                `;

                recentRequests.appendChild(item);
            });
        }
    }


    // -----------------------------
    // MOBILE SIDEBAR
    // -----------------------------
    const menuBtn =
        document.getElementById("menuBtn");

    const sidebar =
        document.getElementById("sidebar");

    if (menuBtn && sidebar) {

        menuBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            sidebar.classList.toggle("open");

            const isOpen =
                sidebar.classList.contains("open");

            menuBtn.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );
        });


        // Close sidebar when clicking outside
        document.addEventListener("click", (event) => {

            if (
                window.innerWidth <= 850 &&
                sidebar.classList.contains("open") &&
                !sidebar.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                sidebar.classList.remove("open");

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        });


        // Close sidebar after selecting navigation
        const navItems =
            sidebar.querySelectorAll(".nav-item");

        navItems.forEach((item) => {

            item.addEventListener("click", () => {

                if (window.innerWidth <= 850) {
                    sidebar.classList.remove("open");

                    menuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            });
        });
    }


    // -----------------------------
    // LOGOUT
    // -----------------------------
    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            const confirmLogout =
                confirm("Are you sure you want to logout?");

            if (confirmLogout) {

                // Clear temporary login/session data
                sessionStorage.clear();

                // Login page is outside the pages folder
               window.location.href = "login.html";
            }
        });
    }


    // -----------------------------
    // STAT CARD ANIMATION
    // -----------------------------
    const statCards =
        document.querySelectorAll(".stat-card");

    statCards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";

        setTimeout(() => {

            card.style.transition =
                "opacity 0.45s ease, transform 0.45s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, index * 100);
    });


    // -----------------------------
    // QUICK ACTION CARD ANIMATION
    // -----------------------------
    const quickCards =
        document.querySelectorAll(".quick-card");

    quickCards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";

        setTimeout(() => {

            card.style.transition =
                "opacity 0.4s ease, transform 0.4s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 250 + index * 100);
    });


    // -----------------------------
    // EMERGENCY BUTTON
    // -----------------------------
    const emergencyBtn =
        document.querySelector(".emergency-btn");

    if (emergencyBtn) {

        emergencyBtn.addEventListener("click", () => {

            emergencyBtn.classList.add("loading");

            setTimeout(() => {
                emergencyBtn.classList.remove("loading");
            }, 500);
        });
    }


    // -----------------------------
    // VIEW DONORS BUTTON
    // -----------------------------
    const viewDonorsBtn =
        document.querySelector(".view-donors-btn");

    if (viewDonorsBtn) {

        viewDonorsBtn.addEventListener("click", () => {
            viewDonorsBtn.classList.add("clicked");

            setTimeout(() => {
                viewDonorsBtn.classList.remove("clicked");
            }, 300);
        });
    }


    // -----------------------------
    // WINDOW RESIZE
    // -----------------------------
    window.addEventListener("resize", () => {

        if (
            window.innerWidth > 850 &&
            sidebar
        ) {
            sidebar.classList.remove("open");

            if (menuBtn) {
                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    });


    // -----------------------------
    // KEYBOARD ESCAPE
    // -----------------------------
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            if (
                sidebar &&
                sidebar.classList.contains("open")
            ) {
                sidebar.classList.remove("open");

                if (menuBtn) {
                    menuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            }
        }
    });

});