const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('This is a ping command'),
    execute(interaction) {
        interaction.reply('pong!');
    }
};