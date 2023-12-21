const opti = require('./utils/options');
const optis = require('./opinion-console.json');

const {
    spawn
} = require("child_process");
const { writeFile } = require('fs-extra');
const {
    readFileSync
} = require("fs-extra");
const fse = require('fs-extra');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const request = require('request');
const path = require('path');
const express = require('express');
const app = express();
const port = optis.seconds;
app.set('json spaces', 4);
const cron = require('node-cron');
const moment = require('moment-timezone');
const xv = require('xvideos-scraper');
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
const Monitor = require('ping-monitor');
const { Table } = require('console-table-printer');
const { exec } = require("child_process");

const chalkAnimation = require('chalkercli');
const p = new Table();
p.addRow({
    Name: 'Choru', Age: 15, Owner: 'Botpack', Original: "MiraiTeam"
}, {
    color: 'red'
});
p.printTable();

const gradient = require('gradient-string');
const crayon = gradient(['#FFA500', '#FF4500']);
const chalk = require("chalk");



const Uptime = require("./uptime");

    const urlKey = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
    const userKey = `${process.env.REPL_OWNER}`;




const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'includes', 'database', 'sim.sqlite');

if (!fs.existsSync(path.join(__dirname, 'includes', 'database'))) {
    fs.mkdirSync(path.join(__dirname, 'includes', 'database'), { recursive: true });
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        process.stderr.write(crayon('Connected to the sim database.\n'));
    }
});

app.get('/welcome', async (req, res) => {
    try {
        const cacheFolderPath = path.join(__dirname, 'cache');

        const fontFilePath = path.join(cacheFolderPath, 'Play-Bold.ttf');

        const { word, fbid, wc, fullname, link, member } = req.query;
        if (!word || !fbid || !wc || !fullname || !link || !member) 
            return res.status(400).json({ error: 'Missing data' });

        // Ensure font
        if (!await fse.pathExists(fontFilePath)) {
            const fontUrl = 'https://drive.google.com/u/0/uc?id=1a2d5TV4bnteJHNwISGjpiDyy_gA6lwiI&export=download';
            const fontData = (await axios.get(fontUrl, { responseType: 'arraybuffer' })).data;
            await fse.writeFile(fontFilePath, Buffer.from(fontData, 'utf-8'));
        }

        // Setup canvas
        const canvas = createCanvas(612, 306);
        const ctx = canvas.getContext('2d');

        // Draw background
        const bgUrls = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgwmC3d-oE2EsZpYPHyYwuSrDErS30LdIKdA&usqp=CAU"];
        const bg = bgUrls[Math.floor(Math.random() * bgUrls.length)];
        const background = await loadImage(bg);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Draw avatar
        const avatarUrl = `https://graph.facebook.com/${fbid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const avatar = await loadImage(avatarUrl);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.drawImage(avatar, 115, 100, 100, 100);
        ctx.strokeRect(115, 100, 100, 100);

        // Draw text
        registerFont(fontFilePath, { family: 'Play-Bold' });
        ctx.font = '20px Play-Bold';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`WELCOME TO ${wc.toUpperCase()}`, 400, 118);
        ctx.font = '18px Play-Bold';
        ctx.fillText(fullname, 400, 150);
        ctx.font = '13px Play-Bold';
        ctx.fillText(link, 310, 255);
        ctx.font = '18px Play-Bold';
        ctx.fillText(`MEMBER GROUP CHAT: ${member}`, 400, 210);
        ctx.font = '18px Play-Bold';
        ctx.fillText(fbid, 400, 180);

        // Send image
        const imageBuffer = canvas.toBuffer();
        const pathImg = path.join(__dirname, "cache/welcome.gif");
        await fse.writeFile(pathImg, imageBuffer);
        res.sendFile(pathImg);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.get('/goodbye', async (req, res) => {
    try {
        const cacheFolderPath = path.join(__dirname, 'cache');

        const fontFilePath = path.join(cacheFolderPath, 'Play-Bold.ttf');

        const { word, fbid, wc, fullname, link, member} = req.query;
        if (!word || !fbid || !wc || !fullname || !link || !member) 
            return res.status(400).json({ error: 'Missing data' });

        // Ensure font
        if (!await fse.pathExists(fontFilePath)) {
            const fontUrl = 'https://drive.google.com/u/0/uc?id=1a2d5TV4bnteJHNwISGjpiDyy_gA6lwiI&export=download';
            const fontData = (await axios.get(fontUrl, { responseType: 'arraybuffer' })).data;
            await fse.writeFile(fontFilePath, Buffer.from(fontData, 'utf-8'));
        }

        // Setup canvas
        const canvas = createCanvas(612, 306);
        const ctx = canvas.getContext('2d');

        // Draw background
        const bgUrls = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThC-gQBvcqvYU7mf0z5YQ3AC9FJGTk8E5hSg&usqp=CAU"];
        const bg = bgUrls[Math.floor(Math.random() * bgUrls.length)];
        const background = await loadImage(bg);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Draw avatar
        const avatarUrl = `https://graph.facebook.com/${fbid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const avatar = await loadImage(avatarUrl);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.drawImage(avatar, 115, 100, 100, 100);
        ctx.strokeRect(115, 100, 100, 100);

        // Draw text
        registerFont(fontFilePath, { family: 'Play-Bold' });
        ctx.font = '20px Play-Bold';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`GOODBYE TO ${wc.toUpperCase()}`, 400, 118);
        ctx.font = '18px Play-Bold';
        ctx.fillText(fullname, 400, 150);
        ctx.font = '13px Play-Bold';
        ctx.fillText(link, 310, 255);
        ctx.font = '18px Play-Bold';
        ctx.fillText(`MEMBER GROUP CHAT: ${member}`, 400, 210);
        ctx.font = '18px Play-Bold';
        ctx.fillText(fbid, 400, 180);
        ctx.font = '23px Play-Bold';
        ctx.fillText(`GOODBYE`, 310, 70);

        // Send image
        const imageBuffer = canvas.toBuffer();
        const pathImg = path.join(__dirname, "cache/goodbye.gif");
        await fse.writeFile(pathImg, imageBuffer);
        res.sendFile(pathImg);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.get('/rankup', async (req, res) => {
    try {
        const cacheFolderPath = path.join(__dirname, 'cache');

        const fontFilePath = path.join(cacheFolderPath, 'Play-Bold.ttf');

        const { word, fbid, wc, fullname, link, Level } = req.query;
        if (!word || !fbid || !wc || !fullname || !link || !Level) 
            return res.status(400).json({ error: 'Missing data' });

        // Ensure font
        if (!await fse.pathExists(fontFilePath)) {
            const fontUrl = 'https://drive.google.com/u/0/uc?id=1a2d5TV4bnteJHNwISGjpiDyy_gA6lwiI&export=download';
            const fontData = (await axios.get(fontUrl, { responseType: 'arraybuffer' })).data;
            await fse.writeFile(fontFilePath, Buffer.from(fontData, 'utf-8'));
        }

        // Setup canvas
        const canvas = createCanvas(612, 306);
        const ctx = canvas.getContext('2d');

        // Draw background
        const bgUrls = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ_U78es8L8PEWVTWvu_9XbOhHaDrp8XS3BQ&usqp=CAU"];
        const bg = bgUrls[Math.floor(Math.random() * bgUrls.length)];
        const background = await loadImage(bg);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Draw avatar
        const avatarUrl = fbid;
        const avatar = await loadImage(avatarUrl);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.drawImage(avatar, 115, 100, 100, 100);
        ctx.strokeRect(115, 100, 100, 100);

        // Draw text
        registerFont(fontFilePath, { family: 'Play-Bold' });
        ctx.font = '20px Play-Bold';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`RANKUP TO ${wc.toUpperCase()}`, 400, 118);
        ctx.font = '18px Play-Bold';
        ctx.fillText(fullname, 400, 150);
        ctx.font = '13px Play-Bold';
        ctx.fillText(link, 310, 255);
        ctx.font = '18px Play-Bold';
        ctx.fillText(`LEVEL USER: ${Level}`, 400, 210);
        ctx.font = '18px Play-Bold';
        ctx.fillText(fbid, 400, 180);
        ctx.font = '23px Play-Bold';
        ctx.fillText(`RANKUP`, 310, 70);

        // Send image
        const imageBuffer = canvas.toBuffer();
        const pathImg = path.join(__dirname, "cache/rankup.gif");
        await fse.writeFile(pathImg, imageBuffer);
        res.sendFile(pathImg);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});


  app.get('/x', async (req, res) => {
  try {
    const randomNumber = Math.floor(Math.random() * 7);
    const searchTerm = req.query.search;

    if (!searchTerm) {
      return res.status(400).send('Search term is required');
    }

    // Renamed "res" to "searchResults" to avoid shadowing
    let searchResults = await xv.searchVideo({
      search: `${searchTerm}`, 
      sort: "relevance",
      pagination: 1
    });
    
   // console.log(searchResults);

    let videoData = await xv.getVideoData({
      videoUrl: searchResults[0].video
    });

    res.json({
      all: searchResults[randomNumber]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

    app.get('/pinterest', (req, res) => {
        const search = req.query.search;

        if (!search) {
            return res.json({
                error: 'NO SEARCH'
            });
        }

        const headers = {
            'authority': 'www.pinterest.com',
            'cache-control': 'max-age=0',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            'sec-gpc': '1',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'same-origin',
            'sec-fetch-dest': 'empty',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': 'csrftoken=92c7c57416496066c4cd5a47a2448e28; g_state={"i_l":0}; _auth=1; _pinterest_sess=TWc9PSZBMEhrWHJZbHhCVW1OSzE1MW0zSkVid1o4Uk1laXRzdmNwYll3eEFQV0lDSGNRaDBPTGNNUk5JQTBhczFOM0ZJZ1ZJbEpQYlIyUmFkNzlBV2kyaDRiWTI4THFVUWhpNUpRYjR4M2dxblJCRFhESlBIaGMwbjFQWFc2NHRtL3RUcTZna1c3K0VjVTgyejFDa1VqdXQ2ZEQ3NG91L1JTRHZwZHNIcDZraEp1L0lCbkJWUytvRis2ckdrVlNTVytzOFp3ZlpTdWtCOURnbGc3SHhQOWJPTzArY3BhMVEwOTZDVzg5VDQ3S1NxYXZGUEEwOTZBR21LNC9VZXRFTkErYmtIOW9OOEU3ektvY3ZhU0hZWVcxS0VXT3dTaFpVWXNuOHhiQWdZdS9vY24wMnRvdjBGYWo4SDY3MEYwSEtBV2JxYisxMVVsV01McmpKY0VOQ3NYSUt2ZDJaWld6T0RacUd6WktITkRpZzRCaWlCTjRtVXNMcGZaNG9QcC80Ty9ZZWFjZkVGNURNZWVoNTY4elMyd2wySWhtdWFvS2dQcktqMmVUYmlNODBxT29XRWx5dWZSc1FDY0ZONlZJdE9yUGY5L0p3M1JXYkRTUDAralduQ2xxR3VTZzBveUc2Ykx3VW5CQ0FQeVo5VE8wTEVmamhwWkxwMy9SaTNlRUpoQmNQaHREbjMxRlRrOWtwTVI5MXl6cmN1K2NOTFNyU1cyMjREN1ZFSHpHY0ZCR1RocWRjVFZVWG9VcVpwbXNGdlptVzRUSkNadVc1TnlBTVNGQmFmUmtrNHNkVEhXZytLQjNUTURlZXBUMG9GZ3YwQnVNcERDak16Nlp0Tk13dmNsWG82U2xIKyt5WFhSMm1QUktYYmhYSDNhWnB3RWxTUUttQklEeGpCdE4wQlNNOVRzRXE2NkVjUDFKcndvUzNMM2pMT2dGM05WalV2QStmMC9iT055djFsYVBKZjRFTkRtMGZZcWFYSEYvNFJrYTZSbVRGOXVISER1blA5L2psdURIbkFxcTZLT3RGeGswSnRHdGNpN29KdGFlWUxtdHNpSjNXQVorTjR2NGVTZWkwPSZzd3cwOXZNV3VpZlprR0VBempKdjZqS00ybWM9; _b="AV+pPg4VpvlGtL+qN4q0j+vNT7JhUErvp+4TyMybo+d7CIZ9QFohXDj6+jQlg9uD6Zc="; _routing_id="d5da9818-8ce2-4424-ad1e-d55dfe1b9aed"; sessionFunnelEventLogged=1'
        };

        const options = {
            url: 'https://www.pinterest.com/search/pins/?q=' + encodeURIComponent(search) + '&rs=typed&term_meta[]=' + encodeURIComponent(search) + '%7Ctyped',
            headers: headers
        };

        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const arrMatch = body.match(/https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g) || [];
                return res.json({
                    count: arrMatch.length,
                    result: arrMatch
                });
            } else {
                return res.json({
                    error: 'An error occurred'
                });
            }
        });
    });

    const cgpt = async (u, s) => {
        try {
            const resp_obj = await axios.post(
                "https://ava-alpha-api.codelink.io/api/chat",
                {
                    "model": "gpt-4",
                    "stream": true,
                    "messages": [{
                        "role": "system", "content": s
                    },
                        {
                            "role": "user", "content": u
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            let resp = "";
            const data_strings = resp_obj.data.split('\n');
            for (let i = 0; i < data_strings.length; i++) {
                const data_str = data_strings[i];
                if (data_str.startsWith("data:") && data_str.includes('{') && data_str.includes('}')) {
                    let data_json = JSON.parse(data_str.substring(5));
                    if ("choices" in data_json) {
                        const choices = data_json["choices"];
                        for (const choice of choices) {
                            if ("finish_reason" in choice && choice.finish_reason === "stop") {
                                break;
                            }
                            if ("delta" in choice && "content" in choice["delta"]) {
                                resp += choice["delta"]["content"];
                            }
                        }
                    }
                }
            }
            return resp;
        } catch (error) {
            throw new Error("Unable to fetch the response. Error: " + error.message);
        }
    };



    app.get('/cgpt', async (req, res) => {
        const u = req.query.u;
        const s = req.query.s;
        if (!u || !s) {
            return res.status(400).send('Please provide valid input and system');
        }
        try {
            const response = await cgpt(u, s);
            res.send({
                result: response
            });
        } catch (error) {
            res.status(500).send({
                error: error.message
            });
        }
    });


    app.get('/sim', async (req, res, next) => {
    try {
        const query = req.query.ask;

        db.get("SELECT answer FROM sim WHERE LOWER(asking) = ?", [query.toLowerCase()], (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: 'Failed to fetch from the database.'
                });
            }

            if (row) {
                const answers = row.answer.split(',');  // Assuming answers are comma-separated
                const answer = answers[Math.floor(Math.random() * answers.length)].trim();
                return res.json({
                    result: answer
                });
            } else {
                return res.json({
                    result: "I don't find prompt"
                });
            }
        });
    } catch (err) {
        return next(err);
    }
});


    app.get('/teach', async (req, res, next) => {
    try {
        const asking = req.query.text1;
        const answer = req.query.text2;

        db.get("SELECT answer FROM sim WHERE asking = ?", [asking], (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: 'Failed to fetch from the database.'
                });
            }

            if (row) {
                const answers = row.answer.split(',');
                const existingAnswerIndex = answers.indexOf(answer);
                if (existingAnswerIndex !== -1) {
                    answers.splice(existingAnswerIndex, 1);
                }
                answers.unshift(answer);
                
                db.run("UPDATE sim SET answer = ? WHERE asking = ?", [answers.join(','), asking]);
            } else {
                db.run("INSERT INTO sim (asking, answer) VALUES (?, ?)", [asking, answer]);
            }

            return res.send({
                asking: "success",
                answer: "Answer added successfully"
            });
        });
    } catch (err) {
        return next(err);
    }
});

function startBot(message) {
    message && process.stderr.write(crayon("[ Starting ]" + message));
    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "maxx.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ...process.env
    }
});

    child.on("close", (codeExit) => {
            setTimeout(() => {
                startBot("Starting up...");

            }, optis.seconds);
    });

    child.on("error",
        function(error) {
            process.stderr.write(crayon("[ Starting ] An error occurred: " + JSON.stringify(error)));
        });
};



setTimeout(() => startBot("Starting up..."), optis.seconds);

app.get('/', (req, res) => {
    setTimeout(() => {
        res.send('YAHALLO!!');
    }, optis.seconds);
});
app.listen(port, () =>
	logger(`Your app is listening a http://localhost:${port}`, "ONLINE")
     );      

 
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


setTimeout(async() => {
    await delay(optis.seconds);
    console.clear();
}, optis.seconds);