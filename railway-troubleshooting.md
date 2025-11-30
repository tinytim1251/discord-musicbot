# Railway Troubleshooting Guide

## If your bot isn't going online on Railway:

### 1. Check Railway Logs
- Go to your Railway project
- Click on your service
- Go to **"Deployments"** tab
- Click on the latest deployment
- Check the logs for errors

### 2. Common Issues:

#### Issue: "Cannot find module" errors
**Solution:** Make sure all dependencies are in `package.json`

#### Issue: "DISCORD_TOKEN is not defined"
**Solution:** 
- Go to **Variables** tab
- Make sure `DISCORD_TOKEN` is set correctly
- Check for typos (no spaces, correct name)
- Redeploy after adding variables

#### Issue: Bot starts but immediately crashes
**Solution:**
- Check logs for error messages
- Make sure Node.js version is compatible (v16+)
- Check if all intents are enabled in Discord Developer Portal

#### Issue: Build succeeds but bot doesn't connect
**Solution:**
- Check if the start command is correct: `node index.js`
- Verify the token is correct
- Check Railway logs for connection errors

### 3. Verify Deployment:

**What you should see in logs:**
```
✅ Music bot is online! Logged in as MotivationBot#3851
   Status set to: Idle
Started refreshing application (/) commands.
Successfully registered application (/) commands.
```

**If you see errors:**
- Copy the error message
- Check the troubleshooting steps above
- Make sure your bot token is valid

### 4. Force Redeploy:
- Go to **Settings** → **Deploy**
- Click **Redeploy**
- Watch the logs to see if it connects

### 5. Check Discord:
- Make sure the bot is still in your server
- Check if it shows as online in Discord
- Try using `!motivation` or `/play` commands

## Still not working?
Share the error message from Railway logs and I can help fix it!

