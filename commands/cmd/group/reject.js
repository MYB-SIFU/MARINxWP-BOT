module.exports = {
    name: "reject",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (ctx.args[0]?.toLowerCase() === "all") {
            const pendings = await ctx.group().pendingMembers();
            if (pendings.length === 0) return await ctx.reply(tools.msg.info("No members are waiting for approval."));

            try {
                const allJids = pendings.map(pending => pending.jid);
                await ctx.group().rejectPendingMembers(allJids);

                return await ctx.reply(tools.msg.info(`Successfully menolak semua anggota (${allJids.length}).`));
            } catch (error) {
                return await tools.cmd.handleError(ctx, error);
            }
        }

        const target = await ctx.target(["text"]);

        if (!target.jid)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "6281234567891")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} all`)} to reject all pending members.`
                ])
            );

        const pendings = await ctx.group().pendingMembers();
        const isPending = pendings.some(pending => tools.cmd.areJidsSameUser(pending.jid, target.jid));
        if (!isPending) return await ctx.reply(tools.msg.info("Account not found in the pending members list."));

        try {
            await ctx.group().rejectPendingMembers(target.jid);

            await ctx.reply(tools.msg.info("Successfully ditolak!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
