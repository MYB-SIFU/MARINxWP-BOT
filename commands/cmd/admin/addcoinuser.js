module.exports = {
    name: "addcoinuser",
    aliases: ["acu", "addcoin"],
    category: "admin",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();
        const coinAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target || !coinAmount)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 8 -s")}\n` +
                    `${tools.msg.generateNotes(["Reply/quote a message to target the sender."])}\n` +
                    tools.msg.generatesFlagInfo({
                        "-s": "Stay silent without notifying the target account"
                    }),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        try {
            const targetDb = ctx.getDb("users", target.jid);
            targetDb.coin += coinAmount;
            targetDb.save();

            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;
            if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, tools.msg.info(`You have received ${coinAmount} coins from the owner!`));

            await ctx.reply(tools.msg.info(`Successfully added ${coinAmount} coins to that user!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
