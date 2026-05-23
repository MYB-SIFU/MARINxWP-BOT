module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners);

    require("./onReady.js")(bot);
    require("./onMessage.js")(bot);
    require("./onMember.js")(bot);
    require("./onCall.js")(bot);
};
