const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dropbox')
        .setDescription('Gives the Academy Dropbox link'),
    execute(interaction) {
        interaction.reply('https://www.dropbox.com/scl/fo/ci9endqr35wxbi236kxx6/ABn_Z2rVYuMQhqAibeU3kp8?rlkey=c72i5onqp1fqsve1ittkyrqam&st=mtof39ez&dl=0');
    }
};