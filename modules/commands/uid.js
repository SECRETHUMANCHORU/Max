const fs = require('fs');
const path = require('path');
const request = require('request');  // 
module.exports.config = {
    name: "uid",
    version: "30.0.0",
    hasPermission: 0,
    credits: "Choru TikTokers",
    description: "fbid details from Facebook.",
    commandCategory: "System",
    cooldown: 5
};

module.exports.run = async ({ api, event, args }) => {
    try {
      //const botId = api.getCurrentUserID();
      
      
      if (event.type == "message_reply") { 
	uid = event.messageReply.senderID
	return api.sendMessage(`${uid}`, event.threadID, event.messageID) 
}
      
      
        let targetID = `${args.join(" ") || event.senderID}`; 
        if (Object.keys(event.mentions).length > 0) {
            targetID = Object.keys(event.mentions)[0]; 
        }
        
      
        const userMapping = await api.getUserInfo(targetID);
        const userInfo = userMapping[targetID];
        

          if (userInfo) {
          const selfID = api.getCurrentUserID()
            const formattedInfo = `UID: ${userInfo.uid}`;

            api.sendMessage(formattedInfo, event.threadID);
        } else {
            api.sendMessage("Couldn't fetch user information.", event.threadID);
        }
    } catch (err) {
        api.sendMessage("An error occurred while fetching user info.", event.threadID);
    }
};
