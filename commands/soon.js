const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soon')
        .setDescription('Comming soon to the bot...'),
    execute(interaction) {
        interaction.reply('Estamos planejando algumas funções de moderação, comandos engraçadinhos e funções de canal de voz!');
    }
};