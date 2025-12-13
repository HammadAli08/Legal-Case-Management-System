# Access Your Deployed Application

Your backend is now live on Railway! Here's how to access it and complete the deployment.

---

## Step 1: Get Your Backend URL

1. Go to https://railway.app/dashboard
2. Click your **Legal-Case-Management-System** project
3. Click the **backend service**
4. Go to **"Settings"** tab
5. Under **"Domains"**, you'll see your public URL:
   ```
   https://your-backend-name.up.railway.app
   ```
6. **Copy this URL** - you'll need it for the frontend

### Test Your Backend

Open this URL in your browser:
```
https://your-backend-name.up.railway.app/health
```

You should see:
```json
{"status":"ok"}
```

✅ If you see this, your backend is working!

---

## Step 2: Get Your Backend API Endpoints

Your backend now has these endpoints available:

### Health Check
```
GET https://your-backend-url.up.railway.app/health
```

### Interactive API Documentation
```
https://your-backend-url.up.railway.app/docs
```
Open this in browser to see all available endpoints and test them!

### Alternative Documentation
```
https://your-backend-url.up.railway.app/redoc
```

---

## Step 3: Deploy Frontend to Railway

Now deploy your frontend on the same Railway project.

### 3.1 Create Frontend Service

1. Go to Railway dashboard
2. Click your project
3. Click **"+ New Service"**
4. Click **"Deploy from GitHub repo"**
5. Select your repo: `Legal-Case-Management-System`
6. Click **"Deploy"**

### 3.2 Configure Frontend Service

While it deploys:

1. Click the **frontend service** box
2. Go to **"Settings"** tab
3. Set **Root Directory**: `frontend`
4. Save

### 3.3 Add Environment Variable

1. Go to **"Variables"** tab
2. Add this variable:
   ```
   VITE_API_URL = https://your-backend-url.up.railway.app
   ```
   (Use the exact URL from Step 1)

3. If the build has already started, click **"Redeploy"** in Deployments tab

### 3.4 Wait for Frontend Build

1. Go to **"Logs"** tab
2. Wait for "Deployment successful" message
3. Takes 2-3 minutes

### 3.5 Get Frontend URL

1. Go to **"Settings"** tab
2. Under **"Domains"**, copy your frontend URL:
   ```
   https://your-frontend-name.up.railway.app
   ```

---

## Step 4: Access Your Application

Open your frontend URL in browser:
```
https://your-frontend-name.up.railway.app
```

You should see your Legal Case Management System UI! 🎉

---

## Step 5: Update Backend CORS (Important!)

The backend needs to allow requests from your frontend domain.

1. Go to backend service
2. Click **"Variables"** tab
3. Add or update:
   ```
   ALLOWED_ORIGINS = https://your-frontend-name.up.railway.app
   ```
4. Click **"Redeploy"** in Deployments tab

This tells the backend to accept requests from your frontend.

---

## Full URLs Reference

Save these URLs for future reference:

```
BACKEND API:        https://your-backend-name.up.railway.app
BACKEND DOCS:       https://your-backend-name.up.railway.app/docs
BACKEND REDOC:      https://your-backend-name.up.railway.app/redoc
FRONTEND APP:       https://your-frontend-name.up.railway.app
```

---

## Step-by-Step Access Guide

### To Use Your Application:

1. **Open Frontend**: https://your-frontend-name.up.railway.app
2. **See API Docs**: https://your-backend-name.up.railway.app/docs
3. **Test Backend**: https://your-backend-name.up.railway.app/health

### To Manage Services:

1. **Railway Dashboard**: https://railway.app/dashboard
2. **View Logs**: Service → Logs tab
3. **Monitor Status**: Service → Overview tab
4. **Edit Variables**: Service → Variables tab

---

## Auto-Deploy on GitHub Push

Both services are now set to auto-deploy!

1. Make changes locally
2. Commit and push to `main`:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Railway automatically detects changes
4. Both backend and frontend redeploy (2-5 minutes)
5. No manual action needed!

---

## Troubleshooting

### Frontend shows blank page
- Check VITE_API_URL is correct in Variables tab
- Check backend ALLOWED_ORIGINS includes your frontend domain
- Open browser DevTools (F12) → Console tab to see errors

### Frontend can't reach backend
- Make sure VITE_API_URL doesn't have trailing slash
- Check backend health endpoint works
- Wait 1 minute after changing ALLOWED_ORIGINS for it to take effect

### Backend returning 404
- Check you're accessing correct endpoint
- Visit `/docs` endpoint to see all available endpoints
- Check logs for error messages

### Services keep crashing
- Check Logs tab for error messages
- Verify all environment variables are set
- Check API keys are correct (Groq, HuggingFace, Qdrant)

---

## Add Custom Domain (Optional - Later)

Want your own domain instead of `*.up.railway.app`?

1. Buy a domain (GoDaddy, Namecheap, etc.)
2. In Railway, select service → Settings → Domains
3. Click "Add Custom Domain"
4. Follow instructions to update DNS
5. Wait 5-30 minutes for propagation

Example with custom domain:
```
Frontend:    https://legal-ai.yourdomain.com
Backend API: https://api.legal-ai.yourdomain.com
```

---

## Check Deployment Status

### In Railway Dashboard

- **Green dot** = Service running ✅
- **Yellow dot** = Deploying in progress
- **Red dot** = Service crashed ❌

### View All Services

Your project now has:
- ✅ Backend service (running)
- ✅ Frontend service (running)
- ✅ Auto-deploy on GitHub push

---

## Monitor Your App

### Daily Checks
- Check logs for errors: Service → Logs
- Verify health endpoint: `/health` returns `{"status":"ok"}`
- Monitor performance: Service → Metrics (if available)

### View Deployment History
- Service → Deployments tab
- See all deployment history
- Click to view individual deployment logs

---

## Next Steps

1. ✅ Backend deployed and accessible
2. ⏳ Deploy frontend (follow Step 3)
3. ⏳ Test full application
4. ⏳ Update CORS settings
5. ⏳ Add custom domain (optional)

---

## Support & Documentation

- **Railway Docs**: https://docs.railway.app
- **Your API Docs**: https://your-backend-url/docs
- **GitHub Repo**: https://github.com/HammadAli08/Legal-Case-Management-System

---

## Summary

Your Legal Case Management System is now live! 🚀

- Backend deployed ✅
- Frontend ready to deploy (follow Step 3)
- Auto-deploy on every GitHub push ✅
- Logs visible in Railway dashboard ✅
- Both services in one project ✅

**Continue with Step 3 above to deploy frontend!**
