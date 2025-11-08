import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/stats - Overview statistics
router.get('/', async (req, res) => {
  try {
    const now = new Date()
    const yearStart = new Date(now.getFullYear(), 0, 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Total Spend (YTD)
    const totalSpendResult = await prisma.invoice.aggregate({
      where: {
        invoiceDate: {
          gte: yearStart,
        },
      },
      _sum: {
        totalAmount: true,
      },
    })

    // Last month spend for comparison
    const lastMonthSpendResult = await prisma.invoice.aggregate({
      where: {
        invoiceDate: {
          gte: lastMonth,
          lt: thisMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    })

    // This month spend
    const thisMonthSpendResult = await prisma.invoice.aggregate({
      where: {
        invoiceDate: {
          gte: thisMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    })

    const totalSpend = Number(totalSpendResult._sum.totalAmount || 0)
    const lastMonthSpend = Number(lastMonthSpendResult._sum.totalAmount || 0)
    const thisMonthSpend = Number(thisMonthSpendResult._sum.totalAmount || 0)
    const spendChange = lastMonthSpend > 0 
      ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend * 100) 
      : 0

    // Total Invoices Processed (all time)
    const totalInvoices = await prisma.invoice.count()
    const lastMonthInvoices = await prisma.invoice.count({
      where: {
        invoiceDate: {
          gte: lastMonth,
          lt: thisMonth,
        },
      },
    })
    const thisMonthInvoices = await prisma.invoice.count({
      where: {
        invoiceDate: {
          gte: thisMonth,
        },
      },
    })
    const invoiceChange = lastMonthInvoices > 0 
      ? ((thisMonthInvoices - lastMonthInvoices) / lastMonthInvoices * 100) 
      : 0

    // Documents Uploaded (this month)
    const documentsThisMonth = await prisma.document.count({
      where: {
        uploadedAt: {
          gte: thisMonth,
        },
      },
    })
    const documentsLastMonth = await prisma.document.count({
      where: {
        uploadedAt: {
          gte: lastMonth,
          lt: thisMonth,
        },
      },
    })
    const documentChange = documentsLastMonth > 0 
      ? ((documentsThisMonth - documentsLastMonth) / documentsLastMonth * 100) 
      : 0

    // Average Invoice Value
    const avgInvoiceResult = await prisma.invoice.aggregate({
      _avg: {
        totalAmount: true,
      },
    })
    const avgInvoiceValue = Number(avgInvoiceResult._avg.totalAmount || 0)

    res.json({
      totalSpend: {
        value: totalSpend,
        change: spendChange,
        period: 'YTD',
      },
      totalInvoices: {
        value: totalInvoices,
        change: invoiceChange,
        period: 'from last month',
      },
      documentsUploaded: {
        value: documentsThisMonth,
        change: documentChange,
        period: 'this month',
      },
      averageInvoiceValue: {
        value: avgInvoiceValue,
        change: 0,
        period: '',
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

export default router
