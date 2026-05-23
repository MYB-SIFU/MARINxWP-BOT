module.exports = {
    name: "donate",
    aliases: ["support"],
    category: "info",
    code: async (ctx) => {
        try {
            const botText = ctx.db.bot.text || {};
            const qrisLink = botText?.qris;
            const customText = botText?.donate;
            const text = customText
                ? customText.replace(/%tag%/g, `@${ctx.getId(ctx.sender.jid)}`).replace(/%name%/g, config.bot.name).replace(/%prefix%/g, ctx.used.prefix).replace(/%command%/g, ctx.used.command).replace(/%footer%/g, config.msg.footer).replace(/%readmore%/g, "\u200E".repeat(4001))
                : tools.msg.info("No donation links have been configured by the owner.");

            if (qrisLink) {
                await ctx.reply({ image: { url: qrisLink }, caption: text, mentions: [ctx.sender.jid] });
            } else {
                await ctx.reply({ text, mentions: [ctx.sender.jid] });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
