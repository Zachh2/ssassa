const axios = require("axios");

module.exports.config = {
    name: "ai2",
    version: "1.0.0",
    credits: "chill",
    description: "Interact with Llama AI",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["llama"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let q = args.join(" ");
        if (!q) {
            return api.sendMessage("[ ❗ ] - Missing question for the ai2", event.threadID, event.messageID);
        }

        const initialMessage = await api.sendMessage("Answering plss wait...", event.threadID);

        try {
            const response = await axios.get(`https://joshweb.click/ai/llama-3-8b?q=${encodeURIComponent(q)}&uid=100`);
            const answer = response.data.result;

            // Deleting the initial message
            api.deleteMessage(initialMessage.messageID, (err) => {
                if (err) {
                    console.error("Failed to delete initial message:", err);
                } else {
                    // Sending the response message
                    api.sendMessage(`👾 Iᒪᒪᗰᗩ\n━━━━━━━━━━━━━━━━━━\n${answer}\n━━━━━━━━━━━━━━━━━━`, event.threadID);
                }
            });
        } catch (error) {
            console.error(error);
            api.deleteMessage(initialMessage.messageID, (err) => {
                if (err) {
                    console.error("Failed to delete initial message:", err);
                } else {
                    api.sendMessage("An error occurred while processing your request.", event.threadID);
                }
            });
        }
    } catch (error) {
        console.error("Error in lma command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
