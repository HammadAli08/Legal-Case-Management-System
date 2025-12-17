# Use GitHub Container Registry mirror
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend .

# Don't hardcode port. Use $PORT environment variable provided by Railway (defaults to 8000)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
