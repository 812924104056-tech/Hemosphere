document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");

    // -----------------------------------------
    // LOAD SAVED THEME
    // -----------------------------------------
    const savedTheme = localStorage.getItem("hemosphere-theme");

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }

    updateThemeIcon();


    // -----------------------------------------
    // THEME TOGGLE
    // -----------------------------------------
    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            body.classList.toggle("dark-mode");

            const isDark =
                body.classList.contains("dark-mode");

            // Save theme
            localStorage.setItem(
                "hemosphere-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();
        });
    }


    // -----------------------------------------
    // UPDATE THEME ICON
    // -----------------------------------------
    function updateThemeIcon() {

        if (!themeToggle) return;

        const icon =
            themeToggle.querySelector("i");

        if (!icon) return;

        const isDark =
            body.classList.contains("dark-mode");

        if (isDark) {

            // Dark mode → show Sun
            icon.className = "fa-solid fa-sun";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to light mode"
            );

        } else {

            // Light mode → show Moon
            icon.className = "fa-solid fa-moon";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to dark mode"
            );
        }
    }


    // -----------------------------------------
    // KEYBOARD ACCESS
    // -----------------------------------------
    if (themeToggle) {

        themeToggle.addEventListener("keydown", (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                themeToggle.click();
            }
        });
    }

});