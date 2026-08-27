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

  const sheetId = process.env.GOOGLE_SHEET_ID || process.env.SHEET_ID
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  let credentials: Record<string, unknown> | undefined

  if (serviceAccountJson) {
    try {
      credentials = JSON.parse(serviceAccountJson)
    } catch {
      console.error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON')
      return res.status(500).json({ error: 'Server configuration error' })
    }
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    credentials = {
      type: 'service_account',
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY
        .replace(/^["']|["']$/g, '')
        .replace(/\\n/g, '\n')
        .trim(),
      // optional but helps GoogleAuth
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID || undefined,
    }
  }

  if (!credentials || !sheetId) {
    console.error('Missing environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
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
