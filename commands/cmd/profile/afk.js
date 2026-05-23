module.exports = {
    name: "afk",
    category: "profile",
    code: async (ctx) => {
        const input = ctx.text;

        try {
            const senderDb = ctx.db.user;
            senderDb.afk = { reason: input, timestamp: Date.now() };
            senderDb.save();
            await ctx.reply(tools.msg.info(`You are now AFK${input ? ` with reason: ${formatter.inlineCode(input)}` : " without a reason"}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
