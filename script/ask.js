module.exports.config = {
    name: "ask",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "ask the Jailbreak AI",
    hasPrefix: false,
    aliases: ["ask"],
    usage: "[ask <askquestion>]",
    cooldown: 5
};

const axios = require("axios");

module.exports.run = async function({ api, event, args }) {
    try {
        const query = args.join(" ");
        if (!query) {
            api.sendMessage("Usage: ask <question>", event.threadID);
            return;
        }

        api.sendMessage("🔍 | Asking Jailbreak AI, please wait...", event.threadID);

        const response = await axios.get(`https://hiroshi-rest-api.replit.app/ai/jailbreak?ask=${encodeURIComponent(query)}`);
        
        if (response.data && response.data.response) {
            const answer = response.data.response;
            api.sendMessage(`🔓 | Jailbreak AI says: ${answer}`, event.threadID);
        } else {
            api.sendMessage("No answer found, please try again later.", event.threadID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
