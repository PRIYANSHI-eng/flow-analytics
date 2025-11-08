# Vanna AI Service - Step-by-Step Setup Guide

## Prerequisites

✅ Python 3.8 or higher installed
✅ PostgreSQL database running (via Docker)
✅ Groq API account (free tier available)

## Step 1: Navigate to Vanna Directory

```bash
cd c:/Users/chitt/OneDrive/Desktop/flow-analytics/services/vanna
```

## Step 2: Create Python Virtual Environment

### On Windows (bash):
```bash
python -m venv venv
source venv/Scripts/activate
```

### On Mac/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` prefix in your terminal.

## Step 3: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This will install:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- Vanna AI (SQL generation)
- Groq (LLM API client)
- psycopg2 (PostgreSQL adapter)
- Other dependencies

## Step 4: Get Groq API Key

1. **Visit Groq Console**: https://console.groq.com/
2. **Sign Up**: Create free account (no credit card required)
3. **Navigate to API Keys**: Left sidebar → "API Keys"
4. **Create New Key**: Click "Create API Key"
5. **Copy Key**: It will look like `gsk_xxxxxxxxxxxxxxxxxxxxx`

## Step 5: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env file with your text editor
```

Update `.env` with your actual values:

```env
# Paste your Groq API key here
GROQ_API_KEY=gsk_your_actual_key_from_groq_console

# Database URL (should match your Docker setup)
DATABASE_URL=postgresql://flowuser:flowpass123@localhost:5432/flow_analytics

# Server config (can leave as default)
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Step 6: Verify Database Connection

Make sure PostgreSQL is running:

```bash
# Check if Docker container is running
docker ps

# You should see flow-analytics-postgres-1 in the list
```

If not running:

```bash
cd c:/Users/chitt/OneDrive/Desktop/flow-analytics
docker-compose up -d
```

## Step 7: Start the Vanna Service

```bash
# Make sure you're in services/vanna directory
# Make sure virtual environment is activated (you see (venv))

python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Connected to PostgreSQL database
INFO:     Found 7 tables in database
INFO:     Vanna AI Service initialized successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Step 8: Test the Service

### Test 1: Health Check

Open new terminal and run:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database_connected": true,
  "model": "groq-llama3-70b",
  "timestamp": null
}
```

### Test 2: Ask a Question

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"What is the total spend?\"}"
```

Expected response:
```json
{
  "question": "What is the total spend?",
  "sql": "SELECT SUM(total_amount) as total_spend FROM invoices",
  "results": [{"total_spend": 249500.00}],
  "success": true,
  "error": null
}
```

### Test 3: Visit API Documentation

Open browser: http://localhost:8000/docs

You'll see interactive Swagger UI where you can test all endpoints.

## Step 9: Update Express Backend

The Express backend already has a `/api/chat-with-data` endpoint that will proxy to this service. Test it:

```bash
# Make sure Express backend is running on port 3001
curl -X POST http://localhost:3001/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"Show top 5 vendors by spend\"}"
```

## Common Commands

### Start Service
```bash
cd services/vanna
source venv/Scripts/activate  # On Windows bash
python main.py
```

### Stop Service
Press `Ctrl+C` in the terminal

### Deactivate Virtual Environment
```bash
deactivate
```

### View Logs
The service logs to console by default. Look for:
- `✅` Green checkmarks for success
- `❌` Red X for errors
- `INFO` level messages for operations

## Troubleshooting

### Error: "python: command not found"
**Solution**: Use `python3` instead of `python`

### Error: "GROQ_API_KEY not found"
**Solution**: 
1. Check `.env` file exists in `services/vanna/`
2. Verify `GROQ_API_KEY` is set
3. Restart the server

### Error: "Failed to connect to database"
**Solution**:
1. Check PostgreSQL is running: `docker ps`
2. Start it: `docker-compose up -d`
3. Test connection: `docker exec -it flow-analytics-postgres-1 psql -U flowuser -d flow_analytics`

### Error: "ModuleNotFoundError"
**Solution**:
1. Activate virtual environment
2. Run `pip install -r requirements.txt`

### Error: "Port 8000 already in use"
**Solution**:
1. Change `PORT=8001` in `.env`
2. Or kill existing process: `lsof -ti:8000 | xargs kill`

## Next Steps

1. ✅ Vanna AI Service is running on http://localhost:8000
2. ✅ Express API proxies to it via `/api/chat-with-data`
3. 🔲 Build frontend chat interface (Next.js)
4. 🔲 Integrate chat UI with backend API

## Quick Reference

| Command | Purpose |
|---------|---------|
| `python main.py` | Start Vanna service |
| `curl http://localhost:8000/health` | Check health |
| `curl http://localhost:8000/docs` | API documentation |
| `docker-compose up -d` | Start PostgreSQL |
| `docker-compose down` | Stop PostgreSQL |
| `source venv/Scripts/activate` | Activate venv (Windows) |
| `deactivate` | Deactivate venv |

---

**Status**: Vanna AI service is ready! 🚀

Next task: Build the frontend dashboard with Next.js and integrate the chat interface.
