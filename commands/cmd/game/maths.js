const session = new Map();

module.exports = {
    name: "maths",
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(tools.msg.info("A game session is already running!"));

        try {
            const levels = {
                noob: "Noob",
                easy: "Easy",
                medium: "Medium",
                hard: "Hard",
                extreme: "Extreme",
                impossible: "Impossible",
                impossible2: "Impossible II",
                impossible3: "Impossible III",
                impossible4: "Impossible IV",
                impossible5: "Impossible V"
            };
            const input = ctx.args?.[0] && levels.hasOwnProperty(ctx.args[0]) ? ctx.args[0] : "random";
            const apiUrl = tools.api.createUrl("siputzx", "/api/games/maths", {
                level: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const game = {
                coin: result.bonus,
                timeout: result.time,
                answer: String(result.result)
            };

            session.set(ctx.id, true);

            await ctx.reply({
                text: `— ${result.str}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Level")}: ${levels[result.mode]}\n` +
                    `➛ ${formatter.bold("Bonus")}: ${game.coin} Coins\n` +
                    `➛ ${formatter.bold("Time Limit")}: ${tools.msg.convertMsToDuration(game.timeout)}`,
                buttons: [{
                    text: "Surrender",
                    id: `surrender_${ctx.used.command}`
                }]
            });

            const collector = ctx.MessageCollector({
                time: game.timeout
            });

            const playAgain = [{
                text: "Play Again",
                id: `${ctx.used.prefix + ctx.used.command} ${input}`
            }, {
                text: "Level List",
                sections: [{
                    title: "Select Level",
                    highlight_label: "🌕",
                    rows: Object.keys(levels).map(level => ({
                        title: levels[level],
                        description: `Click to play level ${levels[level]}`,
                        id: `${ctx.used.prefix + ctx.used.command} ${level}`
                    }))
                }]
            }];

            collector.on("collect", async (collCtx) => {
                const participantAnswer = collCtx.msg.body?.toLowerCase();
                const participantDb = collCtx.db.user;

                if (participantAnswer === game.answer) {
                    session.delete(ctx.id);
                    collector.stop();
                    participantDb.coin += game.coin;
                    participantDb.winGame += 1;
                    participantDb.save();
                    await collCtx.reply({
                        text: tools.msg.info(`Correct! +${game.coin} Coins`),
                        buttons: playAgain
                    });
                } else if (participantAnswer === `surrender_${ctx.used.command}`) {
                    session.delete(ctx.id);
                    collector.stop();
                    await collCtx.reply({
                        text: tools.msg.info(`You surrendered! The answer is ${tools.msg.ucwords(game.answer)}.`),
                        buttons: playAgain
                    });
                }
            });

            collector.on("end", async () => {
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: tools.msg.info(`Time's up! The answer is ${tools.msg.ucwords(game.answer)}.`),
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};
