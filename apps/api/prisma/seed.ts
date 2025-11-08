import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

type JSONData = any

async function main() {
  console.log('🌱 Starting seed...')
  
  // Read the JSON file
  const dataPath = path.join(__dirname, '../../..', 'data', 'Analytics_Test_Data.json')
  const raw = fs.readFileSync(dataPath, 'utf8')
  const rows: JSONData[] = JSON.parse(raw)
  
  console.log(`📊 Found ${rows.length} records to process`)
  
  let processed = 0
  
  for (const doc of rows) {
    try {
      // Extract vendor data
      const vendorData = doc?.extractedData?.llmData?.vendor?.value
      const vendorName = vendorData?.vendorName?.value || 'Unknown Vendor'
      
      // Upsert vendor
      const vendor = await prisma.vendor.upsert({
        where: { name: vendorName },
        create: {
          name: vendorName,
          taxId: vendorData?.vendorTaxId?.value || null,
          address: vendorData?.vendorAddress?.value || null,
        },
        update: {},
      })
      
      // Create document
      const document = await prisma.document.create({
        data: {
          externalId: doc._id,
          name: doc.name,
          fileType: doc.fileType,
          filePath: doc.filePath,
          fileSize: doc.fileSize?.$numberLong ? BigInt(doc.fileSize.$numberLong) : null,
          status: doc.status,
          uploadedAt: doc.metadata?.uploadedAt ? new Date(doc.metadata.uploadedAt) : null,
          processedAt: doc.processedAt?.$date ? new Date(doc.processedAt.$date) : null,
          vendorId: vendor.id,
        },
      })
      
      // Extract customer data
      const customerData = doc?.extractedData?.llmData?.customer?.value
      let customer = null
      
      if (customerData?.customerName?.value) {
        customer = await prisma.customer.upsert({
          where: { name: customerData.customerName.value },
          create: {
            name: customerData.customerName.value,
            address: customerData?.customerAddress?.value || null,
          },
          update: {},
        })
      }
      
      // Extract invoice data
      const invoiceData = doc?.extractedData?.llmData?.invoice?.value
      const summaryData = doc?.extractedData?.llmData?.summary?.value
      
      // Generate unique invoice code
      const baseCode = invoiceData?.invoiceId?.value || `INV-${doc._id.substring(0, 8)}`
      const invoiceCode = `${baseCode}-${doc._id.substring(0, 8)}`
      
      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          invoiceCode,
          documentType: summaryData?.documentType?.value || null,
          currency: summaryData?.currencySymbol?.value || 'EUR',
          invoiceDate: invoiceData?.invoiceDate?.value 
            ? new Date(invoiceData.invoiceDate.value) 
            : null,
          deliveryDate: invoiceData?.deliveryDate?.value 
            ? new Date(invoiceData.deliveryDate.value) 
            : null,
          subTotal: summaryData?.subTotal?.value || 0,
          totalTax: summaryData?.totalTax?.value || 0,
          totalAmount: summaryData?.invoiceTotal?.value || 0,
          vendorId: vendor.id,
          customerId: customer?.id,
        },
      })
      
      // Link invoice to document
      await prisma.invoiceDocument.create({
        data: {
          invoiceId: invoice.id,
          documentId: document.id,
        },
      })
      
      // Extract payment data
      const paymentData = doc?.extractedData?.llmData?.payment?.value
      
      if (paymentData) {
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            dueDate: paymentData?.dueDate?.value 
              ? new Date(paymentData.dueDate.value) 
              : null,
            terms: paymentData?.paymentTerms?.value || null,
            bankAccount: paymentData?.bankAccountNumber?.value || null,
            netDays: paymentData?.netDays?.value || null,
            discountPct: paymentData?.discountPercentage?.value || null,
            discountDays: paymentData?.discountDays?.value || null,
            discountDueDate: paymentData?.discountDueDate?.value 
              ? new Date(paymentData.discountDueDate.value) 
              : null,
            discountedTotal: paymentData?.discountedTotal?.value || null,
          },
        })
      }
      
      // Extract line items
      const lineItemsData = doc?.extractedData?.llmData?.lineItems?.value?.items?.value || []
      
      for (const item of lineItemsData) {
        await prisma.invoiceLineItem.create({
          data: {
            invoiceId: invoice.id,
            srNo: item?.srNo?.value || null,
            description: item?.description?.value || null,
            quantity: item?.quantity?.value || null,
            unitPrice: item?.unitPrice?.value || null,
            totalPrice: item?.totalPrice?.value || null,
            vatRate: item?.vatRate?.value?.toString() || null,
            vatAmount: item?.vatAmount?.value || null,
            glAccount: item?.Sachkonto?.value?.toString() || null,
            buKey: item?.BUSchluessel?.value?.toString() || null,
          },
        })
      }
      
      processed++
      if (processed % 10 === 0) {
        console.log(`✅ Processed ${processed}/${rows.length} records`)
      }
      
    } catch (error) {
      console.error(`❌ Error processing document ${doc._id}:`, error)
    }
  }
  
  console.log(`\n🎉 Seed completed! Processed ${processed} records.`)
  
  // Print stats
  const stats = {
    vendors: await prisma.vendor.count(),
    customers: await prisma.customer.count(),
    documents: await prisma.document.count(),
    invoices: await prisma.invoice.count(),
    lineItems: await prisma.invoiceLineItem.count(),
    payments: await prisma.payment.count(),
  }
  
  console.log('\n📊 Database Statistics:')
  console.log(stats)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
