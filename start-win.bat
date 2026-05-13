@echo off
setlocal
echo ===============================================================
echo  Booting LLMForge Enterprise Developer Environment (Windows)
echo ===============================================================

:: 1. Audit Backend Environment File
IF NOT EXIST "backend\.env" (
    echo [CRITICAL ERROR] backend\.env is completely missing!
    echo ACTION REQUIRED: Copy backend\.env.example to backend\.env and configure your variables (MongoDB URI ^& Puter Token).
    pause
    exit /b 1
)

FOR %%A IN ("backend\.env") DO IF %%~zA==0 (
    echo [CRITICAL ERROR] backend\.env is completely empty!
    echo ACTION REQUIRED: Please populate your variables inside backend\.env.
    pause
    exit /b 1
)

:: 2. Audit Frontend Environment File
IF NOT EXIST "frontend\.env" (
    echo [CRITICAL ERROR] frontend\.env is completely missing!
    echo ACTION REQUIRED: Copy frontend\.env.example to frontend\.env and configure your variables.
    pause
    exit /b 1
)

FOR %%A IN ("frontend\.env") DO IF %%~zA==0 (
    echo [CRITICAL ERROR] frontend\.env is completely empty!
    echo ACTION REQUIRED: Please populate your variables inside frontend\.env.
    pause
    exit /b 1
)

echo [SUCCESS] Environment files found and populated.
echo Initializing Node.js Backend Engine...
start "LLMForge Backend" cmd /k "cd backend && npm start"

echo Initializing Vite Frontend Engine...
start "LLMForge Frontend" cmd /k "cd frontend && npm run dev"

echo ===============================================================
echo  LLMForge is booting up in separate command prompt windows!
echo ===============================================================
pause
