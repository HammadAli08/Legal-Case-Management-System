# Legal Case Management System - Deployment Guide

This guide covers deploying your full-stack Legal AI application to production using multiple hosting options.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment Options](#backend-deployment-options)
3. [Frontend Deployment Options](#frontend-deployment-options)
4. [Full-Stack Deployment](#full-stack-deployment)
5. [Environment Configuration](#environment-configuration)
6. [CI/CD Setup](#cicd-setup)

---

## Prerequisites

### Required
- GitHub account (already done ✓)
- API keys for:
  - **Groq API** (for LLM - ChatGroq)
  - **Hugging Face** (for embeddings)
  - **Qdrant Cloud** (for vector database)
- Python 3.10+ (Backend)
- Node.js 18+ (Frontend)

### Recommended
- Docker & Docker Compose
- Git CLI
- Domain name (optional but recommended)

---

## Backend Deployment Options

### Option 1: Render (Easiest, Free Tier Available)

#### Step 1: Prepare Backend
```bash
cd backend
# Ensure requirements.txt is complete
pip freeze > requirements.txt
```

#### Step 2: Create `.env.production` file
```
FASTAPI_ENV=production
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_key
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
DATABASE_URL=your_database_url
```

#### Step 3: Deploy to Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Set configuration:
   - **Name**: legal-ai-backend
   - **Runtime**: Python 3.10
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
   - **Root Directory**: `backend`
6. Add environment variables in "Environment" tab
7. Deploy

**Render URL**: Your service will be available at `https://legal-ai-backend-xxxx.onrender.com`

---

### Option 2: Railway (Simple, Pay-as-you-go)

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Deploy
```bash
cd backend
railway init
railway link
railway up
```

#### Step 3: Set Environment Variables
```bash
railway variables set GROQ_API_KEY=your_key
railway variables set HUGGINGFACE_API_KEY=your_key
railway variables set QDRANT_URL=your_url
railway variables set QDRANT_API_KEY=your_key
```

---

### Option 3: AWS (Most Scalable)

#### Using Elastic Beanstalk
1. Install AWS CLI: `pip install awsebcli`
2. Initialize: `eb init -p python-3.11 legal-ai-backend`
3. Create environment: `eb create legal-ai-env`
4. Set environment variables:
   ```bash
   eb setenv GROQ_API_KEY=your_key HUGGINGFACE_API_KEY=your_key
   ```
5. Deploy: `eb deploy`

#### Using ECS + ECR (Docker)
See Docker Deployment section below.

---

### Option 4: Docker + Any Cloud (Most Flexible)

#### Step 1: Create `Dockerfile` in backend/
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Step 2: Create `docker-compose.yml` (for local testing)
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - FASTAPI_ENV=production
      - GROQ_API_KEY=${GROQ_API_KEY}
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - QDRANT_URL=${QDRANT_URL}
      - QDRANT_API_KEY=${QDRANT_API_KEY}
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  qdrant_storage:
```

#### Step 3: Build and push to Docker Hub
```bash
docker build -t yourusername/legal-ai-backend:latest ./backend
docker push yourusername/legal-ai-backend:latest
```

---

## Frontend Deployment Options

### Option 1: Vercel (Recommended for React/Vite)

#### Step 1: Prepare Frontend
```bash
cd frontend
npm install
npm run build
```

#### Step 2: Deploy
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repo
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - `VITE_API_URL=https://your-backend-url.com`
7. Deploy

**Vercel URL**: Your app will be available at `https://legal-ai-xxxx.vercel.app`

---

### Option 2: Netlify

#### Step 1: Configure `netlify.toml`
```toml
[build]
  command = "cd frontend && npm install && npm run build"
  publish = "frontend/dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy
1. Go to https://netlify.com
2. Connect GitHub repo
3. Configure build settings as above
4. Add environment variables
5. Deploy

---

### Option 3: GitHub Pages (Free but Limited)

#### Step 1: Update `vite.config.js`
```javascript
export default {
  base: '/Legal-Case-Management-System/',
  // ... rest of config
}
```

#### Step 2: Update `package.json`
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.1.0"
  }
}
```

#### Step 3: Deploy
```bash
npm run deploy
```

---

### Option 4: Docker to Any Cloud

#### Create `frontend/Dockerfile`
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Create `frontend/nginx.conf`
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://backend:8000/;
    }
}
```

---

## Full-Stack Deployment

### Recommended: Render + Vercel (Easiest)

| Component | Service | Free? | Difficulty |
|-----------|---------|-------|-----------|
| Backend | Render | Yes (limited) | Easy |
| Frontend | Vercel | Yes | Easy |
| Database | Qdrant Cloud | Yes (limited) | Easy |

### Steps:
1. Deploy backend to Render (see above)
2. Deploy frontend to Vercel (see above)
3. Update frontend's `VITE_API_URL` to point to Render backend
4. Update backend's CORS settings to allow Vercel domain

### Update Backend CORS (`backend/app/main.py`):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-app.vercel.app",
        "localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Environment Configuration

### Backend `.env.production`
```
FASTAPI_ENV=production
LOG_LEVEL=info

# LLM & Embeddings
GROQ_API_KEY=gsk_xxxxx
HUGGINGFACE_API_KEY=hf_xxxxx

# Vector Database
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=xxxxxxx

# Database (if using)
DATABASE_URL=postgresql://user:password@host/db

# CORS
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### Frontend `.env.production`
```
VITE_API_URL=https://your-backend-url.com
VITE_ENV=production
```

---

## CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl -X POST https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_DEPLOY_KEY }}

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Quick Start Checklist

- [ ] Add environment variables to GitHub Secrets
- [ ] Choose deployment platforms (Render + Vercel recommended)
- [ ] Create Docker files (optional but recommended)
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Update CORS settings
- [ ] Update API URL in frontend
- [ ] Test end-to-end
- [ ] Set up CI/CD
- [ ] Monitor logs and errors

---

## Troubleshooting

### Backend won't start
- Check `requirements.txt` has all dependencies
- Verify all environment variables are set
- Check Qdrant and Groq API keys are valid
- Review logs in deployment platform

### Frontend can't reach backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running and accessible

### Build failures
- Run builds locally first: `npm run build` (frontend), `uvicorn app.main:app` (backend)
- Check Node/Python versions match requirements
- Verify all dependencies are in requirements.txt or package.json

---

## Production Best Practices

1. **Security**
   - Never commit `.env` files
   - Use strong API keys
   - Enable HTTPS (automatic on Vercel/Render)
   - Set appropriate CORS origins

2. **Monitoring**
   - Enable logs on Render/Vercel
   - Set up error tracking (Sentry)
   - Monitor API performance

3. **Scaling**
   - Use load balancers for backend
   - Enable caching on frontend
   - Optimize vector database queries

4. **Updates**
   - Set up auto-deployment on main branch
   - Test in staging before production
   - Keep dependencies updated

---

## Contact & Support

For issues:
- Check platform-specific docs (Render, Vercel, etc.)
- Review application logs
- Test API locally first
