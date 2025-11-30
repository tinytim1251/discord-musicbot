const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, ActivityType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Store queues for each guild
const queues = new Map();

// Array of motivational messages
const motivationalMessages = [
  "🌟 You've got this! Every step forward is progress, no matter how small.",
  "💪 Believe in yourself! You're capable of amazing things.",
  "🚀 Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "✨ You are stronger than you think and more capable than you imagine.",
  "🎯 Focus on progress, not perfection. Every day is a new opportunity!",
  "🔥 Your potential is limitless. Keep pushing forward!",
  "💎 Challenges are what make life interesting. Overcoming them is what makes life meaningful.",
  "🌈 The only way to do great work is to love what you do. Keep going!",
  "⚡ Don't wait for the perfect moment. Start where you are, use what you have!",
  "🎨 You are the artist of your own life. Paint it with courage and passion!",
  "🌟 The future belongs to those who believe in the beauty of their dreams.",
  "💪 It's not about being the best, it's about being better than you were yesterday.",
  "🚀 You don't have to be great to start, but you have to start to be great!",
  "✨ The only person you should try to be better than is the person you were yesterday.",
  "🎯 Your limitation—it's only your imagination!"
];

// Slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Song name or YouTube URL')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),
  new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the music and leave the voice channel'),
  new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current queue'),
  new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current song'),
  new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the paused song')
].map(command => command.toJSON());

// Register slash commands when bot starts
let clientId = null;

// Function to get YouTube video info
async function getVideoInfo(query) {
  try {
    // Check if it's a URL
    if (ytdl.validateURL(query)) {
      const info = await ytdl.getInfo(query);
      return {
        title: info.videoDetails.title,
        url: query,
        duration: info.videoDetails.lengthSeconds
      };
    } else {
      // Search for the video
      const searchResult = await ytSearch(query);
      if (searchResult.videos.length > 0) {
        const video = searchResult.videos[0];
        return {
          title: video.title,
          url: video.url,
          duration: video.duration ? video.duration.seconds : 0
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting video info:', error);
    return null;
  }
}

// Function to play music
async function playMusic(guildId, voiceChannel, interaction) {
  const queue = queues.get(guildId);
  if (!queue || queue.songs.length === 0) return;

  const song = queue.songs[0];
  
  try {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      try {
        connection.destroy();
      queues.delete(guildId);
      console.log(`Left voice channel in guild ${guildId}`);
      } catch (error) {
        console.error('Error cleaning up connection:', error);
      }
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    const stream = ytdl(song.url, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    const resource = createAudioResource(stream);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
      // Song finished, play next
      queue.songs.shift();
      if (queue.songs.length > 0) {
        playMusic(guildId, voiceChannel, interaction);
      } else {
        try {
          connection.destroy();
          queues.delete(guildId);
        } catch (error) {
          console.error('Error destroying connection:', error);
        }
      }
    });

    player.on('error', error => {
      console.error('Audio player error:', error);
      queue.songs.shift();
      if (queue.songs.length > 0) {
        playMusic(guildId, voiceChannel, interaction);
      } else {
        try {
          connection.destroy();
          queues.delete(guildId);
        } catch (error) {
          console.error('Error destroying connection:', error);
        }
      }
    });

    queue.connection = connection;
    queue.player = player;

    const embed = new EmbedBuilder()
      .setTitle('🎵 Now Playing')
      .setDescription(`**${song.title}**`)
      .setColor(0x00FF00)
      .setURL(song.url);

    if (interaction && !interaction.replied && !interaction.deferred) {
      await interaction.reply({ embeds: [embed] });
    } else if (interaction) {
      await interaction.followUp({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Error playing music:', error);
    if (interaction && !interaction.replied) {
      await interaction.followUp({ content: '❌ Error playing music. Make sure I have permission to join the voice channel!' });
    }
  }
}

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, member, guild } = interaction;

  // Play command
  if (commandName === 'play') {
    await interaction.deferReply();

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      return interaction.editReply('❌ You need to be in a voice channel!');
    }

    const songQuery = interaction.options.getString('song');
    const videoInfo = await getVideoInfo(songQuery);

    if (!videoInfo) {
      return interaction.editReply('❌ Could not find that song!');
    }

    if (!queues.has(guild.id)) {
      queues.set(guild.id, {
        songs: [],
        connection: null,
        player: null
      });
    }

    const queue = queues.get(guild.id);
    queue.songs.push(videoInfo);

    if (queue.songs.length === 1) {
      // Start playing immediately
      await playMusic(guild.id, voiceChannel, interaction);
    } else {
      await interaction.editReply(`✅ Added to queue: **${videoInfo.title}**`);
    }
  }

  // Skip command
  if (commandName === 'skip') {
    const queue = queues.get(guild.id);
    if (!queue || !queue.player) {
      return interaction.reply('❌ Nothing is playing!');
    }

    queue.player.stop();
    await interaction.reply('⏭️ Skipped!');
  }

  // Stop command
  if (commandName === 'stop') {
    const queue = queues.get(guild.id);
    if (!queue || !queue.connection) {
      return interaction.reply('❌ Nothing is playing!');
    }

    queue.connection.destroy();
    queues.delete(guild.id);
    await interaction.reply('🛑 Stopped and left voice channel!');
  }

  // Queue command
  if (commandName === 'queue') {
    const queue = queues.get(guild.id);
    if (!queue || queue.songs.length === 0) {
      return interaction.reply('❌ Queue is empty!');
    }

    const queueList = queue.songs.map((song, index) => 
      `${index + 1}. ${song.title}`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('📋 Music Queue')
      .setDescription(queueList)
      .setColor(0x0099FF);

    await interaction.reply({ embeds: [embed] });
  }

  // Pause command
  if (commandName === 'pause') {
    const queue = queues.get(guild.id);
    if (!queue || !queue.player) {
      return interaction.reply('❌ Nothing is playing!');
    }

    queue.player.pause();
    await interaction.reply('⏸️ Paused!');
  }

  // Resume command
  if (commandName === 'resume') {
    const queue = queues.get(guild.id);
    if (!queue || !queue.player) {
      return interaction.reply('❌ Nothing is playing!');
    }

    queue.player.unpause();
    await interaction.reply('▶️ Resumed!');
  }
});

// Handle !motivation command (text command)
client.on('messageCreate', (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check if the message starts with !motivation
  if (message.content.toLowerCase() === '!motivation') {
    // Get a random motivational message
    const randomMessage = motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];
    
    message.reply(randomMessage).catch(error => {
      console.error('Error replying with motivation:', error);
    });
  }
});

client.once('ready', async () => {
  // Set bot status with custom presence
  client.user.setPresence({
    status: 'idle', // 'online', 'idle', 'dnd', or 'invisible'
    activities: [{
      name: 'Music Bot | /play',
      type: ActivityType.Listening, // Playing, Streaming, Listening, Watching, Competing
    }]
  });
  console.log(`✅ Music bot is online! Logged in as ${client.user.tag}`);
  console.log(`   Status: Online | Listening to Music Bot | /play`);
  
  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  clientId = client.user.id;

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
    console.log('Successfully registered application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

// Handle reconnection - ensures bot stays online
client.on('reconnecting', () => {
  console.log('🔄 Bot is reconnecting...');
});

client.on('resume', () => {
  // Restore presence on reconnect
  client.user.setPresence({
    status: 'idle',
    activities: [{
      name: 'Music Bot | /play',
      type: ActivityType.Listening,
    }]
  });
  console.log('✅ Bot reconnected and is back online!');
});

client.on('disconnect', () => {
  console.log('⚠️ Bot disconnected. Will attempt to reconnect...');
});

// Add error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
  // Bot will automatically attempt to reconnect
});

client.on('warn', (warning) => {
  console.warn('Discord client warning:', warning);
});

// Handle process errors to keep bot running
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  // Don't exit - keep the bot running
});

// Login to Discord with automatic reconnection
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error('❌ Failed to login:', error.message);
  console.log('🔄 Retrying in 5 seconds...');
  setTimeout(() => {
    client.login(process.env.DISCORD_TOKEN);
  }, 5000);
});
