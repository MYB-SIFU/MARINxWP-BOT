const os = require("node:os");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "server",
    category: "info",
    code: async (ctx) => {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const cpus = os.cpus();

            await ctx.reply(
                `➛ ${formatter.bold("OS")}: ${os.type()} (${os.platform()})\n` +
                `➛ ${formatter.bold("Arch")}: ${os.arch()}\n` +
                `➛ ${formatter.bold("Release")}: ${os.release()}\n` +
                `➛ ${formatter.bold("Host")}: ${os.hostname()}\n` +
                "\n" +
                `➛ ${formatter.bold("Memory Used")}: ${tools.msg.formatSize(usedMem)}\n` +
                `➛ ${formatter.bold("Memory Free")}: ${tools.msg.formatSize(freeMem)}\n` +
                `➛ ${formatter.bold("Memory Total")}: ${tools.msg.formatSize(totalMem)}\n` +
                "\n" +
                `➛ ${formatter.bold("CPU Model")}: ${cpus[0].model}\n` +
                `➛ ${formatter.bold("CPU Speed")}: ${cpus[0].speed} MHz\n` +
                `➛ ${formatter.bold("CPU Cores")}: ${cpus.length}\n` +
                `➛ ${formatter.bold("Load Average")}: ${os.loadavg().map(avg => avg.toFixed(2)).join(", ")}\n` +
                "\n" +
                `➛ ${formatter.bold("Node.js")}: ${process.version}\n` +
                `➛ ${formatter.bold("Exec Path")}: ${process.execPath}\n` +
                `➛ ${formatter.bold("PID")}: ${process.pid}\n` +
                "\n" +
                `➛ ${formatter.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                `➛ ${formatter.bold("Database")}: ${fs.existsSync(ctx.bot.databaseDir) ? tools.msg.formatSize(fs.readdirSync(ctx.bot.databaseDir).reduce((total, file) => total + fs.statSync(path.join(ctx.bot.databaseDir, file)).size, 0) / 1024) : "N/A"} (Simpl.DB with JSON)\n` +
                `➛ ${formatter.bold("Library")}: @itsreimau/gktw`
            );
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
