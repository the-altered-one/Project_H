import { filterMessages } from "./data.js";

export function renderMessages({
    messages,
    listElement,
    statusElement,
    query
}) {
    const listSection = document.querySelector("#messages-list");
    listElement.replaceChildren();
    const emptyListLogo = document.querySelector("#empty-list-logo");

    if (listSection) {
        listSection.hidden = messages.length === 0;
    }

    if (emptyListLogo) {
        emptyListLogo.hidden = messages.length !== 0;
    }

    const visibleMessages = filterMessages(messages, query);

    if (visibleMessages.length === 0) {
        statusElement.textContent =
            `No messages match your search (total of ${messages.length} scanned).`;
        return;
    }
    
    statusElement.textContent =
        `Showing ${visibleMessages.length} of ${messages.length} messages.`;

    for (const message of visibleMessages) {
        const details = document.createElement("p");
        const body = document.createElement("p");

        const item = document.createElement("li");
        item.className = "contact__item";

        const heading = document.createElement("h3");
        if (message.type === "hello") {
            heading.textContent =
                `${message.name || "Anonymous"} says hello to everyone!`
            
            body.textContent = message.message;
        } else if (message.type === "meeting") {
            heading.textContent =
                `${message.name || "Anonymous"} has set up a meeting!`
            
            details.textContent = `Email: ${message.email} | Date: ${message.date}`;
            body.textContent = message.message;
        } else {
            heading.textContent =
                `${message.name || "Anonymous"} has given us an idea!`;

            body.textContent = message.message;
        }

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = message.id;
        deleteButton.setAttribute(
            "aria-label",
            `Delete message from ${message.name || "Anonymous"}`
        );

        item.append(heading, details, body, deleteButton);
        listElement.append(item);
    }
}