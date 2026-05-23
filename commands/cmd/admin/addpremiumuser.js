module.exports = {
    name: "addpremiumuser",
    aliases: ["addpremuser", "addprem", "apu"],
    category: "admin",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();
        const daysAmount = parseInt(ctx.args[target.source === "quoted" ? 0 : 1], 10);

        if (!target.jid)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 8 -s")}\n` +
                    `${tools.msg.generateNotes(["Reply/quote a message to target the sender."])}\n` +
                    tools.msg.generatesFlagInfo({
                        "-s": "Stay silent without notifying the target account"
                    }),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (daysAmount && daysAmount <= 0) return await ctx.reply(tools.msg.info("Premium duration (in days) must be filled and greater than 0!"));

        try {
            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;

            const targetDb = ctx.getDb("users", target.jid);
            targetDb.premium = true;
            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                targetDb.premiumExpiration = expirationDate;
                targetDb.save();

                if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, tools.msg.info(`You have been added as a premium user by the owner for ${daysAmount} days!`));

                await ctx.reply(tools.msg.info(`Successfully added premium for ${daysAmount} days to that user!`));
            } else {
                delete targetDb?.premiumExpiration;
                targetDb.save();

                if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, tools.msg.info("You have been added as a permanent premium user by the owner!"));

                await ctx.reply(tools.msg.info("Successfully added permanent premium to that user!"));
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
