module.exports = {
    name: "mute",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (ctx.args[0]?.toLowerCase() === "bot") {
            const groupDb = ctx.db.group;
            groupDb.mutebot = true;
            await groupDb.save();
            return await ctx.reply(tools.msg.info("Successfully me-mute grup ini dari bot!"));
        }

        const target = await ctx.target(["quoted", "mentioned"]);

        if (!target.jid)
            return await ctx.reply({
                text: `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    `${tools.msg.generateCmdExample(ctx.used, "@6281234567891")}\n` +
                    tools.msg.generateNotes([
                        "Reply/quote a message to target the sender.",
                        `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} to mute the bot.`
                    ]),
                mentions: ["6281234567891@s.whatsapp.net"]
            });

        if (tools.cmd.areJidsSameUser(target.jid, ctx.me.lid))
            return await ctx.reply(tools.msg.info(`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} bot`)} to mute the bot.`));
        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(tools.msg.info("They are the group owner!"));

        try {
            const groupDb = ctx.db.group;
            const muteList = groupDb?.mute || [];

            const isAlreadyMuted = muteList.includes(target.jid);
            if (isAlreadyMuted) return await ctx.reply(tools.msg.info("User is already muted!"));

            muteList.push(target.jid);
            groupDb.mute = muteList;
            groupDb.save();

            await ctx.reply(tools.msg.info("Successfully me-mute pengguna itu dari grup ini!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
