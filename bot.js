const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
  else if (msg.content === '!prins'){
    msg.channel.send('Ganteng!');
  }
  else if (msg.content === '!agung'){
    msg.channel.send('Cuman temen nya Bila!');
  }
});

client.login(auth.token);
