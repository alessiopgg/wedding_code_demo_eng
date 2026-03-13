/* =========================================================
   WEDDING TABLE DATA
   Edit this array to update the seating plan quickly.
   You can add/remove tables and guests without touching the HTML.
   ========================================================= */
const seatingPlan = [
    {
        tableName: "Head Table",
        guests: [
            "Charlotte Evans",
            "Oliver Bennett",
            "Maid of Honor",
            "Best Man",
            "Bride's Mother",
            "Groom's Mother"
        ]
    },
    {
        tableName: "Rose Table",
        guests: [
            "Emily Carter",
            "James Carter",
            "Sophia White",
            "Daniel White",
            "Amelia Green",
            "Luca Rossi"
        ]
    },
    {
        tableName: "Olive Table",
        guests: [
            "Emma Stone",
            "William Hart",
            "Mia Collins",
            "Henry Price",
            "Isabella Reed"
        ]
    },
    {
        tableName: "Garden Table",
        guests: [
            "Noah Turner",
            "Ava Turner",
            "Grace Mitchell",
            "Leo Martin",
            "Ella Brooks",
            "Thomas Reed"
        ]
    },
    {
        tableName: "Sunset Table",
        guests: [
            "Sophie Allen",
            "Benjamin Hall",
            "Lily Walker",
            "Jack Lewis",
            "Chloe Baker"
        ]
    },
    {
        tableName: "Tuscan Table",
        guests: [
            "Matteo Ricci",
            "Giulia Conti",
            "Anna Bell",
            "George King",
            "Olivia Ward",
            "Samuel Clark"
        ]
    }
];

/* =========================================================
   RENDER SEATING PLAN
   ========================================================= */
function renderSeatingPlan() {
    const tablesGrid = document.getElementById("tables-grid");
    if (!tablesGrid) return;

    tablesGrid.innerHTML = seatingPlan
        .map((table) => {
            const guestItems = table.guests
                .map((guest) => `<li>${guest}</li>`)
                .join("");

            return `
        <article class="table-card">
          <h3>${table.tableName}</h3>
          <span class="table-guest-count">${table.guests.length} guests</span>
          <ul class="guest-list">
            ${guestItems}
          </ul>
        </article>
      `;
        })
        .join("");
}

/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */
function setupMobileNavigation() {
    const navToggle = document.getElementById("nav-toggle");
    const siteNav = document.getElementById("site-nav");

    if (!navToggle || !siteNav) return;

    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.classList.toggle("is-open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("nav-open", isOpen);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            navToggle.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("nav-open");
        });
    });
}

/* =========================================================
   STICKY HEADER STYLE ON SCROLL
   ========================================================= */
function setupHeaderScrollEffect() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 10);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader);
}

/* =========================================================
   ACTIVE NAV LINK ON SCROLL
   ========================================================= */
function setupActiveNavLinks() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".site-nav a");

    if (!sections.length || !navLinks.length) return;

    const updateActiveLink = () => {
        let currentSectionId = "home";

        sections.forEach((section) => {
            const top = section.offsetTop - 140;
            const bottom = top + section.offsetHeight;

            if (window.scrollY >= top && window.scrollY < bottom) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${currentSectionId}`);
        });
    };

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink);
}

/* =========================================================
   REVEAL ELEMENTS ON SCROLL
   ========================================================= */
function setupRevealAnimation() {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18
        }
    );

    revealElements.forEach((element) => observer.observe(element));
}

/* =========================================================
   GALLERY LIGHTBOX
   ========================================================= */
function setupGalleryLightbox() {
    const galleryCards = document.querySelectorAll(".gallery-card");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxClose = document.getElementById("lightbox-close");

    if (!galleryCards.length || !lightbox || !lightboxImage || !lightboxClose) return;

    const openLightbox = (src, alt) => {
        lightboxImage.src = src;
        lightboxImage.alt = alt || "Expanded gallery image";
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("nav-open");
    };

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
        document.body.classList.remove("nav-open");
    };

    galleryCards.forEach((card) => {
        card.addEventListener("click", () => {
            const image = card.querySelector("img");
            if (!image) return;
            openLightbox(image.src, image.alt);
        });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });
}

/* =========================================================
   RSVP FORM LOGIC
   Uses Formspree endpoint from the form action attribute.
   Replace YOUR_FORM_ID in index.html with your real form ID.
   ========================================================= */
function setupRsvpForm() {
    const form = document.getElementById("rsvp-form");
    const status = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");
    const guestCountInput = document.getElementById("guest-count");
    const attendanceInputs = document.querySelectorAll('input[name="attendance"]');

    if (!form || !status || !submitBtn || !guestCountInput || !attendanceInputs.length) return;

    const updateGuestCountState = () => {
        const selectedAttendance = document.querySelector('input[name="attendance"]:checked');
        const isAttending = selectedAttendance && selectedAttendance.value === "Yes";

        guestCountInput.disabled = !isAttending;
        guestCountInput.required = isAttending;

        if (!isAttending) {
            guestCountInput.value = "0";
        } else if (guestCountInput.value === "0" || guestCountInput.value === "") {
            guestCountInput.value = "1";
        }
    };

    attendanceInputs.forEach((input) => {
        input.addEventListener("change", updateGuestCountState);
    });

    updateGuestCountState();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const endpoint = form.getAttribute("action");

        status.textContent = "";
        status.className = "form-status";

        if (!endpoint || endpoint.includes("YOUR_FORM_ID")) {
            status.textContent =
                "Form not configured yet. Replace YOUR_FORM_ID in index.html with your real Formspree form ID.";
            status.classList.add("error");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    Accept: "application/json"
                }
            });

            if (response.ok) {
                status.textContent = "Thank you! Your RSVP has been sent successfully.";
                status.classList.add("success");
                form.reset();

                const attendingYes = form.querySelector('input[name="attendance"][value="Yes"]');
                if (attendingYes) attendingYes.checked = true;
                updateGuestCountState();
            } else {
                const data = await response.json().catch(() => null);

                if (data && data.errors && Array.isArray(data.errors)) {
                    status.textContent = data.errors.map((error) => error.message).join(" ");
                } else {
                    status.textContent = "Something went wrong while sending the form. Please try again.";
                }

                status.classList.add("error");
            }
        } catch (error) {
            status.textContent =
                "Network error. Check your connection and verify the Formspree endpoint.";
            status.classList.add("error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send RSVP";
        }
    });
}

/* =========================================================
   FOOTER YEAR
   ========================================================= */
function setCurrentYear() {
    const yearElement = document.getElementById("current-year");
    if (!yearElement) return;
    yearElement.textContent = new Date().getFullYear();
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    renderSeatingPlan();
    setupMobileNavigation();
    setupHeaderScrollEffect();
    setupActiveNavLinks();
    setupRevealAnimation();
    setupGalleryLightbox();
    setupRsvpForm();
    setCurrentYear();
});