#!/bin/bash
# starts backend + frontend dev servers

echo "🎮 starting irene.exe..."

# backend
cd "$(dirname "$0")/backend"
python3 -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo "✓ backend running at http://localhost:8000 (pid $BACKEND_PID)"

# frontend
cd "$(dirname "$0")/frontend"
npm run dev -- --port 5173 &
FRONTEND_PID=$!
echo "✓ frontend running at http://localhost:5173 (pid $FRONTEND_PID)"

echo ""
echo "  admin panel → http://localhost:5173  (click YOU tab)"
echo "  her view    → http://localhost:5173  (click HER tab)"
echo ""
echo "  ctrl+c to stop both servers"

# cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
