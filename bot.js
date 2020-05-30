const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const ytdl = require('ytdl-core');


const prefix = '!';
const queue = new Map();



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.once('shardReconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnecting!');
});

client.on('guildMemberAdd', member => {
  //console.log('User ' + member.user.username + 'sudah bergabung dengan server!');
  const channel = member.guild.channels.find(channel => channel.name === "newmember_log");
  channel.send(member.user.username + 'baru gabung ke server! tapi bentar lagi di kick');
  var role = member.guild.roles.find('name', 'Balzol Knight');
  member.roles.add(role);
});

client.on('message', async msg => {

  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) 
    return;

    let args = msg.content.slice(prefix.length).trim().split(' ');
    let command = args.shift().toLowerCase();
    const serverQueue = queue.get(msg.guild.id);

    if (command === 'ayen') {
      msg.channel.send('Jomblo!');
    }
    else if (command == 'prinslagiapa' || msg.content == '?prinslagiapa') {
      msg.channel.send("Lagi gawe bngst");
    }
    else if (command === 'prins') {
      msg.channel.send('Ganteng!');
    }
    else if (command === 'agung') {
      msg.channel.send('Cuman temen nya Bila!');
    }
    else if (command === 'irja' || command == 'irza') {
      msg.channel.send('Ganteng dengan sonic nya');
    }
    else if (command === 'join') {
      if (!msg.member.voice.channel) {
        msg.channel.send("Join voice channel dulu jing!");
      }
      msg.member.voice.channel.join();
    }
    else if (command === 'play' || command === 'p' || command === 'prinskece') {
      execute(msg, serverQueue);
    }
    else if (command === 'skip' || command === 's') {
      skip(msg, serverQueue);
    }
    else if (command === 'stop') {
      stop(msg, serverQueue);
    }
    else if (command === 'leave') {
      if (!msg.guild.me.voice.channel) {
        return msg.channel.send("Bot Agung nya aja ga di voice channel bodoh");
      }

      if (msg.guild.me.voice.channelID !== msg.member.voice.channelID)
        return msg.channel.send("Voice channel lo barengin dulu sama bot nya tolol");

      msg.member.voice.channel.leave();

      msg.channel.send("Dadah para kafir...");

    }
    else {
      msg.channel.send("Kalo ngasih command jangan asal tod");
    }
  });

async function execute(message, serverQueue) {
  const args = message.content.split(" ");
  songTitle = args[1];

  //Check if user is in the voice channel
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "Join voice channel dulu pinter"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} udah masuk antrian, sabarin ye`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("Apa yang mau di skip bngst");
  serverQueue.connection.dispatcher.end();
  serverQueue.textChannel.send(`Skip - skip lagu orang aja nih bngst`);

}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  /*if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }*/
  //{filter: "audioonly"}
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url), { filter: "audioonly" })
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Nih gue start lagu: **${song.title}**, Puas anjing?`);

}




client.login(auth.token);
