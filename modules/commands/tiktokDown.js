const TiktokDown = require('../../package-modules/tiktokdown');
const fs = require('fs');
const request = require('request');
const path = require('path');

module.exports.config = {
    name: "Tiktok",
    version: "30.0.0",
    hasPermission: 0,
    credits: "Choru Tiktokers",
    description: "Tiktok downloader video link",
    commandCategory: "video",
    usages: "tiktok link",
    cooldowns: 0
};
module.exports.run = async ({ api, event, args }) => {
  const link = args.join(" ");

  if (!link) {
    return api.sendMessage(
      "[!] Need a TikTok link to proceed",
      event.threadID,
      event.messageID
    );
  }

  const tiktokDownloader = new TiktokDown();
  const result = await tiktokDownloader.download(link);

  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  const downloadAndSend = () => {
    const filePath = path.join(cacheDir, 'nown.mp4');
    request(result.tikwn.nowm)
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => {
        api.sendMessage(
          {
            body: `Ssstik:\nYou can download it in chrome:\n Link: ${result.ssstik.url}\n Session: ${result.ssstik.session}\n\n Video info\nAuthor: ${result.ssstik.authorNickname}\nAuthorUniqueID: ${result.ssstik.authorUniqueId}\nVideoTitle: ${result.ssstik.videoTitle}\nPlayed by: ${result.ssstik.play}\nLiked by: ${result.ssstik.digg}\nDuration: ${result.ssstik.duration}`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
  };

  downloadAndSend();
};
