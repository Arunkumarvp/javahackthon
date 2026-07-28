# AI Financial Guardian — Java Hackathon

## Overview

**AI Financial Guardian & Open Banking Suite** is a full-stack application powered by a Spring Boot backend and a Vite-based JavaScript frontend. It integrates a Weaviate vector database for AI/RAG capabilities and supports public access via LocalTunnel.

---

## Prerequisites

Ensure the following are installed before running the project:

| Dependency        | Minimum Version    |
| ----------------- | ------------------ |
| Java (OpenJDK)    | 21                 |
| Maven             | 3.9+               |
| Node.js           | 18+                |
| npm               | 9+                 |
| Docker (optional) | Latest             |
| Git               | Any recent version |

> **Note:** The launcher script expects JDK 21 at `/usr/lib/jvm/java-21-openjdk-amd64`. Update the `JAVA_HOME` variable inside `start_app.sh` if your JDK is installed at a different path.

---

## Clone the Repository

```bash
git clone https://github.com/Arunkumarvp/javahackthon.git
cd javahackthon
git checkout feature/rag-banfico-dashboard-wiring
```

---

## Environment Configuration

Copy the example environment file and fill in required values before starting:

```bash
cp .env.example .env
```

Edit `.env` with your API keys, database connection strings, and any other required configuration (e.g., `JAVA_HOME`, `NODE_ENV`, Twilio credentials, OpenRouter API key).

---

## 🚀 Quick Start — Run the Entire Project

The easiest way to start all services at once is with the provided master launcher script:

```bash
chmod +x start_app.sh
./start_app.sh
```

### What `start_app.sh` does

The script orchestrates the full startup pipeline in **4 sequential steps**:

| Step | Service             | Port   | Description                                                                                                        |
| ---- | ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| 1    | Weaviate Vector DB  | `8085` | Starts the vector database using Docker Compose (falls back to in-memory Java RAG engine if Docker is unavailable) |
| 2    | Spring Boot Backend | `8080` | Compiles and launches the backend API server; waits for a health check at `/actuator/health`                       |
| 3    | Vite Frontend       | `3000` | Starts the frontend dev server accessible on all interfaces                                                        |
| 4    | LocalTunnel         | —      | Generates a public HTTPS URL to share the app with external users                                                  |

### Expected output

```
=========================================================================
        AI FINANCIAL GUARDIAN & OPEN BANKING SUITE - LAUNCHER
=========================================================================
• JDK Version : openjdk version "21.x.x" ...
• Root Path   : /path/to/javahackthon
=========================================================================
[1/4] Starting Weaviate Vector Database...
✔ Weaviate Vector DB active on port 8085.
[2/4] Launching Spring Boot Backend Service (Port 8080)...
✔ Spring Boot Backend starting (PID: xxxx, logs: backend.log)...
✔ Backend successfully listening on http://localhost:8080/api
[3/4] Launching Frontend Web Application (Port 3000)...
✔ Vite Frontend active on http://localhost:3000 (PID: xxxx, logs: frontend.log)
[4/4] Generating Public Access Tunnel URL...
=========================================================================
               🚀 APPLICATION DEPLOYMENT SUCCESSFUL
=========================================================================
 Local Access URL   : http://localhost:3000
 Network Access URL : http://<your-local-ip>:3000
 Backend API URL    : http://localhost:8080/api
 Public Access Link : https://<generated>.loca.lt
=========================================================================
```

### Accessing the application

| URL                           | Description                   |
| ----------------------------- | ----------------------------- |
| `http://localhost:3000`       | Frontend (local)              |
| `http://<local-ip>:3000`      | Frontend (network access)     |
| `http://localhost:8080/api`   | Backend REST API              |
| `https://<generated>.loca.lt` | Public access via LocalTunnel |

### Log files

All service logs are written to the project root:

| Log File       | Service                       |
| -------------- | ----------------------------- |
| `backend.log`  | Spring Boot backend output    |
| `frontend.log` | Vite frontend output          |
| `tunnel.log`   | LocalTunnel public URL output |

Monitor logs in real time:

```bash
tail -f backend.log
tail -f frontend.log
tail -f tunnel.log
```

### Stopping all services

Press `Ctrl+C` in the terminal running `start_app.sh`. The script's trap handler will cleanly shut down the backend, frontend, and tunnel processes.

---

## Running Services Individually

If you prefer to start services separately:

### Backend

```bash
cd "backend "
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npx vite --host 0.0.0.0 --port 3000
```

### Weaviate (Docker)

```bash
docker compose up -d
```

---
