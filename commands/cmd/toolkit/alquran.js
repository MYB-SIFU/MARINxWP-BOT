module.exports = {
    name: "alquran",
    aliases: ["quran"],
    category: "toolkit",
    code: async (ctx) => {
        const [surat, ayat] = ctx.args;

        if (!surat && !ayat)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "21 35")}\n` +
                tools.msg.generateNotes([
                    `Type ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} to see the list.`
                ])
            );

        if (surat.toLowerCase() === "list") {
            const listText = await tools.list.get("alquran");
            return await ctx.reply(listText);
        }

        if (isNaN(surat) || surat < 1 || surat > 114) return await ctx.reply(tools.msg.info("Surah must be a number between 1 and 114!"));

        try {
            const apiUrl = tools.api.createUrl("https://islami.api.akuari.my.id", "/alquran", {
                query: surat
            });
            const result = (await axios.get(apiUrl)).data.result;
            const verses = result.verses;

            if (ayat) {
                if (ayat.includes("-")) {
                    const [startAyat, endAyat] = ayat.split("-").map(Number);
                    if (isNaN(startAyat) || isNaN(endAyat) || startAyat < 1 || endAyat < startAyat) return await ctx.reply(tools.msg.info("Verse range is not valid!"));
                    const selectedVerses = verses.filter(vers => vers.number >= startAyat && vers.number <= endAyat);
                    if (!selectedVerses.length) return await ctx.reply(tools.msg.info(`No verses found in range ${startAyat}-${endAyat}!`));

                    const versesText = selectedVerses.map(vers =>
                        `➛ ${formatter.bold("Verse")}: ${vers.number}\n` +
                        `${vers.text}\n` +
                        formatter.italic(vers.translation_id)
                    ).join("\n");
                    await ctx.reply(
                        `${versesText}\n` +
                        "\n" +
                        `➛ ${formatter.bold("Surah")}: ${result.name}\n` +
                        `➛ ${formatter.bold("Meaning")}: ${result.name_translations.id}`
                    );
                } else {
                    const singleAyat = parseInt(ayat, 10);
                    if (isNaN(singleAyat) || singleAyat < 1) return await ctx.reply(tools.msg.info("Verse must be a valid number greater than 0!"));
                    const verse = verses.find(vers => vers.number === singleAyat);
                    if (!verse) return await ctx.reply(tools.msg.info(`Verse ${singleAyat} does not exist!`));

                    await ctx.reply(
                        `${verse.text}\n` +
                        `${formatter.italic(verse.translation_id)}\n` +
                        "\n" +
                        `➛ ${formatter.bold("Surah")}: ${result.name}\n` +
                        `➛ ${formatter.bold("Meaning")}: ${result.name_translations.id}\n` +
                        `➛ ${formatter.bold("Verse")}: ${singleAyat}`
                    );
                }
            } else {
                const versesText = verses.map(vers =>
                    `➛ ${formatter.bold("Verse")}: ${vers.number}\n` +
                    `${vers.text}\n` +
                    formatter.italic(vers.translation_id)
                ).join("\n");
                await ctx.reply(
                    `${versesText}\n` +
                    "\n" +
                    `➛ ${formatter.bold("Surah")}: ${result.name}\n` +
                    `➛ ${formatter.bold("Meaning")}: ${result.name_translations.id}`
                );
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};
