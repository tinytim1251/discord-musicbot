# How to Keep Your Bot Online 24/7

## Important Note
**If your PC shuts off, the bot cannot run.** A bot needs a computer/server that is powered on and connected to the internet to function.

## Options to Keep Bot Online 24/7

### Option 1: Keep Your PC On (Free)
- Leave your computer running 24/7
- Set Windows to never sleep: Settings → System → Power & Sleep
- The bot will stay online as long as your PC is on

### Option 2: Cloud Hosting (Recommended for 24/7)

#### Free Options:
1. **Railway** (Free tier available)
   - Go to https://railway.app
   - Connect your GitHub repo
   - Deploy your bot
   - Free tier: 500 hours/month

2. **Render** (Free tier available)
   - Go to https://render.com
   - Create a new Web Service
   - Connect your repo
   - Free tier: Spins down after 15 min inactivity

3. **Replit** (Free tier available)
   - Go to https://replit.com
   - Create a new Node.js repl
   - Upload your bot files
   - Use "Always On" feature (paid) or free tier

#### Paid Options (More Reliable):
1. **DigitalOcean** - $5/month
2. **AWS EC2** - Pay as you go
3. **Vultr** - $2.50/month
4. **Heroku** - No longer free, but reliable

### Option 3: Use a Process Manager (If PC Stays On)

Install PM2 to auto-restart if bot crashes:
```bash
npm install -g pm2
pm2 start index.js
pm2 save
pm2 startup
```

This keeps the bot running even if it crashes, but your PC must still be on.

## Current Bot Features
- ✅ Automatic reconnection if disconnected
- ✅ Error handling to prevent crashes
- ✅ Status set to Idle
- ✅ Custom presence: "Listening to Music Bot | /play"

## Summary
The bot **cannot run if your PC is off**. To keep it online 24/7, you need:
- Your PC to stay on, OR
- Cloud hosting (free or paid)

The bot already has reconnection logic, so it will stay online as long as the computer/server it's running on stays on.

