const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "slap",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Slap a user using the Batman slap meme",
    hasPrefix: false,
    aliases: ["slap"],
    usage: "[slap <mention>]",
    cooldown: 5
};

module.exports.run = async function({ api, event }) {
    try {
        const mentions = Object.keys(event.mentions);
        if (mentions.length < 1) {
            return api.sendMessage("Please mention a user to be slapped.", event.threadID);
        }

        const batmanId = event.senderID; // ID of the sender (Batman)
        const robinId = mentions[0]; // ID of the mentioned user (Robin)

        const apiUrl = `https://hiroshi-rest-api.replit.app/canvas/batmanslap?batman=${batmanId}&robin=${robinId}`;

        api.sendMessage("Slaping... please wait...", event.threadID);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const slapImagePath = path.join(__dirname, "batmanSlap.png");

        fs.writeFileSync(slapImagePath, response.data);

        // Get user info for the sender
        api.getUserInfo(batmanId, (err, ret) => {
            if (err) {
                api.sendMessage("An error occurred while fetching user info.", event.threadID);
                return;
            }

            const batmanName = ret[batmanId].name;

            api.sendMessage({
                body: `${event.mentions[robinId]} has been slapped by ${batmanName}!`,
                mentions: [
                    { tag: event.mentions[robinId], id: robinId }
                ],
                attachment: fs.createReadStream(slapImagePath)
            }, event.threadID, () => {
                fs.unlinkSync(slapImagePath);
            });
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
