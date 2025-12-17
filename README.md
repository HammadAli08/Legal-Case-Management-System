# Legal AI - Case Management System

<div align="center">

![Legal AI](https://img.shields.io/badge/Legal%20AI-Case%20Management-2c666e?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge&logo=vercel)

A stunning, production-ready legal case management system powered by AI. Features ML-based case classification, priority assessment, and RAG-powered legal research assistant.

</div>

---

## ✨ Features

- **🏷️ Case Classification** - AI-powered categorization (Civil, Criminal, Constitutional)
- **⚡ Priority Assessment** - Smart urgency level detection (High, Medium, Low)
- **💬 Legal Assistant** - RAG-based chat for precedent research
- **🎨 Premium UI** - Modern glassmorphism design with smooth animations
- **📱 Responsive** - Works beautifully on all devices

---

## 🚀 Quick Start

### Frontend (Vercel Deployment)

```bash
cd frontend
npm install
npm run dev
```

**Deploy to Vercel:**
1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend-url`
5. Deploy!

### Backend (Railway Deployment)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Deploy to Railway:**
1. Connect GitHub repo to [Railway](https://railway.app)
2. Use root `Dockerfile`
3. Add environment variables (see below)
4. Deploy!

---

## 🔧 Environment Variables

### Backend (Railway)
```env
GROQ_API_KEY=your_groq_key
HUGGINGFACE_API_KEY=your_hf_token
QDRANT_URL=https://your-qdrant-cluster
QDRANT_API_KEY=your_qdrant_api_key
FASTAPI_ENV=production
ALLOWED_ORIGINS=https://your-vercel-domain
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-railway-backend-url
```

---

## 📁 Project Structure

```
legal-ai-production/
├── frontend/              # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── index.css     # Premium styling
│   ├── vercel.json       # Vercel configuration
│   └── package.json
├── backend/              # FastAPI
│   ├── app/
│   │   ├── main.py       # API endpoints
│   │   ├── config.py     # Settings
│   │   ├── models.py     # Pydantic models
│   │   └── utils.py      # Utilities
│   ├── models/           # ML models (.pkl)
│   └── requirements.txt
├── Dockerfile            # Backend Docker config
└── README.md
```

---

## 🎨 Design Features

- **Glassmorphism** - Frosted glass effects throughout
- **Gradient Accents** - Beautiful color transitions
- **Micro-animations** - Smooth, subtle interactions
- **Dark Theme** - Easy on the eyes, professional look
- **Google Fonts** - Inter + Playfair Display typography

---

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | System status |
| `/api/classify` | POST | Classify case type |
| `/api/prioritize` | POST | Determine priority |
| `/api/chat` | POST | Legal assistant chat |

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Lucide Icons
- Axios

**Backend:**
- FastAPI
- LangChain
- Qdrant (Vector DB)
- Groq LLM
- scikit-learn

---

## 📄 License

MIT © 2024 HammadAli08

---

<div align="center">

**Built with ❤️ for the legal profession**

</div>
