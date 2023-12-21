module.exports.config = {
	name: "rankup",
	version: "30.0.0",
	hasPermssion: 2,
	credits: "Choru Tiktokers",
	description: "Announce rankup for each group, user",
	commandCategory: "Edit-IMG",
	dependencies: {
		"fs-extra": ""
	},
	cooldowns: 2,
};

module.exports.handleEvent = async function({ api, event, Currencies, Users, getText }) {
    var { threadID, senderID } = event;
    const { createReadStream } = require("fs-extra");
    const { createCanvas } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    const request = require("request"); // Added
    const pathImg = __dirname + "/noprefix/rankup/rankup.jpeg";
    var id1 = event.senderID;

    threadID = String(threadID);
    senderID = String(senderID);

    const thread = global.data.threadData.get(threadID) || {};

    let exp = (await Currencies.getData(senderID)).exp;
    exp = exp += 1;

    if (isNaN(exp)) return;

    if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
        await Currencies.setData(senderID, { exp });
        return;
    }

    const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
    const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

    if (level > curLevel && level != 1) {
        const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
        let { threadName, participantIDs, imageSrc } = await api.getThreadInfo(event.threadID);
        var message = (typeof thread.customRankup == "undefined") ? getText("levelup") : thread.customRankup;

        message = message
            .replace(/\{name}/g, name)
            .replace(/\{level}/g, level);

        const moduleName = this.config.name;

        const imageUrl = await new Promise((resolve, reject) => {
            const url = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            request(url, { followRedirect: false }, (err, res) => {
                if (err) reject(err);
                resolve(res.headers.location);
            });
        });

        const encodedImageUrl = encodeURIComponent(imageUrl);
        const gifUrl = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/rankup?word=${name.substring(0, 8)}&fbid=${encodedImageUrl}&wc=${threadName.substring(0, 8)}&level=${level}&fullname=${name}&link=https://www.facebook.com/profile.php?id=${senderID}`;
        const gifBuffer = (await axios.get(gifUrl, { responseType: "arraybuffer" })).data;

        fs.writeFileSync(pathImg, Buffer.from(gifBuffer, "utf-8"));

        api.sendMessage({
            body: message,
            mentions: [{ tag: name, id: senderID }],
            attachment: fs.createReadStream(pathImg)
        }, event.threadID, () => fs.unlinkSync(pathImg));
    }

    await Currencies.setData(senderID, { exp });
    return;
};

module.exports.languages = {
	"vi": {
		"off": "𝗧𝗮̆́𝘁",
		"on": "𝗕𝗮̣̂𝘁",
		"successText": "𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐭𝐡𝐨̂𝐧𝐠 𝐛𝐚́𝐨 𝐫𝐚𝐧𝐤𝐮𝐩 ✨",
		"levelup": "{name}, Ang iyong ka astigan ay tumaas ng {level} Levels"
	},
	"en": {
		"on": "on",
		"off": "off",
		"successText": "success notification rankup!",
		"levelup": ">{name}, Ang iyong ka-astigan ay tumaas ng Level {level}.",
	}
};

module.exports.run = async function({ api, event, Threads, getText, Currencies, args }) {
    const { threadID, messageID, senderID } = event;

    switch (args[0]) {
        case "level": {
            const { createReadStream } = require("fs-extra");
            const fs = require("fs-extra");
            const axios = require("axios");
            const request = require("request"); 
            const pathImg = __dirname + "/noprefix/rankup/rankup.jpeg";

            let exp = (await Currencies.getData(senderID)).exp;
            const level = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));

            const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
            let { threadName } = await api.getThreadInfo(event.threadID);

            const imageUrl = await new Promise((resolve, reject) => {
                const url = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                request(url, { followRedirect: false }, (err, res) => {
                    if (err) reject(err);
                    resolve(res.headers.location);
                });
            });

            const encodedImageUrl = encodeURIComponent(imageUrl);
            const gifUrl = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/rankup?word=${name.substring(0, 8)}&fbid=${encodedImageUrl}&wc=${threadName.substring(0, 8)}&level=${level}&fullname=${name}&link=https://www.facebook.com/profile.php?id=${senderID}`;
            const gifBuffer = (await axios.get(gifUrl, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(pathImg, Buffer.from(gifBuffer, "utf-8"));

            api.sendMessage({
                body: `Your current level is: ${level}`,
                attachment: fs.createReadStream(pathImg)
            }, threadID, messageID, () => fs.unlinkSync(pathImg));
            return;
        }

    

        default: {
            let data = (await Threads.getData(threadID)).data;

            if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
            else data["rankup"] = false;

            await Threads.setData(threadID, { data });
            global.data.threadData.set(threadID, data);
            return api.sendMessage(`${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
        }
    }
};
