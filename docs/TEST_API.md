# API Testing Guide

The server is running on **http://localhost:3001**

## Test All Endpoints

### 1. Root Endpoint (NEW!)
```bash
curl http://localhost:3001/
```

**Or open in browser:** http://localhost:3001

**Expected:** API information and endpoint list

---

### 2. Health Check
```bash
curl http://localhost:3001/health
```

**Expected:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-08T..."
}
```

---

### 3. Dashboard Statistics
```bash
curl http://localhost:3001/api/stats
```

**Expected:**
```json
{
  "totalSpend": {
    "value": 12345.67,
    "change": 5.2,
    "period": "YTD"
  },
  "totalInvoices": {
    "value": 50,
    ...
  }
  ...
}
```

---

### 4. List Invoices
```bash
# All invoices
curl http://localhost:3001/api/invoices

# With search
curl "http://localhost:3001/api/invoices?search=Pheonix"

# With pagination
curl "http://localhost:3001/api/invoices?page=1&limit=10"
```

---

### 5. Top 10 Vendors
```bash
curl http://localhost:3001/api/vendors/top10
```

**Expected:**
```json
[
  {
    "name": "Vendor Name",
    "totalSpend": 5000,
    "invoiceCount": 10,
    "percentage": 25.5,
    "cumulativePercentage": 25.5
  },
  ...
]
```

---

### 6. Invoice Volume Trends
```bash
# Last 12 months (default)
curl http://localhost:3001/api/trends/invoice-volume

# Last 6 months
curl "http://localhost:3001/api/trends/invoice-volume?months=6"
```

---

### 7. Category Spend
```bash
curl http://localhost:3001/api/trends/category-spend
```

---

### 8. Cash Outflow Forecast
```bash
curl http://localhost:3001/api/trends/cash-outflow
```

---

## Browser Testing

Simply open these URLs in your browser:

1. http://localhost:3001/
2. http://localhost:3001/health
3. http://localhost:3001/api/stats
4. http://localhost:3001/api/invoices
5. http://localhost:3001/api/vendors/top10
6. http://localhost:3001/api/trends/invoice-volume
7. http://localhost:3001/api/trends/category-spend
8. http://localhost:3001/api/trends/cash-outflow

---

## Database Statistics

Your database now contains:
- ✅ 12 vendors
- ✅ 10 customers  
- ✅ 50 documents
- ✅ 50 invoices
- ✅ 665 line items
- ✅ 49 payments

All data successfully imported! 🎉

---

## Next Steps

1. **Test all endpoints** above
2. **Verify data** looks correct
3. **Setup Vanna AI service** (Python)
4. **Build Frontend** (Next.js)

---

## Troubleshooting

**If you get "Cannot GET /":**
- You're probably testing an old server instance
- Stop it (Ctrl+C in terminal) and run `npm run dev` again

**If port 3001 is busy:**
- Change `PORT=3002` in `.env` file

**To view database:**
```bash
npm run db:studio
```
Opens http://localhost:5555
