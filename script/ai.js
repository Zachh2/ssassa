const axios = require('axios');
const moment = require('moment-timezone');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usage: "Ai [promot]",
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
 const timeString = moment.tz('Asia/Manila').format('LLL');
  const input = args.join(' ');


  
  if (!input) {
    api.shareContact(`Hello im Artifical Intelligence, please provide a question.`,api.getCurrentUserID(), event.threadID, event.messageID);
    return;
  }
  api.setMessageReaction("⏳", event.messageID, (err) => {
  }, true);
api.sendTypingIndicator(event.threadID, true);

  api.sendMessage(`🔍𝙎𝙚𝙖𝙧𝙘𝙝𝙞𝙣𝙜 𝙋𝙡𝙚𝙖𝙨𝙚 𝙒𝙖𝙞𝙩....
━━━━━━━━━━━━━━━━━━\n\n "${input}"`,event.threadID, event.messageID);
  
  try {
    const { data } = await axios.get(`https://openaikey-x20f.onrender.com/api?prompt=${encodeURIComponent(input)}`);
    let response = data.response;
    response += `\n\n${timeString}`;
    api.sendMessage(response, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
