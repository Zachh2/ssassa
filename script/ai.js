const axios = require('axios');

module.exports.config = {
  name: 'ericson',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['ericson'],
  description: "AI",
  usage: "ericdon [prompt]",
  credits: 'ericson',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(" ");
  const userID = "100";

  if (!prompt) {
    api.sendMessage('Please provide a question ex: ai what is n1gga?', event.threadID, event.messageID);
    return;
  }

  const chill = await new Promise(resolve => {
    api.sendMessage('🤖 ERICSON 𝘈𝘕𝘚𝘞𝘌𝘙𝘐𝘕𝘎...', event.threadID, (err, info) => {
      if (err) {
        console.error('Error sending message:', err);
        return;
      }
      api.setMessageReaction("⏳", info.messageID, (err) => {
        if (err) console.error('Error setting reaction:', err);
      });
      resolve(info);
    });
  });

  const apiUrl = `https://markdevs-last-api-as2j.onrender.com/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${encodeURIComponent(userID)}`;

  try {
    const startTime = Date.now();
    const hot = await axios.get(apiUrl);
    const result = hot.data;
    const aiResponse = result.gpt4;
    const endTime = Date.now();
    const responseTime = ((endTime - startTime) / 1000).toFixed(2);

    api.getUserInfo(event.senderID, async (err, ret) => {
      if (err) {
        console.error('Error fetching user info:', err);
        await api.editMessage('Error fetching user info.', chill.messageID);
        return;
      }

      const userName = ret[event.senderID].name;
      const formattedResponse = `🤖 ERICSON 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴𝚂 𝙰𝙸
━━━━━━━━━━━━━━━━━━
${aiResponse}
━━━━━━━━━━━━━━━━━━
🗣 Asked by: ${userName}
⏰ Respond Time: ${responseTime}s
━━━━━━━━━━━━━━━━━━
𝙸𝚏 𝚎𝚛𝚛𝚘𝚛 𝚃𝚛𝚢 𝚄𝚜𝚎 "𝙶𝙿𝚃4" 𝙲𝙼𝙳`;

      try {
        await api.editMessage(formattedResponse, chill.messageID);
        api.setMessageReaction("✅", chill.messageID, (err) => {
          if (err) console.error('Error setting reaction:', err);
        });
      } catch (error) {
        console.error('Error editing message:', error);
        api.sendMessage('Error editing message: ' + error.message, event.threadID, event.messageID);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    await api.editMessage('Error: ' + error.message, chill.messageID);
  }
};
