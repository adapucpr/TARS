const {SlashCommandBuilder, ChannelType, MessageFlags} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_teams')
        .setDescription('Cria canais para cada equipe de um desafio.')
        .addStringOption(option =>
            option.setName('challenge')
                .setDescription('Nome do desafio (ex: mini1)')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('number_of_teams')
                .setDescription('Número de equipes a serem criadas')
                .setRequired(true)
        ),
    async execute(interaction) {
        const challenge = interaction.options.getString('challenge');
        const numTeams = interaction.options.getInteger('number_of_teams');
        try {
            for (let i = 1; i <= numTeams; i++) {
                const teamName = `${challenge}_equipe_${i}`;

                const category = await interaction.guild.channels.create({
                    name: teamName,
                    type: ChannelType.GuildCategory,
                });

                await interaction.guild.channels.create({
                    name: 'Geral',
                    type: ChannelType.GuildText,
                    parent: category.id,
                });

                await interaction.guild.channels.create({
                    name: 'Feedbacks',
                    type: ChannelType.GuildText,
                    parent: category.id,
                });

                await interaction.guild.channels.create({
                    name: 'Conversa',
                    type: ChannelType.GuildVoice,
                    parent: category.id,
                });
            }

            await interaction.reply({
                content: `Canais para ${numTeams} equipes criados com sucesso!`,
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `Houve um erro ao criar os canais: ${error}`,
                flags: MessageFlags.Ephemeral
            });
        }
    },
};
