const { SlashCommandBuilder, EmbedBuilder, Events, MessageFlags, AttachmentBuilder } = require('discord.js');

module.exports = { 
  data: new SlashCommandBuilder()
    .setName('reaction_role')
    .setDescription('Configura a mensagem de reaction role!'),
  async execute(interaction) {
    const client = interaction.client;
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

    const channelId = interaction.channelId;
    const space_invader = '👾';
    const paintbrush = '🖌️';

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const embed = new EmbedBuilder()
      .setColor('#e42643')
      .setTitle('Escolha sua área de ajuda!')
      .setDescription(`${space_invader} Quero Ajudar com programação\n${paintbrush} Quero Ajudar com Design`);

    const channel = interaction.guild.channels.cache.get(channelId) || interaction.channel;
    
    const messageEmbed = await channel.send({ embeds: [embed] });
    await messageEmbed.react(space_invader);
    await messageEmbed.react(paintbrush);

    if (!client.reactionRoleSetup) {
      client.reactionRoleSetup = true;

      client.on(Events.MessageReactionAdd, async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot || !reaction.message.guild) return;

        if (reaction.message.channel.id === channelId) {
          const ajudaProgs = reaction.message.guild.roles.cache.find(role => role.name === "ajuda-progs");
          const ajudaDesign = reaction.message.guild.roles.cache.find(role => role.name === "ajuda-design");

          const member = reaction.message.guild.members.cache.get(user.id);
          if (!member) return;

          if (reaction.emoji.name === space_invader && ajudaProgs) {
            await member.roles.add(ajudaProgs);
          } else if (reaction.emoji.name === paintbrush && ajudaDesign) {
            await member.roles.add(ajudaDesign);
          }
        }
      });

      client.on(Events.MessageReactionRemove, async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot || !reaction.message.guild) return;

        if (reaction.message.channel.id === channelId) {
          const ajudaProgs = reaction.message.guild.roles.cache.find(role => role.name === "ajuda-progs");
          const ajudaDesign = reaction.message.guild.roles.cache.find(role => role.name === "ajuda-design");

          const member = reaction.message.guild.members.cache.get(user.id);
          if (!member) return;

          if (reaction.emoji.name === space_invader && ajudaProgs) {
            await member.roles.remove(ajudaProgs);
          } else if (reaction.emoji.name === paintbrush && ajudaDesign) {
            await member.roles.remove(ajudaDesign);
          }
        }
      });
    }

    await interaction.editReply("Mensagem de reaction role configurada com sucesso!");
  }
};
