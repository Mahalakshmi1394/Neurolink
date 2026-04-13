@echo off
title NeuroLink System Launcher
echo ===================================================
echo     STARTING NEUROLINK MEDICAL AI SYSTEM
echo ===================================================
echo.

echo 1. Starting Backend Server (Port 5000)...
start "NeuroLink Backend" cmd /k "cd server && npm start"

echo 2. Starting Frontend Client (Port 5173)...
start "NeuroLink App" cmd /k "cd client && npm run dev"

echo 3. Starting AI Service: Brain Tumor Analysis (Port 5001)...
start "AI - Brain Tumor" cmd /k "cd ai-services/brain-tumor && python app.py"

echo 4. Starting AI Service: Neuro Risk Prediction (Port 5002)...
start "AI - Neuro Risk" cmd /k "cd ai-services/neuro-risk && python app.py"

echo.
echo ===================================================
echo     ALL SERVICES STARTED SUCCESSFULLY
echo ===================================================
echo.
echo Please wait 10-20 seconds for all services to initialize.
echo Then open your browser to: http://localhost:5173
echo.
pause
