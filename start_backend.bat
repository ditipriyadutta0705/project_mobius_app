@echo off
title Project Mobius - Simulation Engine
echo ========================================================
echo   PROJECT MOBIUS: MULTIVERSE SIMULATION ENGINE
echo ========================================================
echo.
echo [*] Python Interpreter: C:\anaconda\envs\mobius-env\python.exe
echo [*] Running Dual-Search Simulation Pipeline (BFS + MCTS)...
echo.

if exist "%~dp0mobius-engine\backend\main.py" (
    cd /d "%~dp0"
    "C:\anaconda\envs\mobius-env\python.exe" mobius-engine\backend\main.py --depth 4 --mcts-iterations 15 --render-videos
) else if exist "%~dp0backend\main.py" (
    cd /d "%~dp0"
    "C:\anaconda\envs\mobius-env\python.exe" backend\main.py --depth 4 --mcts-iterations 15 --render-videos
) else (
    echo [!] Error: Could not locate backend/main.py.
)

echo.
echo [✓] Done. Press any key to exit.
pause
