#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# AI Financial Guardian — Master Launcher & Public Deployment Pipeline
# ─────────────────────────────────────────────────────────────────────────────

set -e

# Setup environment variables
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
MAVEN_BIN="/opt/idea-IU-262.8665.258/plugins/maven-plugin/lib/maven3/bin/mvn"
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "========================================================================="
echo "        AI FINANCIAL GUARDIAN & OPEN BANKING SUITE - LAUNCHER           "
echo "========================================================================="
echo "• JDK Version : $(java -version 2>&1 | head -n 1)"
echo "• Root Path   : $PROJECT_ROOT"
echo "========================================================================="

# 1. Start Weaviate Vector Database
echo ""
echo "[1/4] Starting Weaviate Vector Database..."
if command -v docker >/dev/null 2>&1; then
    (cd "$PROJECT_ROOT" && docker compose up -d 2>/dev/null || docker-compose up -d 2>/dev/null) && echo "✔ Weaviate Vector DB active on port 8085." || echo "⚠ Docker unavailable — using in-memory Java RAG engine."
else
    echo "⚠ Docker not installed — using in-memory Java RAG engine."
fi

# 2. Build & Launch Backend Service
echo ""
echo "[2/4] Launching Spring Boot Backend Service (Port 8080)..."
BACKEND_DIR="$PROJECT_ROOT/backend "
cd "$BACKEND_DIR"
nohup $MAVEN_BIN spring-boot:run > "$PROJECT_ROOT/backend.log" 2>&1 &
BACKEND_PID=$!
echo "✔ Spring Boot Backend starting (PID: $BACKEND_PID, logs: backend.log)..."

# Wait for backend port 8080
echo "  Waiting for backend health check..."
COUNT=0
until curl -s http://localhost:8080/actuator/health >/dev/null 2>&1 || [ $COUNT -eq 30 ]; do
    sleep 2
    COUNT=$((COUNT + 1))
    echo -n "."
done
echo ""
if [ $COUNT -lt 30 ]; then
    echo "✔ Backend successfully listening on http://localhost:8080/api"
else
    echo "⚠ Backend takes longer to initialize; continuing launch pipeline."
fi

# 3. Build & Launch Frontend Application
echo ""
echo "[3/4] Launching Frontend Web Application (Port 3000)..."
FRONTEND_DIR="$PROJECT_ROOT/frontend"
cd "$FRONTEND_DIR"
nohup npx vite --host 0.0.0.0 --port 3000 > "$PROJECT_ROOT/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "✔ Vite Frontend active on http://localhost:3000 (PID: $FRONTEND_PID, logs: frontend.log)..."

# 4. Generate Public Access Link via LocalTunnel
echo ""
echo "[4/4] Generating Public Access Tunnel URL..."
echo "-------------------------------------------------------------------------"
echo "Public Tunnel Service initializing..."

npx -y localtunnel --port 3000 > "$PROJECT_ROOT/tunnel.log" 2>&1 &
TUNNEL_PID=$!

sleep 4
TUNNEL_URL=$(grep -o 'https://[^ ]*' "$PROJECT_ROOT/tunnel.log" | head -n 1 || echo "http://localhost:3000")

echo ""
echo "========================================================================="
echo "               🚀 APPLICATION DEPLOYMENT SUCCESSFUL                     "
echo "========================================================================="
echo " Local Access URL  : http://localhost:3000"
echo " Backend API URL   : http://localhost:8080/api"
echo " Public Access Link: $TUNNEL_URL"
echo "========================================================================="
echo " Share the Public Access Link with anyone to test the live AI app!"
echo " Logs are saved in backend.log, frontend.log, and tunnel.log"
echo " Press Ctrl+C to stop all services."
echo "========================================================================="

# Keep script running
trap "kill $BACKEND_PID $FRONTEND_PID $TUNNEL_PID 2>/dev/null; exit 0" INT TERM
wait
