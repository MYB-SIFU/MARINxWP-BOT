module.exports = {
    name: "botgroup",
    aliases: ["botgc", "gcbot"],
    category: "info",
    code: async (ctx) => {
        await ctx.reply(config.bot.groupLink);
    }
};
