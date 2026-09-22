/* ==========================================
   HemoSphere
   register.js
   Donor Registration Functionality
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const form = document.getElementById("registerForm");

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("registerEmail");
    const phone = document.getElementById("phone");

    const bloodGroup = document.getElementById("bloodGroup");
    const dateOfBirth = document.getElementById("dateOfBirth");

    const state = document.getElementById("state");
    const city = document.getElementById("city");
    const area = document.getElementById("area");

    const lastDonation = document.getElementById("lastDonation");

    const password =
        document.getElementById("registerPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const terms =
        document.getElementById("terms");

    const registerMessage =
        document.getElementById("registerMessage");

    const strengthProgress =
        document.getElementById("strengthProgress");

    const strengthText =
        document.getElementById("strengthText");


    /* ==========================================
       HELPER FUNCTIONS
    ========================================== */

    function getError(id) {
        return document.getElementById(id);
    }


    function setError(input, errorId, message) {

        const error = getError(errorId);

        if (error) {
            error.textContent = message;
        }

        if (input) {

            const parent =
                input.closest(".input-box") ||
                input.closest(".select-box");

            if (parent) {

                parent.classList.remove(
                    "input-success"
                );

                parent.classList.add(
                    "input-error"
                );
            }
        }

        return false;
    }


    function setSuccess(input, errorId) {

        const error = getError(errorId);

        if (error) {
            error.textContent = "";
        }

        if (input) {

            const parent =
                input.closest(".input-box") ||
                input.closest(".select-box");

            if (parent) {

                parent.classList.remove(
                    "input-error"
                );

                parent.classList.add(
                    "input-success"
                );
            }
        }

        return true;
    }


    function clearState(input, errorId) {

        const error = getError(errorId);

        if (error) {
            error.textContent = "";
        }

        if (input) {

            const parent =
                input.closest(".input-box") ||
                input.closest(".select-box");

            if (parent) {

                parent.classList.remove(
                    "input-error",
                    "input-success"
                );
            }
        }
    }


    /* ==========================================
       NAME VALIDATION
    ========================================== */

    function validateName(input, errorId, fieldName) {

        const value = input.value.trim();

        const namePattern =
            /^[A-Za-z\s]{2,50}$/;


        if (value === "") {

            return setError(
                input,
                errorId,
                `${fieldName} is required.`
            );
        }


        if (!namePattern.test(value)) {

            return setError(
                input,
                errorId,
                `${fieldName} must contain letters only.`
            );
        }


        return setSuccess(input, errorId);
    }


    /* ==========================================
       EMAIL VALIDATION
    ========================================== */

    function validateEmail() {

        const value = email.value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (value === "") {

            return setError(
                email,
                "registerEmailError",
                "Email address is required."
            );
        }


        if (!emailPattern.test(value)) {

            return setError(
                email,
                "registerEmailError",
                "Enter a valid email address."
            );
        }


        return setSuccess(
            email,
            "registerEmailError"
        );
    }


    /* ==========================================
       PHONE VALIDATION
    ========================================== */

    function validatePhone() {

        const value =
            phone.value.replace(/\s+/g, "");

        const phonePattern =
            /^[6-9]\d{9}$/;


        if (value === "") {

            return setError(
                phone,
                "phoneError",
                "Mobile number is required."
            );
        }


        if (!phonePattern.test(value)) {

            return setError(
                phone,
                "phoneError",
                "Enter a valid 10-digit mobile number."
            );
        }


        return setSuccess(
            phone,
            "phoneError"
        );
    }


    /* ==========================================
       BLOOD GROUP VALIDATION
    ========================================== */

    function validateBloodGroup() {

        if (bloodGroup.value === "") {

            return setError(
                bloodGroup,
                "bloodGroupError",
                "Please select your blood group."
            );
        }


        return setSuccess(
            bloodGroup,
            "bloodGroupError"
        );
    }


    /* ==========================================
       DATE OF BIRTH VALIDATION
    ========================================== */

    function validateDateOfBirth() {

        const value = dateOfBirth.value;

        if (value === "") {

            return setError(
                dateOfBirth,
                "dateOfBirthError",
                "Date of birth is required."
            );
        }


        const birthDate =
            new Date(value);

        const today =
            new Date();


        if (birthDate > today) {

            return setError(
                dateOfBirth,
                "dateOfBirthError",
                "Date of birth cannot be in the future."
            );
        }


        return setSuccess(
            dateOfBirth,
            "dateOfBirthError"
        );
    }


    /* ==========================================
       STATE VALIDATION
    ========================================== */

    function validateState() {

        if (state.value === "") {

            return setError(
                state,
                "stateError",
                "Please select your state."
            );
        }


        return setSuccess(
            state,
            "stateError"
        );
    }


    /* ==========================================
       CITY VALIDATION
    ========================================== */

    function validateCity() {

        const value = city.value.trim();

        if (value === "") {

            return setError(
                city,
                "cityError",
                "City is required."
            );
        }


        if (value.length < 2) {

            return setError(
                city,
                "cityError",
                "Please enter a valid city."
            );
        }


        return setSuccess(
            city,
            "cityError"
        );
    }


    /* ==========================================
       AREA VALIDATION
    ========================================== */

    function validateArea() {

        const value = area.value.trim();

        if (value === "") {

            return setError(
                area,
                "areaError",
                "Area / locality is required."
            );
        }


        if (value.length < 2) {

            return setError(
                area,
                "areaError",
                "Please enter a valid area."
            );
        }


        return setSuccess(
            area,
            "areaError"
        );
    }


    /* ==========================================
       AVAILABILITY VALIDATION
    ========================================== */

    function validateAvailability() {

        const selected =
            document.querySelector(
                'input[name="availability"]:checked'
            );


        if (!selected) {

            registerMessage.textContent =
                "Please select your donor availability.";

            registerMessage.style.color =
                "#D32F2F";

            return false;
        }


        return true;
    }


    /* ==========================================
       PASSWORD STRENGTH
    ========================================== */

    function checkPasswordStrength(value) {

        let score = 0;


        if (value.length >= 8) {
            score++;
        }

        if (/[a-z]/.test(value)) {
            score++;
        }

        if (/[A-Z]/.test(value)) {
            score++;
        }

        if (/[0-9]/.test(value)) {
            score++;
        }

        if (/[^A-Za-z0-9]/.test(value)) {
            score++;
        }


        let width = "0%";
        let text = "Password strength";


        if (value.length === 0) {

            width = "0%";
            text = "Password strength";

        } else if (score <= 2) {

            width = "35%";
            text = "Weak password";

        } else if (score === 3) {

            width = "60%";
            text = "Medium password";

        } else if (score === 4) {

            width = "80%";
            text = "Strong password";

        } else {

            width = "100%";
            text = "Very strong password";
        }


        strengthProgress.style.width = width;

        strengthText.textContent = text;
    }


    /* ==========================================
       PASSWORD VALIDATION
    ========================================== */

    function validatePassword() {

        const value = password.value;


        if (value === "") {

            return setError(
                password,
                "registerPasswordError",
                "Password is required."
            );
        }


        if (value.length < 8) {

            return setError(
                password,
                "registerPasswordError",
                "Password must contain at least 8 characters."
            );
        }


        if (!/[A-Z]/.test(value)) {

            return setError(
                password,
                "registerPasswordError",
                "Add at least one uppercase letter."
            );
        }


        if (!/[0-9]/.test(value)) {

            return setError(
                password,
                "registerPasswordError",
                "Add at least one number."
            );
        }


        return setSuccess(
            password,
            "registerPasswordError"
        );
    }


    /* ==========================================
       CONFIRM PASSWORD
    ========================================== */

    function validateConfirmPassword() {

        const value =
            confirmPassword.value;


        if (value === "") {

            return setError(
                confirmPassword,
                "confirmPasswordError",
                "Please confirm your password."
            );
        }


        if (value !== password.value) {

            return setError(
                confirmPassword,
                "confirmPasswordError",
                "Passwords do not match."
            );
        }


        return setSuccess(
            confirmPassword,
            "confirmPasswordError"
        );
    }


    /* ==========================================
       TERMS VALIDATION
    ========================================== */

    function validateTerms() {

        const error =
            getError("termsError");


        if (!terms.checked) {

            error.textContent =
                "Please accept the Terms & Conditions.";

            return false;
        }


        error.textContent = "";

        return true;
    }


    /* ==========================================
       PASSWORD TOGGLE
    ========================================== */

    function setupPasswordToggle(
        buttonId,
        input
    ) {

        const button =
            document.getElementById(buttonId);


        if (!button || !input) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                const isPassword =
                    input.type === "password";


                input.type =
                    isPassword
                        ? "text"
                        : "password";


                button.innerHTML =
                    isPassword
                        ? '<i class="fa-solid fa-eye-slash"></i>'
                        : '<i class="fa-solid fa-eye"></i>';


                button.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );

            }
        );
    }


    setupPasswordToggle(
        "toggleRegisterPassword",
        password
    );

    setupPasswordToggle(
        "toggleConfirmPassword",
        confirmPassword
    );


    /* ==========================================
       PASSWORD INPUT EVENT
    ========================================== */

    if (password) {

        password.addEventListener(
            "input",
            () => {

                checkPasswordStrength(
                    password.value
                );

                clearState(
                    password,
                    "registerPasswordError"
                );

            }
        );
    }


    /* ==========================================
       CONFIRM PASSWORD INPUT
    ========================================== */

    if (confirmPassword) {

        confirmPassword.addEventListener(
            "input",
            () => {

                clearState(
                    confirmPassword,
                    "confirmPasswordError"
                );

            }
        );
    }


    /* ==========================================
       REAL-TIME INPUT CLEANUP
    ========================================== */

    const inputs = [
        firstName,
        lastName,
        email,
        phone,
        city,
        area
    ];


    inputs.forEach((input) => {

        if (!input) return;


        input.addEventListener(
            "input",
            () => {

                const parent =
                    input.closest(".input-box");


                if (parent) {

                    parent.classList.remove(
                        "input-error",
                        "input-success"
                    );
                }

            }
        );

    });


    /* ==========================================
       FORM SUBMIT
    ========================================== */

    if (form) {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                registerMessage.textContent = "";


                /* ------------------------------
                   VALIDATE ALL FIELDS
                ------------------------------ */

                const firstNameValid =
                    validateName(
                        firstName,
                        "firstNameError",
                        "First name"
                    );


                const lastNameValid =
                    validateName(
                        lastName,
                        "lastNameError",
                        "Last name"
                    );


                const emailValid =
                    validateEmail();


                const phoneValid =
                    validatePhone();


                const bloodValid =
                    validateBloodGroup();


                const dobValid =
                    validateDateOfBirth();


                const stateValid =
                    validateState();


                const cityValid =
                    validateCity();


                const areaValid =
                    validateArea();


                const availabilityValid =
                    validateAvailability();


                const passwordValid =
                    validatePassword();


                const confirmPasswordValid =
                    validateConfirmPassword();


                const termsValid =
                    validateTerms();


                /* ------------------------------
                   CHECK VALIDATION
                ------------------------------ */

                if (
                    !firstNameValid ||
                    !lastNameValid ||
                    !emailValid ||
                    !phoneValid ||
                    !bloodValid ||
                    !dobValid ||
                    !stateValid ||
                    !cityValid ||
                    !areaValid ||
                    !availabilityValid ||
                    !passwordValid ||
                    !confirmPasswordValid ||
                    !termsValid
                ) {

                    if (!registerMessage.textContent) {

                        registerMessage.textContent =
                            "Please correct the highlighted fields.";

                        registerMessage.style.color =
                            "#D32F2F";
                    }

                    return;
                }


                /* ==================================
                   COLLECT DONOR DATA
                ================================== */

                const selectedAvailability =
                    document.querySelector(
                        'input[name="availability"]:checked'
                    );


                const donorData = {

                    firstName:
                        firstName.value.trim(),

                    lastName:
                        lastName.value.trim(),

                    email:
                        email.value.trim(),

                    phone:
                        phone.value.trim(),

                    bloodGroup:
                        bloodGroup.value,

                    gender:
                        document.getElementById("gender").value,

                    dateOfBirth:
                        dateOfBirth.value,

                    state:
                        state.value,

                    city:
                        city.value.trim(),

                    area:
                        area.value.trim(),

                    availability:
                        selectedAvailability
                            ? selectedAvailability.value
                            : "",

                    lastDonation:
                        lastDonation.value || null,

                    registeredAt:
                        new Date().toISOString()

                };


                /* ==================================
                   DEMO STORAGE
                ================================== */

                /*
                   Temporary frontend storage.

                   Later we will replace this with
                   backend + database API.
                */

                const existingDonors =
                    JSON.parse(
                        localStorage.getItem(
                            "hemosphereDonors"
                        )
                    ) || [];


                existingDonors.push(donorData);


                localStorage.setItem(
                    "hemosphereDonors",
                    JSON.stringify(existingDonors)
                );


                /* ==================================
                   LOADING STATE
                ================================== */

                const submitButton =
                    form.querySelector(
                        ".register-submit"
                    );


                const buttonText =
                    submitButton.querySelector(
                        "span"
                    );


                const buttonIcon =
                    submitButton.querySelector(
                        "i"
                    );


                submitButton.disabled = true;


                buttonText.textContent =
                    "Creating Account...";


                buttonIcon.className =
                    "fa-solid fa-spinner fa-spin";


                /* ==================================
                   DEMO PROCESS
                ================================== */

                setTimeout(() => {

                    registerMessage.textContent =
                        "Registration successful! Welcome to HemoSphere.";

                    registerMessage.style.color =
                        "#2E7D32";


                    buttonText.textContent =
                        "Account Created";


                    buttonIcon.className =
                        "fa-solid fa-circle-check";


                    /* Save registration status */

                    localStorage.setItem(
                        "hemosphereLoggedIn",
                        "true"
                    );


                    localStorage.setItem(
                        "hemosphereCurrentDonor",
                        JSON.stringify(donorData)
                    );


                    /* Redirect */

                    setTimeout(() => {

                        window.location.href =
                            "dashboard.html";

                    }, 1200);


                }, 1200);

            }
        );

    }


    /* ==========================================
       PREVENT FUTURE DONATION DATE
    ========================================== */

    if (lastDonation) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        lastDonation.max = today;
    }


    /* ==========================================
       PREVENT FUTURE DATE OF BIRTH
    ========================================== */

    if (dateOfBirth) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        dateOfBirth.max = today;
    }


    /* ==========================================
       PHONE NUMBER CLEANUP
    ========================================== */

    if (phone) {

        phone.addEventListener(
            "input",
            () => {

                phone.value =
                    phone.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

            }
        );
    }


});