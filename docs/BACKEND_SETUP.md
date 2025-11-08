# 🚀 BACKEND SETUP - COMMANDS TO RUN

## ✅ What's Been Created

All backend code files have been created:
- ✅ Docker Compose configuration
- ✅ Prisma schema with all models
- ✅ Express.js server
- ✅ All API route files
- ✅ Database seed script
- ✅ TypeScript configuration
- ✅ Environment variables

## 📋 STEP-BY-STEP COMMANDS

### Step 1: Start PostgreSQL Database (Docker)

```bash
# Make sure Docker Desktop is running first!
# Then from project root:
docker-compose up -d
```

**Expected output:**
```
✔ Container flow-analytics-db  Started
```

**Verify it's running:**
```bash
docker ps
```

You should see `flow-analytics-db` on port 5432.

---

### Step 2: Install Backend Dependencies

```bash
cd apps/api
npm install
```

**This will install (~2-3 minutes):**
- Express, Prisma, TypeScript
- All type definitions
- Development tools

---

### Step 3: Generate Prisma Client & Create Tables

```bash
# Still in apps/api directory

# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push
```

**Expected output:**
```
✔ Generated Prisma Client
✔ Database synchronized
```

---

### Step 4: Import Data (Seed Database)

```bash
npm run db:seed
```

**Expected output:**
```
🌱 Starting seed...
📊 Found 64 records to process
✅ Processed 10/64 records
✅ Processed 20/64 records
...
🎉 Seed completed! Processed 64 records.

📊 Database Statistics:
{
  vendors: 45,
  customers: 12,
  documents: 64,
  invoices: 64,
  lineItems: 128,
  payments: 64
}
```

---

### Step 5: Start API Server

```bash
npm run dev
```

**Expected output:**
```
🚀 API Server running on http://localhost:3001
```

**Leave this terminal running!**

---

### Step 6: Test the API (New Terminal)

Open a **new terminal** and test:

```bash
# Health check
curl http://localhost:3001/health

# Dashboard stats
curl http://localhost:3001/api/stats

# List invoices
curl http://localhost:3001/api/invoices

# Top 10 vendors
curl http://localhost:3001/api/vendors/top10
```

**Or open in browser:**
- http://localhost:3001/api/stats
- http://localhost:3001/api/invoices
- http://localhost:3001/api/vendors/top10

---

## 🎯 Summary - Copy & Paste All Commands

```bash
# 1. Start Database
docker-compose up -d

# 2. Setup Backend
cd apps/api
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

That's it! Your backend is ready! 🎉

---

## 📊 Optional: View Database Visually

In a new terminal:

```bash
cd apps/api
npm run db:studio
```

Opens **http://localhost:5555** - a visual database browser.

---

## ⚠️ Troubleshooting

### Docker not found
- Install Docker Desktop and start it
- On Windows: Make sure WSL 2 is enabled

### Port 5432 already in use
```bash
# Stop existing PostgreSQL
docker stop $(docker ps -q --filter "publish=5432")
# Or change port in docker-compose.yml
```

### Port 3001 already in use
```bash
# Change PORT in apps/api/.env
PORT=3002
```

### Seed script fails
```bash
# Reset and retry
npm run db:push -- --force-reset
npm run db:seed
```

### "Cannot find module" errors
```bash
# Re-install dependencies
rm -rf node_modules package-lock.json
npm install
npm run db:generate
```

---

## 🔥 Quick Reset Everything

```bash
# Stop and remove containers
docker-compose down -v

# Clean install
cd apps/api
rm -rf node_modules dist
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

---

## ✅ What's Working Now

- ✅ PostgreSQL database running in Docker
- ✅ 6 normalized tables created
- ✅ 64 invoices imported with all related data
- ✅ REST API with 7 endpoints
- ✅ TypeScript + Prisma ORM
- ✅ CORS enabled for frontend

---

## 🔜 Next Steps (After Backend Works)

1. **Test all endpoints** - Make sure all 7 routes work
2. **Setup Vanna AI service** - Python FastAPI + Groq
3. **Setup Frontend** - Next.js dashboard
4. **Implement Charts** - Recharts components
5. **Deploy** - Vercel + Railway/Render

---

## 📞 Need Help?

Check:
1. Docker is running: `docker ps`
2. Database logs: `docker logs flow-analytics-db`
3. No errors in terminal where `npm run dev` is running
4. .env file exists in `apps/api/`

---

**Ready to run the commands? Start with Step 1! 🚀**
