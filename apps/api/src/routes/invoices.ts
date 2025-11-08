import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/invoices - List invoices with filtering
router.get('/', async (req, res) => {
  try {
    const { search, page = '1', limit = '50', sortBy = 'invoiceDate', order = 'desc' } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {}

    if (search) {
      where.OR = [
        { invoiceCode: { contains: search as string, mode: 'insensitive' } },
        { vendor: { name: { contains: search as string, mode: 'insensitive' } } },
      ]
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          vendor: {
            select: {
              name: true,
              taxId: true,
            },
          },
          customer: {
            select: {
              name: true,
            },
          },
          payment: {
            select: {
              dueDate: true,
              terms: true,
            },
          },
        },
        orderBy: {
          [sortBy as string]: order as 'asc' | 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.invoice.count({ where }),
    ])

    res.json({
      data: invoices.map((inv: any) => ({
        id: inv.id,
        invoiceCode: inv.invoiceCode,
        vendor: inv.vendor.name,
        date: inv.invoiceDate,
        amount: Number(inv.totalAmount),
        currency: inv.currency,
        status: inv.payment?.dueDate && new Date(inv.payment.dueDate) < new Date() 
          ? 'overdue' 
          : 'paid',
        dueDate: inv.payment?.dueDate,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    res.status(500).json({ error: 'Failed to fetch invoices' })
  }
})

export default router
