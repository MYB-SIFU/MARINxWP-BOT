module.exports = {
    name: "add",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const target = await ctx.target(["text"]);

        if (!target.jid)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "6281234567891")
            );

        const isOnWhatsApp = await ctx.core.onWhatsApp(target.jid);
        if (!isOnWhatsApp?.[0]?.exists) return await ctx.reply(tools.msg.info("Account not found on WhatsApp!"));

        try {
            await ctx.group().add(target.jid);

            await ctx.reply(tools.msg.info("Successfully added!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
