import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/vendors/top10 - Top 10 vendors by spend
router.get('/top10', async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        invoices: {
          select: {
            totalAmount: true,
          },
        },
      },
    })

    const vendorSpends = vendors
      .map((vendor: { name: string; invoices: { totalAmount: number | string }[] }) => ({
        name: vendor.name,
        totalSpend: vendor.invoices.reduce(
          (sum, inv) => sum + Number(inv.totalAmount),
          0
        ),
        invoiceCount: vendor.invoices.length,
      }))
      .sort((a: { name: string; totalSpend: number; invoiceCount: number }, b: { name: string; totalSpend: number; invoiceCount: number }) => b.totalSpend - a.totalSpend)
      .slice(0, 10)

    // Calculate cumulative percentage
    const totalSpend = vendorSpends.reduce((sum: number, v: { name: string; totalSpend: number; invoiceCount: number }) => sum + v.totalSpend, 0)
    let cumulative = 0

    const result = vendorSpends.map((vendor: { name: string; totalSpend: number; invoiceCount: number }) => {
      cumulative += vendor.totalSpend
      return {
        ...vendor,
        percentage: (vendor.totalSpend / totalSpend) * 100,
        cumulativePercentage: (cumulative / totalSpend) * 100,
      }
    })

    res.json(result)
  } catch (error) {
    console.error('Error fetching top vendors:', error)
    res.status(500).json({ error: 'Failed to fetch top vendors' })
  }
})

export default router
