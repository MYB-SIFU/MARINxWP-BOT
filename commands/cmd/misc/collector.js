const util = require("node:util");

module.exports = {
    name: "collector",
    aliases: ["collect"],
    category: "misc",
    code: async (ctx) => {
        const timeout = parseInt(ctx.args[0], 10) || 60000;
        if (isNaN(timeout)) return await ctx.reply(tools.msg.info("Timeout value must be a number!"));

        try {
            const collector = ctx.MessageCollector({
                time: timeout,
                filter: (collCtx) => !collCtx.msg.key.fromMe
            });
            await ctx.reply(tools.msg.info(`Collector started with timeout ${tools.msg.convertMsToDuration(timeout)}.`));

            collector.on("collect", async (collCtx) => await collCtx.reply(formatter.monospace(util.format(collCtx.bot.m))));

            collector.on("end", async () => await ctx.reply(tools.msg.info("Collector stopped!")));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
