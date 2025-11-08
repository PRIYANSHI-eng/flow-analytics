# Flow Analytics - Frontend

AI-Powered Analytics Dashboard for Invoice & Spend Management built with Next.js 14.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: lucide-react
- **Date Utilities**: date-fns

## Features

### Dashboard (/)
- **Overview Cards**: 4 key metrics with trend indicators
  - Total Spend (YTD)
  - Total Invoices Processed
  - Documents Uploaded
  - Average Invoice Value

- **Charts**: 4 interactive visualizations
  - Invoice Trends (Last 12 Months) - Dual-axis line chart
  - Top Vendors by Spend - Horizontal bar chart
  - Spend by Category - Pie chart
  - Cash Outflow by Amount Range - Dual-axis bar chart

- **Invoices Table**: 
  - Search by vendor/invoice number
  - Sort by date or amount
  - Pagination
  - Status badges (Paid, Pending, Overdue)

### Chat Interface (/chat)
- Natural language queries
- AI-powered SQL generation
- Results displayed in tables
- SQL query preview

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_VANNA_API_URL=http://localhost:8000
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Backend Requirements

The frontend requires the backend API to be running:

1. Start PostgreSQL (Docker):
   ```bash
   cd apps/api
   docker-compose up -d
   ```

2. Start Express API:
   ```bash
   cd apps/api
   npm run dev
   ```

3. Start Vanna AI Service:
   ```bash
   cd services/vanna
   python vanna_service.py
   ```

## Deploy on Vercel

1. Push to GitHub (already done)
2. Connect repository to Vercel
3. Set root directory to `apps/web`
4. Add environment variables
5. Deploy
