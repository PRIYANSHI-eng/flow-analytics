@echo off
REM Flow Analytics - Neon Database Setup Script for Windows
REM Run this after you get your DATABASE_URL from Neon

echo.
echo ========================================
echo Flow Analytics - Neon Database Setup
echo ========================================
echo.

REM Check if DATABASE_URL is provided
if "%~1"=="" (
    echo ERROR: DATABASE_URL not provided
    echo.
    echo Usage: setup-neon-db.bat "postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
    echo.
    echo Steps:
    echo 1. Go to Neon dashboard: https://console.neon.tech
    echo 2. Click 'Connect' button
    echo 3. Copy the connection string
    echo 4. Run: setup-neon-db.bat "YOUR_CONNECTION_STRING"
    echo.
    pause
    exit /b 1
)

set DATABASE_URL=%~1

echo Step 1: Creating .env file in apps/api...
cd apps\api

REM Backup existing .env if it exists
if exist .env (
    echo    Backing up existing .env to .env.backup...
    copy .env .env.backup >nul
)

REM Create new .env file
(
echo DATABASE_URL="%DATABASE_URL%"
echo PORT=3001
echo VANNA_API_BASE_URL=http://localhost:8000
) > .env

echo    Done: .env file created
echo.

echo Step 2: Generating Prisma client...
call npm run db:generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo    Done: Prisma client generated
echo.

echo Step 3: Pushing schema to Neon database...
call npm run db:push
if errorlevel 1 (
    echo ERROR: Failed to push schema
    pause
    exit /b 1
)
echo    Done: Schema pushed successfully
echo.

echo Step 4: Seeding database with 50 invoices...
call npm run db:seed
if errorlevel 1 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)
echo    Done: Database seeded successfully
echo.

echo.
echo ========================================
echo DATABASE SETUP COMPLETE!
echo ========================================
echo.
echo Summary:
echo    - Database: Neon PostgreSQL
echo    - Tables: 7 tables created
echo    - Data: 50 invoices imported
echo    - Line Items: 665 records
echo    - Vendors: 12 records
echo    - Customers: 10 records
echo.
echo Next steps:
echo    1. Save this DATABASE_URL for Vercel deployment
echo    2. Use same URL for Vanna AI on Render
echo    3. Start backend: cd apps\api ^&^& npm run dev
echo.
echo Ready to deploy!
echo.
pause
