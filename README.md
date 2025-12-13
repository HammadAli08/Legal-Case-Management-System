# Legal Case Management System

A full‑stack app (FastAPI backend + React/Vite frontend) for legal case management with RAG-enabled chat, classification, and prioritization.

This repository is prepared for production deployment:
- Backend: Dockerized FastAPI app (root `Dockerfile`) — deploy on Railway
- Frontend: Vite/React app (in `frontend/`) — deploy on Vercel or any static host

Quick links
- Backend code: `backend/` (FastAPI app)
- Frontend code: `frontend/` (Vite + React)
- Root Dockerfile: `./Dockerfile` (builds backend)
- Deployment guide: `DEPLOYMENT.md`

Requirements
- Python 3.11+ (backend)
- Node.js 18+ (frontend local dev)
- Docker (optional, for building images locally)

Environment variables (required for production)

Backend (Railway) - add these in Railway Variables:
```
GROQ_API_KEY=your_groq_key
HUGGINGFACE_API_KEY=your_hf_token
QDRANT_URL=https://<your-qdrant-cluster>
QDRANT_API_KEY=your_qdrant_api_key
FASTAPI_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain
```

Frontend (Vercel) - add env var in Vercel project settings:
```
VITE_API_URL=https://your-backend-url
```

Local development

Backend
```bash
# create and activate venv
python -m venv .venv
source .venv/bin/activate

# install
pip install -r backend/requirements.txt

# run
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# open http://localhost:8000/docs
```

Frontend
```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173 (or the port shown by Vite)
```

Build & Docker (optional)

Build backend image locally (root Dockerfile builds backend):
```bash
docker build -t legal-ai-backend:local .
docker run -e GROQ_API_KEY=... -e HUGGINGFACE_API_KEY=... -e QDRANT_URL=... -e QDRANT_API_KEY=... -p 8000:8000 legal-ai-backend:local
```

Build frontend for static hosting
```bash
cd frontend
npm ci
npm run build
# serve dist/ with any static server or Dockerfile provided
```

Deployment (summary)
- Backend: Deploy to Railway using the root `Dockerfile`. Add required env vars in Railway -> Variables. Test `/health` and `/docs`.
- Frontend: Deploy to Vercel. Choose `frontend` as root when importing the repo and set `VITE_API_URL` to your Railway backend URL.

Useful commands
```
# run backend tests (if any)
# run frontend build locally to validate
cd frontend && npm run build
```

Troubleshooting
- If Railway build fails: check logs in Railway dashboard, ensure Dockerfile present at root, and all required env vars are set.
- If frontend cannot connect to API: confirm `VITE_API_URL` and `ALLOWED_ORIGINS` match exactly (no trailing slash).

Next steps (optional)
- Add GitHub Actions to auto-build Docker images and notify on failure
- Add monitoring (Sentry, Railway metrics)
- Configure custom domains on Vercel / Railway

License & contact
- Repository owner: `HammadAli08`
- For questions, open an issue in the repo or ask here.
