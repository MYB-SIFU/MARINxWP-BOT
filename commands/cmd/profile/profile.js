module.exports = {
    name: "profile",
    aliases: ["me", "prof"],
    category: "profile",
    code: async (ctx) => {
        try {
            const users = ctx.db.users.getAll();
            const userDb = ctx.db.user;

            const leaderboardData = users.map(user => ({
                jid: user.jid, level: user.level || 0, winGame: user.winGame || 0
            })).sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const profilePictureUrl = await ctx.profilePictureUrl(ctx.sender.jid);
            const canvasUrl = tools.api.createUrl("siputzx", "/api/canvas/profile", {
                backgroundURL: "https://picsum.photos/850/300",
                avatarURL: profilePictureUrl,
                rankName: "RANK",
                rankId: leaderboardData.findIndex(user => tools.cmd.areJidsSameUser(user.jid, ctx.sender.lid)) + 1,
                exp: userDb?.xp || 0,
                requireExp: "100",
                level: userDb?.level || 0,
                name: ctx.sender.pushName
            });

            await ctx.reply({
                image: { url: canvasUrl },
                caption:
                    `➛ ${formatter.bold("Name")}: ${ctx.sender.pushName}\n` +
                    `➛ ${formatter.bold("Status")}: ${ctx.sender.isOwner() ? "Owner" : (userDb?.premium ? `Premium (${userDb?.premiumExpiration ? `${tools.msg.convertMsToDuration(Date.now() - userDb.premiumExpiration, ["days", "hours"])} remaining` : "Lifetime"})` : "Free")}\n` +
                    `➛ ${formatter.bold("Level")}: ${userDb?.level || 0} (${userDb?.xp || 0}/100)\n` +
                    `➛ ${formatter.bold("Coins")}: ${ctx.sender.isOwner() || userDb?.premium ? "Unlimited" : (userDb?.coin || 0)}\n` +
                    `➛ ${formatter.bold("Wins")}: ${userDb?.winGame || 0}\n` +
                    `➛ ${formatter.bold("Rank")}: ${leaderboardData.findIndex(user => tools.cmd.areJidsSameUser(user.jid, ctx.sender.lid)) + 1}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
