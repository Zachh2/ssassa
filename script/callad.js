async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.config = {
  name: "callad",
  version: "1.0.1",
  role: 0,
  credits: "Cliff",
  description: "Report bot's error to admin or comment",
  hasPrefix: false,
  commandCategory: "report",
  usages: "[Error encountered or comments]",
  cooldowns: 5
};

module.exports.handleReply = async function({ api, args, event, Utils, admin }) {
  var i = await getUserName(api, event.senderID);
  switch (event.MessageReply.senderID.type) {
    case "reply":
      var t = admin;
      for (let n of t) {
        api.sendMessage({
          body: "📄Feedback from " + i + ":\n" + event.body,
          mentions: [{ id: event.senderID, tag: i }]
        }, n, (err, message) => {
          if (!err) {
           event.messageReply.senderID({
              name: module.exports.config.name,
              messageID: message.messageID,
              messID: event.messageID,
              author: event.senderID,
              id: event.threadID,
              type: "calladmin"
            });
          }
        });
      }
      break;
    case "calladmin":
      api.sendMessage({
        body: `📌Feedback from admin ${i} to you:\n--------\n${event.body}\n--------\n»💬Reply to this message to continue sending reports to admin`,
        mentions: [{ tag: i, id: event.senderID }]
      }, event.threadID, (err, message) => {
        if (!err) {
          event.messageReply.senderID({
            name: module.exports.config.name,
            author: event.senderID,
            messageID: message.messageID,
          });
        }
      });
      break;
  }
};

module.exports.run = async function({ api, event, args, Utils, admin }) {
  if (!args[0]) return api.sendMessage("You have not entered the content to report", event.threadID, event.messageID);

  const name = await getUserName(api, event.senderID);
  let mentions = [];
    mentions.push({
        tag: name,
        id: event.senderID,
    });
  var t = event.senderID,
      d = event.threadID;
  let threadInfo = await api.getThreadInfo(event.threadID);
  var l = require("moment-timezone").tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");

  api.sendMessage(`At: ${l}\nYour report has been sent to the bot admins`, event.threadID, () => {
    var s = admin;
    for (let o of s) {
      let s = threadInfo.threadName || "Unnamed";
      api.shareContact(`▱▱▱[𝗖𝗔𝗟𝗟 𝗔𝗗𝗠𝗜𝗡]▱▱▱\n\n- User Name: ${name}\n- User ID: ${t}\n- Sent from group: ${threadInfo.threadName}\n- Thread ID: ${d}\n\nContent:\n─────────────────\n${args.join(" ")}\n─────────────────\nTime: ${l}`, t, o, (err, message) => {
        if (!err) {
          event.messageReply.senderID({
            name: this.config.name,
            messageID: message.messageID,
            author: event.senderID,
            messID: event.messageID,
            id: d,
          });
        }
      });
    }
  });
};
