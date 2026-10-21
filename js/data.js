const validTypes = new Set(["hello", "meeting", "idea"]);

export function createMessage({
    name,
    email,
    date,
    message,
    type
}) {
    const id =
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return {
        id,
        name: name.trim(),
        email: email.trim(),
        date,
        message: message.trim(),
        type
    };
}

export function filterMessages(messages, query) {
    const searchText = query.trim().toLocaleLowerCase();

    if (!searchText) {
        return messages;
    }

    return messages.filter((item) => {
        const searchableText = [
            item.name,
            item.email,
            item.date,
            item.message,
            item.type
        ].join(" ").toLocaleLowerCase();

        return searchableText.includes(searchText);
    });
}

export function isValidSavedMessages(value) {
    if (!Array.isArray(value)) {
        return false;
    }

    const ids = new Set();

    for (const item of value) {
        if (
            item === null ||
            typeof item !== "object" ||
            Array.isArray(item) ||
            typeof item.id !== "string" ||
            !item.id.trim() ||
            typeof item.name !== "string" ||
            typeof item.email !== "string" ||
            typeof item.date !== "string" ||
            typeof item.message !== "string" ||
            !item.message.trim() ||
            !validTypes.has(item.type)
        ) {
            return false;
        }

        if (ids.has(item.id)) {
            return false;
        }

        ids.add(item.id);
    }

    return true;
}