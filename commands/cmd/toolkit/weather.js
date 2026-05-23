module.exports = {
    name: "weather",
    aliases: ["cuaca"],
    category: "toolkit",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "bogor")
            );

        try {
            const apiUrl = tools.api.createUrl("nexray", "/information/cuaca", {
                kota: input
            });
            const result = (await axios.get(apiUrl)).data.result.forecasts;

            const resultText = result.map(res =>
                `➛ ${formatter.bold("Time")}: ${res.waktu}\n` +
                `➛ ${formatter.bold("Weather")}: ${res.cuaca}\n` +
                `➛ ${formatter.bold("Temperature")}: ${res.suhu}\n` +
                `➛ ${formatter.bold("Humidity")}: ${res.kelembaban}\n` +
                `➛ ${formatter.bold("Wind Speed")}: ${res.kecepatan_angin}\n` +
                `➛ ${formatter.bold("Wind Direction")}: ${res.arah_angin}\n` +
                `➛ ${formatter.bold("Visibility")}: ${res.visibilitas}`
            ).join("\n\n");
            await ctx.reply(resultText.trim());
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};
