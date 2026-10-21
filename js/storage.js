
const STORAGE_KEY = "contact-messages-v1";

export function loadMessages() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData === null) {
            return {
                messages: [],
                warning: ""
            };
        }

        const parsedData = JSON.parse(savedData);

        if (!Array.isArray(parsedData)) {
            return {
                messages: [],
                warning: "Saved messages have an invalid format."
            };
        }

        return {
            messages: parsedData,
            warning: ""
        };
    } catch (error) {
        console.error("Could not load saved messages:", error);

        return {
            messages: [],
            warning: "Could not load saved messages. Check browser storage."
        };
    }
}

export function saveMessages(messages) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(messages)
        );

        return {
            ok: true,
            message: ""
        };
    } catch (error) {
        console.error("Could not save messages:", error);

        return {
            ok: false,
            message: "Could not save messages. Check browser storage settings."
        };
    }
}
