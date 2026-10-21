import { createMessage } from "./data.js";
import { loadMessages, saveMessages } from "./storage.js";
import { renderMessages } from "./render.js";
import { initSlider } from "./slider.js";

function initContactMessages() {
    const form = document.querySelector("#contact-form");
    const nameInput = document.querySelector("#contact-name");
    const emailInput = document.querySelector("#contact-email");
    const dateInput = document.querySelector("#contact-date");
    const messageHeading = document.querySelector("#message-heading");
    const messageInput = document.querySelector("#message-box");
    const formMessage = document.querySelector("#contact-form-message");
    const searchInput = document.querySelector("#contact-search-input");
    const clearSearchButton = document.querySelector("#clear-contact-search");
    const listElement = document.querySelector(".contact__list");
    const listStatus = document.querySelector("#contact-list-status");
    const storageMessage = document.querySelector("#contact-storage-message");
    const emailField = document.querySelector("#email-field");
    const dateField = document.querySelector("#date-field");

    if (
        !form ||
        !nameInput ||
        !emailInput ||
        !dateInput ||
        !messageHeading ||
        !messageInput ||
        !formMessage ||
        !searchInput ||
        !clearSearchButton ||
        !listElement ||
        !listStatus ||
        !storageMessage
    ) {
        return;
    }

    const loaded = loadMessages();
    let messages = loaded.messages;
    storageMessage.textContent = loaded.warning;

    function render() {
        renderMessages({
            messages,
            listElement,
            statusElement: listStatus,
            query: searchInput.value
        });
    }

    function persist() {
        const result = saveMessages(messages);
        storageMessage.textContent = result.message;
    }

    function updateMeetingInputs() {
        const selectedType = form.querySelector(
            'input[name="contact_opt"]:checked'
        )?.value;

        const isMeeting = selectedType === "meeting";

        emailField.hidden = !isMeeting;
        emailInput.required = isMeeting;
        dateField.hidden = !isMeeting;
        dateInput.required = isMeeting;

        if (!isMeeting) {
            dateInput.value = "";
        }
    }

    form.querySelectorAll('input[name="contact_opt"]')
        .forEach((radio) => {
            radio.addEventListener("change", updateMeetingInputs);
        });

    updateMeetingInputs();

    function updateMessageRequirement() {
        const selectedType = form.querySelector(
            'input[name="contact_opt"]:checked'
        )?.value;

        messageInput.required = selectedType === "idea";

        messageHeading.textContent =
            selectedType === "idea" ? "What's your idea?*" : "Message";
    }

    form.querySelectorAll('input[name="contact_opt"]').forEach(radio => {
        radio.addEventListener("change", updateMessageRequirement);
    });

    updateMessageRequirement();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const date = dateInput.value;
        const message = messageInput.value.trim();
        const selectedType = form.querySelector(
            'input[name="contact_opt"]:checked'
        )?.value;

        if (selectedType === "idea" && !message) {
            formMessage.textContent = "Please enter a valid idea.";
            messageInput.focus();
            return;
        }

        if (!selectedType || (selectedType === "meeting" && (!date || !email))) {
            formMessage.textContent = "Please complete all required fields.";
            return;
        }

        const newMessage = createMessage({
            name,
            email,
            date,
            message,
            type: selectedType
        });

        messages.push(newMessage);

        persist();

        form.reset();
        formMessage.textContent = "Your message was added successfully.";

        render();
    });

    form.addEventListener("input", () => {
        formMessage.textContent = "";
    });

    form.addEventListener("change", () => {
        formMessage.textContent = "";
    });

    searchInput.addEventListener("input", render);

    clearSearchButton.addEventListener("click", () => {
        searchInput.value = "";
        render();
        searchInput.focus();
    });

    listElement.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const button = target.closest(
            'button[data-action="delete"]'
        );

        if (!button || !listElement.contains(button)) {
            return;
        }

        const id = button.dataset.id;

        if (!messages.some((message) => message.id === id)) {
            return;
        }

        messages = messages.filter(
            (message) => message.id !== id
        );

        persist();
        render();
    });

    render();
}

initContactMessages();
initSlider();