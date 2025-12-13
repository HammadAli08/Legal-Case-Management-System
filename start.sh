#!/bin/bash
# This script is used by Railway to start the application
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
