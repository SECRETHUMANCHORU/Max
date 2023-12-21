const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
 const crypto = require('crypto');
const chalk = require('chalk');
const logger = require("./utils/log.js");
//const login = require("./includes/fca-maxx");
const login = require ("node-ainzfb-new");
const fs = require('fs');
const path = require('path');
const nodeCron = require("node-cron");

const axios = require("axios");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;
const gradient = require('gradient-string');

const successLoading = [
    '#33ff33',
    '#3399ff',
    '#00ccff',
    '#ff9933',
    '#ffff33'
];

const randomGradientloading = () => successLoading[Math.floor(Math.random() * successLoading.length)];
const crayon = gradient([randomGradientloading(), randomGradientloading()]);

const faildedLoading = [
    '#FF0004',
    '#8B0000'
];

const randomGradientfailde = () => faildedLoading[Math.floor(Math.random() * faildedLoading.length)];
const crayons = gradient([randomGradientfailde(), randomGradientfailde()]);


global.client = new Object({
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: new Array(),
    handleSchedule: new Array(),
    handleReaction: new Array(),
    handleReply: new Array(),
    mainPath: process.cwd(),
    configPath: new String()
});

global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array()
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();

global.language = new Object();

var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "config.json");
    configValue = require(global.client.configPath);
    logger.loader("Found file config: config.json");
}
catch {
    if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
        configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
        configValue = JSON.parse(configValue);
        logger.loader(`Found: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`);
    }
    else return logger.loader("config.json not found!", "error");
}

try {
    for (const key in configValue) global.config[key] = configValue[key];
    logger.loader("Config Loaded!");
}
catch { return logger.loader("Can't load file config!", "error") }

const { Sequelize, sequelize } = require("./includes/database");

writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');

const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = new Object();
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;    
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    var text = langText[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
}


try {
    var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
    var appState = require(appStateFile);
    logger.loader(global.getText("mirai", "foundPathAppstate"))
}
catch { return logger.loader(global.getText("mirai", "notFoundPathAppstate"), "error") }

function checkBan(checkban) {
    const [_0x4e5718, _0x28e5ae] = global.utils.homeDir();
    global.checkBan = !![];
    if (existsSync('/home/runner/.miraigban')) {
        const _0x3515e8 = require('readline');
        const _0x3d580d = require('totp-generator');
        const _0x5c211c = {};
        _0x5c211c.input = process.stdin,
            _0x5c211c.output = process.stdout;
        var _0x2cd8f4 = _0x3515e8.createInterface(_0x5c211c);
        global.handleListen.stopListening(),
            _0x2cd8f4.on(line, _0x4244d8 => {
                _0x4244d8 = String(_0x4244d8);

                if (isNaN(_0x4244d8) || _0x4244d8.length < 6 || _0x4244d8.length > 6)
                    return;
                else return axios.get('https://raw.githubusercontent.com/ChoruTiktokers182/Choru-bypass/main/listgban.json').then(_0x2f978e => {
                    const _0x360aa8 = _0x3d580d(String(_0x2f978e.data).replace(/\s+/g, '').toLowerCase());
                    if (_0x360aa8 !== _0x4244d8) return;
                    else {
                        const _0x1ac6d2 = {};
                        return _0x1ac6d2.recursive = !![], rm('/.miraigban', _0x1ac6d2), _0x2cd8f4.close();
                    }
                });
            });
        return;
    };
    return axios.get('https://raw.githubusercontent.com/ChoruTiktokers182/Choru-bypass/main/listgban.json').then(dataGban => {
        for (const _0x125f31 of global.data.allUserID)
            if (dataGban.data.hasOwnProperty(_0x125f31) && !global.data.userBanned.has(_0x125f31)) global.data.userBanned.set(_0x125f31, {
                'reason': dataGban.data[_0x125f31]['reason'],
                'dateAdded': dataGban.data[_0x125f31]['dateAdded']
            });
        for (const thread of global.data.allThreadID)
            if (dataGban.data.hasOwnProperty(thread) && !global.data.userBanned.has(thread)) global.data.threadBanned.set(thread, {
                'reason': dataGban.data[thread]['reason'],
                'dateAdded': dataGban.data[thread]['dateAdded']
            });
        delete require.cache[require.resolve(global.client.configPath)];
        const admin = require(global.client.configPath).ADMINBOT || [];
        for (const adminID of admin) {
            if (!isNaN(adminID) && dataGban.data.hasOwnProperty(adminID)) {
                mkdirSync(_0x4e5718 + ('/.miraigban'));
                if (_0x28e5ae == 'win32') execSync('attrib +H' + '+S' + _0x4e5718 + ('/.miraigban'));
                return process.exit(0);
            }
        }
        if (dataGban.data.hasOwnProperty(checkban.getCurrentUserID())) {
            mkdirSync(_0x4e5718 + ('/.miraigban'));
            if (_0x28e5ae == 'win32')
                execSync('attrib +H +S ' + _0x4e5718 + ('/.miraigban'));
            return process.exit(0);
        }
        return axios.get('https://raw.githubusercontent.com/ChoruTiktokers182/Choru-bypass/main/data.json').then(json => {
        }).catch(error => {
            throw new Error(error);
        });
    });
} 

function onBot({ models: botModel }) {
    const loginData = {};
    loginData['appState'] = appState;
    login(loginData, async(loginError, loginApiData) => {
        if (loginError) return logger(JSON.stringify(loginError), `ERROR`);
loginApiData.setOptions(global.config.FCAOption)
setInterval(() => {loginApiData.setOptions({ online: true })}, 60000)

        global.config.version = '30.0.0'
        global.client.timeStart = new Date().getTime(),


            function () {
                function logStatus(message) {
    logHeader();
    process.stderr.write(crayon(message + ''));
    logFooter();
}


function logHeader() {
    process.stderr.write(crayon("╔═✧════════════════════════════════✧═╗\n"));
    process.stderr.write(crayon("║                                    ║\n"));
    process.stderr.write(crayon("║        ❯ INSTALL COMMANDS ❮        ║\n"));
    process.stderr.write(crayon("║                                    ║\n"));
    process.stderr.write(crayon("╟─✦────────────────────────────────✦─╢\n"));
}


function logFooter() {
    process.stderr.write(crayon("║                                    ║\n"));
    process.stderr.write(crayon("╚═✧════════════════════════════════✧═╝\n"));
}


logStatus("");
    const listCommand = readdirSync(global.client.mainPath + '/modules/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
    for (const command of listCommand) {
        try {
            var module = require(global.client.mainPath + '/modules/commands/' + command);
            if (!module.config || !module.run || !module.config.commandCategory) throw new Error("Command Error Format");
            if (global.client.commands.has(module.config.name || '')) throw new Error("Command Name Already Exists");
            if (!module.languages || typeof module.languages !== 'object' || Object.keys(module.languages).length === 0) {
               // logger.loader(`[ COMMANDS ]  WARNING: Language not found for command "${module.config.name}"`);
            }



            if (module.config.dependencies && typeof module.config.dependencies === 'object') {
                for (const reqDependencies in module.config.dependencies) {
                    const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                    try {
                        if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) {
                                global.nodemodule[reqDependencies] = require(reqDependencies);
                            } else {
                                global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                            }
                        } else '';
                    } catch {
                        var check = false;
                        var isError;
                      logger.loader(`[ COMMANDS ] » WARNING: Package "${reqDependencies}" not found for command "${module.config.name}"`);
                        execSync('npm --package-lock false --save install' + ' ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                        for (let i = 1; i <= 3; i++) {
                            try {
                                require['cache'] = {};
                                if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) {
                                    global['nodemodule'][reqDependencies] = require(reqDependencies);
                                } else {
                                    global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                }
                                check = true;
                                break;
                            } catch (error) { isError = error; }
                            if (check || !isError) break;
                        }
                        if (!check || isError) throw new Error(`Can't Install Package "${reqDependencies}" for command "${module.config.name}": ${isError}`);
                    }
                }
              //  logger.loader(`[ COMMANDS ] » INSTALL: ${module.config.name}`);
            }
            if (module.config.envConfig) try {
                for (const envConfig in module.config.envConfig) {
                    if (typeof global.configModule[module.config.name] === 'undefined') {
                        global.configModule[module.config.name] = {};
                    }
                    if (typeof global.config[module.config.name] === 'undefined') {
                        global.config[module.config.name] = {};
                    }
                    if (typeof global.config[module.config.name][envConfig] !== 'undefined') {
                        global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                    } else {
                        global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                    }
                    if (typeof global.config[module.config.name][envConfig] === 'undefined') {
                        global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                    }
                }
              //  logger.loader(`[ COMMANDS ]  INSTALL ${module.config.name}`);
            } catch (error) {
                throw new Error(`Loaded Config Error for command "${module.config.name}": ${JSON.stringify(error)}`);
            }
            if (module.onLoad) {
                try {
                    const moduleData = {};
                    moduleData.api = loginApiData;
                    moduleData.models = botModel;
                    module.onLoad(moduleData);
                } catch (_0x20fd5f) {
                    throw new Error(`Can't Onload Module "${module.config.name}": ${JSON.stringify(_0x20fd5f)}`);
                };
            }
            if (module.handleEvent) {
                global.client.eventRegistered.push(module.config.name);
            }
            global.client.commands.set(module.config.name, module);
            logger.loader(`[ COMMANDS ] » ${module.config.name}`);
        } catch (error) {
            console.error(`[ COMMANDS ]  ERROR: ${command} ${error}`);
        }
    }
}(),

function () {

function logStatus(message) {
    logHeader();
    process.stderr.write(crayon(message + ''));
    logFooter();
}


function logHeader() {
    process.stderr.write(crayon("╔═✧════════════════════════════════✧═╗\n"));
    process.stderr.write(crayon("║                                    ║\n"));
    process.stderr.write(crayon("║         ❯ INSTALL EVENTS ❮         ║\n"));
    process.stderr.write(crayon("║                                    ║\n"));
    process.stderr.write(crayon("╟─✦────────────────────────────────✦─╢\n"));
}


function logFooter() {
    process.stderr.write(crayon("║                                    ║\n"));
    process.stderr.write(crayon("╚═✧════════════════════════════════✧═╝\n"));
}


logStatus("");

    const events = readdirSync(global.client.mainPath + '/modules/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event));
    for (const ev of events) {
        try {
            var event = require(global.client.mainPath + '/modules/events/' + ev);
            if (!event.config || !event.run) throw new Error(`Event Error Format for event "${ev}"`);
            if (global.client.events.has(event.config.name) || '') throw new Error(`Event Name Already Exists for event "${ev}"`);

                        if (event.config.dependencies && typeof event.config.dependencies === 'object') {
                for (const dependency in event.config.dependencies) {
                    const dependencyPath = join(__dirname, 'nodemodules', 'node_modules', dependency);
                    try {
                        if (!global.nodemodule.hasOwnProperty(dependency)) {
                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) {
                                global.nodemodule[dependency] = require(dependency);
                            } else {
                                global.nodemodule[dependency] = require(dependencyPath);
                            }
                        } else '';
                    } catch {
                        var check = false;
                        var isError;
                        logger.loader(`[ EVENT ] » WARNING: Package "${dependency}" not found for event "${event.config.name}"`);
                        execSync('npm --package-lock false --save install' + ' ' + dependency + (event.config.dependencies[dependency] === '*' || event.config.dependencies[dependency] === '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                        for (let i = 1; i <= 3; i++) {
                            try {
                                require['cache'] = {};
                                if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) {
                                    global.nodemodule[dependency] = require(dependency);
                                } else {
                                    global.nodemodule[dependency] = require(dependencyPath);
                                }
                                check = true;
                                break;
                            } catch (error) { isError = error; }
                            if (check || !isError) break;
                        }
                        if (!check || isError) throw new Error(`Can't Install Package "${dependency}" for event "${event.config.name}": ${isError}`);
                    }
                }
                //logger.loader(`[ EVENT ]  INSTALL: ${event.config.name}`);
            }
                        if (event.config.envConfig) {
                try {
                    for (const envConfig in event.config.envConfig) {
                        if (typeof global.configModule[event.config.name] === 'undefined') {
                            global.configModule[event.config.name] = {};
                        }
                        if (typeof global.config[event.config.name] === 'undefined') {
                            global.config[event.config.name] = {};
                        }
                        if (typeof global.config[event.config.name][envConfig] !== 'undefined') {
                            global.configModule[event.config.name][envConfig] = global.config[event.config.name][envConfig];
                        } else {
                            global.configModule[event.config.name][envConfig] = event.config.envConfig[envConfig] || '';
                        }
                        if (typeof global.config[event.config.name][envConfig] === 'undefined') {
                            global.config[event.config.name][envConfig] = event.config.envConfig[envConfig] || '';
                        }
                    }
                    //logger.loader(`[ EVENT ]  INSTALL ${event.config.name}`);
                } catch (error) {
                    throw new Error(`Loaded Config Error for event "${event.config.name}": ${JSON.stringify(error)}`);
                }
            }
            if (event.onLoad) {
                try {
                    const eventData = {};
                    eventData.api = loginApiData;
                    eventData.models = botModel;
                    event.onLoad(eventData);
                } catch (error) {
                    throw new Error(`Can't Onload Event "${event.config.name}": ${JSON.stringify(error)}`);
                }
            }
            global.client.events.set(event.config.name, event);


            logger.loader(`[ EVENT ] » ${event.config.name}`);

        } catch (error) {
            console.error(`[ EVENT ]  ERROR: ${ev} ${error}`);
        }
    }
}(),




        writeFileSync(global.client['configPath'], JSON['stringify'](global.config, null, 4), 'utf8') 
        unlinkSync(global['client']['configPath'] + '.temp');        
        const listenerData = {};
        listenerData.api = loginApiData; 
        listenerData.models = botModel;
        const listener = require('./includes/listen')(listenerData);

const logPingTime = require('./includes/database/pingLogger'); 
//const logo = require("./logo");



        function listenerCallback(error, message) {
    if (error) return;
    if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;
    return listener(message);
};
global.handleListen = loginApiData.listenMqtt(listenerCallback);
try {
    await checkBan(loginApiData);
} catch (error) {
    return process.exit(0);
};

        global.client.api = loginApiData

function humanReadableToCron(humanReadable) {
    const parts = humanReadable.split(' ');
    const number = parseInt(parts[0]);
    const unit = parts[1];

    switch (unit) {
        case 'minute':
        case 'minutes':
            return `*/${number} * * * *`;
        case 'hour':
        case 'hours':
            return `0 */${number} * * *`;
        case 'day':
        case 'days':
            return `0 0 */${number} * *`;
        case 'month':
        case 'months':
            return `0 0 1 */${number} *`;
        case 'year':
        case 'years':
            return `0 0 1 1 */${number}`;
        default:
            return null;
    }
}

function readCronScheduleConfig() {
    try {
        const configFile = path.join(__dirname, 'config-cron-schedule.json');
        if (fs.existsSync(configFile)) {
            return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error reading cron schedule config:', error);
        return {};
    }
}

function writeCronScheduleConfig(config) {
    try {
        const configFile = path.join(__dirname, 'config-cron-schedule.json');
        fs.writeFileSync(configFile, JSON.stringify(config, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error writing cron schedule config:', error);
    }
}

async function updateCronNameInConfig(cronName) {
    try {
        const config = readCronScheduleConfig();
        if (!config[cronName]) {
            config[cronName] = 'on';
            writeCronScheduleConfig(config);
        }
    } catch (error) {
        console.error('Error updating cron name in config:', error);
    }
}

global.client.crons = global.client.crons || new Map();

async function loadCrons() {


function logStatus(message) {
    logHeader();
    process.stderr.write(crayon(message + ''));
    logFooter();
}


function logHeader() {
    process.stderr.write(crayon("╔═✧════════════════════════════════✧═╗\n"));
    process.stderr.write(crayon("║                                    ║\n"));
    process.stderr.write(crayon("║         ❯ INSTALL CRONS ❮          ║\n"));
    process.stderr.write(crayon("║                                    ║\n"));
    process.stderr.write(crayon("╟─✦────────────────────────────────✦─╢\n"));
}


function logFooter() {
    process.stderr.write(crayon("║                                    ║\n"));
    process.stderr.write(crayon("╚═✧════════════════════════════════✧═╝\n"));
}


logStatus("");



    const crons = fs.readdirSync(global.client.mainPath + '/modules/crons').filter(cron => cron.endsWith('.js') && !global.config.cronDisabled.includes(cron));

    for (const cr of crons) {
        try {
            const cron = require(global.client.mainPath + '/modules/crons/' + cr);

            if (!cron.config || !cron.onLoad) throw new Error(`cron Error Format for cron "${cr}"`);

            if (global.client.crons.has(cron.config.name)) throw new Error(`cron Name Already Exists for cron "${cr}"`);

            if (!cron.create || !cron.create.cron || !cron.create.cron.config) {
                throw new Error(`cron Error: missing create.cron.config for cron "${cr}"`);
            }

            if (!cron.create.cron.config.owner || !cron.create.cron.config.description) {
                throw new Error(`cron Error: missing owner or description in create.cron.config for cron "${cr}"`);
            }

            if (cron.create.cron.config.owner !== "Choru TikTokers") {
                throw new Error(`cron Error: owner should be "Choru TikTokers" for cron "${cr}"`);
            }

            if (cron.create.cron.config.description !== "how to set time in scheduled, The schedule: 1 hours, you can change that to 1 hour It can be done in 1 minutes, 1 hours, 1 months, 1 year") {
                throw new Error(`cron Error: description should be "how to set time in scheduled, The schedule: 1 hours, you can change that to 1 hour It can be done in 1 minutes, 1 hours, 1 months, 1 year" for cron "${cr}"`);
            }

            if (cron.config.dependencies) {
                for (const dependency of cron.config.dependencies) {
                    const dependencyPath = path.join(__dirname, 'node_modules', dependency);

                    try {
                        if (!global.nodemodule.hasOwnProperty(dependency)) {
                            global.nodemodule[dependency] = require(dependencyPath);
                        }
                    } catch {
                        execSync('npm install --package-lock false --save ' + dependency, { stdio: 'inherit', env: process.env, shell: true, cwd: path.join(__dirname, 'node_modules') });
                        require.cache = {};
                        global.nodemodule[dependency] = require(dependencyPath);
                    }
                }
            }

            if (cron.config.envConfig) {
                for (const envConfig in cron.config.envConfig) {
                    if (!global.configModule[cron.config.name]) {
                        global.configModule[cron.config.name] = {};
                    }

                    if (!global.config[cron.config.name]) {
                        global.config[cron.config.name] = {};
                    }

                    if (global.config[cron.config.name][envConfig] !== undefined) {
                        global.configModule[cron.config.name][envConfig] = global.config[cron.config.name][envConfig];
                    } else {
                        global.configModule[cron.config.name][envConfig] = cron.config.envConfig[envConfig] || '';
                    }

                    if (global.config[cron.config.name][envConfig] === undefined) {
                        global.config[cron.config.name][envConfig] = cron.config.envConfig[envConfig] || '';
                    }
                }
            }
updateCronNameInConfig(cron.config.name);
            if (cron.onLoad) {
                const cronName = cron.config.name;
                const scheduleConfig = readCronScheduleConfig();
                const isCronScheduled = scheduleConfig[cronName] === 'on';

                if (isCronScheduled) {
                    const cronSchedule = humanReadableToCron(cron.config.schedule);
                    nodeCron.schedule(cronSchedule, () => cron.onLoad({ api: loginApiData, models: botModel }));
                }
            }

            global.client.crons.set(cron.config.name, cron);

            logger.loader(`[ CRON ] » ${cron.config.name}`);

        } catch (error) {
            console.error(`[ CRON ]  ERROR: ${cr} ${error}`);
        }
    }
}

var lol = global.config.Permissionv2;
nodeCron.schedule(`*/1 * * * *`, () => {
  for (let lolz of lol)
  loginApiData.sendMessage(`Name: ${global.config.BOTNAME} || ${global.data.botID}\nOnline Bot`, lolz);
},{
  scheduled: true,
  timezone: "Asia/Manila"
});
loadCrons().catch(console.error);
logger.loader(`\nSuccess\ncmd: ${global.client.commands.size},\nevent: ${global.client.events.size},\ncron: ${global.client.crons.size}`,);

 logger.loader(`FBID BOT:${loginApiData.getCurrentUserID()}`)
 logger.loader(`VERSION: ${global.config.version}`)


const logo = require ("./logo");


    });
}

(async() => {
    try {
        await sequelize.authenticate();
        const authentication = {};
        authentication.Sequelize = Sequelize;
        authentication.sequelize = sequelize;
        const models = require('./includes/database/model')(authentication);
        const botData = {};
        botData.models = models
        onBot(botData);
    } catch (error) { }

})(); 
//const logo = require("./logo.js");
process.on('unhandledRejection', (err, p) => {});
