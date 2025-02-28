const { Client, GatewayIntentBits, Partials, Events, Collection, MessageFlags } = require('discord.js');
const dotenv = require('dotenv').config()
const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

const { birthdayTimer } = require('./database/db_api')
const prefix = '/';

const fs = require('fs');
const path = require('path');

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/')
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name || command.data.name, command);
}


//To run the bot, just type 'node .' on the ../Tars/ directory
client.once('ready', () => {
    console.log('Tars is online');
    birthdayTimer(client)
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error)
        await interaction.editReply('Ocorreu um erro ao executar o comando!');
    }
});

//This has to be the last line of the file
client.login(process.env.CLIENT_TOKEN);
