const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: 'reactionrole',
    description: "Sets up a reaction role message!",
    async execute(message, args, client) {
        if (!client) {
            console.error("❌ Erro: client não foi passado corretamente para reactionrole.js");
            return message.channel.send("Houve um erro ao executar esse comando.");
        }

        const channelId = '1343699249879187460';
        const space_invader = '👾';
        const paintbrush = '🖌️';

        let embed = new EmbedBuilder()
            .setColor('#e42643')
            .setTitle('Escolha sua área de ajuda!')
            .setDescription(`${space_invader} Quero Ajudar com programação\n${paintbrush} Quero Ajudar com Design`);

        let messageEmbed = await message.channel.send({ embeds: [embed] });
        await messageEmbed.react(space_invader);
        await messageEmbed.react(paintbrush);

        if (!client.reactionRoleSetup) {
            client.reactionRoleSetup = true;

            client.on(Events.MessageReactionAdd, async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot || !reaction.message.guild) return;

                if (reaction.message.channel.id === channelId) {
                    const ajudaprogs = reaction.message.guild.roles.cache.find(role => role.name === "ajuda-progs");
                    const ajudadesign = reaction.message.guild.roles.cache.find(role => role.name === "ajuda-design");

                    const member = reaction.message.guild.members.cache.get(user.id);
                    if (!member) return;

                    if (reaction.emoji.name === space_invader) {
                        await member.roles.add(ajudaprogs);
                    } else if (reaction.emoji.name === paintbrush) {
                        await member.roles.add(ajudadesign);
                    }
                }
            });

            client.on(Events.MessageReactionRemove, async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot || !reaction.message.guild) return;

                if (reaction.message.channel.id === channelId) {
                    const ajudaprogs = reaction.message.guild.roles.cache.find(role => role.name === "ajuda-progs");
                    const ajudadesign = reaction.message.guild.roles.cache.find(role => role.name === "ajuda-design");

                    const member = reaction.message.guild.members.cache.get(user.id);
                    if (!member) return;

                    if (reaction.emoji.name === space_invader) {
                        await member.roles.remove(ajudaprogs);
                    } else if (reaction.emoji.name === paintbrush) {
                        await member.roles.remove(ajudadesign);
                    }
                }
            });
        }
    }
};
