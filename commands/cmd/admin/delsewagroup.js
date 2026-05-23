module.exports = {
    name: "delsewagroup",
    aliases: ["delsewa", "delsewagrup", "dsg"],
    category: "admin",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = ctx.isGroup() ? ctx.id : await ctx.target(["text_group"]);

        if (!target.jid)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "1234567890 -s")}\n` +
                `${tools.msg.generateNotes(["Use in a group to automatically remove rental for that group."])}\n` +
                tools.msg.generatesFlagInfo({
                    "-s": "Stay silent without notifying the group owner"
                })
            );

        if (!await ctx.group(target.jid)) return await ctx.reply(tools.msg.info("Group not valid or bot is not in that group!"));

        try {
            const targetDb = ctx.getDb("users", target.jid);
            delete targetDb.premium;
            delete targetDb.premiumExpiration;
            targetDb.save();

            const flag = ctx.flag({
                silent: {
                    type: "boolean",
                    short: "s",
                    default: false
                }
            });
            const silent = flag?.silent;
            const group = await ctx.group(target.jid);
            const groupOwner = await group.owner();
            if (!silent && groupOwner && !config.system.restrict) {
                const groupMentions = [{
                    groupJid: `${group.id}@g.us`,
                    groupSubject: await group.name()
                }];
                await ctx.sendMessage(groupOwner, {
                    text: tools.msg.info(`Bot rental for group @${groupMentions.groupJid} has been stopped by the owner!`),
                    contextInfo: {
                        groupMentions
                    }
                });
            }

            await ctx.reply(tools.msg.info(`Successfully removed bot rental for ${ctx.isGroup() ? 'this' : 'that'} group!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
