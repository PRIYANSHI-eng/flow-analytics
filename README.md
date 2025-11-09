# Flow Analytics

> AI-Powered Analytics Dashboard for Invoice & Spend Management

Full-stack analytics dashboard with AI-powered natural language queries built with Next.js, Express, and Groq AI.

## ��� Live Production Deployment

**��� Access the Application**

- **Frontend Dashboard**: https://flow-analytics-web.vercel.app
- **Backend API**: https://flow-analytics-api.vercel.app  
- **Vanna AI Service**: https://flow-analytics-vanna.onrender.com
- **Database**: Neon PostgreSQL (Serverless)
- **GitHub Repository**: https://github.com/PRIYANSHI-eng/flow-analytics

**��� Demo Video**: [Paste your Google Drive link here]

> **⚠️ Important Note for Testing**: The AI Chat feature uses Render's free tier, which sleeps after 15 minutes of inactivity. If you see a "connection closed" error on first attempt, please wait 30 seconds and retry - the service will wake up and work perfectly. All other features (Dashboard, Charts, Settings) work instantly!

## �� Project Overview

Flow Analytics is an intelligent invoice analytics platform that combines powerful data visualization with AI-driven insights. Users can explore spend patterns, track vendor performance, and query data using natural language.

### Key Features

- ��� **Real-time Analytics Dashboard** - Interactive charts and metrics for spend analysis
- ��� **AI Chat Interface** - Ask questions in plain English, get SQL-powered answers
- ��� **Trend Analysis** - Monthly invoice volumes, category spend, cash flow forecasts
- ��� **Smart Search** - Filter and search through invoices with ease
- �� **Vendor Intelligence** - Track top vendors, spending patterns, payment status
- ��� **Responsive Design** - Works seamlessly on desktop and mobile
- ��� **Dark Mode** - Full dark theme support with OKLCH color system

## ���️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 with OKLCH colors
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js 4.18
- **ORM**: Prisma 5.22
- **Database**: PostgreSQL (Neon Serverless)
- **Deployment**: Vercel

### AI Service
- **Language**: Python 3.11
- **Framework**: FastAPI 0.109
- **LLM**: Groq (LLaMA 3.3 70B Versatile)
- **Deployment**: Render

## ��� API Endpoints

### Express Backend

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Dashboard statistics |
| `/api/invoices` | GET | Paginated invoice list |
| `/api/vendors/top10` | GET | Top 10 vendors by spend |
| `/api/trends/invoice-volume` | GET | Monthly invoice trends |
| `/api/trends/category-spend` | GET | Spending by GL account |
| `/api/trends/cash-outflow` | GET | Cash flow forecast |
| `/api/chat-with-data` | POST | Natural language queries |

### Vanna AI Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/ask` | POST | Natural language to SQL + execution |
| `/docs` | GET | Interactive API documentation |

## ��� Assignment Requirements

### ✅ Completed Features

- [x] PostgreSQL database with normalized schema
- [x] RESTful API with Express and Prisma
- [x] Vanna AI integration with Groq LLaMA 3.3 70B
- [x] Next.js frontend with shadcn/ui
- [x] Interactive dashboard with 4 charts
- [x] Invoices table with search and sort
- [x] AI chat interface with natural language queries
- [x] Dark mode support
- [x] Responsive design
- [x] Production deployment (Vercel + Render + Neon)

### ��� Bonus Features

- [x] Chat history persistence with localStorage
- [x] OKLCH color system for consistent theming
- [x] Settings page
- [x] Comprehensive error handling
- [x] Serverless deployment architecture

## ��� License

This project is part of the Flowbit AI internship program.

---

**Status**: ✅ Production Ready | ��� Fully Deployed

Built with ❤️ using Next.js 16, Express, Prisma, and Groq AI
