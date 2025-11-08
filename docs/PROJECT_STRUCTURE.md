# Project Structure

```
flow-analytics/
│
├── 📁 apps/
│   ├── 📁 api/                          # Backend API (Node.js + Express + Prisma)
│   │   ├── 📁 prisma/
│   │   │   ├── schema.prisma           # Database schema
│   │   │   └── seed.ts                 # Data import script
│   │   ├── 📁 src/
│   │   │   ├── index.ts                # Express server entry point
│   │   │   └── 📁 routes/
│   │   │       ├── stats.ts            # GET /api/stats
│   │   │       ├── invoices.ts         # GET /api/invoices
│   │   │       ├── vendors.ts          # GET /api/vendors/top10
│   │   │       ├── trends.ts           # GET /api/trends/*
│   │   │       └── chat.ts             # POST /api/chat-with-data
│   │   ├── .env                        # Environment variables
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── 📁 web/                          # Frontend (Next.js) - TO BE CREATED
│       ├── 📁 app/
│       ├── 📁 components/
│       └── package.json
│
├── 📁 services/
│   └── 📁 vanna/                        # AI Service (Python + FastAPI) - TO BE CREATED
│       ├── main.py
│       ├── requirements.txt
│       └── .env
│
├── 📁 data/
│   └── Analytics_Test_Data.json        # Source data (64 invoices)
│
├── docker-compose.yml                   # PostgreSQL container config
├── package.json                         # Workspace root
├── README.md                            # Main documentation
└── BACKEND_SETUP.md                     # Setup guide

```

## Files Created (Backend - Phase 1)

### ✅ Configuration Files
- `docker-compose.yml` - PostgreSQL container setup
- `apps/api/package.json` - Dependencies
- `apps/api/tsconfig.json` - TypeScript config
- `apps/api/.env` - Environment variables
- `apps/api/.gitignore` - Git ignore rules

### ✅ Database Files
- `apps/api/prisma/schema.prisma` - Database schema (7 models)
- `apps/api/prisma/seed.ts` - Data import script

### ✅ Backend Code
- `apps/api/src/index.ts` - Express server
- `apps/api/src/routes/stats.ts` - Dashboard statistics
- `apps/api/src/routes/invoices.ts` - Invoice list endpoint
- `apps/api/src/routes/vendors.ts` - Vendor analytics
- `apps/api/src/routes/trends.ts` - Trends & forecasts
- `apps/api/src/routes/chat.ts` - AI chat proxy

### ✅ Documentation
- `apps/api/README.md` - Backend documentation
- `README.md` - Updated project README
- `BACKEND_SETUP.md` - Setup instructions

---

## Database Schema (7 Tables)

```
┌─────────────┐
│   vendors   │
├─────────────┤
│ id          │──┐
│ name (UK)   │  │
│ taxId       │  │
│ address     │  │
└─────────────┘  │
                 │
                 │  ┌──────────────┐
                 │  │  customers   │
                 │  ├──────────────┤
                 │  │ id           │──┐
                 │  │ name (UK)    │  │
                 │  │ address      │  │
                 │  └──────────────┘  │
                 │                    │
                 ├────────────────────┼──┐
                 │                    │  │
         ┌───────▼────────┐           │  │
         │   documents    │           │  │
         ├────────────────┤           │  │
         │ id             │──┐        │  │
         │ externalId(UK) │  │        │  │
         │ name           │  │        │  │
         │ fileType       │  │        │  │
         │ vendorId (FK)  │──┘        │  │
         └────────────────┘           │  │
                                      │  │
         ┌────────────────┐           │  │
         │    invoices    │◄──────────┘  │
         ├────────────────┤              │
         │ id             │──┐           │
         │ invoiceCode(UK)│  │           │
         │ invoiceDate    │  │           │
         │ totalAmount    │  │           │
         │ vendorId (FK)  │──┘           │
         │ customerId(FK) │──────────────┘
         └────────────────┘
                │
                │
       ┌────────┴────────┬──────────────┐
       │                 │              │
   ┌───▼───────────┐ ┌───▼─────┐ ┌─────▼────────────┐
   │invoice_line_  │ │payments │ │invoice_documents │
   │    items      │ │         │ │  (junction)      │
   ├───────────────┤ ├─────────┤ ├──────────────────┤
   │ id            │ │ id      │ │ id               │
   │ invoiceId(FK) │ │ invoice │ │ invoiceId (FK)   │
   │ description   │ │   Id(FK)│ │ documentId (FK)  │
   │ quantity      │ │ dueDate │ └──────────────────┘
   │ unitPrice     │ │ terms   │
   │ totalPrice    │ └─────────┘
   └───────────────┘
```

**Key Relationships:**
- Vendor → Many Invoices
- Vendor → Many Documents
- Customer → Many Invoices
- Invoice → Many Line Items
- Invoice → One Payment
- Invoice ↔ Documents (Many-to-Many via junction)

---

## API Endpoints (7 Routes)

```
Backend Server: http://localhost:3001

GET  /health                          → Health check
GET  /api/stats                       → Dashboard overview
GET  /api/invoices                    → List invoices (paginated)
  ├─ ?search=term                     → Search by vendor/invoice code
  ├─ ?page=1&limit=50                 → Pagination
  └─ ?sortBy=invoiceDate&order=desc   → Sorting

GET  /api/vendors/top10               → Top 10 vendors by spend
GET  /api/trends/invoice-volume       → Monthly trends
  └─ ?months=12                       → Last N months

GET  /api/trends/category-spend       → Spend by category
GET  /api/trends/cash-outflow         → Payment forecast by date range
POST /api/chat-with-data              → Natural language query
  └─ Body: { "query": "..." }         → Forwards to Vanna AI
```

---

## Tech Stack

### Backend (✅ Done)
```
Runtime:     Node.js 18+
Language:    TypeScript
Framework:   Express.js
Database:    PostgreSQL 16
ORM:         Prisma 5.22
Validation:  express-validator
CORS:        Enabled
```

### Frontend (🔜 Next)
```
Framework:   Next.js 14 (App Router)
Language:    TypeScript
Styling:     TailwindCSS
Components:  shadcn/ui
Charts:      Recharts
State:       React Context / Zustand
```

### AI Service (🔜 Next)
```
Runtime:     Python 3.11+
Framework:   FastAPI
AI Engine:   Vanna AI
LLM:         Groq
Database:    PostgreSQL (same as backend)
```

---

## Data Flow

```
┌─────────────────┐
│  JSON Data      │
│  (64 invoices)  │
└────────┬────────┘
         │
         │ npm run db:seed
         │
         ▼
┌─────────────────┐
│  PostgreSQL     │◄──────── Prisma ORM
│  (Docker)       │
└────────┬────────┘
         │
         │ Prisma Client
         │
         ▼
┌─────────────────┐
│  Express API    │◄──────── Frontend (Next.js)
│  (REST)         │
└────────┬────────┘
         │
         │ Fetch to Vanna
         │
         ▼
┌─────────────────┐
│  Vanna AI       │
│  (FastAPI)      │
└─────────────────┘
         │
         │ Groq LLM
         │
         ▼
    SQL + Results
```

---

## Environment Variables Summary

### apps/api/.env
```env
DATABASE_URL=postgresql://flowuser:flowpass123@localhost:5432/flow_analytics
PORT=3001
NODE_ENV=development
VANNA_API_BASE_URL=http://localhost:8000
```

### apps/web/.env.local (future)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### services/vanna/.env (future)
```env
DATABASE_URL=postgresql://flowuser:flowpass123@localhost:5432/flow_analytics
GROQ_API_KEY=<your_key>
PORT=8000
```

---

## Current Progress

```
Phase 1: Backend API ✅ COMPLETE
├─ Database setup ✅
├─ Data ingestion ✅
├─ API endpoints ✅
└─ Documentation ✅

Phase 2: Vanna AI Service ⏳ NEXT
├─ Setup FastAPI
├─ Integrate Vanna
├─ Connect Groq
└─ SQL generation

Phase 3: Frontend Dashboard ⏳ PENDING
├─ Setup Next.js
├─ Install shadcn/ui
├─ Build layouts
├─ Implement charts
└─ Connect to API

Phase 4: Deployment ⏳ PENDING
├─ Deploy frontend (Vercel)
├─ Deploy backend (Vercel)
├─ Deploy Vanna (Render/Railway)
└─ Production database
```

---

## What to Do Next

**Option A: Test Backend Thoroughly**
```bash
cd apps/api
npm run dev
# Test all endpoints
```

**Option B: Setup Vanna AI Service**
```bash
cd services/vanna
# Create Python FastAPI service
```

**Option C: Start Frontend**
```bash
cd apps/web
# Initialize Next.js app
```

**Recommended:** Complete backend testing first, then Vanna AI, then frontend.
