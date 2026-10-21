export function initSlider(
    root = document.querySelector(".block.testimonials")
) {
    if (!root || root.dataset.sliderInitialized === "true") {
        return;
    }

    const viewport = root.querySelector(".testimonials__cases");
    const conveyer = root.querySelector(".cases__conveyer");
    const footer = root.querySelector(".testimonials__footer");

    const cards = Array.from(
        conveyer?.querySelectorAll(":scope > .conveyer__card") ?? []
    );

    const arrows = footer?.querySelectorAll(":scope > a") ?? [];
    const iconsContainer = footer?.querySelector(".footer__icons");

    if (
        !viewport ||
        !conveyer ||
        cards.length === 0 ||
        arrows.length < 2
    ) {
        return;
    }

    const previousButton = arrows[0];
    const nextButton = arrows[1];
    const hasClones = cards.length > 1;

    if (hasClones) {
        const lastClone = cards[cards.length - 1].cloneNode(true);
        const firstClone = cards[0].cloneNode(true);

        lastClone.setAttribute("aria-hidden", "true");
        firstClone.setAttribute("aria-hidden", "true");

        lastClone.dataset.sliderClone = "true";
        firstClone.dataset.sliderClone = "true";

        conveyer.prepend(lastClone);
        conveyer.append(firstClone);
    }

    const slides = Array.from(
        conveyer.querySelectorAll(":scope > .conveyer__card")
    );

    let indicators = [];

    if (iconsContainer) {
        const firstIconSrc =
            iconsContainer.querySelector("img")?.getAttribute("src") ?? "";

        const slashIndex = firstIconSrc.lastIndexOf("/");
        const iconDirectory = slashIndex >= 0
            ? firstIconSrc.slice(0, slashIndex + 1)
            : "assets/testimonials/";

        iconsContainer.replaceChildren();

        for (let i = 0; i < cards.length; i++) {
            const icon = document.createElement("img");

            icon.src = `${iconDirectory}${
                i === 0 ? "active.png" : "inactive.png"
            }`;

            icon.alt = `Go to testimonial ${i + 1}`;
            icon.setAttribute("role", "button");
            icon.setAttribute("tabindex", "0");
            icon.setAttribute("aria-label", `Show testimonial ${i + 1}`);
            icon.setAttribute("aria-pressed", String(i === 0));

            iconsContainer.append(icon);
        }

        indicators = Array.from(
            iconsContainer.querySelectorAll("img")
        );
    }

    let currentIndex = hasClones ? 1 : 0;

    function getLogicalIndex() {
        if (!hasClones) {
            return currentIndex;
        }

        return (
            (currentIndex - 1 + cards.length) % cards.length
        );
    }

    function updateSlider(animate = true) {
        const activeSlide = slides[currentIndex];

        if (!activeSlide) {
            return;
        }

        if (!animate) {
            conveyer.style.transition = "none";
        }

        const slideCenter =
            activeSlide.offsetLeft + activeSlide.offsetWidth / 2;

        const offset = viewport.clientWidth / 2 - slideCenter;

        conveyer.style.transform = `translateX(${offset}px)`;

        const activeLogicalIndex = getLogicalIndex();

        indicators.forEach((indicator, index) => {
            const active = index === activeLogicalIndex;

            indicator.src = indicator.src.replace(
                /(?:active|inactive)\.png$/,
                active ? "active.png" : "inactive.png"
            );

            indicator.setAttribute("aria-pressed", String(active));
        });

        if (!animate) {
            conveyer.getBoundingClientRect();
            conveyer.style.transition = "";
        }
    }

    function move(direction) {
        if (cards.length < 2) {
            return;
        }

        currentIndex += direction;
        updateSlider();
    }

    function goToSlide(targetIndex) {
        if (cards.length < 2) {
            return;
        }

        const currentLogicalIndex = getLogicalIndex();
        let difference = targetIndex - currentLogicalIndex;

        if (difference > cards.length / 2) {
            difference -= cards.length;
        } else if (difference < -cards.length / 2) {
            difference += cards.length;
        }

        if (difference === 0) {
            return;
        }

        currentIndex += difference;
        updateSlider();
    }

    previousButton.addEventListener("click", event => {
        event.preventDefault();
        move(-1);
    });

    nextButton.addEventListener("click", event => {
        event.preventDefault();
        move(1);
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
            goToSlide(index);
        });

        indicator.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goToSlide(index);
            }
        });
    });

    conveyer.addEventListener("transitionend", event => {
        if (event.target !== conveyer || event.propertyName !== "transform") {
            return;
        }

        if (!hasClones) {
            return;
        }

        if (currentIndex === 0) {
            currentIndex = cards.length;
            updateSlider(false);
        } else if (currentIndex === cards.length + 1) {
            currentIndex = 1;
            updateSlider(false);
        }
    });

    window.addEventListener("resize", () => updateSlider(false));

    root.dataset.sliderInitialized = "true";

    updateSlider(false);
}
