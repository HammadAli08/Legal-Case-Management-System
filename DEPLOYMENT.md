# Deployment Guide - Legal Case Management System

This document covers deploying your application to Railway (backend) and Vercel (frontend).

---

## Quick Start

### Backend (Railway)
1. Go to https://railway.app
2. Sign in with GitHub
3. Create project → Deploy from GitHub → Select repo
4. Railway will auto-detect and use the root `Dockerfile`
5. Add environment variables:
   - `GROQ_API_KEY` = your Groq API key
   - `HUGGINGFACE_API_KEY` = your HuggingFace token
   - `QDRANT_URL` = your Qdrant Cloud URL
   - `QDRANT_API_KEY` = your Qdrant API key
   - `FASTAPI_ENV` = production
6. Deploy and get your backend URL

### Frontend (Vercel)
1. Go to https://vercel.com
2. Sign in with GitHub
3. Add new project → Import repo → Select repo
4. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`
5. Add environment variable:
   - `VITE_API_URL` = https://your-backend-railway-url.up.railway.app
6. Deploy and get your frontend URL

### Update Backend CORS
1. Go to Railway backend service
2. Add variable: `ALLOWED_ORIGINS` = your-frontend-vercel-url
3. Deploy

---

## Environment Variables

### Backend (Railway)
```
GROQ_API_KEY=gsk_...
HUGGINGFACE_API_KEY=hf_...
QDRANT_URL=https://...qdrant.io
QDRANT_API_KEY=...
FASTAPI_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.up.railway.app
```

---

## Accessing Your Application

Once deployed:
- **Frontend**: https://your-frontend.vercel.app
- **Backend API**: https://your-backend.up.railway.app
- **API Docs**: https://your-backend.up.railway.app/docs
- **API RedDoc**: https://your-backend.up.railway.app/redoc

---

## Auto-Deployment

Both services are configured to auto-deploy on GitHub push:
1. Make changes
2. Commit and push to main
3. Services auto-redeploy (2-5 minutes)

---

## Troubleshooting

**Backend won't start:**
- Check all environment variables are set correctly
- Verify API keys are valid
- Check logs in Railway dashboard

**Frontend blank page:**
- Check VITE_API_URL is correct
- Check backend ALLOWED_ORIGINS includes frontend domain
- Open browser DevTools (F12) for errors

**Can't reach backend:**
- Verify backend health: `https://your-backend-url/health`
- Check CORS settings
- Wait 1 minute after ALLOWED_ORIGINS change

---

## Documentation

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- Vite Docs: https://vitejs.dev
