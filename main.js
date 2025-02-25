const { Client, GatewayIntentBits, Partials, Events, Collection } = require('discord.js');
const dotenv = require('dotenv').config()
const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds], partials: [Partials.Channel] });

const prefix = '/';

const fs = require('fs');

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
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
    try {
        client.commands.get(command).execute(message, args);
    } catch (err) {
        console.log(err.message);
        message.channel.send('Esse comando eu não conheço, sô');
    }
});


//This has to be the last line of the file
client.login(process.env.CLIENT_TOKEN);