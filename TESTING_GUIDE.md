# Testing Guide - Flow Analytics

## Step 1: Start Backend Server

Open a **dedicated terminal/command prompt** and run:

```bash
cd C:\Users\chitt\OneDrive\Desktop\flow-analytics\apps\api
npm run dev
```

**KEEP THIS TERMINAL OPEN!** You should see:
```
🚀 API Server running on http://localhost:3001
   Also available at http://0.0.0.0:3001
```

## Step 2: Test Backend (in a NEW terminal)

Open a **second terminal** and test:

```bash
# Test 1: Health check
curl http://localhost:3001/health

# Expected output:
# {"status":"ok","timestamp":"2025-11-08T..."}

# Test 2: Stats endpoint
curl http://localhost:3001/api/stats

# Expected: JSON with totalSpend, invoiceCount, documentUploads, avgInvoiceValue

# Test 3: Vendors endpoint
curl http://localhost:3001/api/vendors/top10

# Expected: Array of top 10 vendors

# Test 4: Invoice trends
curl http://localhost:3001/api/trends/invoice-volume

# Expected: Array of monthly data
```

## Step 3: Start Frontend (in a THIRD terminal)

Open a **third terminal**:

```bash
cd C:\Users\chitt\OneDrive\Desktop\flow-analytics\apps\web
npm run dev
```

You should see:
```
▲ Next.js 16.0.1
- Local: http://localhost:3000
```

## Step 4: Open Browser

1. Go to: http://localhost:3000/test
   - This will test the API connection
   - Should show "✅ API is working!" if backend is running

2. Go to: http://localhost:3000
   - Open browser console (F12)
   - Look for console logs showing data fetching
   - Charts should now appear!

## Troubleshooting

### No data showing on dashboard?

1. Check backend is running (curl http://localhost:3001/health)
2. Check browser console for errors (F12)
3. Check the /test page works (http://localhost:3000/test)

### Backend not responding?

1. Make sure you're running `npm run dev` in apps/api folder
2. Make sure PostgreSQL is running (docker ps)
3. Check for errors in the backend terminal

### Charts showing but empty?

1. Check if database has data: `cd apps/api && npx prisma studio`
2. Verify there are invoices, vendors, etc.

## Current Status

✅ PostgreSQL running (docker)
✅ Backend API code fixed
✅ Frontend code ready
⏳ Need to keep backend running while testing frontend

The key is to have **3 separate terminal windows open**:
1. Backend API server (apps/api)
2. Frontend Next.js (apps/web)  
3. Testing/commands terminal

Good luck! 🚀
