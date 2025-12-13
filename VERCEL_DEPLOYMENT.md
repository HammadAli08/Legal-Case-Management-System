# Deploy Frontend to Vercel (Recommended)

Vercel is perfect for your React/Vite frontend. It's faster, cheaper, and easier than Railway for frontend deployment.

---

## Why Vercel for Frontend?

| Feature | Vercel | Railway |
|---------|--------|---------|
| Setup | 2 minutes | 3 minutes |
| Cost | **FREE** (unlimited) | Paid after $5 credit |
| Performance | Optimized for React | General purpose |
| Serverless | ✓ Built-in | Requires setup |
| Edge caching | ✓ Global | Limited |
| **Recommendation** | **Use this!** | Use for backend |

---

## Step 1: Prepare Your GitHub Repo

Your code is already on GitHub, so nothing to do here! ✅

---

## Step 2: Sign Up to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your repos
5. You're logged in! ✅

---

## Step 3: Deploy Frontend

### 3.1 Create New Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."**
3. Click **"Project"**
4. Click **"Import Git Repository"**

### 3.2 Select Your Repository

1. Search for: `Legal-Case-Management-System`
2. Click to select it
3. Click **"Import"**

### 3.3 Configure Project Settings

In the "Configure your Project" page:

1. **Framework Preset**: Select **"Vite"** (or leave blank, Vercel will auto-detect)
2. **Root Directory**: Click and select **"frontend"** folder
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**: Add these:

```
Name: VITE_API_URL
Value: https://your-backend-railway-url.up.railway.app
```

(Use your actual Railway backend URL from earlier)

Click **"Deploy"**

### 3.4 Wait for Build

1. Vercel will start building
2. Takes 2-3 minutes first time
3. You'll see build logs in real-time
4. When done, it shows "Production Deployment" with a checkmark ✅

---

## Step 4: Get Your Frontend URL

Once deployed:

1. Go to Vercel dashboard
2. Click your project: `Legal-Case-Management-System`
3. You'll see your **Production Domain**:
   ```
   https://legal-case-management-system-xxx.vercel.app
   ```

**Copy this URL!** You'll need it to update backend CORS.

---

## Step 5: Update Backend CORS

Your Railway backend needs to allow requests from Vercel:

1. Go to https://railway.app/dashboard
2. Click your project → **backend service**
3. Go to **Variables** tab
4. Add/Update:
   ```
   ALLOWED_ORIGINS = https://legal-case-management-system-xxx.vercel.app
   ```
   (Use your exact Vercel domain)

5. Click **Save**
6. Backend auto-redeploys with new CORS setting

---

## Step 6: Test Your Full Application

1. Open your Vercel frontend URL in browser:
   ```
   https://legal-case-management-system-xxx.vercel.app
   ```

2. Your Legal Case Management System should load! 🎉

3. Try using the app:
   - Navigate to different pages
   - Test chat functionality
   - Classification features
   - Prioritization features

All requests go to your Railway backend API.

---

## Full Stack URLs

Save these for reference:

```
FRONTEND:        https://legal-case-management-system-xxx.vercel.app
BACKEND API:     https://your-backend-xxx.up.railway.app
API DOCS:        https://your-backend-xxx.up.railway.app/docs
VERCEL DASHBOARD: https://vercel.com/dashboard
RAILWAY DASHBOARD: https://railway.app/dashboard
```

---

## Auto-Deploy on GitHub Push

Vercel automatically redeploys when you push to GitHub:

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```
3. Vercel detects changes automatically
4. Frontend redeploys (1-2 minutes)
5. No manual action needed!

View deployments:
- Vercel dashboard → Deployments tab
- See all deployment history

---

## Troubleshooting Vercel Deployment

### Build fails: "Module not found"

1. Check `frontend/package.json` has all dependencies
2. Run locally first: `npm install && npm run build`
3. If works locally, commit and push to GitHub
4. Vercel will retry with your changes

### Frontend shows blank page

1. Check browser console for errors (F12)
2. Check VITE_API_URL is correct:
   - Go to Vercel project → Settings → Environment Variables
   - Verify `VITE_API_URL` value is correct
3. Wait 1 minute after changing env vars for deployment to complete

### Can't reach backend API

1. Check backend is running: `https://your-backend-url/health`
2. Check ALLOWED_ORIGINS in backend includes your Vercel domain
3. Check VITE_API_URL in Vercel environment variables (no trailing slash)
4. Open DevTools (F12) → Network tab to see API requests

### "CORS error" in browser console

1. Go to Railway → backend service → Variables
2. Add/Update `ALLOWED_ORIGINS` with your Vercel domain
3. Wait 2 minutes for backend to redeploy
4. Refresh frontend in browser

---

## View Deployment Logs

### Vercel Logs

1. Go to Vercel dashboard
2. Click project
3. Go to **"Deployments"** tab
4. Click the latest deployment
5. See build logs and deployment progress

### Railway Logs (Backend)

1. Go to Railway dashboard
2. Click backend service
3. Go to **"Logs"** tab
4. See API requests and errors in real-time

---

## Performance Features (Automatic on Vercel)

✅ **Global CDN** - Your frontend served from edge servers worldwide
✅ **Automatic HTTPS** - All requests encrypted
✅ **Automatic scaling** - Handles traffic spikes
✅ **Image optimization** - Automatically optimized
✅ **Analytics** - View page performance

---

## Add Custom Domain (Optional - Later)

Want your own domain?

1. Buy domain (GoDaddy, Namecheap, etc.)
2. In Vercel project → Settings → Domains
3. Click "Add"
4. Enter your domain
5. Update DNS records (Vercel shows instructions)
6. Wait 5-30 minutes

Example with custom domain:
```
Frontend: https://legal-ai.yourdomain.com
Backend:  https://api.legal-ai.yourdomain.com
```

---

## Environment Variables in Vercel

Need to change API URL or add more variables?

1. Vercel project → Settings → **Environment Variables**
2. Edit or add variables
3. Click "Save"
4. Vercel auto-redeploys with new variables
5. Takes 1-2 minutes

---

## Monitoring & Analytics

### View Project Analytics (Free on Vercel)

1. Vercel dashboard → Click project
2. Go to **"Analytics"** tab
3. See:
   - Page load times
   - Core Web Vitals
   - Error rates
   - Traffic patterns

### Get Alerts for Failures

1. Vercel project → Settings → **Notifications**
2. Enable email alerts
3. Get notified if deployment fails

---

## Deployment Summary

Your full stack is now deployed:

✅ **Backend**: Running on Railway
   - URL: `https://your-backend-xxx.up.railway.app`
   - API Docs: `/docs`
   - Auto-deploys on GitHub push

✅ **Frontend**: Running on Vercel
   - URL: `https://your-frontend-xxx.vercel.app`
   - Global CDN
   - Auto-deploys on GitHub push

✅ **Database**: Qdrant Cloud
   - Connected to backend
   - Vector database for RAG

✅ **LLM API**: Groq
   - Connected to backend
   - Fast language model inference

✅ **Embeddings**: HuggingFace
   - Connected to backend
   - Generate embeddings for documents

---

## Quick Checklist

- [ ] Sign up to Vercel with GitHub
- [ ] Import repo and select frontend folder
- [ ] Set VITE_API_URL to your Railway backend URL
- [ ] Deploy
- [ ] Update Railway backend ALLOWED_ORIGINS
- [ ] Test frontend works
- [ ] Check backend logs for any errors

---

## Cost Summary

| Service | Cost/Month |
|---------|-----------|
| Vercel Frontend | **FREE** ✅ |
| Railway Backend | ~$7-15 |
| Qdrant Vector DB | Free (1GB) or $10+ |
| Groq API | Free tier or pay-per-use |
| **Total** | **~$7-25/month** |

---

## Support & Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev
- **Your GitHub**: https://github.com/HammadAli08/Legal-Case-Management-System

---

## What's Next

1. ✅ Deploy to Vercel (follow steps above)
2. ✅ Update Railway backend CORS
3. ✅ Test full application
4. ✅ Monitor logs and performance
5. ✅ Add custom domain (optional)
6. ✅ Set up monitoring/alerts (optional)

**Your Legal Case Management System is now fully deployed to production!** 🚀
