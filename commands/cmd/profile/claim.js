const claimRewards = {
    daily: { reward: 100, cooldown: 24 * 60 * 60 * 1000, level: 1 },
    weekly: { reward: 500, cooldown: 7 * 24 * 60 * 60 * 1000, level: 15 },
    monthly: { reward: 2000, cooldown: 30 * 24 * 60 * 60 * 1000, level: 50 },
    yearly: { reward: 10000, cooldown: 365 * 24 * 60 * 60 * 1000, level: 75 }
};

module.exports = {
    name: "claim",
    aliases: ["bonus"],
    category: "profile",
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "daily")}\n` +
                tools.msg.generateNotes([
                    `Type ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} to see the list.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("claim");
            return await ctx.reply(listText);
        }

        const senderDb = ctx.db.user;
        const claim = claimRewards[input];
        const level = senderDb?.level || 0;

        if (!claim) return await ctx.reply(tools.msg.info("Invalid reward type!"));
        if (ctx.sender.isOwner()) return await ctx.reply(tools.msg.info("You already have unlimited coins!"));
        if (level < claim.level) return await ctx.reply(tools.msg.info(`You need to reach level ${claim.level} to claim this reward. Your current level is ${level}.`));

        const currentTime = Date.now();
        const lastClaim = (senderDb?.lastClaim ?? {})[input] || 0;
        const timePassed = currentTime - lastClaim;
        const remainingTime = claim.cooldown - timePassed;
        if (remainingTime > 0) return await ctx.reply(tools.msg.info(`You have already claimed ${input}. Wait ${tools.msg.convertMsToDuration(remainingTime)} to claim again.`));

        try {
            const rewardCoin = (senderDb?.coin || 0) + claim.reward;
            senderDb.coin = rewardCoin;
            (senderDb.lastClaim ||= {})[input] = currentTime;
            senderDb.save();
            await ctx.reply(tools.msg.info(`You have successfully claimed the ${input} reward of ${claim.reward} coins! Your current coins: ${rewardCoin}.`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
