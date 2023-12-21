module.exports.config = {
	name: "sim",
	version: "1.0",
	hasPermssion: 0,
	credits: "Choru",
	description: "Simsimi chatbot",
	commandCategory: "Chatbot",
	usages: "sim [text]",
	cooldowns: 5
};

module.exports.run = async ({ api, event,args }) => {
const axios = global.nodemodule["axios"];
let ask = args.join(" ");
const res = await axios.get(`https://funsimsimiasking.nextgen0.repl.co/api/sim?ask=${ask}`);
var sim = res.data.result;
return api.sendMessage(`${sim}`, event.threadID, event.messageID)
}
