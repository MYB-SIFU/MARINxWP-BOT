const { Client, CommandHandler } = require("@itsreimau/gktw");
const path = require("node:path");
const events = require("../handlers/index.js");
const guard = require("./guard.js");
const util = require("node:util");

const { bot: botConfig, system } = config;

const directories = {
    auth: path.resolve(__dirname, "../../", system?.authAdapter === "single" ? "session.json" : "session"),
    database: path.resolve(__dirname, "../../data"),
    command: path.resolve(__dirname, "../../commands/cmd")
};

consolefy.log("Connecting...");

const parsePrefix = function(prefix) {
    if (typeof prefix !== "string") return prefix;
    var match = prefix.match(/(\/?)(.+)\1([a-z]*)/i);
    if (!match) return prefix;
    var validFlags = Array.from(new Set(match[3])).filter(function(flag) {
        return "gimsuy".includes(flag);
    }).join("");
    try {
        return new RegExp(match[2], validFlags);
    } catch (error) {
        return prefix;
    }
};

const bot = new Client({
    auth: {
        adapter: system?.authAdapter,
        dir: directories.auth,
        phoneNumber: botConfig.phoneNumber,
        usePairingCode: system.usePairingCode,
        customPairingCode: system.customPairingCode,
        useStore: system.useStore
    },
    connection: {
        suppressBaileys: system?.suppressBaileys,
        version: system?.WAVersion,
        alwaysOnline: system.alwaysOnline,
        selfReply: system.selfReply,
        loggerLevel: system?.loggerLevel
    },
    messaging: {
        autoRead: system.autoRead,
        prefix: parsePrefix(botConfig?.prefix)
    },
    database: {
        dir: directories.database
    },
    owner: [config.owner.id, ...config.owner.co.map(co => co.id)].filter(Boolean)
});

events(bot);
guard(bot);

const handler = new CommandHandler(bot, directories.command);
handler.load();

bot.launch().catch(error => consolefy.error(`Launch error: ${util.format(error)}`));
