const { exec } = require("node:child_process");

module.exports = {
    name: "restart",
    aliases: ["r"],
    category: "admin",
    permissions: { owner: true },
    code: async (ctx) => {
        try {
            const waitMsg = await ctx.reply(tools.msg.info(config.msg.wait));
            const botDb = ctx.db.bot;
            botDb.restart = { jid: ctx.id, key: waitMsg.key, timestamp: Date.now() };
            botDb.save();

            if (process.env.PM2_HOME) {
                exec("pm2 restart $(basename $(pwd))");
            } else {
                setTimeout(() => process.exit(0), 1000);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
