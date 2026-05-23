module.exports = {
    name: "reset",
    category: "profile",
    permissions: {
        private: true
    },
    code: async (ctx) => {
        const input = ctx.args[0];

        try {
            if (input === "y") {
                const usersDb = ctx.db.users;
                usersDb.remove(user => user.jid === ctx.sender.lid);
                return await collCtx.reply(tools.msg.info("Your database has been successfully reset!"));
            } else if (input === "n") {
                return await collCtx.reply(tools.msg.info("Database reset process has been cancelled."));
            }

            await ctx.reply({
                text: tools.msg.info("Are you sure you want to reset your database? This action will delete all stored data and cannot be undone."),
                buttons: [{
                    text: "Yes",
                    id: `${ctx.used.prefix + ctx.used.command} yes`
                }, {
                    text: "No",
                    id: `${ctx.used.prefix + ctx.used.command} no`
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
