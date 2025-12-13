# Render Deployment Guide

## Quick Start (5 minutes)

### Step 1: Push Code to GitHub ✓ (Already Done)

### Step 2: Deploy Backend

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select your repo
4. Configure the service:
   - **Name**: `legal-ai-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Runtime**: `Python 3.11`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
   - **Root Directory**: `backend`
5. Click **"Create Web Service"**
6. Wait for build to complete (2-3 minutes)

### Step 3: Add Environment Variables

1. Go to your service on Render
2. Click **"Environment"** tab
3. Add these variables:
   ```
   FASTAPI_ENV=production
   GROQ_API_KEY=your_groq_key
   HUGGINGFACE_API_KEY=your_hf_key
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_key
   ```
4. Click **"Save"**

The backend will automatically redeploy with new environment variables.

### Step 4: Get Your Backend URL

Once deployed, Render will show you a URL like:
```
https://legal-ai-backend-xxxx.onrender.com
```

**Copy this URL - you'll need it for the frontend!**

### Step 5: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://legal-ai-backend-xxxx.onrender.com
   ```
6. Click **"Deploy"**

### Step 6: Update Backend CORS

1. Go back to Render backend settings
2. Add environment variable:
   ```
   ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
   ```

**That's it! Your app is live! 🎉**

---

## Cost Breakdown

| Service | Free Tier | Paid | Recommended |
|---------|-----------|------|-------------|
| Render Backend | $7/month | $12/month+ | Yes |
| Vercel Frontend | ✓ Unlimited | $20/month | Free tier works |
| Qdrant Vector DB | 1GB free | $10/month+ | Cloud free tier |
| Groq API | ✓ Limited free | Pay per use | Free tier |

**Minimum monthly cost: ~$17 (or free if using all free tiers)**

---

## Troubleshooting Render Deployment

### Build fails: "requirements.txt not found"
- Make sure your repo has `backend/requirements.txt`
- Set Root Directory to `backend`

### Backend won't start: "Port already in use"
- Render uses port 10000, change Start Command to port 10000
- `uvicorn app.main:app --host 0.0.0.0 --port 10000`

### API calls timeout from frontend
- Check CORS settings in backend
- Make sure Qdrant/Groq API keys are correct
- Check backend logs in Render dashboard

### "Module not found" errors
- Ensure all imports in `requirements.txt`
- Run locally: `pip install -r backend/requirements.txt` to verify

---

## Auto-Deploy on Push

Render automatically redeploys when you push to GitHub:

1. Make changes locally
2. Commit and push to main
3. Render automatically rebuilds and deploys
4. Check Render dashboard for status

---

## Monitor Your Deployment

**Render Dashboard**:
- View logs: Service page → "Logs" tab
- Monitor metrics: "Metrics" tab
- Check deployment history: "Deploys" tab

**Vercel Dashboard**:
- View logs: Project → "Deployments" → click a deployment
- Monitor performance: "Analytics" tab
- Check function logs: "Functions" tab

---

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. Test at: `https://your-app.vercel.app`
4. Set up monitoring/alerting
5. Configure custom domain (optional)
6. Enable auto-scaling (if needed)
