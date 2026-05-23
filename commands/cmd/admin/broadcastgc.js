module.exports = {
    name: "broadcastgc",
    aliases: ["bc", "bcht", "bcgc", "broadcast"],
    category: "admin",
    permissions: { owner: true },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "hello world!")}\n` +
                tools.msg.generateNotes([
                    `Use ${formatter.inlineCode("blacklist")} to add a group to the blacklist.`
                ])
            );

        const botDb = ctx.db.bot;
        let blacklist = botDb?.blacklistBroadcast || [];

        if (ctx.args[0]?.toLowerCase() === "blacklist" && ctx.isGroup()) {
            const groupIndex = blacklist.indexOf(ctx.id);
            if (groupIndex > -1) {
                blacklist.splice(groupIndex, 1);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(tools.msg.info("This group has been removed from the broadcast blacklist."));
            } else {
                blacklist.push(ctx.id);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(tools.msg.info("This group has been added to the broadcast blacklist."));
            }
        }

        try {
            const groupJids = Object.values(await ctx.core.groupFetchAllParticipating())
                .filter(group => !blacklist.includes(group.id) && !group.announce && !group.isCommunity && !group.isCommunityAnnounce)
                .map(group => group.id);
            const { delay, duration } = tools.cmd.calculateDelay(groupJids.length);
            const waitMsg = await ctx.reply(tools.msg.info(`Sending broadcast to ${groupJids.length} groups, estimated time: ${tools.msg.convertMsToDuration(duration)}`));

            for (const groupJid of groupJids) {
                try {
                    await ctx.sendMessage(groupJid, {
                        image: { url: config.bot.thumbnail },
                        caption: input,
                        mentionAll: ctx.used.command === "bcht" ? true : false,
                        footer: config.msg.footer,
                        buttons: [{ text: "Contact Owner", id: `${ctx.used.prefix}owner` }, { text: "Donate", id: `${ctx.used.prefix}donate` }]
                    });
                    await tools.cmd.delay(delay);
                } catch {}
            }

            await ctx.editMessage(ctx.id, waitMsg.key, tools.msg.info(`Successfully sent to ${groupJids.length} groups.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
