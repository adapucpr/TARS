const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available commands'),
    async execute(interaction) {
        var str = '';
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
        const command = require(`./${file}`);
        str += `> **/${command.data.name}** \n > \`${command.data.description}\` \n\n`;

        }

        return interaction.reply({
        content: str,
        ephemeral: true,
        });
    },
};