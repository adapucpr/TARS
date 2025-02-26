const { Client, GatewayIntentBits, Partials, Events, Collection, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv').config()
const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

const prefix = '/';

const fs = require('fs');
const path = require('path');

client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name) {
        client.commands.set(command.name, command);
    } else {
        console.warn(`⚠️ Comando ${file} não tem uma propriedade 'name' válida.`);
    }
}


//To run the bot, just type 'node .' on the ../Tars/ directory
client.once('ready', () => {
    console.log('Tars is online');
});

client.on(Events.MessageCreate, (message) =>{    
    if(!message.content.startsWith(prefix) || message.author.bot){
        console.log('not for me baby');
        return;
    };

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // switch(command){
    //     case 'ping':
    //         client.commands.get('ping').execute(message, args);
    //         break
    // }
    const cmd = client.commands.get(command);

if (!cmd) {
    return message.channel.send('Esse comando eu não conheço, sô');
}

try {
    cmd.execute(message, args, client);
} catch (err) {
    console.error(`Erro ao executar o comando ${command}:`, err);
    message.channel.send('Ocorreu um erro ao executar esse comando.');
}

});


//This has to be the last line of the file
client.login(process.env.CLIENT_TOKEN);