module.exports = {
    name: "setoption",
    aliases: ["setopt"],
    category: "group",
    permissions: { admin: true, botAdmin: true, group: true },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "antilink")}\n` +
                tools.msg.generateNotes([
                    `Type ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} to see the list.`,
                    `Type ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} status`)} to see current status.`
                ])
            );

        if (input.toLowerCase() === "list") return await ctx.reply(await tools.list.get("setoption"));

        if (input.toLowerCase() === "status") {
            const opt = ctx.db.group.option || {};
            const s = (v) => v ? "Enabled" : "Disabled";
            return await ctx.reply(
                `➛ ${formatter.bold("Anti Audio")}: ${s(opt.antiaudio)}\n` +
                `➛ ${formatter.bold("Anti Document")}: ${s(opt.antidocument)}\n` +
                `➛ ${formatter.bold("Anti Image")}: ${s(opt.antiimage)}\n` +
                `➛ ${formatter.bold("Anti Sticker")}: ${s(opt.antisticker)}\n` +
                `➛ ${formatter.bold("Anti Video")}: ${s(opt.antivideo)}\n` +
                `➛ ${formatter.bold("Anti Group Status")}: ${s(opt.antigcsw)}\n` +
                `➛ ${formatter.bold("Anti Link")}: ${s(opt.antilink)}\n` +
                `➛ ${formatter.bold("Anti Spam")}: ${s(opt.antispam)}\n` +
                `➛ ${formatter.bold("Anti Tag Status")}: ${s(opt.antitagsw)}\n` +
                `➛ ${formatter.bold("Anti Toxic")}: ${s(opt.antitoxic)}\n` +
                `➛ ${formatter.bold("Auto Kick")}: ${s(opt.autokick)}\n` +
                `➛ ${formatter.bold("Game Restrict")}: ${s(opt.gamerestrict)}\n` +
                `➛ ${formatter.bold("Welcome")}: ${s(opt.welcome)}`
            );
        }

        try {
            const validOptions = ["antiaudio","antidocument","antiimage","antisticker","antivideo","antigcsw","antilink","antispam","antitagsw","antitoxic","autokick","gamerestrict","welcome"];
            const setKey = input.toLowerCase();
            if (!validOptions.includes(setKey)) return await ctx.reply(tools.msg.info(`Option ${formatter.inlineCode(input)} is not valid!`));

            const groupDb = ctx.db.group;
            const newStatus = !(groupDb?.option?.[setKey] || false);
            (groupDb.option ||= {})[setKey] = newStatus;
            groupDb.save();
            await ctx.reply(tools.msg.info(`Option ${formatter.inlineCode(input)} has been ${newStatus ? "enabled" : "disabled"}!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
