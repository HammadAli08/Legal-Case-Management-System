# Railway Deployment via Web Dashboard (Easy Way)

No CLI needed! Deploy entirely through Railway's web interface.

---

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start Free"**
3. Click **"Sign up with GitHub"**
4. Authorize Railway to access your GitHub repos
5. Click **"Create a new Project"**

---

## Step 2: Deploy Backend Service

### 2.1 Create Backend Service

1. In Railway dashboard, click **"+ New Service"**
2. Click **"Deploy from GitHub repo"**
3. Select your GitHub repo: `Legal-Case-Management-System`
4. Click **"Deploy"**
5. Railway will start building your backend

### 2.2 Configure Backend Service

While it builds, configure the service:

1. Click on the service (it will show as a box with your repo name)
2. Go to **"Settings"** tab
3. Under "Deploy", set:
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (uses Dockerfile)
   - **Start Command**: Leave empty (uses Dockerfile)

### 2.3 Add Environment Variables for Backend

1. Go to **"Variables"** tab in the backend service
2. Click **"+ Add Variable"**
3. Add each variable one by one:

```
Variable Name: FASTAPI_ENV
Value: production
```

```
Variable Name: GROQ_API_KEY
Value: [Your Groq API Key from https://console.groq.com/keys]
```

```
Variable Name: HUGGINGFACE_API_KEY
Value: [Your HuggingFace token from https://huggingface.co/settings/tokens]
```

```
Variable Name: QDRANT_URL
Value: [Your Qdrant Cloud URL from https://cloud.qdrant.io]
```

```
Variable Name: QDRANT_API_KEY
Value: [Your Qdrant API Key]
```

```
Variable Name: ALLOWED_ORIGINS
Value: https://legal-ai-frontend.up.railway.app
```
(You'll update this after deploying frontend)

### 2.4 Get Your Backend URL

1. Click on the backend service
2. Go to **"Settings"** tab
3. Under "Domains", you'll see your public URL:
   ```
   https://legal-ai-backend-prod.up.railway.app
   ```
   (The exact name depends on what Railway assigns)

4. **Copy this URL - you'll need it for frontend!**

---

## Step 3: Deploy Frontend Service

### 3.1 Create Frontend Service

1. Click **"+ New Service"** in your project
2. Click **"Deploy from GitHub repo"**
3. Select same repo: `Legal-Case-Management-System`
4. Click **"Deploy"**

### 3.2 Configure Frontend Service

1. Click on the frontend service
2. Go to **"Settings"** tab
3. Under "Deploy", set:
   - **Root Directory**: `frontend`
   - Build Command: Leave empty (uses Dockerfile)
   - Start Command: Leave empty (uses Dockerfile)

### 3.3 Add Environment Variables for Frontend

1. Go to **"Variables"** tab
2. Add this variable:

```
Variable Name: VITE_API_URL
Value: https://legal-ai-backend-prod.up.railway.app
```
(Use the URL from Step 2.4)

### 3.4 Get Your Frontend URL

1. Click on frontend service
2. Go to **"Settings"** tab
3. Under "Domains", copy your frontend URL:
   ```
   https://legal-ai-frontend.up.railway.app
   ```

---

## Step 4: Update Backend CORS (Important!)

Now update the backend to allow requests from frontend:

1. Go to backend service
2. Go to **"Variables"** tab
3. Find `ALLOWED_ORIGINS` variable
4. **Edit it** and change the value to your frontend URL:
   ```
   https://legal-ai-frontend.up.railway.app
   ```
5. Railway will auto-redeploy with the new setting

---

## Step 5: Test Your Deployment

### Test Backend

Open in browser:
```
https://legal-ai-backend-prod.up.railway.app/health
```

You should see:
```json
{"status": "ok"}
```

### Test Frontend

Open in browser:
```
https://legal-ai-frontend.up.railway.app
```

Your app should load! 🎉

---

## Common Tasks in Railway Dashboard

### View Logs

1. Click on a service
2. Go to **"Logs"** tab
3. See real-time output

### View Deployment Status

1. Click on service
2. Go to **"Deployments"** tab
3. See all deployment history

### Restart Service

1. Click on service
2. Click **"Redeploy"** button

### Check Service Health

1. Service shows status in dashboard:
   - 🟢 Running = Good
   - 🟡 Deploying = In progress
   - 🔴 Crashed = Error (check logs)

---

## If Deployment Fails

### Check Logs First

1. Click the service
2. Go to **"Logs"** tab
3. Look for red error messages

### Common Issues & Fixes

**Issue: "Dockerfile not found"**
- Go to Settings → check Root Directory is correct
- Backend root should be: `backend`
- Frontend root should be: `frontend`

**Issue: "Port already in use"**
- This shouldn't happen on Railway (they assign ports)
- Check Dockerfile EXPOSE port is correct

**Issue: "Module not found" or "Requirements error"**
- Likely missing dependencies in requirements.txt
- Go to Logs tab to see which module is missing
- Add to backend/requirements.txt and push to GitHub
- Railway will auto-redeploy

**Issue: "Build taking too long"**
- Normal first time (3-5 minutes)
- Subsequent deploys are faster (1-2 minutes)

**Issue: "Can't reach backend from frontend"**
- Check VITE_API_URL is correct (exactly match backend domain)
- Check ALLOWED_ORIGINS includes frontend domain
- Wait 1 minute after deployment for changes to apply

---

## What Happens on Each Push to GitHub

Railway watches your GitHub repo automatically:

1. You push code to `main` branch
2. Railway detects changes (automatic)
3. Rebuilds both services using your Dockerfiles
4. Deploys automatically (2-3 minutes)
5. You can watch in the "Deployments" tab

**No manual action needed after first setup!** 🚀

---

## View All Services in One Place

Your project dashboard shows:

```
Legal-Case-Management-System
├── backend (your-url.up.railway.app)
├── frontend (your-url.up.railway.app)
└── [Any other services]
```

All in one project, easy to manage!

---

## Next Steps

1. ✅ Go to https://railway.app
2. ✅ Sign up with GitHub
3. ✅ Click "New Project" → "Deploy from GitHub"
4. ✅ Select your Legal-Case-Management-System repo
5. ✅ Follow steps above to deploy backend & frontend
6. ✅ Add all environment variables
7. ✅ Test both services
8. ✅ Done! Your app is live 🎉

---

## Monitoring Your Live App

### Daily Checks
- Check logs for errors: Service → Logs tab
- Monitor deployment status: Deployments tab
- Check resource usage (optional)

### Enable Automatic Email Alerts (optional)
- Go to Account Settings
- Set up notifications for deployment failures
- Get alerts if service crashes

### View Usage & Costs
- Go to Account → Billing
- See current month's usage
- Check if you're within free tier

---

## Custom Domain (Optional - Later)

Want your own domain instead of `*.up.railway.app`?

1. Buy a domain (GoDaddy, Namecheap, etc.)
2. In Railway service → Settings → Domains
3. Click "Add Custom Domain"
4. Follow instructions to update DNS
5. Wait 5-30 minutes for propagation

Example after adding custom domain:
```
Frontend: https://legal-ai.yourdomain.com
Backend: https://api.legal-ai.yourdomain.com
```

---

## Troubleshooting Reference

| Problem | Solution |
|---------|----------|
| Logs show errors | Check backend/requirements.txt or frontend imports |
| Can't access frontend | Wait 3-5 min for build, refresh browser |
| Backend unreachable | Check GROQ_API_KEY and other env vars are set |
| Frontend blank page | Check VITE_API_URL in frontend variables |
| Services keep crashing | Check logs for error messages, see common issues above |

---

## Support & Help

- **Railway Docs**: https://docs.railway.app
- **Railway Status**: https://status.railway.app (is Railway working?)
- **Community Discord**: https://discord.gg/railway

---

## Summary: Deploy in 5 Steps

1. Go to railway.app, sign up with GitHub
2. New Project → Deploy from GitHub
3. Select your repo
4. Deploy backend service (set root dir to `backend`)
5. Deploy frontend service (set root dir to `frontend`)
6. Add environment variables to both services
7. Update ALLOWED_ORIGINS with your frontend URL
8. Test at your public URLs
9. **Done!** Auto-deploys on every GitHub push

**Total time: 10-15 minutes** (first time setup)

All future pushes to `main` branch deploy automatically! ✨
