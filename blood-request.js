document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bloodRequestForm");

    if (!form) {
        return;
    }

    /* ===============================
       SET TODAY AS MINIMUM DATE
    =============================== */

    const requiredDateInput =
        document.getElementById("requiredDate");

    if (requiredDateInput) {

        const today =
            new Date().toISOString().split("T")[0];

        requiredDateInput.min = today;
    }


    /* ===============================
       FORM SUBMIT
    =============================== */

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        /* ===============================
           GET FORM VALUES
        =============================== */

        const bloodGroup =
            document.getElementById("bloodGroup").value;

        const units =
            document.getElementById("units").value;

        const hospitalName =
            document.getElementById("hospitalName")
                .value.trim();

        const city =
            document.getElementById("city")
                .value.trim();

        const hospitalContact =
            document.getElementById("hospitalContact")
                .value.trim();

        const patientName =
            document.getElementById("patientName")
                .value.trim();

        const requiredDate =
            document.getElementById("requiredDate")
                .value;

        const requesterName =
            document.getElementById("requesterName")
                .value.trim();

        const requesterPhone =
            document.getElementById("requesterPhone")
                .value.trim();


        /* ===============================
           VALIDATE REQUIRED FIELDS
        =============================== */

        if (
            !bloodGroup ||
            !units ||
            !hospitalName ||
            !city ||
            !hospitalContact ||
            !patientName ||
            !requiredDate ||
            !requesterName ||
            !requesterPhone
        ) {

            showMessage(
                "Please complete all required fields.",
                "error"
            );

            return;
        }


        /* ===============================
           GET EMERGENCY LEVEL
        =============================== */

        const urgencyElement =
            document.querySelector(
                'input[name="urgency"]:checked'
            );

        if (!urgencyElement) {

            showMessage(
                "Please select an emergency level.",
                "error"
            );

            return;
        }

        const urgency =
            urgencyElement.value;


        /* ===============================
           CREATE UNIQUE REQUEST ID
        =============================== */

        const requestId =
            "HS-" + Date.now();


        /* ===============================
           CREATE BLOOD REQUEST OBJECT
        =============================== */

        const bloodRequest = {

            requestId: requestId,

            bloodGroup: bloodGroup,

            units: units,

            urgency: urgency,

            hospitalName: hospitalName,

            city: city,

            hospitalContact: hospitalContact,

            patientName: patientName,

            requiredDate: requiredDate,

            requesterName: requesterName,

            requesterPhone: requesterPhone,

            status: "Finding Donors",

            createdAt:
                new Date().toISOString()
        };


        /* ===============================
           GET OLD REQUESTS
        =============================== */

        let requests =
            JSON.parse(
                localStorage.getItem(
                    "hemoSphereRequests"
                )
            ) || [];


        /* ===============================
           ADD NEW REQUEST
        =============================== */

        requests.push(bloodRequest);


        /* ===============================
           SAVE REQUEST
        =============================== */

        localStorage.setItem(
            "hemoSphereRequests",
            JSON.stringify(requests)
        );


        /* ===============================
           SUCCESS MESSAGE
        =============================== */

        showMessage(
            "Blood request created successfully!",
            "success"
        );


        /* ===============================
           CHANGE SUBMIT BUTTON
        =============================== */

        const submitButton =
            form.querySelector(".submit-btn");

        if (submitButton) {

            submitButton.innerHTML =
                '<i class="fa-solid fa-check"></i> Request Created';

            submitButton.disabled = true;
        }


        /* ===============================
           REDIRECT TO REQUEST DETAILS
           WITH REQUEST ID
        =============================== */

        setTimeout(() => {

            window.location.href =
                `request-details.html?requestId=${encodeURIComponent(
                    bloodRequest.requestId
                )}`;

        }, 1500);

    });


    /* ===============================
       SHOW FORM MESSAGE
    =============================== */

    function showMessage(message, type) {

        const oldMessage =
            document.querySelector(".form-message");

        if (oldMessage) {
            oldMessage.remove();
        }


        const messageBox =
            document.createElement("div");

        messageBox.className =
            `form-message ${type}`;

        messageBox.textContent =
            message;


        form.insertBefore(
            messageBox,
            form.firstElementChild
        );


        setTimeout(() => {

            if (messageBox) {
                messageBox.remove();
            }

        }, 4000);
    }

});