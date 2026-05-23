module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "info",
    code: async (ctx) => {
        await ctx.reply(tools.msg.info(`Bot has been running for ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}.`));
    }
};
