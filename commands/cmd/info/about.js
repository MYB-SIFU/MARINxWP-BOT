const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "about",
    aliases: ["bot", "infobot"],
    category: "info",
    code: async (ctx) => {
        await ctx.reply(
            `— Hello! I am a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. I can perform many commands such as creating stickers, using AI for various tasks, and other useful features. I am here to entertain and assist you!\n` +
            "\n" +
            `➛ ${formatter.bold("Bot")}: ${config.bot.name}\n` +
            `➛ ${formatter.bold("Version")}: ${require("../../../package.json").version}\n` +
            `➛ ${formatter.bold("Owner")}: ${config.owner.name}\n` +
            `➛ ${formatter.bold("Developer")}: SIFAT\n` +
            `➛ ${formatter.bold("Mode")}: ${tools.msg.ucwords(ctx.db.bot?.mode || "public")}\n` +
            `➛ ${formatter.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
            `➛ ${formatter.bold("Database")}: ${fs.existsSync(ctx.bot.databaseDir) ? tools.msg.formatSize(fs.readdirSync(ctx.bot.databaseDir).reduce((total, file) => total + fs.statSync(path.join(ctx.bot.databaseDir, file)).size, 0) / 1024) : "N/A"} (Simpl.DB with JSON)\n` +
            `➛ ${formatter.bold("Library")}: @itsreimau/gktw (Fork of @mengkodingan/ckptw)\n` +
            `➛ ${formatter.bold("GitHub")}: https://github.com/MYB-SIFU/MARINxWP-BOT`
        );
    }
};
