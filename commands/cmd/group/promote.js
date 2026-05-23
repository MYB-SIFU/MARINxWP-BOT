module.exports = {
    name: "promote",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
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

        if (await ctx.group().isOwner(target.jid)) return await ctx.reply(tools.msg.info("They are the group owner!"));

        try {
            await ctx.group().promote(target.jid);

            await ctx.reply(tools.msg.info("Successfully ditingkatkan dari anggota menjadi admin!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
