import { Router } from 'express'
import fetch from 'node-fetch'

const router = Router()

// POST /api/chat-with-data - Forward to Vanna AI
router.post('/', async (req, res) => {
  try {
    const { question } = req.body

    if (!question) {
      return res.status(400).json({ error: 'Question is required' })
    }

    const vannaUrl = process.env.VANNA_API_BASE_URL || 'http://localhost:8000'

    console.log('🤖 Forwarding question to Vanna AI:', question)

    // Forward request to Vanna AI service
    const response = await fetch(`${vannaUrl}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Vanna API error:', response.status, errorText)
      throw new Error(`Vanna API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Vanna response:', data)

    res.json({
      question,
      sql: data.sql,
      results: data.results,
      success: !data.error,
      error: data.error,
    })
  } catch (error) {
    console.error('❌ Error in chat endpoint:', error)
    res.status(500).json({ 
      error: 'Failed to process chat query',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
