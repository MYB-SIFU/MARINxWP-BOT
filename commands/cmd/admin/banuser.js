module.exports = {
    name: "banuser",
    aliases: ["ban", "bu"],
    category: "admin",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = await ctx.target();

        if (!target.jid)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891 -s")}\n` +
                    `${tools.msg.generateNotes(["Reply/quote a message to target the sender."])}\n` +
                    tools.msg.generatesFlagInfo({
                        "-s": "Stay silent without notifying the target account"
                    }),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        try {
            const targetDb = ctx.getDb("users", target.jid);
            targetDb.banned = true;
            targetDb.save();

            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;
            if (!silent && !config.system.restrict) await ctx.sendMessage(target.jid, tools.msg.info("You have been banned by the owner!"));

            await ctx.reply(tools.msg.info("Successfully banned!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
