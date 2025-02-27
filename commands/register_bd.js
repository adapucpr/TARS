const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { pool } = require("../database/db_api")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bday')
        .setDescription('Coloca o seu aniversário para o Zezé te parabenizar!')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Seu nome')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('data')
                .setDescription('Formato: mm-dd')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Crossposted })

        try {
            const data = interaction.options.getString('data')
            const nome = interaction.options.getString('nome')

            await pool.query("INSERT INTO birthday VALUES($1, $2);", [data, nome]);

            await interaction.editReply('Zezé agora sabe o níver de ' + nome + '!')
        } catch (err) {
            console.log(err.message)
            await interaction.editReply('Houve um erro, tente novamente :(')
        }
    }
}