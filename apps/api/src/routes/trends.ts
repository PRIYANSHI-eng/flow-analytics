import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/trends/invoice-volume - Invoice count and spend over time
router.get('/invoice-volume', async (req, res) => {
  try {
    const { months = '12' } = req.query
    const monthsNum = parseInt(months as string)

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - monthsNum)

    // Get invoices grouped by month
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: {
          gte: startDate,
        },
      },
      select: {
        invoiceDate: true,
        totalAmount: true,
      },
    })

    // Group by month
    const monthlyData: Record<string, { count: number; spend: number }> = {}

    invoices.forEach((inv: { invoiceDate: Date | null; totalAmount: any }) => {
      if (inv.invoiceDate) {
        const monthKey = inv.invoiceDate.toISOString().substring(0, 7) // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { count: 0, spend: 0 }
        }
        monthlyData[monthKey].count++
        monthlyData[monthKey].spend += Number(inv.totalAmount)
      }
    })

    // Convert to array and sort
    const result = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        invoiceCount: data.count,
        totalSpend: data.spend,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    res.json(result)
  } catch (error) {
    console.error('Error fetching invoice trends:', error)
    res.status(500).json({ error: 'Failed to fetch invoice trends' })
  }
})

// GET /api/trends/category-spend - Spend by category
router.get('/category-spend', async (req, res) => {
  try {
    // For demo purposes, we'll categorize by GL Account
    const lineItems = await prisma.invoiceLineItem.findMany({
      select: {
        glAccount: true,
        totalPrice: true,
      },
    })

    const categories: Record<string, number> = {
      Operations: 0,
      Marketing: 0,
      Facilities: 0,
    }

    lineItems.forEach((item: { glAccount: string | null; totalPrice: any }) => {
      const price = Math.abs(Number(item.totalPrice || 0))
      const account = item.glAccount || '0000'

      // Simple categorization logic (customize based on your needs)
      if (account.startsWith('4')) {
        categories.Operations += price
      } else if (account.startsWith('5')) {
        categories.Marketing += price
      } else {
        categories.Facilities += price
      }
    })

    const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0)

    const result = Object.entries(categories).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))

    res.json(result)
  } catch (error) {
    console.error('Error fetching category spend:', error)
    res.status(500).json({ error: 'Failed to fetch category spend' })
  }
})

// GET /api/trends/cash-outflow - Cash outflow forecast
router.get('/cash-outflow', async (req, res) => {
  try {
    const now = new Date()
    const ranges = [
      { label: '0-7 days', start: 0, end: 7 },
      { label: '8-30 days', start: 8, end: 30 },
      { label: '31-60 days', start: 31, end: 60 },
      { label: '60+ days', start: 61, end: 365 },
    ]

    const result = await Promise.all(
      ranges.map(async range => {
        const startDate = new Date(now)
        startDate.setDate(startDate.getDate() + range.start)

        const endDate = new Date(now)
        endDate.setDate(endDate.getDate() + range.end)

        const payments = await prisma.payment.findMany({
          where: {
            dueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            invoice: {
              select: {
                totalAmount: true,
              },
            },
          },
        })

        const total = payments.reduce(
          (sum: number, p: { invoice: { totalAmount: any } }) => sum + Number(p.invoice.totalAmount),
          0
        )

        return {
          range: range.label,
          amount: total,
          count: payments.length,
        }
      })
    )

    res.json(result)
  } catch (error) {
    console.error('Error fetching cash outflow:', error)
    res.status(500).json({ error: 'Failed to fetch cash outflow' })
  }
})

export default router
