import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/invoices - List invoices with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      page = '1', 
      pageSize = '10', 
      sortBy = 'invoiceDate', 
      sortOrder = 'desc' 
    } = req.query

    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum

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
            },
          },
        },
        orderBy: {
          [sortBy as string === 'date' ? 'invoiceDate' : sortBy as string === 'amount' ? 'totalAmount' : sortBy as string]: sortOrder as 'asc' | 'desc',
        },
        skip,
        take: pageSizeNum,
      }),
      prisma.invoice.count({ where }),
    ])

    const now = new Date()
    res.json({
      invoices: invoices.map((inv: any) => ({
        id: inv.id,
        invoiceCode: inv.invoiceCode,
        vendorName: inv.vendor.name,
        customerName: inv.customer?.name || null,
        invoiceDate: inv.invoiceDate?.toISOString() || null,
        totalAmount: Number(inv.totalAmount),
        currency: inv.currency,
        status: (inv.payment?.dueDate && new Date(inv.payment.dueDate) < now)
            ? 'overdue'
            : 'pending',
        dueDate: inv.payment?.dueDate?.toISOString() || null,
        paymentDate: null,
      })),
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    res.status(500).json({ error: 'Failed to fetch invoices' })
  }
})

export default router
