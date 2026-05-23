module.exports = {
    name: "group",
    category: "group",
    permissions: { admin: true, botAdmin: true, group: true },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "open")}\n` +
                tools.msg.generateNotes([`Type ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} to see the list.`])
            );

        if (input.toLowerCase() === "list") return await ctx.reply(await tools.list.get("group"));

        try {
            switch (input.toLowerCase()) {
                case "open": case "close": case "lock": case "unlock":
                    await ctx.group()[input.toLowerCase()](); break;
                case "approve": await ctx.group().joinApproval("on"); break;
                case "disapprove": await ctx.group().joinApproval("off"); break;
                case "invite": await ctx.group().membersCanAddMemberMode("on"); break;
                case "restrict": await ctx.group().membersCanAddMemberMode("off"); break;
                default: return await ctx.reply(tools.msg.info(`Setting "${input}" is not valid!`));
            }
            await ctx.reply(tools.msg.info("Group setting updated successfully!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
