document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.querySelector(".site-header");
    const nav = document.querySelector(".main-nav");
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelectorAll(".main-nav a");
    const splash = document.getElementById("splashScreen");

    // Splash screen management - show only on first visit
    const showSplash = () => {
        if (!splash) return;

        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const isHome = currentPage === "index.html" || currentPage === "";

        if (!isHome) {
            splash.style.display = "none";
            return;
        }

        // Check if splash has already been shown using localStorage
        const splashShown = localStorage.getItem("sigeLogoSplashShown");
        
        if (splashShown) {
            splash.style.display = "none";
            return;
        }

        body.classList.add("splash-active");
        splash.classList.add("active");

        // Remove splash after animation completes (3 seconds)
        setTimeout(() => {
            splash.classList.remove("active");
            body.classList.remove("splash-active");
            setTimeout(() => {
                splash.style.display = "none";
                // Mark that splash has been shown
                localStorage.setItem("sigeLogoSplashShown", "true");
            }, 800);
        }, 3000);
    };

    // Initialize splash screen
    showSplash();

    // Header scroll state management
    const setHeaderState = () => {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 18);
    };

    // Active nav link detection
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === currentPage;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // Mobile menu management
    const closeMenu = () => {
        body.classList.remove("nav-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
    };

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = body.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        document.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const clickedToggle = target.closest(".nav-toggle");
            const clickedNav = target.closest(".main-nav");
            if (!clickedToggle && !clickedNav && body.classList.contains("nav-open")) {
                closeMenu();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) {
                closeMenu();
            }
        });
    }

    // Close menu on Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Header scroll listener
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });

    // Fade-in and section animations with IntersectionObserver
    const fadeElements = document.querySelectorAll(".fade-in");
    const mainSections = document.querySelectorAll("main > section");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
        fadeElements.forEach((element) => element.classList.add("visible"));
        mainSections.forEach((section) => {
            section.classList.add("section-motion", "visible");
        });
    } else {
        const observer = new IntersectionObserver(
            (entries, localObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("visible");
                    localObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -30px 0px",
            }
        );

        fadeElements.forEach((element) => observer.observe(element));

        mainSections.forEach((section, index) => {
            section.classList.add("section-motion");
            section.style.setProperty("--section-delay", `${Math.min(index * 80, 240)}ms`);
            observer.observe(section);
        });
    }

    // Performance optimization: Preload critical images
    if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
            const images = document.querySelectorAll("img[loading='lazy']");
            // Lazy load images are handled by browser, but we can hint preloading for above-the-fold
        });
    }
});
