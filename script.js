/* ==========================================
   HemoSphere
   script.js - Part 1
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       MOBILE MENU
    ========================================== */

    const navbar = document.querySelector(".navbar");
    const header = document.querySelector(".header");

    // Create mobile menu button
    const menuBtn = document.createElement("button");

    menuBtn.className = "menu-btn";
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

    header.appendChild(menuBtn);

    menuBtn.addEventListener("click", () => {

        navbar.classList.toggle("show-menu");

        if (navbar.classList.contains("show-menu")) {
            menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }

    });


    /* ==========================================
       CLOSE MOBILE MENU AFTER CLICK
    ========================================== */

    const navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("show-menu");

            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

        });

    });


    /* ==========================================
       ACTIVE NAVIGATION LINK
    ========================================== */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });


    /* ==========================================
       HEADER SCROLL EFFECT
    ========================================== */

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    });


    /* ==========================================
       SMOOTH SCROLL
    ========================================== */

    navLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId.startsWith("#")) {

                const targetSection = document.querySelector(targetId);

                if (targetSection) {

                    event.preventDefault();

                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

        });

    });


    /* ==========================================
       HERO BUTTON ANIMATION
    ========================================== */

    const buttons = document.querySelectorAll(
        ".primary-btn, .secondary-btn, .register-btn"
    );

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            button.classList.add("button-click");

            setTimeout(() => {

                button.classList.remove("button-click");

            }, 200);

        });

    });


    /* ==========================================
       IMAGE ERROR HANDLING
    ========================================== */

    const heroImage = document.querySelector(".hero-image img");

    if (heroImage) {

        heroImage.addEventListener("error", () => {

            console.warn(
                "HemoSphere: hero-image.png was not found."
            );

        });

    }


    /* ==========================================
       PAGE LOAD ANIMATION
    ========================================== */

    document.body.classList.add("page-loaded");

});