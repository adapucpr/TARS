const { SlashCommandBuilder, ChannelType, MessageFlags, AttachmentBuilder } = require('discord.js')
const { loadCategoriesData, saveCategoriesData } = require('../persistence/categories_persistence')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('archive_teams')
        .setDescription('Archives channels of a challenge.')
        .addStringOption(option =>
            option.setName('challenge')
                .setDescription('Challenge name (ex: mini_1)')
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
        

        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        const challenge = interaction.options.getString('challenge');

        const categoriesData = loadCategoriesData();
        const challengeData = categoriesData[challenge];

        if (!challengeData) {
            return interaction.reply(`No categories for challenge ${challenge} found.`);
        }

        const archiveCategoryName = `arquivo_${challenge}`;
        const archiveCategory = await interaction.guild.channels.create({
            name: archiveCategoryName,
            type: ChannelType.GuildCategory
        });

        for (const team of challengeData) {
            for (const textChannelId of team.text) {
                const textChannel = interaction.guild.channels.cache.get(textChannelId);
                if (textChannel) {
                    const newName = `equipe_${team.team_number}_${textChannel.name}`;
                    textChannel.setName(newName);
                    await textChannel.setParent(archiveCategory.id);
                }
            }

            const voiceChannel = interaction.guild.channels.cache.get(team.voice);
            if (voiceChannel) {
                await voiceChannel.delete();
            }

            const origCategory = interaction.guild.channels.cache.get(team.category);
            if (origCategory) {
                const childChannels = interaction.guild.channels.cache.filter(ch => ch.parentId === origCategory.id);
                if (childChannels.size === 0) {
                    await origCategory.delete();
                }
            }
        }

        delete categoriesData[challenge];
        saveCategoriesData(categoriesData);

        await interaction.editReply(`Archiving for challenge ${challenge} finished successfully.`);
    }
}