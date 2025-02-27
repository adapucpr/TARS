const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team_randomizer')
        .setDescription('A command to auto-decide the order of the team on the given challenge presentation.')
        .addStringOption(option =>
            option.setName('challenge')
                .setDescription('Nome do desafio (ex: mini_1)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('shift')
                .setDescription('Turno (ex: manhã)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('teams')
                .setDescription('Nome das equipes separados por ; (ex: amigo esto aqui;balacobaco;time massa)')
                .setRequired(true)
        ),
    execute(interaction) {
        const challenge = interaction.options.getString('challenge');
        const shift = interaction.options.getString('shift');
        let teams = interaction.options.getString('teams').split(';');

        // Shuffle the teams array using Fisher-Yates algorithm
        for (let i = teams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [teams[i], teams[j]] = [teams[j], teams[i]]; // Swap elements
        }

        // Generate message
        const final_message = teams.map((team, index) => `> ${index + 1} - ${team}`).join('\n');

        interaction.reply(`Ordem das apresentações do **${challenge} da ${shift}**:\n${final_message}\n*Para mudar a ordem é só falar com a mentoria!*`);
    }
};
