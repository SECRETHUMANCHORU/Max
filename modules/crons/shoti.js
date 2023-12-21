const fs = require('fs');
const request = require('request');
const axios = require('axios');

module.exports.config = {
    name: "shoti",
    schedule: "1 hours",
    version: "30.0.0",
    credits: "Choru Tikrokers",
    description: "Shoti Schedule"
};

module.exports.create = {
    cron: {
        config: {
            owner: "Choru TikTokers",
            description: `how to set time in scheduled, The schedule: 1 hours, you can change that to 1 hour It can be done in 1 minutes, 1 hours, 1 months, 1 year`
        }
    }
};//dont change owner/description


module.exports.onLoad = ({ api }) => {
    api.getThreadList(30, null, ["INBOX"], async (err, list) => { 
        if (err) return console.log("ERR: "+err);
        list.forEach(async (now) => { 
            if (now.isGroup == true && now.threadID != list.threadID) {
                const response = await axios.get("https://shoti-api.libyzxy0.repl.co/api/get-shoti?apikey=shoti-1h7ccntg3mgjvqi8hso");
                const { username, nickname, id: userId } = response.data.user;

                const link = response.data.data.play;

                var callback = () => {
                    api.sendMessage({
                        body: `Every ${this.config.schedule}\nUser Info:\nUsername: ${username}\nNickname: ${nickname}\nUser ID: ${userId}`, 
                        attachment: fs.createReadStream(__dirname + "/cache/shoti.mp4")
                    }, now.threadID, () => fs.unlinkSync(__dirname + "/cache/shoti.mp4"));
                };

                if (!fs.existsSync(__dirname + "/cache")) {
                    fs.mkdirSync(__dirname + "/cache");
                }

                if (!fs.existsSync(__dirname + "/cache/shoti.mp4")) {
                    var file = fs.openSync(__dirname + "/cache/shoti.mp4", 'w');
                    fs.closeSync(file);
                }

                var stream = request(encodeURI(link))
                    .pipe(fs.createWriteStream(__dirname+"/cache/shoti.mp4"));
                stream.on("finish", callback);
            }
        });
    });
};
