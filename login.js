/* ==========================================
   HemoSphere
   login.js
   Login Page Functionality
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const loginForm = document.getElementById("loginForm");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const loginMessage = document.getElementById("loginMessage");

    const togglePassword =
        document.getElementById("togglePassword");

    const forgotPassword =
        document.getElementById("forgotPassword");


    /* ==========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", () => {

            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword ? "text" : "password";

            togglePassword.innerHTML = isPassword
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';

            togglePassword.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );

        });

    }


    /* ==========================================
       EMAIL VALIDATION
    ========================================== */

    function validateEmail() {

        const email = emailInput.value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (email === "") {

            emailError.textContent =
                "Please enter your email address.";

            emailInput.parentElement
                .classList.add("input-error");

            return false;
        }


        if (!emailPattern.test(email)) {

            emailError.textContent =
                "Please enter a valid email address.";

            emailInput.parentElement
                .classList.add("input-error");

            return false;
        }


        emailError.textContent = "";

        emailInput.parentElement
            .classList.remove("input-error");

        emailInput.parentElement
            .classList.add("input-success");

        return true;
    }


    /* ==========================================
       PASSWORD VALIDATION
    ========================================== */

    function validatePassword() {

        const password = passwordInput.value;

        if (password === "") {

            passwordError.textContent =
                "Please enter your password.";

            passwordInput.parentElement
                .classList.add("input-error");

            return false;
        }


        if (password.length < 6) {

            passwordError.textContent =
                "Password must contain at least 6 characters.";

            passwordInput.parentElement
                .classList.add("input-error");

            return false;
        }


        passwordError.textContent = "";

        passwordInput.parentElement
            .classList.remove("input-error");

        passwordInput.parentElement
            .classList.add("input-success");

        return true;
    }


    /* ==========================================
       REAL-TIME VALIDATION
    ========================================== */

    if (emailInput) {

        emailInput.addEventListener("blur", () => {
            validateEmail();
        });

    }


    if (passwordInput) {

        passwordInput.addEventListener("blur", () => {
            validatePassword();
        });

    }


    /* ==========================================
       REMOVE ERROR WHILE TYPING
    ========================================== */

    if (emailInput) {

        emailInput.addEventListener("input", () => {

            emailError.textContent = "";

            emailInput.parentElement
                .classList.remove(
                    "input-error",
                    "input-success"
                );

        });

    }


    if (passwordInput) {

        passwordInput.addEventListener("input", () => {

            passwordError.textContent = "";

            passwordInput.parentElement
                .classList.remove(
                    "input-error",
                    "input-success"
                );

        });

    }


    /* ==========================================
       LOGIN FORM SUBMIT
    ========================================== */

    if (loginForm) {

        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();


            /* Clear previous message */

            loginMessage.textContent = "";

            loginMessage.style.color = "";


            /* Validate */

            const emailValid = validateEmail();
            const passwordValid = validatePassword();


            if (!emailValid || !passwordValid) {

                loginMessage.textContent =
                    "Please correct the errors above.";

                loginMessage.style.color =
                    "#D32F2F";

                return;
            }


            /* ======================================
               FRONTEND DEMO LOGIN
            ====================================== */

            const submitButton =
                loginForm.querySelector(".login-submit");

            const buttonText =
                submitButton.querySelector("span");

            const buttonIcon =
                submitButton.querySelector("i");


            /* Loading state */

            buttonText.textContent = "Signing In...";

            buttonIcon.className =
                "fa-solid fa-spinner fa-spin";

            submitButton.disabled = true;


            /* Demo delay */

            setTimeout(() => {

                loginMessage.textContent =
                    "Login successful! Redirecting...";

                loginMessage.style.color =
                    "#2E7D32";


                buttonText.textContent =
                    "Success";

                buttonIcon.className =
                    "fa-solid fa-circle-check";


                /* Redirect to dashboard */

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1000);


            }, 1200);

        });

    }


    /* ==========================================
       FORGOT PASSWORD
    ========================================== */

    if (forgotPassword) {

        forgotPassword.addEventListener("click", (event) => {

            event.preventDefault();

            const email = emailInput.value.trim();


            if (email === "") {

                emailError.textContent =
                    "Enter your email to reset your password.";

                emailInput.focus();

                return;
            }


            if (!validateEmail()) {

                emailInput.focus();

                return;
            }


            loginMessage.textContent =
                "Password reset functionality will be connected to the backend.";

            loginMessage.style.color =
                "#D32F2F";

        });

    }


});