const axios = require('axios');

module.exports.config = {
  name: "claude",
  role: 0,
  credits: "chill",
  description: "claude ml",
  hasPrefix: false,
  version: "1.0.0",
  aliases: ["claude"],
  usage: "claude [question]"
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(" ");

  if (!question) {
    return api.sendMessage('Please provide a question.', event.threadID, event.messageID);
  }

  api.sendMessage('Asking Claude your question, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://hiroshi-rest-api.replit.app/ai/claude?ask=${encodeURIComponent(question)}`);
    const answer = response.data.response;

    api.sendMessage(`🧠 𝐶𝐿𝐴𝑈𝐷𝐸 𝐴𝐼\n━━━━━━━━━━━━━━━━━━\n${answer}\n━━━━━━━━━━━━━━━━━━`, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage('❌ | An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
