const session = new Map();

module.exports = {
    name: "family100",
    category: "game",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(tools.msg.info("A game session is already running!"));

        try {
            const apiUrl = tools.api.createUrl("siputzx", "/api/games/family100");
            const result = (await axios.get(apiUrl)).data.data;

            const game = {
                coin: {
                    answered: 5,
                    allAnswered: 10
                },
                timeout: 90000,
                answers: new Set(result.jawaban.map(ans => ans.toLowerCase())),
                participants: new Set()
            };

            session.set(ctx.id, true);

            await ctx.reply({
                text: `— ${result.soal}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Bonus")}: ${game.coin.answered} Coins for 1 correct answer, ${game.coin.allAnswered} Coins for all answers correct\n` +
                    `➛ ${formatter.bold("Total Answers")}: ${game.answers.size}\n` +
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
                id: ctx.used.prefix + ctx.used.command
            }];

            collector.on("collect", async (collCtx) => {
                const participantAnswer = collCtx.msg.body?.toLowerCase();
                const participantDb = collCtx.db.user;

                if (game.answers.has(participantAnswer)) {
                    game.answers.delete(participantAnswer);
                    game.participants.add(collCtx.sender.lid);

                    participantDb.coin += game.coin.answered;
                    participantDb.save();
                    await collCtx.reply(tools.msg.info(`${tools.msg.ucwords(participantAnswer)} correct! Answers remaining: ${game.answers.size}`));

                    if (game.answers.size === 0) {
                        session.delete(ctx.id);
                        collector.stop();
                        for (const participant of game.participants) {
                            const allParticipantDb = ctx.getDb("users", participant);
                            allParticipantDb.coin += game.coin.allAnswered;
                            allParticipantDb.winGame += 1;
                            allParticipantDb.save();
                        }
                        await collCtx.reply({
                            text: tools.msg.info(`Congratulations! All answers found! Every participant who answered gets ${game.coin.allAnswered} coins.`),
                            buttons: playAgain
                        });
                    }
                } else if (participantAnswer === `surrender_${ctx.used.command}`) {
                    const remaining = [...game.answers].map(tools.msg.ucwords).join(", ").replace(/, ([^,]*)$/, ", and $1");
                    session.delete(ctx.id);
                    collector.stop();
                    await collCtx.reply({
                        text: tools.msg.info(`You surrendered! Unanswered items: ${remaining}.`),
                        buttons: playAgain
                    });
                } else if (tools.cmd.didYouMean(participantAnswer, [game.answer]) === game.answer) {
                    await collCtx.reply(tools.msg.info("So close!"));
                }
            });

            collector.on("end", async () => {
                const remaining = [...game.answers].map(tools.msg.ucwords).join(", ").replace(/, ([^,]*)$/, ", and $1");

                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: tools.msg.info(`Time's up! Unanswered items: ${remaining}.`),
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};
