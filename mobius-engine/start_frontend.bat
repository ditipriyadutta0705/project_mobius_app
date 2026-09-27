@echo off
title Project Mobius - Stark HUD Frontend
echo ========================================================
echo   PROJECT MOBIUS: STARTING STARK HOLOGRAPHIC HUD
echo ========================================================
echo.
echo [*] Configuring session PATH for Node.js and npm...
set "PATH=C:\anaconda\envs\mobius-env;C:\anaconda\envs\mobius-env\Scripts;%PATH%"

if exist "%~dp0frontend\package.json" (
    cd /d "%~dp0frontend"
) else if exist "%~dp0mobius-engine\frontend\package.json" (
    cd /d "%~dp0mobius-engine\frontend"
) else if exist "%~dp0package.json" (
    cd /d "%~dp0"
) else (
    echo [!] Error: Could not locate frontend directory with package.json.
    pause
    exit /b 1
)

echo [*] Working Directory: %CD%
echo.
echo ========================================================
echo  Launching Vite Dev Server...
echo  Local URL: http://localhost:5173
echo ========================================================
echo.

:: Open default browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173"

:: Start Vite development server
node node_modules\vite\bin\vite.js --host

pause
