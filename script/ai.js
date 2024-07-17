const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['ai'],
  description: "AI",
  usage: "ai [prompt]",
  credits: 'churchill',
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
    api.sendMessage('🤖 𝐆𝐏𝐓𝟒 𝐂𝐎𝐍𝐓𝐈𝐍𝐔𝐄𝐒𝐒𝐒 𝐀𝐍𝐒𝐖𝐄𝐑𝐈𝐍𝐆𝐆 𝐏𝐋𝐒𝐒 𝐖𝐀𝐈𝐓...', event.threadID, (err, info) => {
      resolve(info);
    });
  });

  const apiUrl = `https://markdevs69-1efde24ed4ea.herokuapp.com/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${encodeURIComponent(userID)}`;

  try {
    const hot = await axios.get(apiUrl);
    const result = hot.data;
    const aiResponse = result.gpt4;
    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

    api.getUserInfo(event.senderID, async (err, ret) => {
      if (err) {
        console.error('Error fetching user info:', err);
        await api.editMessage('Error fetching user info.', chill.messageID);
        return;
      }

      const userName = ret[event.senderID].name;
      const formattedResponse = `🤖 𝐆𝐏𝐓𝟒+ 𝐂𝐎𝐍𝐓𝐈𝐍𝐔𝐄𝐒 𝐀𝐈\n━━━━━━━━━━━━━━━━━━\n${aiResponse}\n━━━━━━━━━━━━━━━━━━\n🗣 Asked by: ${userName}\n⏰ 𝑅𝑒𝑠𝑝𝑜𝑛𝑑 𝑇𝑖𝑚𝑒: ${responseTime}`;

      try {
        await api.editMessage(formattedResponse, chill.messageID);
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
