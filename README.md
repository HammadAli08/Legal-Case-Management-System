# Legal AI - Case Management System

<div align="center">

![Legal AI](https://img.shields.io/badge/Legal%20AI-Case%20Management-2c666e?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Serverless-009688?style=for-the-badge&logo=fastapi)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

A stunning, production-ready legal case management system powered by AI. Fully optimized for Vercel Serverless deployment.

</div>

---

## ✨ Features

- **🏷️ Case Classification** - AI-powered categorization (Civil, Criminal, Constitutional)
- **⚡ Priority Assessment** - Smart urgency level detection (High, Medium, Low)
- **💬 Legal Assistant** - RAG-based chat for precedent research
- **Serverless Architecture** - Zero-config deployment on Vercel
- **Premium UI** - Modern glassmorphism design

---

## 🚀 Quick Start (Vercel)

This project relies on a "Vercel Native" structure where the frontend and backend live together.

### 1. Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) (optional, for local dev)
- Node.js 18+
- Python 3.9+

### 2. Local Development

You can run the frontend locally, but the backend serverless functions require `vercel dev` to emulate the environment correctly.

```bash
# Install dependencies
npm install
pip install -r api/requirements.txt

# Run with Vercel CLI (Recommended)
vercel dev
```

Or run separately (requires setting API URL in frontend):

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
uvicorn api.index:app --reload
```

### 3. Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the repository.
4. **Project Configuration**:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (Root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**: Add the variables below.
6. Click **Deploy**.

---

## 🔧 Environment Variables

Set these in your Vercel Project Settings:

```env
# AI Services
GROQ_API_KEY=your_groq_key
HUGGINGFACE_API_KEY=your_hf_token

# Vector DB
QDRANT_URL=https://your-qdrant-cluster
QDRANT_API_KEY=your_qdrant_api_key

# App Config
FASTAPI_ENV=production
ALLOWED_ORIGINS=*
```

---

## 📁 Project Structure

We use a Vercel-native monorepo structure:

```
legal-ai-production/
├── api/                  # Python Serverless Functions
│   ├── index.py          # Main FastAPI endpoints
│   ├── config.py         # Configuration
│   ├── models/           # ML Models (Pickle files)
│   └── requirements.txt  # Python Dependencies
├── src/                  # React Frontend Source
├── public/               # Static Assets
├── vercel.json           # Vercel Routing & Config
├── vite.config.js        # Vite Configuration
└── package.json          # Node Dependencies
```

---

## 🏗️ Architecture Notes

- **Zero Cold Start Logic**: Models are loaded via global caching. While the first request per lambda instance may take 5-10s, subsequent requests are instant.
- **Serverless**: The backend is stateless.
- **Rewrites**: `vercel.json` routes all `/api/*` traffic to the Python backend seamlessly.

---

## 📄 License

MIT © 2024 HammadAli08
