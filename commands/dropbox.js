const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dropbox')
        .setDescription('Gives the Academy Dropbox link'),
    execute(interaction) {
        interaction.reply('https://www.dropbox.com/scl/fo/ymoh5c7as17vd2jqwojdn/AGVnjqa_402ros-Xd4Tl3PQ?rlkey=18xf2rer3zak5756o7kare9td&st=p6w9ojby&dl=0');
    }
};