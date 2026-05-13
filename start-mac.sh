#!/bin/bash

# ==============================================================================
# LLMForge Enterprise - Automated Developer Startup Script (macOS / Linux)
# ==============================================================================

echo "==============================================================="
echo " Booting LLMForge Enterprise Developer Environment"
echo "==============================================================="

# 1. Audit Backend Environment File
if [ ! -s "backend/.env" ]; then
    echo "❌ [CRITICAL ERROR]: backend/.env is missing or completely empty!"
    echo "⚠️  ACTION REQUIRED: Copy backend/.env.example to backend/.env and configure your variables (MongoDB URI & Puter Token)."
    exit 1
fi

# 2. Audit Frontend Environment File
if [ ! -s "frontend/.env" ]; then
    echo "❌ [CRITICAL ERROR]: frontend/.env is missing or completely empty!"
    echo "⚠️  ACTION REQUIRED: Copy frontend/.env.example to frontend/.env and configure your variables."
    exit 1
fi

echo "✅ Environment files found and populated."
echo "🚀 Initializing Node.js Backend Engine..."
cd backend && npm start & 
BACKEND_PID=$!

echo "🚀 Initializing Vite Frontend Engine..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "==============================================================="
echo " LLMForge is running! Close this terminal or press CTRL+C to terminate."
echo "==============================================================="

# Wait for both background processes
wait $BACKEND_PID $FRONTEND_PID
