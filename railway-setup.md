# Railway Deployment - Quick Setup

## Step-by-Step Instructions:

### 1. Connect GitHub Repository
- Click **"New Project"** on Railway
- Select **"Deploy from GitHub repo"**
- Authorize Railway to access your GitHub
- Select repository: **`tinytim1251/discord-musicbot`**

### 2. Add Environment Variable
- Click on your deployed service
- Go to **"Variables"** tab
- Click **"New Variable"**
- Add:
  - **Name:** `DISCORD_TOKEN`
  - **Value:** `your_bot_token_here` (get this from your .env file or Discord Developer Portal)
- Click **"Add"**

### 3. Deploy
- Railway will automatically detect it's a Node.js project
- It will run `npm install` and then `node index.js`
- Watch the logs to see when it connects

### 4. Check Logs
- Go to **"Deployments"** tab
- Click on the latest deployment
- You should see: `✅ Music bot is online! Logged in as MotivationBot#3851`

## That's it!
Your bot will now run 24/7 on Railway! 🚀

