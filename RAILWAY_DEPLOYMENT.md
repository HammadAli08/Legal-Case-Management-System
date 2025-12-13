# Railway Deployment Guide

Railway is a modern deployment platform that's simple, fast, and developer-friendly. Perfect for your Legal AI application.

## Quick Comparison: Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| Setup Time | 2-3 min | 5 min |
| Free Trial | $5 free credit | Limited |
| Pricing | Pay-as-you-go | Fixed tier + usage |
| Ease | Very Easy | Easy |
| GitHub Integration | ✓ Excellent | ✓ Good |
| Auto-Deploy | ✓ Yes | ✓ Yes |

---

## Prerequisites

1. **GitHub Account** ✓ (Already done)
2. **Railway Account** - Sign up at https://railway.app
3. **Docker files** ✓ (Already created)

---

## Step-by-Step Deployment

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start Free"**
3. Sign up with GitHub (easiest method)
4. Authorize Railway to access your repos

### Step 2: Deploy Backend

#### Option A: Using Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to backend folder
cd backend

# Initialize Railway project
railway init
# Follow prompts:
# - Project name: legal-ai-backend
# - Add PostgreSQL? No (unless needed)
# - Deploy now? Yes

# The CLI will create a Railway project and deploy
```

#### Option B: Using Railway Dashboard (Web UI)

1. Go to https://railway.app/dashboard
2. Click **"+ New Project"**
3. Click **"Deploy from GitHub repo"**
4. Select your repo
5. Click **"Deploy"**
6. Select backend folder in deployment config

### Step 3: Configure Backend Environment Variables

After deployment, add environment variables:

```bash
# Using CLI
railway variables set GROQ_API_KEY=your_groq_key
railway variables set HUGGINGFACE_API_KEY=your_hf_key
railway variables set QDRANT_URL=your_qdrant_url
railway variables set QDRANT_API_KEY=your_qdrant_key
railway variables set ALLOWED_ORIGINS=https://your-frontend-url
```

Or through Dashboard:
1. Go to your project
2. Click the backend service
3. Go to **Variables** tab
4. Add each variable

### Step 4: Get Your Backend URL

Railway will assign a public URL:
```
https://legal-ai-backend-prod.up.railway.app
```

**Save this URL for frontend configuration**

### Step 5: Deploy Frontend

```bash
# Navigate to frontend
cd ../frontend

# Initialize Railway for frontend
railway init
# - Project name: legal-ai-frontend
# - Add database? No
# - Deploy now? Yes
```

Or via Dashboard:
1. Go to your project
2. Click **"+ Add Service"**
3. Select **"Docker"** or **"GitHub"**
4. Configure and deploy

### Step 6: Add Frontend Environment Variables

```bash
railway variables set VITE_API_URL=https://legal-ai-backend-prod.up.railway.app
```

### Step 7: Link Services (Optional but Recommended)

Connect backend and frontend so they can communicate:

```bash
# Use Railway CLI to link services
railway link
```

---

## Configuration Files for Railway

### railway.json (Optional - for CLI configuration)

Create this file in your project root to customize Railway behavior:

```json
{
  "builder": "dockerfile",
  "ignore": [
    "node_modules",
    "__pycache__",
    ".git",
    ".env"
  ]
}
```

Or in `backend/railway.json`:

```json
{
  "builder": "dockerfile",
  "dockerfilePath": "Dockerfile",
  "port": 8000,
  "ignore": [
    "__pycache__",
    "*.pyc",
    ".git"
  ]
}
```

---

## Full Stack with Railway

### Deploy Everything with One Command

```bash
# Start from project root
railway init

# This creates a railway.json that includes both services
# Then deploy with:
railway up
```

### With docker-compose

Railway can deploy your docker-compose setup directly:

1. Push your `docker-compose.yml` to GitHub
2. In Railway dashboard, select "Docker Compose" as build method
3. Railway handles the rest!

---

## Advanced: Using Railway Plugins

Railway has plugins for databases and services:

```bash
# Add PostgreSQL (if needed)
railway add
# Select PostgreSQL from menu
# Railway automatically sets DATABASE_URL environment variable

# Add Redis (optional - for caching)
railway add
# Select Redis from menu
```

---

## Monitoring & Logs

### View Logs

```bash
# Using CLI
railway logs

# Follow logs in real-time
railway logs --follow
```

Or through Dashboard:
1. Select your service
2. Go to **Logs** tab
3. View real-time logs

### Monitor Deployment

```bash
# Check deployment status
railway status

# View service info
railway service
```

---

## Auto-Deployment on Push

Railway automatically redeploys when you push to GitHub:

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Railway automatically detects changes
4. Rebuilds and deploys (2-3 minutes)
5. Check logs to confirm deployment

### Disable Auto-Deploy (if needed)

In Railway dashboard:
1. Select service
2. Settings → **Automatic Deploy**: Toggle off

---

## Cost on Railway

### Pricing Structure
- **$5 free credit** to start
- **Pay-as-you-go** after credit used
- Typical costs:
  - FastAPI backend: $5-15/month
  - Vite frontend: $5-10/month
  - **Total: ~$10-25/month** (similar to Render)

### Free Tier
Railway offers $5 free credit monthly. For light usage, you might stay within free tier!

---

## Troubleshooting Railway Deployment

### "Build failed: dockerfile not found"
- Ensure Dockerfile is in backend/ or frontend/
- Or specify path in `railway.json`:
  ```json
  {
    "dockerfilePath": "backend/Dockerfile"
  }
  ```

### Port issues
- Railway assigns random ports
- Configure in `railway.json`:
  ```json
  {
    "port": 8000
  }
  ```

### Environment variables not working
```bash
# Double-check variables are set
railway variables

# Redeploy to apply changes
railway up
```

### Frontend can't reach backend
- Check `VITE_API_URL` is correct
- Verify CORS in backend
- Test endpoint: `curl https://your-backend-url/health`

### Build timeout
- Optimize Dockerfile (smaller base image)
- Remove unnecessary dependencies
- Check Docker build time: `docker build ./backend -t test`

---

## Switching from Render to Railway

If you want to migrate:

1. Create new Railway project
2. Deploy backend:
   ```bash
   cd backend && railway init
   ```
3. Add all environment variables
4. Update frontend API URL to new Railway backend URL
5. Deploy frontend:
   ```bash
   cd ../frontend && railway init
   ```
6. Test thoroughly
7. Update DNS if using custom domain
8. Delete Render services (optional)

---

## Railway vs Docker Compose (Local Dev)

### Local Testing
```bash
# Run everything locally before deploying
docker-compose up

# Access at:
# Frontend: http://localhost
# Backend: http://localhost:8000
# Qdrant: http://localhost:6333
```

### Deploy to Railway
```bash
# Push to GitHub
git push origin main

# Deploy via Railway
railway up

# Check status
railway status
```

---

## Custom Domain (Optional)

Add your own domain to Railway:

1. Buy domain (GoDaddy, Namecheap, etc.)
2. In Railway Dashboard → Select Service → Settings
3. Go to **Domains** tab
4. Add custom domain
5. Update DNS records (Railway shows instructions)
6. Wait 5-30 minutes for propagation

Example:
```
Frontend: https://legal-ai.yourdomain.com
Backend: https://api.legal-ai.yourdomain.com
```

---

## Security Best Practices on Railway

1. **Never commit .env files**
   - Use Railway variables instead
   - Check `.gitignore` has `.env`

2. **Use strong API keys**
   - Rotate Groq/HuggingFace keys periodically
   - Store in Railway, not code

3. **Enable auto-deploy only on main branch**
   - Prevents accidental deployments
   - Create staging environment for testing

4. **Monitor logs for errors**
   - Railway logs are always accessible
   - Set up alerts if needed

---

## Quick Start Summary

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy backend
cd backend
railway init  # Follow prompts
railway variables set GROQ_API_KEY=xxx
railway variables set HUGGINGFACE_API_KEY=xxx
railway variables set QDRANT_URL=xxx
railway variables set QDRANT_API_KEY=xxx

# 4. Deploy frontend
cd ../frontend
railway init
railway variables set VITE_API_URL=<your-backend-url>

# 5. Done! Both services live and auto-deploying
```

**Total deployment time: ~5 minutes** (after getting API keys)

---

## Documentation & Support

- Official Docs: https://docs.railway.app
- CLI Reference: https://docs.railway.app/cli/commands
- GitHub Issues: https://github.com/railwayapp/railway
- Discord Community: https://discord.gg/railway

---

## Next Steps

1. Sign up on Railway: https://railway.app
2. Follow Step-by-Step Deployment above
3. Test your deployment
4. Enable auto-deploy on GitHub pushes
5. Monitor logs regularly
6. Set up custom domain (optional)
