@echo off
echo ===================================================
echo   Starting Full-Stack Calculator App...
echo ===================================================
echo.

echo [1/2] Starting Go Backend on port 8080 (background)...
start /b cmd /c "cd backend && go run ./cmd/server"

echo [2/2] Starting React Frontend...
echo.
echo Once booted, click the link to play:
echo http://localhost:5173/
echo.
echo ===================================================
cd frontend
npm run dev
