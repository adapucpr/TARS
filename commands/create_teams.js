const {SlashCommandBuilder, ChannelType, MessageFlags, AttachmentBuilder } = require("discord.js");
const { loadCategoriesData, saveCategoriesData } = require('../persistence/categories_persistence')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_teams')
        .setDescription('Cria canais para cada equipe de um desafio.')
        .addStringOption(option =>
            option.setName('challenge')
                .setDescription('Nome do desafio (ex: mini_1)')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('number_of_teams')
                .setDescription('Número de equipes a serem criadas')
                .setRequired(true)
        ),
    async execute(interaction) {
        const member = interaction.member;
        const server_admin = interaction.guild.roles.cache.find(role => role.name === "Server Admin");
            // Verifica se o usuário tem o cargo "admin"
            if (server_admin && !member.roles.cache.has(server_admin.id)) {
                const audioAttachment = new AttachmentBuilder('./resources/gugudada.wav', { name: 'gugudada.wav' });
                return await interaction.reply({ 
                  files: [audioAttachment],
                  content: '🔊 Gugu, dadada! \n***cc: Desculpa colega, esse comando você não pode rodar :/***',
                });      
              }
        

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const challenge = interaction.options.getString('challenge');
        const numTeams = interaction.options.getInteger('number_of_teams');

        const categoriesData = loadCategoriesData()

        if (!categoriesData[challenge]) {
            categoriesData[challenge] = [];
        }

        try {
            for (let i = 1; i <= numTeams; i++) {
                const teamName = `${challenge}_equipe_${i}`;

                const category = await interaction.guild.channels.create({
                    name: teamName,
                    type: ChannelType.GuildCategory,
                });

                const geralChannel = await interaction.guild.channels.create({
                    name: 'Geral',
                    type: ChannelType.GuildText,
                    parent: category.id,
                });

                const feedbacksChannel = await interaction.guild.channels.create({
                    name: 'Feedbacks',
                    type: ChannelType.GuildText,
                    parent: category.id,
                });

                const voiceChannel = await interaction.guild.channels.create({
                    name: 'Conversa',
                    type: ChannelType.GuildVoice,
                    parent: category.id,
                });

                categoriesData[challenge].push({
                    team_number: i,
                    category: category.id,
                    text: [geralChannel.id, feedbacksChannel.id],
                    voice: voiceChannel.id
                });
            }

            saveCategoriesData(categoriesData);

            await interaction.editReply(`Canais para ${numTeams} equipes criados com sucesso!`);

        } catch (error) {
            console.error(error);
            await interaction.editReply(`Houve um erro ao criar os canais: ${error}`);
        }
    },
};
