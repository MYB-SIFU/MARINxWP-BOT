module.exports = {
    name: "demote",
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

        if (!await ctx.group().isAdmin(target.jid)) return await ctx.reply(tools.msg.info("They are a regular member!"));

        try {
            await ctx.group().demote(target.jid);

            await ctx.reply(tools.msg.info("Successfully diturunkan dari admin menjadi anggota!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
