module.exports = {
    name: "broadcastgcsw",
    aliases: ["bcgcsw", "bcswgc"],
    category: "admin",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image", "video"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image", "video"])
        ];

        const type = checkMedia || checkQuotedMedia;

        if (!input && !type)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "hello, world!")}\n` +
                tools.msg.generateNotes([
                    `Use ${formatter.inlineCode("blacklist")} to add a group to the blacklist. (Only works in groups)`
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
                return await ctx.reply(tools.msg.info("This group has been removed from the broadcast blacklist"));
            } else {
                blacklist.push(ctx.id);
                botDb.blacklistBroadcast = blacklist;
                botDb.save();
                return await ctx.reply(tools.msg.info("This group has been added to the broadcast blacklist"));
            }
        }

        try {
            const groupJids = Object.values(await ctx.core.groupFetchAllParticipating()).filter(group => !blacklist.includes(group.id) && !group.announce && !group.isCommunity && !group.isCommunityAnnounce).map(group => group.id);
            let content;
            if (["image", "video"].includes(type)) {
                const buffer = await ctx.msg.download() || await ctx.quoted.download();
                content = {
                    [type]: buffer,
                    caption: input
                };
            } else {
                content = {
                    text: input
                };
            }
            const {
                delay,
                duration
            } = tools.cmd.calculateDelay(groupJids.length);
            const waitMsg = await ctx.reply(tools.msg.info(`Sending broadcast to ${groupJids.length} groups, estimated time: ${tools.msg.convertMsToDuration(duration)}`));
            for (const groupJid of groupJids) {
                try {
                    await ctx.sendMessage(groupJid, {
                        ...content,
                        groupStatus: true
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
