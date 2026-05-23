module.exports = {
    name: "price",
    aliases: ["rent", "subscribe", "premium"],
    category: "info",
    code: async (ctx) => {
        try {
            const customText = ctx.db.bot.text?.price;
            const text = customText
                ? customText.replace(/%tag%/g, `@${ctx.getId(ctx.sender.jid)}`).replace(/%name%/g, config.bot.name).replace(/%prefix%/g, ctx.used.prefix).replace(/%command%/g, ctx.used.command).replace(/%footer%/g, config.msg.footer).replace(/%readmore%/g, "\u200E".repeat(4001))
                : tools.msg.info("This bot has no set pricing.");

            await ctx.reply({ text, mentions: [ctx.sender.jid] });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
