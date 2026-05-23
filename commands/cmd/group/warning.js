module.exports = {
    name: "warning",
    aliases: ["warn"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const target = await ctx.target(["quoted", "mentioned"]);

        if (!target.jid)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    tools.msg.generateNotes([
                        "Reply/quote a message to target the sender."
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (tools.cmd.areJidsSameUser(target.jid, ctx.me.lid)) return await ctx.reply(tools.msg.info("Cannot modify the bot's warnings!"));
        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(tools.msg.info("Cannot warn the group owner!"));

        try {
            const groupDb = ctx.db.group;
            const warnings = groupDb?.warnings || [];
            const maxWarnings = groupDb?.maxwarnings || 3;

            const targetIndex = warnings.findIndex(warning => tools.cmd.areJidsSameUser(warning.jid, target.jid));

            let newWarningCount;

            if (targetIndex !== -1) {
                warnings[targetIndex].count += 1;
                newWarningCount = warnings[targetIndex].count;
            } else {
                newWarningCount = 1;
                warnings.push({
                    jid: target.jid,
                    count: newWarningCount
                });
            }

            groupDb.warnings = warnings;
            groupDb.save();

            if (newWarningCount >= maxWarnings) {
                await ctx.reply(tools.msg.info(`User has reached the warning limit (${newWarningCount}/${maxWarnings}).`));
                await ctx.group().kick(target);
                groupDb.warnings = warnings.filter(warning => warning.jid !== target);
            } else {
                await ctx.reply(tools.msg.info(`Successfully menambahkan warning menjadi ${newWarningCount}/${maxWarnings}.`));
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
