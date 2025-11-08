# Flow Analytics# Flow Analytics



> AI-Powered Analytics Dashboard for Invoice & Spend ManagementFull-stack analytics dashboard with AI-powered natural language queries.



A production-grade full-stack application featuring real-time analytics, natural language querying, and comprehensive spend management built with modern technologies.## Project Structure



## 🎯 Project Overview```

flow-analytics/

Flow Analytics is an intelligent invoice analytics platform that combines powerful data visualization with AI-driven insights. Users can explore spend patterns, track vendor performance, and query data using natural language.├── apps/

│   ├── api/          # Express.js backend API

### Key Features│   └── web/          # Next.js frontend

├── services/

- 📊 **Real-time Analytics Dashboard** - Interactive charts and metrics for spend analysis│   └── vanna/        # Vanna AI service (Python)

- 🤖 **AI Chat Interface** - Ask questions in plain English, get SQL-powered answers├── data/

- 📈 **Trend Analysis** - Monthly invoice volumes, category spend, cash flow forecasts│   └── Analytics_Test_Data.json

- 🔍 **Smart Search** - Filter and search through invoices with ease├── docker-compose.yml

- 💰 **Vendor Intelligence** - Track top vendors, spending patterns, payment status└── package.json

- 📱 **Responsive Design** - Works seamlessly on desktop and mobile```



## 🏗️ Architecture## Quick Start



```### 1. Start Database

flow-analytics/

├── apps/```bash

│   ├── api/                    # Express + Prisma REST APIdocker-compose up -d

│   │   ├── prisma/```

│   │   │   ├── schema.prisma   # Database schema (7 normalized tables)

│   │   │   └── seed.ts         # Data import script### 2. Setup Backend API

│   │   └── src/

│   │       ├── lib/            # Prisma singleton```bash

│   │       ├── routes/         # API endpoints (7 routes)cd apps/api

│   │       └── index.ts        # Express servernpm install

│   │npm run db:generate

│   └── web/                    # Next.js frontend (Coming soon)npm run db:push

│npm run db:seed

├── services/npm run dev

│   └── vanna/                  # Python FastAPI service```

│       ├── main.py             # FastAPI app

│       ├── vanna_service.py    # Groq LLM integrationBackend runs on http://localhost:3001

│       └── requirements.txt    # Python dependencies

│### 3. Setup Frontend (Coming Soon)

├── data/

│   └── Analytics_Test_Data.json  # Sample invoice data```bash

│cd apps/web

├── docs/                       # Additional documentationnpm install

├── docker-compose.yml          # PostgreSQL databasenpm run dev

└── package.json                # Monorepo workspace config```

```

Frontend runs on http://localhost:3000

## 🛠️ Tech Stack

### 4. Setup Vanna AI (Coming Soon)

### Backend

- **Runtime**: Node.js 18+ with TypeScript```bash

- **Framework**: Express.js 4.18cd services/vanna

- **ORM**: Prisma 5.22 (with PostgreSQL)pip install -r requirements.txt

- **Database**: PostgreSQL 16 (Docker)python main.py

- **Architecture**: RESTful API with singleton pattern```



### AI ServiceVanna AI runs on http://localhost:8000

- **Language**: Python 3.11+

- **Framework**: FastAPI 0.109## Tech Stack

- **LLM**: Groq (LLaMA 3.3 70B)

- **Database**: PostgreSQL via psycopg2### Backend

- **Runtime**: Node.js with TypeScript

### Frontend (Coming Soon)- **Framework**: Express.js

- **Framework**: Next.js 14+- **Database**: PostgreSQL (via Docker)

- **UI Library**: shadcn/ui + Tailwind CSS- **ORM**: Prisma

- **Charts**: Recharts- **API Style**: REST

- **Type Safety**: TypeScript

### Frontend

## 🚀 Quick Start- **Framework**: Next.js 14 (App Router)

- **Language**: TypeScript

### Prerequisites- **Styling**: TailwindCSS

- **Components**: shadcn/ui

- Node.js 18+- **Charts**: Recharts

- Python 3.11+

- Docker Desktop### AI Service

- Groq API Key (free at https://console.groq.com/)- **Framework**: FastAPI (Python)

- **AI**: Vanna AI + Groq

### 1. Clone Repository- **Database**: PostgreSQL



```bash## Environment Variables

git clone https://github.com/PRIYANSHI-eng/flow-analytics.git

cd flow-analyticsCreate `.env` files in each app:

```

**apps/api/.env**

### 2. Install Dependencies```env

DATABASE_URL="postgresql://flowuser:flowpass123@localhost:5432/flow_analytics"

```bashPORT=3001

# Install Node.js dependenciesVANNA_API_BASE_URL=http://localhost:8000

npm install```



# Install Python dependencies**apps/web/.env.local**

cd services/vanna```env

python -m venv venvNEXT_PUBLIC_API_URL=http://localhost:3001

source venv/Scripts/activate  # Windows: venv\Scripts\activate```

pip install -r requirements.txt

cd ../..**services/vanna/.env**

``````env

DATABASE_URL=postgresql://flowuser:flowpass123@localhost:5432/flow_analytics

### 3. Setup Environment VariablesGROQ_API_KEY=your_groq_api_key

PORT=8000

**Backend API** (`apps/api/.env`):```

```env

DATABASE_URL="postgresql://flowuser:flowpass123@localhost:5432/flow_analytics"## Database Schema

PORT=3001

```- **vendors** - Vendor information

- **customers** - Customer information

**Vanna AI Service** (`services/vanna/.env`):- **documents** - Uploaded files

```env- **invoices** - Invoice records

GROQ_API_KEY=your_groq_api_key_here- **invoice_line_items** - Invoice line items

DATABASE_URL=postgresql://flowuser:flowpass123@localhost:5432/flow_analytics- **payments** - Payment terms

PORT=8000- **invoice_documents** - Links invoices to documents

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

```## API Endpoints



### 4. Start Services| Endpoint | Description |

|----------|-------------|

```bash| `GET /api/stats` | Dashboard statistics |

# Start PostgreSQL database| `GET /api/invoices` | List invoices |

docker-compose up -d| `GET /api/vendors/top10` | Top 10 vendors |

| `GET /api/trends/invoice-volume` | Invoice trends |

# Generate Prisma client and seed database| `GET /api/trends/category-spend` | Category spending |

cd apps/api| `GET /api/trends/cash-outflow` | Cash outflow forecast |

npm run db:generate| `POST /api/chat-with-data` | Natural language queries |

npm run db:push

npm run db:seed## Features



# Start Express API (Terminal 1)### ✅ Implemented

npm run dev- PostgreSQL database setup with Docker

- Normalized data schema

# Start Vanna AI service (Terminal 2)- Data ingestion from JSON

cd ../../services/vanna- REST API endpoints

source venv/Scripts/activate- Dashboard statistics

python main.py

```### 🔄 In Progress

- Vanna AI integration

### 5. Verify Services- Frontend dashboard

- Chart visualizations

- **Express API**: http://localhost:3001

- **Vanna AI**: http://localhost:8000/docs### 📋 Planned

- **PostgreSQL**: localhost:5432- Chat interface

- Data export

## 📡 API Endpoints- Role-based access

- Deployment

### Express Backend (Port 3001)

## Development

| Endpoint | Method | Description |

|----------|--------|-------------|```bash

| `/api/stats` | GET | Dashboard overview statistics |# Start all services

| `/api/invoices` | GET | Paginated invoice list with search |docker-compose up -d        # Database

| `/api/vendors/top10` | GET | Top 10 vendors by spend |cd apps/api && npm run dev  # Backend

| `/api/trends/invoice-volume` | GET | Monthly invoice trends |cd apps/web && npm run dev  # Frontend

| `/api/trends/category-spend` | GET | Spending by GL account |cd services/vanna && python main.py  # AI service

| `/api/trends/cash-outflow` | GET | Cash flow by date ranges |

| `/api/chat-with-data` | POST | Proxy to Vanna AI service |# Database management

cd apps/api

### Vanna AI Service (Port 8000)npm run db:studio          # Visual database browser

npm run db:push            # Update schema

| Endpoint | Method | Description |npm run db:seed            # Re-seed data

|----------|--------|-------------|

| `/health` | GET | Health check |# View logs

| `/ask` | POST | Natural language to SQL + execution |docker logs flow-analytics-db  # Database logs

| `/generate-sql/{question}` | GET | Generate SQL without execution |```

| `/train` | POST | Train model with SQL examples |

## Deployment

## 💡 Usage Examples

- **Frontend + Backend**: Vercel

### Query Dashboard Statistics- **Database**: Railway / Render / Supabase

- **Vanna AI**: Render / Railway / Fly.io

```bash

curl http://localhost:3001/api/stats## License

```

MIT
Response:
```json
{
  "totalSpend": { "current": 30129.36, "previous": 0, "change": 0 },
  "invoiceCount": { "current": 50, "previous": 0, "change": 0 },
  "documentUploads": { "current": 50, "previous": 0, "change": 0 },
  "avgInvoiceValue": { "current": 602.59, "previous": 0, "change": 0 }
}
```

### Ask Natural Language Question

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the total spend?"}'
```

Response:
```json
{
  "question": "What is the total spend?",
  "sql": "SELECT SUM(i.\"totalAmount\") FROM invoices i",
  "results": [{"sum": "30129.36"}],
  "success": true
}
```

### Get Top Vendors

```bash
curl http://localhost:3001/api/vendors/top10
```

## 🗄️ Database Schema

7 normalized tables with proper relationships and indexes:

- **vendors** - Vendor information
- **customers** - Customer details
- **documents** - Uploaded document metadata
- **invoices** - Invoice records (indexed on date, vendor, customer)
- **invoice_line_items** - Line items with GL accounts
- **payments** - Payment records (indexed on due date)
- **invoice_documents** - Junction table for many-to-many relationship

## 🧪 Sample Questions for AI Chat

- "What is the total spend for the last 3 months?"
- "Show me the top 5 vendors by invoice amount"
- "How many invoices are overdue?"
- "What's the average invoice value by month?"
- "Show spending breakdown by GL account"
- "Which vendor has the most invoices?"

## 📊 Data Model

The system processes invoice data with the following structure:

- **50 invoices** imported from Analytics_Test_Data.json
- **665 line items** with GL account categorization
- **12 unique vendors** tracked
- **10 customers** in the system
- **Date range**: Historical invoice data
- **Currency**: EUR (with multi-currency support)

## 🔧 Development

### Common Commands

```bash
# Backend development
cd apps/api
npm run dev              # Start dev server with hot reload
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Import sample data

# Vanna AI development
cd services/vanna
source venv/Scripts/activate
python main.py           # Start with auto-reload
```

### Database Management

```bash
# Connect to PostgreSQL
docker exec -it flow-analytics-db psql -U flowuser -d flow_analytics

# View all invoices
SELECT * FROM invoices LIMIT 10;

# Check total spend
SELECT SUM("totalAmount") FROM invoices;

# Reset database
cd apps/api
npm run db:push -- --force-reset
npm run db:seed
```

## 🚢 Deployment

### Backend API
- **Platform**: Railway / Render
- **Database**: Managed PostgreSQL
- **Environment**: Production NODE_ENV

### Vanna AI Service
- **Platform**: Railway / Render
- **Runtime**: Python 3.11+
- **Requirements**: requirements.txt

### Frontend (Coming Soon)
- **Platform**: Vercel
- **Build**: Next.js static export
- **API**: Connected to deployed backend

## 🔐 Security

- ✅ Environment variables for secrets
- ✅ CORS configuration
- ✅ Database connection pooling (singleton pattern)
- ✅ Input validation (Pydantic models)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Rate limiting (recommended for production)

## 📝 Environment Setup

Create `.env` files in:
1. `apps/api/.env` - Backend API config
2. `services/vanna/.env` - AI service config

See `.env.example` files in each directory for templates.

## 🤝 Contributing

This project was developed as part of an internship assignment. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is part of an internship program.

## 🙏 Acknowledgments

- **Groq** - Ultra-fast LLM inference
- **Prisma** - Next-generation ORM
- **FastAPI** - High-performance Python framework
- **shadcn/ui** - Beautiful UI components (upcoming)

## 📞 Support

For questions or issues:
1. Check the `docs/` folder for detailed documentation
2. Review API endpoints at http://localhost:8000/docs
3. Test endpoints using the provided curl examples

---

**Status**: Backend Complete ✅ | Frontend In Progress 🚧

Built with ❤️ using modern web technologies
