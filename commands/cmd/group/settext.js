module.exports = {
    name: "settext",
    aliases: ["settxt"],
    category: "group",
    permissions: { admin: true, botAdmin: true, group: true },
    code: async (ctx) => {
        const key = ctx.args[0];
        const text = ctx.text ? (ctx.text.startsWith(`${key} `) ? ctx.text.slice(key.length + 1) : ctx.text) : ctx.quoted?.body;

        if (key?.toLowerCase() === "list") return await ctx.reply(await tools.list.get("settext"));

        if (!key || !text)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "welcome Welcome to the group!")}\n` +
                tools.msg.generateNotes([
                    `Type ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} to see the list.`,
                    `Use ${formatter.inlineCode("delete")} as text to remove a previously saved text.`
                ])
            );

        try {
            let setKey;
            switch (key.toLowerCase()) {
                case "goodbye": case "intro": case "welcome": setKey = key.toLowerCase(); break;
                default: return await ctx.reply(tools.msg.info(`Text key ${formatter.inlineCode(key)} is not valid!`));
            }

            const groupDb = ctx.db.group;
            if (text.toLowerCase() === "delete") {
                delete groupDb?.text?.[setKey];
                groupDb.save();
                return await ctx.reply(tools.msg.info(`Text for ${formatter.inlineCode(key)} has been deleted!`));
            }

            (groupDb.text ||= {})[setKey] = text;
            groupDb.save();
            await ctx.reply(tools.msg.info(`Text for ${formatter.inlineCode(key)} has been saved!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
