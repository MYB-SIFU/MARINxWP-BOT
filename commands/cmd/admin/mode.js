module.exports = {
    name: "mode",
    aliases: ["m"],
    category: "admin",
    permissions: { owner: true },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "self")}\n` +
                tools.msg.generateNotes([
                    `Type ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} to see the list.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("mode");
            return await ctx.reply(listText);
        }

        try {
            const botDb = ctx.db.bot;
            switch (input.toLowerCase()) {
                case "premium":
                case "group":
                case "private":
                case "public":
                case "self":
                    botDb.mode = input.toLowerCase();
                    botDb.save();
                    break;
                default:
                    return await ctx.reply(tools.msg.info(`Mode "${input}" is not valid!`));
            }
            await ctx.reply(tools.msg.info(`Successfully changed mode to ${input}!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
