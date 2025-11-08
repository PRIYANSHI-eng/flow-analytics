# Vanna AI Service

Natural Language to SQL conversion service using Groq LLM and PostgreSQL.

## Overview

This service allows users to query the Flow Analytics database using natural language questions. It uses Groq's powerful LLaMA 3.1 70B model to convert questions into SQL and execute them against the PostgreSQL database.

## Features

- 🤖 **Natural Language Queries**: Ask questions in plain English
- ⚡ **Groq LLM**: Uses Groq's fast inference for SQL generation
- 🗄️ **PostgreSQL Integration**: Direct connection to your analytics database
- 🔒 **Type-Safe**: Full type hints with Pydantic models
- 📊 **Schema-Aware**: Understands your database structure
- 🚀 **FastAPI**: High-performance async API

## Setup

### 1. Create Virtual Environment

```bash
cd services/vanna
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Get your Groq API key from: https://console.groq.com/
GROQ_API_KEY=gsk_your_actual_groq_api_key_here

# PostgreSQL connection (should match your Docker setup)
DATABASE_URL=postgresql://flowuser:flowpass123@localhost:5432/flow_analytics

PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Get Groq API Key

1. Visit https://console.groq.com/
2. Sign up for free account
3. Navigate to API Keys section
4. Create new API key
5. Copy and paste into `.env` file

## Running the Service

### Development Mode

```bash
# Make sure your virtual environment is activated
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --port 8000
```

The service will start on http://localhost:8000

## API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
```

### Ask a Question
```bash
POST http://localhost:8000/ask
Content-Type: application/json

{
  "question": "What is the total spend for the last 3 months?"
}
```

Response:
```json
{
  "question": "What is the total spend for the last 3 months?",
  "sql": "SELECT SUM(total_amount) as total_spend FROM invoices WHERE invoice_date >= CURRENT_DATE - INTERVAL '3 months'",
  "results": [
    {
      "total_spend": 125000.50
    }
  ],
  "success": true,
  "error": null
}
```

### Generate SQL Only (No Execution)
```bash
GET http://localhost:8000/generate-sql/What are the top 5 vendors by spend?
```

### Train Model
```bash
POST http://localhost:8000/train
Content-Type: application/json

{
  "sql_examples": [
    {
      "question": "Show top 5 vendors by spend",
      "sql": "SELECT v.vendor_name, SUM(i.total_amount) as total FROM vendors v JOIN invoices i ON v.id = i.vendor_id GROUP BY v.id ORDER BY total DESC LIMIT 5"
    }
  ]
}
```

## Example Questions

Try these natural language questions:

- "What is the total spend for the last 3 months?"
- "Show me the top 10 vendors by total invoice amount"
- "Which invoices are overdue?"
- "What is the average invoice value by month?"
- "Show spending by GL account category"
- "How many invoices were created last quarter?"
- "What is the total value of pending invoices?"
- "Show me all invoices from vendor 'Acme Corp'"

## Database Schema Reference

The service understands the following tables:

- **vendors**: Vendor information
- **customers**: Customer information  
- **documents**: Uploaded documents
- **invoices**: Invoice records
- **invoice_line_items**: Line items with GL accounts
- **payments**: Payment records
- **invoice_documents**: Links invoices to documents

See `vanna_service.py` for complete schema details.

## Testing

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Ask a question
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the total spend?"}'

# Generate SQL only
curl http://localhost:8000/generate-sql/Show%20top%205%20vendors
```

### Using Python

```python
import requests

# Ask a question
response = requests.post(
    "http://localhost:8000/ask",
    json={"question": "What is the total spend for the last month?"}
)

result = response.json()
print(f"SQL: {result['sql']}")
print(f"Results: {result['results']}")
```

## Integration with Express API

The Express backend `/api/chat-with-data` endpoint proxies to this service:

```javascript
// In your Express app
app.post('/api/chat-with-data', async (req, res) => {
  const response = await fetch('http://localhost:8000/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: req.body.question })
  });
  const data = await response.json();
  res.json(data);
});
```

## Troubleshooting

### "GROQ_API_KEY not found"
- Make sure `.env` file exists in `services/vanna/`
- Check that `GROQ_API_KEY` is set correctly
- Restart the server after changing `.env`

### "Failed to connect to database"
- Ensure PostgreSQL Docker container is running: `docker-compose ps`
- Check DATABASE_URL matches your PostgreSQL credentials
- Test connection: `psql postgresql://flowuser:flowpass123@localhost:5432/flow_analytics`

### "Module not found"
- Activate virtual environment: `venv\Scripts\activate` (Windows)
- Install dependencies: `pip install -r requirements.txt`

### SQL Generation Issues
- Check that your database schema is up to date
- Try rephrasing the question more specifically
- Use `/generate-sql` endpoint to debug SQL without executing

## Architecture

```
services/vanna/
├── main.py              # FastAPI application
├── vanna_service.py     # Vanna + Groq integration
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (create from .env.example)
└── README.md           # This file
```

## Performance

- **Groq LLM**: Ultra-fast inference (~500 tokens/sec)
- **SQL Generation**: Typically <1 second
- **Query Execution**: Depends on database complexity

## Security

- Never commit `.env` file
- Use environment variables for all secrets
- CORS configured for allowed origins only
- SQL injection prevention via parameterized queries (planned)

## Future Enhancements

- [ ] SQL query caching for repeated questions
- [ ] Query result streaming for large datasets
- [ ] Fine-tuning with company-specific SQL patterns
- [ ] Query validation before execution
- [ ] Rate limiting
- [ ] Authentication/Authorization

## License

Part of Flow Analytics internship project.
