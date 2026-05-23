const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "menu",
    aliases: ["allmenu", "help"],
    category: "core",
    code: async (ctx) => {
        try {
            const { cmd } = ctx.bot;
            const tag = {
                "ai-chat": "AI (Chat)",
                "ai-generate": "AI (Generate)",
                "ai-misc": "AI (Misc)",
                converter: "Converter",
                downloader: "Downloader",
                game: "Game",
                group: "Group",
                maker: "Maker",
                profile: "Profile",
                search: "Search",
                toolkit: "Toolkit",
                admin: "Admin",
                info: "Information",
                misc: "Misc"
            };

            const getCommands = (categories) => {
                const result = {};
                const allCmds = Array.from(cmd.values());
                categories.forEach(cat => {
                    const filtered = allCmds.filter(c => c.category === cat).map(c => ({
                        name: c.name,
                        permissions: c.permissions || {}
                    }));
                    if (filtered.length > 0) result[cat] = filtered;
                });
                return result;
            };

            const formatPerms = (perms) => {
                let format = "";
                if (perms.coin) format += "ⓒ";
                if (perms.group) format += "Ⓖ";
                if (perms.owner) format += "Ⓞ";
                if (perms.premium) format += "Ⓟ";
                if (perms.private) format += "ⓟ";
                return format;
            };

            const input = ctx.args[0]?.toLowerCase();
            if (input || ctx.used.command === "allmenu") {
                const selectedCats = input === "all" || ctx.used.command === "allmenu"
                    ? Object.keys(tag)
                    : (tag[input] ? [input] : []);
                const commandsData = getCommands(selectedCats);

                if (Object.keys(commandsData).length === 0)
                    return await ctx.reply(tools.msg.info("Menu not found!"));

                let text = "";
                for (const [key, list] of Object.entries(commandsData)) {
                    text += "╭┈┈┈┈┈┈ ♡\n" + `┊ ✿ — ${formatter.bold(tag[key] || key)}\n`;
                    list.forEach(c => { text += `┊ ➛ ${ctx.used.prefix + c.name} ${formatPerms(c.permissions)}\n`; });
                    text += "╰┈┈┈┈┈┈\n\n";
                }
                await ctx.reply(text.trim());
            } else {
                const userDb = ctx.db.user;
                const text =
                    `— Hello, @${ctx.getId(ctx.sender.jid)}! I am a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}.\n` +
                    "\n" +
                    `➛ ${formatter.bold("Status")}: ${ctx.sender.isOwner() ? "Owner" : (userDb?.premium ? `Premium (${userDb?.premiumExpiration ? `${tools.msg.convertMsToDuration(Date.now() - userDb.premiumExpiration, ["days", "hours"])} remaining` : "Lifetime"})` : "Free")}\n` +
                    `➛ ${formatter.bold("Level")}: ${userDb?.level || 0} (${userDb?.xp || 0}/100)\n` +
                    `➛ ${formatter.bold("Coins")}: ${ctx.sender.isOwner() || userDb?.premium ? "Unlimited" : (userDb?.coin || 0)}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Mode")}: ${tools.msg.ucwords(ctx.db.bot?.mode || "public")}\n` +
                    `➛ ${formatter.bold("Uptime")}: ${tools.msg.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
                    `➛ ${formatter.bold("Database")}: ${fs.existsSync(ctx.bot.databaseDir) ? tools.msg.formatSize(fs.readdirSync(ctx.bot.databaseDir).reduce((total, file) => total + fs.statSync(path.join(ctx.bot.databaseDir, file)).size, 0) / 1024) : "N/A"}\n` +
                    `➛ ${formatter.bold("Library")}: @itsreimau/gktw\n` +
                    `➛ ${formatter.bold("Developer")}: SIFAT\n` +
                    "\n" +
                    `☆ ${formatter.italic("Support the bot to keep it running!")}`;

                const rows = Object.keys(tag).map(category => ({
                    title: tag[category],
                    description: `View ${tag[category]} commands`,
                    id: `${ctx.used.prefix + ctx.used.command} ${category}`
                }));
                rows.unshift({
                    title: "All Categories",
                    description: "View all commands at once",
                    id: `${ctx.used.prefix + ctx.used.command} all`
                });

                await ctx.reply({
                    image: { url: config.bot.thumbnail },
                    caption: text.trim(),
                    mentions: [ctx.sender.jid],
                    footer: config.msg.footer,
                    optionText: "Options",
                    optionTitle: "Select an option",
                    offerText: config.bot.name,
                    offerCode: config.system.customPairingCode,
                    offerUrl: config.bot.groupLink,
                    offerExpiration: Date.now() + 3_600_000,
                    nativeFlow: [{
                        text: "Command List",
                        sections: [{ title: "Select Menu Category", highlight_label: "🌕", rows }]
                    }, {
                        text: "Contact Owner",
                        id: `${ctx.used.prefix}owner`
                    }, {
                        text: "Donate",
                        id: `${ctx.used.prefix}donate`
                    }]
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
