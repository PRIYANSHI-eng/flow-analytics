# 🚀 Production Deployment Guide

Complete step-by-step guide to deploy Flow Analytics to production.

## Overview

We'll deploy to these platforms:
- **Frontend**: Vercel
- **Backend API**: Vercel
- **Database**: Railway (or Neon/Supabase)
- **Vanna AI**: Render (or Railway)

---

## 1. Deploy PostgreSQL Database

### Option A: Railway (Recommended - Free $5/month credit)

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Provision PostgreSQL"

3. **Get Database Credentials**
   - Click on PostgreSQL service
   - Go to "Variables" tab
   - Copy `DATABASE_URL`
   - Example: `postgresql://postgres:password@containers-us-west-123.railway.app:7432/railway`

4. **Connect and Seed Database**
   ```bash
   cd apps/api
   
   # Update .env with Railway DATABASE_URL
   echo "DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:7432/railway" > .env
   
   # Push schema and seed data
   npm run db:push
   npm run db:seed
   ```

### Option B: Neon (Free Tier - 3GB Storage)

1. Go to https://neon.tech
2. Create account
3. Create new project
4. Copy connection string
5. Follow step 4 above

### Option C: Supabase (Free Tier)

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" URL)
5. Follow step 4 above

---

## 2. Deploy Vanna AI Service

### Render Deployment

1. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Or use "Public Git repository" and enter: `https://github.com/PRIYANSHI-eng/flow-analytics`

3. **Configure Service**
   ```
   Name: flow-analytics-vanna
   Region: Oregon (US West) or nearest
   Branch: main
   Root Directory: services/vanna
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python main.py
   Instance Type: Free
   ```

4. **Set Environment Variables**
   - Click "Environment" tab
   - Add these variables:
   ```
   DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:7432/railway
   GROQ_API_KEY=gsk_your_groq_api_key_here
   PORT=8000
   ALLOWED_ORIGINS=https://flow-analytics.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (~3-5 minutes)
   - Copy the service URL (e.g., `https://flow-analytics-vanna.onrender.com`)

6. **Test Vanna AI**
   ```bash
   curl https://flow-analytics-vanna.onrender.com/health
   
   curl -X POST https://flow-analytics-vanna.onrender.com/ask \
     -H "Content-Type: application/json" \
     -d '{"question": "What is the total spend?"}'
   ```

---

## 3. Deploy Backend API

### Vercel Deployment

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Configure for Deployment**
   
   Create `vercel.json` in `apps/api/`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/index.js"
       }
     ]
   }
   ```

3. **Update package.json**
   
   Make sure `apps/api/package.json` has:
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js",
       "vercel-build": "prisma generate && npm run build"
     }
   }
   ```

4. **Deploy via GitHub (Easiest)**
   
   a. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```
   
   b. Go to https://vercel.com
   c. Click "Add New Project"
   d. Import your GitHub repository
   e. Configure:
   ```
   Framework Preset: Other
   Root Directory: apps/api
   Build Command: npm run vercel-build
   Output Directory: dist
   Install Command: npm install
   ```
   
   f. Environment Variables:
   ```
   DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:7432/railway
   VANNA_API_BASE_URL=https://flow-analytics-vanna.onrender.com
   PORT=3001
   ```
   
   g. Click "Deploy"

5. **Alternative: Deploy via CLI**
   ```bash
   cd apps/api
   vercel
   # Follow prompts
   # Set environment variables when asked
   ```

6. **Get API URL**
   - Vercel will give you a URL like: `https://flow-analytics-api.vercel.app`
   - Save this for frontend deployment

7. **Test Backend**
   ```bash
   curl https://flow-analytics-api.vercel.app/health
   curl https://flow-analytics-api.vercel.app/api/stats
   ```

---

## 4. Deploy Frontend

### Vercel Deployment

1. **Update Environment Variable**
   
   Make sure `apps/web/.env.local` has:
   ```env
   NEXT_PUBLIC_API_URL=https://flow-analytics-api.vercel.app
   ```

2. **Deploy via GitHub**
   
   a. Go to https://vercel.com
   b. Click "Add New Project"
   c. Import your repository (if not already)
   d. Configure:
   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```
   
   e. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://flow-analytics-api.vercel.app
   ```
   
   f. Click "Deploy"

3. **Alternative: Deploy via CLI**
   ```bash
   cd apps/web
   vercel
   # Follow prompts
   ```

4. **Get Frontend URL**
   - Vercel will give you: `https://flow-analytics.vercel.app`
   - This is your main application URL!

5. **Update CORS in Backend**
   
   If you get CORS errors, update `apps/api/src/index.ts`:
   ```typescript
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://flow-analytics.vercel.app'
     ],
     credentials: true
   }))
   ```
   
   Then redeploy backend:
   ```bash
   cd apps/api
   git add .
   git commit -m "Update CORS for production"
   git push
   # Vercel will auto-deploy
   ```

6. **Update CORS in Vanna AI**
   
   Update Render environment variable:
   ```
   ALLOWED_ORIGINS=https://flow-analytics.vercel.app,https://flow-analytics-api.vercel.app
   ```

---

## 5. Final Testing

### Test All Services

1. **Database**
   ```bash
   psql "postgresql://postgres:password@containers-us-west-123.railway.app:7432/railway"
   # Run: SELECT COUNT(*) FROM invoices;
   ```

2. **Vanna AI**
   ```bash
   curl https://flow-analytics-vanna.onrender.com/health
   ```

3. **Backend API**
   ```bash
   curl https://flow-analytics-api.vercel.app/api/stats
   curl https://flow-analytics-api.vercel.app/api/invoices?page=1&pageSize=5
   curl https://flow-analytics-api.vercel.app/api/vendors/top10
   ```

4. **Frontend + Full Flow**
   - Open https://flow-analytics.vercel.app
   - Verify dashboard loads with data
   - Check all 4 charts
   - Test table search and sorting
   - Toggle dark mode in Settings
   - Test Chat interface:
     - "What is the total spend?"
     - "Show top 5 vendors by spend"
     - "How many invoices are overdue?"

---

## 6. Update README with URLs

Add this section to your main README.md:

```markdown
## 🌐 Live Demo

**Production URLs:**
- 🎨 **Frontend**: https://flow-analytics.vercel.app
- 🔌 **Backend API**: https://flow-analytics-api.vercel.app
- 🤖 **Vanna AI Service**: https://flow-analytics-vanna.onrender.com
- 📹 **Demo Video**: [Your YouTube/Loom Link]

**Test Credentials:**
No authentication required - open dashboard to start exploring!
```

---

## 🐛 Troubleshooting

### Issue: "Module not found" during build

**Solution**: Make sure all dependencies are in package.json
```bash
cd apps/api
npm install --save-dev @types/node @types/express
```

### Issue: Prisma client not generated

**Solution**: Add postinstall script
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Issue: CORS errors in production

**Solution**: Update CORS origins in both backend and Vanna AI

### Issue: Database connection timeout

**Solution**: 
1. Check DATABASE_URL is correct
2. Ensure IP is whitelisted (Railway: allow all IPs)
3. Use connection pooling URL if available

### Issue: Vanna AI slow/timeout

**Solution**: 
1. Render free tier may sleep after inactivity
2. First request takes ~30 seconds to wake up
3. Upgrade to paid tier for always-on

### Issue: Build fails on Vercel

**Solution**: Check build logs
```bash
vercel logs <deployment-url>
```

Common fixes:
- Add all TypeScript types
- Ensure tsconfig.json is correct
- Check for missing dependencies

---

## 📊 Deployment Costs

| Service | Platform | Free Tier | Limits |
|---------|----------|-----------|--------|
| Frontend | Vercel | ✅ Yes | 100GB bandwidth/month |
| Backend | Vercel | ✅ Yes | Serverless functions |
| Database | Railway | ✅ $5 credit | 500 hours/month |
| Vanna AI | Render | ✅ Yes | 750 hours/month |
| **Total** | **All Free** | **$0/month** | **Sufficient for demo** |

---

## 🚀 Quick Deploy (All Steps)

```bash
# 1. Deploy Database (Railway)
# - Go to railway.app, create PostgreSQL
# - Copy DATABASE_URL

# 2. Seed Database
cd apps/api
# Update .env with Railway URL
npm run db:push
npm run db:seed

# 3. Deploy Vanna (Render)
# - Go to render.com
# - Create Web Service from GitHub
# - Root: services/vanna
# - Add env vars: DATABASE_URL, GROQ_API_KEY
# - Copy service URL

# 4. Deploy Backend (Vercel)
cd apps/api
# Update env vars in Vercel dashboard
vercel --prod
# Copy API URL

# 5. Deploy Frontend (Vercel)
cd apps/web
# Set NEXT_PUBLIC_API_URL in Vercel
vercel --prod
# Copy frontend URL

# 6. Test everything!
```

---

## ✅ Deployment Checklist

- [ ] PostgreSQL deployed and accessible
- [ ] Database seeded with test data
- [ ] Vanna AI deployed and responds to /health
- [ ] Backend API deployed and returns data
- [ ] Frontend deployed and shows dashboard
- [ ] All charts loading data
- [ ] Chat interface working
- [ ] Dark mode toggle working
- [ ] No CORS errors
- [ ] All production URLs added to README
- [ ] Demo video recorded
- [ ] Submission email sent

---

## 📧 Production URLs Template

Update your README.md with:

```markdown
## 🌐 Production Deployment

**Live Application**: https://flow-analytics.vercel.app

**Services:**
- Frontend: https://flow-analytics.vercel.app
- Backend API: https://flow-analytics-api.vercel.app
- Vanna AI: https://flow-analytics-vanna.onrender.com
- Database: Railway PostgreSQL (private)

**Demo Video**: [Link to your demo video]

**GitHub Repository**: https://github.com/PRIYANSHI-eng/flow-analytics
```

---

**Total Deployment Time**: ~3-4 hours for first-time deployment

**Good luck! 🚀**
