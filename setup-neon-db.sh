#!/bin/bash

# Flow Analytics - Neon Database Setup Script
# Run this after you get your DATABASE_URL from Neon

echo "🚀 Flow Analytics - Neon Database Setup"
echo "========================================"
echo ""

# Check if DATABASE_URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: DATABASE_URL not provided"
    echo ""
    echo "Usage: ./setup-neon-db.sh 'postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require'"
    echo ""
    echo "Steps:"
    echo "1. Go to Neon dashboard: https://console.neon.tech"
    echo "2. Click 'Connect' button"
    echo "3. Copy the connection string"
    echo "4. Run: ./setup-neon-db.sh 'YOUR_CONNECTION_STRING'"
    exit 1
fi

DATABASE_URL="$1"

echo "📝 Step 1: Creating .env file in apps/api..."
cd apps/api

# Backup existing .env if it exists
if [ -f .env ]; then
    echo "   Backing up existing .env to .env.backup..."
    cp .env .env.backup
fi

# Create new .env file
cat > .env << EOF
DATABASE_URL="$DATABASE_URL"
PORT=3001
VANNA_API_BASE_URL=http://localhost:8000
EOF

echo "   ✅ .env file created"
echo ""

echo "📦 Step 2: Generating Prisma client..."
npm run db:generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi
echo "   ✅ Prisma client generated"
echo ""

echo "🗄️  Step 3: Pushing schema to Neon database..."
npm run db:push
if [ $? -ne 0 ]; then
    echo "❌ Failed to push schema"
    exit 1
fi
echo "   ✅ Schema pushed successfully"
echo ""

echo "📊 Step 4: Seeding database with 50 invoices..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi
echo "   ✅ Database seeded successfully"
echo ""

echo "✅ Database setup complete!"
echo ""
echo "📋 Summary:"
echo "   - Database: Neon PostgreSQL"
echo "   - Tables: 7 (vendors, customers, documents, invoices, invoice_line_items, payments, invoice_documents)"
echo "   - Data: 50 invoices, 665 line items, 12 vendors, 10 customers"
echo ""
echo "🔗 Next steps:"
echo "   1. Keep this DATABASE_URL for Vercel deployment"
echo "   2. Use same URL for Vanna AI deployment on Render"
echo "   3. Start backend: cd apps/api && npm run dev"
echo ""
echo "🎉 Ready to deploy!"
