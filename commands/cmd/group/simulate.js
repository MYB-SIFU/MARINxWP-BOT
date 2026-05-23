const { Events } = require("@itsreimau/gktw");
const { handleWelcome } = require("../../event/welcome.js");

module.exports = {
    name: "simulate",
    aliases: ["sim"],
    category: "group",
    permissions: { botAdmin: true, group: true },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "join")}\n` +
                tools.msg.generateNotes([`Use ${formatter.inlineCode("leave")} to simulate leaving the group.`])
            );

        try {
            const welcome = { id: ctx.id, participant: ctx.sender.lid, participantPn: ctx.sender.jid };
            switch (input.toLowerCase()) {
                case "j": case "join": await handleWelcome(ctx, welcome, Events.UserJoin, true); break;
                case "l": case "leave": await handleWelcome(ctx, welcome, Events.UserLeave, true); break;
                default: return await ctx.reply(tools.msg.info(`Simulation ${formatter.inlineCode(input)} is not valid!`));
            }
            await ctx.reply(tools.msg.info("Simulation sent successfully!"));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};
