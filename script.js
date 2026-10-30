
document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = [...document.querySelectorAll(".gallery-item")];
    const imageButtons = [...document.querySelectorAll(".image-button")];
    const filterButtons = [...document.querySelectorAll(".filter-btn")];

    const lightbox = document.querySelector("#lightbox");
    const lightboxImage = document.querySelector("#lightboxImage");
    const lightboxTitle = document.querySelector("#lightboxTitle");
    const lightboxCategory = document.querySelector("#lightboxCategory");
    const closeButton = document.querySelector("#closeLightbox");
    const prevButton = document.querySelector("#prevButton");
    const nextButton = document.querySelector("#nextButton");
    const counter = document.querySelector(".lightbox-counter");

    if (!lightbox || !lightboxImage || !closeButton ||
        !prevButton || !nextButton) {
        console.error("Image Gallery: A lightbox element is missing.");
        return;
    }

    let visibleButtons = [];
    let currentIndex = 0;

    function updateVisibleImages() {
        visibleButtons = imageButtons.filter(button =>
            button.closest(".gallery-item").style.display !== "none"
        );
    }

    function showImage() {
        if (!visibleButtons.length) return;

        const button = visibleButtons[currentIndex];
        const image = button.querySelector("img");

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        if (lightboxTitle) {
            lightboxTitle.textContent = button.dataset.title || image.alt;
        }

        if (lightboxCategory) {
            lightboxCategory.textContent =
                (button.dataset.categoryLabel || "").toUpperCase();
        }

        if (counter) {
            counter.textContent =
                `${String(currentIndex + 1).padStart(2, "0")} / ${String(visibleButtons.length).padStart(2, "0")}`;
        }
    }

    function openLightbox(button) {
        updateVisibleImages();
        currentIndex = visibleButtons.indexOf(button);

        if (currentIndex === -1) return;

        showImage();
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function nextImage() {
        if (!visibleButtons.length) return;
        currentIndex = (currentIndex + 1) % visibleButtons.length;
        showImage();
    }

    function previousImage() {
        if (!visibleButtons.length) return;
        currentIndex =
            (currentIndex - 1 + visibleButtons.length) % visibleButtons.length;
        showImage();
    }

    // Open a photograph when its button is clicked
    imageButtons.forEach(button => {
        button.addEventListener("click", () => openLightbox(button));
    });

    // Filter photographs
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.filter;

            filterButtons.forEach(filter =>
                filter.classList.remove("active")
            );
            button.classList.add("active");

            galleryItems.forEach(item => {
                const matches =
                    category === "all" ||
                    item.dataset.category === category;

                item.style.display = matches ? "" : "none";
            });

            updateVisibleImages();
        });
    });

    closeButton.addEventListener("click", closeLightbox);
    nextButton.addEventListener("click", nextImage);
    prevButton.addEventListener("click", previousImage);

    // Close when clicking the dark background
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeLightbox();
    });

    // Keyboard controls
    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("open")) return;

        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") nextImage();
        if (event.key === "ArrowLeft") previousImage();
    });

    updateVisibleImages();
});
