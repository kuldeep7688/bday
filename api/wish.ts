import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { wish } = req.body || {}

  if (!wish || typeof wish !== 'string') {
    return res.status(400).json({ error: 'Wish is required' })
  }

  if (wish.length > 500) {
    return res.status(400).json({ error: 'Wish must be 500 characters or less' })
  }

  if (/<[^>]*>/g.test(wish)) {
    return res.status(400).json({ error: 'Wish contains invalid characters' })
  }

  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!serviceAccountJson || !sheetId) {
    console.error('Missing environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const credentials = JSON.parse(serviceAccountJson)

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const timestamp = new Date().toISOString()

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, wish]],
      },
    })

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Failed to append wish:', error)
    return res.status(500).json({ error: 'Failed to save wish' })
  }
}
