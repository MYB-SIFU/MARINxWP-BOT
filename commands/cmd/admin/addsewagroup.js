module.exports = {
    name: "addsewagroup",
    aliases: ["addsewa", "addsewagrup", "adg"],
    category: "admin",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const target = ctx.isGroup() ? ctx.id : await ctx.target(["text_group"]);
        const daysAmount = parseInt(ctx.args[ctx.isGroup() ? 0 : 1], 10);

        if (!target.jid)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "1234567890 8 -s")}\n` +
                `${tools.msg.generateNotes(["Use in a group to automatically rent that group."])}\n` +
                tools.msg.generatesFlagInfo({
                    "-s": "Stay silent without notifying the group owner"
                })
            );

        if (!await ctx.group(target.jid)) return await ctx.reply(tools.msg.info("Group not valid or bot is not in that group!"));
        if (daysAmount && daysAmount <= 0) return await ctx.reply(tools.msg.info("Rental duration (in days) must be filled and greater than 0!"));

        try {
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

            if ((!silent && groupOwner) && !config.system.restrict) {
                const groupMentions = [{
                    groupJid: `${group.id}@g.us`,
                    groupSubject: await group.name()
                }];
            }

            const targetDb = ctx.getDb("groups", target.jid);
            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                targetDb.sewaExpiration = expirationDate;
                targetDb.save();

                if (!silent && groupOwner && !config.system.restrict)
                    await ctx.sendMessage(groupOwner, {
                        text: tools.msg.info(`Bot successfully rented to group @${groupMentions.groupJid} for ${daysAmount} days!`),
                        contextInfo: {
                            groupMentions
                        }
                    });

                await ctx.reply(tools.msg.info(`Successfully rented bot to ${ctx.isGroup() ? 'this' : 'that'} group for ${daysAmount} days!`));
            } else {
                delete targetDb?.sewaExpiration;
                targetDb.save();

                if (!silent && groupOwner && !config.system.restrict)
                    await ctx.sendMessage(groupOwner, {
                        text: tools.msg.info(`Bot successfully rented to group @${groupMentions.groupJid} permanently!`),
                        contextInfo: {
                            groupMentions
                        }
                    });

                await ctx.reply(tools.msg.info(`Successfully rented bot to ${ctx.isGroup() ? 'this' : 'that'} group permanently!`));
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
