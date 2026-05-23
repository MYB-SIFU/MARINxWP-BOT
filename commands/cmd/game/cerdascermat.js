const session = new Map();

module.exports = {
    name: "cerdascermat",
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(tools.msg.info("A game session is already running!"));

        try {
            const mapel = {
                bindo: "Indonesian Language",
                tik: "Information and Communication Technology",
                pkn: "Pancasila and Civic Education",
                bing: "English Language",
                penjas: "Physical Education and Health",
                pai: "Islamic Religious Education",
                matematika: "Mathematics",
                jawa: "Javanese Language",
                ips: "Social Studies",
                ipa: "Natural Science"
            };
            const input = ctx.args?.[0] && mapel[ctx.args[0]] ? ctx.args[0] : "tik";
            const apiUrl = tools.api.createUrl("siputzx", "/api/games/cc-sd", {
                matapelajaran: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.data.soal);

            const game = {
                coin: 5,
                timeout: 60000,
                answerKey: result.jawaban_benar,
                answer: result.semua_jawaban.find(ans => Object.keys(ans)[0] === result.jawaban_benar)[result.jawaban_benar].toLowerCase()
            };

            session.set(ctx.id, true);

            await ctx.reply({
                text: `— ${result.pertanyaan}\n` +
                    `${result.semua_jawaban.map(answers => {
                        const answer = Object.keys(answers)[0];
                        return `${answer.toUpperCase()}. ${answers[answer]}`;
                    }).join("\n")}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Subject")}: ${mapel[input]}\n` +
                    `➛ ${formatter.bold("Bonus")}: ${game.coin} Coins\n` +
                    `➛ ${formatter.bold("Time Limit")}: ${tools.msg.convertMsToDuration(game.timeout)}\n` +
                    `➛ ${formatter.bold("How to Answer")}: Type A, B, C, or D`,
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
                text: "Subject List",
                sections: [{
                    title: "Select Subject",
                    highlight_label: "🌕",
                    rows: Object.keys(mapel).map(key => ({
                        title: key.toUpperCase(),
                        description: `Click to play subject ${mapel[key]}`,
                        id: `${ctx.used.prefix + ctx.used.command} ${key}`
                    }))
                }]
            }];

            collector.on("collect", async (collCtx) => {
                const participantAnswer = collCtx.msg.body?.toLowerCase();
                const participantDb = collCtx.db.user;

                if (participantAnswer === game.answerKey) {
                    session.delete(ctx.id);
                    collector.stop();
                    participantDb.coin += game.coin;
                    participantDb.winGame += 1;
                    await participantDb.save();
                    await collCtx.reply({
                        text: tools.msg.info(`Correct! +${game.coin} Coins`),
                        buttons: playAgain
                    });
                } else if (participantAnswer === `surrender_${ctx.used.command}`) {
                    session.delete(ctx.id);
                    collector.stop();
                    await collCtx.reply({
                        text: tools.msg.info(`You surrendered! The answer is ${game.answer} (${game.answerKey.toUpperCase()}).`),
                        buttons: playAgain
                    });
                }
            });

            collector.on("end", async () => {
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: tools.msg.info(`Time's up! The answer is ${game.answer}(${game.answerKey.toUpperCase()}).`),
                        buttons: playAgain
                    });
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};
