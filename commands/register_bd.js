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
            option.setName('dia')
                .setDescription('Dia do mês do seu aniversário')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mês')
                .setDescription('Mês do seu aniversário')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Crossposted })

        try {
            var dia = interaction.options.getString('dia')
            var mes = interaction.options.getString('mês')
            const nome = interaction.options.getString('nome')

            dia = dia.length < 2 ? ('0' + dia) : (dia)
            mes = mes.length < 2 ? ('0' + mes) : (mes)

            const dateToInsert = mes + '-' + dia

            await pool.query("INSERT INTO birthday VALUES($1, $2);", [dateToInsert, nome]);

            await interaction.editReply('Zezé agora sabe o níver de ' + nome + '!')
        } catch (err) {
            console.log(err.message)
            await interaction.editReply('Houve um erro, tente novamente :(')
        }
    }
}