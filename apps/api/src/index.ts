import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './lib/prisma'
import statsRouter from './routes/stats'
import invoicesRouter from './routes/invoices'
import vendorsRouter from './routes/vendors'
import trendsRouter from './routes/trends'
import chatRouter from './routes/chat'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Flow Analytics API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      stats: '/api/stats',
      invoices: '/api/invoices',
      vendors: '/api/vendors/top10',
      trends: {
        invoiceVolume: '/api/trends/invoice-volume',
        categorySpend: '/api/trends/category-spend',
        cashOutflow: '/api/trends/cash-outflow',
      },
      chat: '/api/chat-with-data (POST)',
    },
    documentation: 'See README.md for full API documentation',
  })
})

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/stats', statsRouter)
app.use('/api/invoices', invoicesRouter)
app.use('/api/vendors', vendorsRouter)
app.use('/api/trends', trendsRouter)
app.use('/api/chat-with-data', chatRouter)

// Backward compatibility alias for spec requirement
app.use('/api/invoice-trends', trendsRouter)
app.use('/api/category-spend', trendsRouter)
app.use('/api/cash-outflow', trendsRouter)

// Error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`)
  console.log(`   Also available at http://0.0.0.0:${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
