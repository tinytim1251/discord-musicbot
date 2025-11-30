# Discord Music Bot

A Discord bot that plays music from YouTube in voice channels using slash commands.

## Setup Instructions

1. **Install Node.js** (if you haven't already)
   - Download from https://nodejs.org/

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a Discord Bot**
   - Go to https://discord.com/developers/applications
   - Click "New Application" and give it a name
   - Go to the "Bot" section
   - Click "Add Bot"
   - Under "Token", click "Reset Token" and copy it
   - Enable "Message Content Intent" under "Privileged Gateway Intents"

4. **Invite Bot to Server**
   - Go to "OAuth2" > "URL Generator"
   - Select scopes: `bot` and `applications.commands`
   - Select bot permissions: 
     - `Send Messages`
     - `Read Message History`
     - `Connect` (to join voice channels)
     - `Speak` (to play audio)
     - `Use Voice Activity`
   - Copy the generated URL and open it in your browser to invite the bot

5. **Configure Environment**
   - Make sure your `.env` file contains:
     ```
     DISCORD_TOKEN=your_actual_token_here
     ```

6. **Run the Bot**
   ```bash
   npm start
   ```
   Or:
   ```bash
   node index.js
   ```

## Commands

All commands are slash commands (type `/` in Discord to see them):

- `/play <song name or URL>` - Play a song from YouTube
  - Example: `/play never gonna give you up`
  - Example: `/play https://www.youtube.com/watch?v=dQw4w9WgXcQ`

- `/skip` - Skip the current song and play the next in queue

- `/stop` - Stop the music and make the bot leave the voice channel

- `/queue` - Show the current music queue

- `/pause` - Pause the currently playing song

- `/resume` - Resume the paused song

## Features

- Play music from YouTube by name or URL
- Queue system - add multiple songs
- Skip, pause, and resume controls
- View current queue
- Automatic playback of next song in queue

## Usage

1. Join a voice channel in your Discord server
2. Use `/play` followed by a song name or YouTube URL
3. The bot will join your voice channel and start playing!

## Requirements

- Node.js (v16 or higher)
- Discord bot token
- Bot must have permission to join and speak in voice channels

## Troubleshooting

- **Bot doesn't join voice channel**: Make sure the bot has "Connect" and "Speak" permissions
- **No sound**: Check that your Discord audio settings are correct
- **Commands not showing**: Wait a few minutes after starting the bot for commands to register globally
