module.exports = {
    name: "transfer",
    aliases: ["tf"],
    category: "profile",
    code: async (ctx) => {
        const target = await ctx.target();
        const coinAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target || !coinAmount)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 8")}\n` +
                    tools.msg.generateNotes([
                        "Reply/quote a message to target the sender."
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        const senderDb = ctx.db.user;

        if (ctx.sender.isOwner() || senderDb?.premium) return await ctx.reply(tools.msg.info("Unlimited coins cannot be transferred."));
        if (coinAmount <= 0) return await ctx.reply(tools.msg.info("Coin amount must be greater than 0!"));
        if (senderDb?.coin < coinAmount) return await ctx.reply(tools.msg.info("You don't have enough coins for this transfer!"));

        try {
            const targetDb = ctx.getDb("users", target.jid);
            targetDb.coin += coinAmount;
            senderDb.coin -= coinAmount;
            targetDb.save();
            senderDb.save();

            await ctx.reply(tools.msg.info(`Successfully transferred ${coinAmount} coins to that user!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
