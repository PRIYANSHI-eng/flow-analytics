import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Ì¥ç Checking Neon Database...\n')
  
  const invoices = await prisma.invoice.count()
  const vendors = await prisma.vendor.count()
  const customers = await prisma.customer.count()
  const lineItems = await prisma.invoiceLineItem.count()
  const payments = await prisma.payment.count()
  
  console.log('‚úÖ DATABASE STATUS:')
  console.log('===================')
  console.log(`Ì≥Ñ Invoices:     ${invoices}`)
  console.log(`Ìø¢ Vendors:      ${vendors}`)
  console.log(`Ì±• Customers:    ${customers}`)
  console.log(`Ì≥ã Line Items:   ${lineItems}`)
  console.log(`Ì≤∞ Payments:     ${payments}`)
  console.log('')
  
  if (invoices === 50) {
    console.log('Ìæâ DATABASE FULLY SEEDED!')
    console.log('‚úÖ All 50 invoices imported successfully')
  } else if (invoices > 0) {
    console.log(`‚ö†Ô∏è  Database has ${invoices} invoices (expected 50)`)
  } else {
    console.log('‚ùå Database is empty - needs seeding')
  }
  
  await prisma.$disconnect()
}

main()
