# Wish Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist birthday wishes submitted through the website to a Google Sheet via a Vercel serverless function.

**Architecture:** A Vercel serverless function at `/api/wish` acts as a secure proxy between the React frontend and Google Sheets API. The client POSTs wishes to this endpoint, which validates input and appends rows to a Google Sheet using service account credentials stored in environment variables.

**Tech Stack:** Vite + React + TypeScript, Vercel Serverless Functions, Google Sheets API (via `googleapis` npm package)

---

## File Structure

```
Project Root/
├── api/
│   └── wish.ts                # New: Vercel serverless function
├── src/
│   └── components/
│       └── BirthdayWish.tsx   # Modified: Add POST to /api/wish
├── tsconfig.json              # Unchanged (Vercel handles api/ compilation)
└── package.json               # Modified: Add googleapis dependency
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install googleapis package**

Run: `npm install googleapis`

Expected: Package added to dependencies in `package.json`

- [ ] **Step 2: Verify installation**

Run: `npm list googleapis`

Expected: Output shows `googleapis@<version>`

- [ ] **Step 3: Commit dependency addition**

```bash
git add package.json package-lock.json
git commit -m "add: googleapis dependency for wish persistence"
```

---

### Task 2: Create Vercel Serverless Function

**Files:**
- Create: `api/wish.ts`

- [ ] **Step 1: Create api directory**

Run: `mkdir -p api`

Expected: Directory created

- [ ] **Step 2: Create the serverless function**

Create file `api/wish.ts` with this content:

```typescript
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
```

- [ ] **Step 3: Verify TypeScript syntax**

Run: `npx tsc --noEmit api/wish.ts`

Expected: No errors (Vercel will handle compilation during deployment)

- [ ] **Step 4: Commit serverless function**

```bash
git add api/wish.ts
git commit -m "add: serverless function for wish persistence"
```

---

### Task 3: Update BirthdayWish Component

**Files:**
- Modify: `src/components/BirthdayWish.tsx`

- [ ] **Step 1: Add error state**

In `src/components/BirthdayWish.tsx`, add a new state variable after line 6:

```typescript
const [hasError, setHasError] = useState(false)
```

- [ ] **Step 2: Modify handleSubmit to POST to API**

Replace the `handleSubmit` function (lines 9-18) with this:

```typescript
const handleSubmit = async () => {
  if (!wish.trim()) return

  setIsFlying(true)
  setHasError(false)

  try {
    const response = await fetch('/api/wish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wish: wish.trim() }),
    })

    if (!response.ok) {
      throw new Error('Failed to send wish')
    }
  } catch (error) {
    console.error('Failed to send wish:', error)
    setHasError(true)
  }

  setTimeout(() => {
    setIsFlying(false)
    setIsSubmitted(true)
  }, 2500)
}
```

- [ ] **Step 3: Add error message display**

In the JSX, after the "wish-sent" section (after line 97), add an error display. Find the closing `</AnimatePresence>` at line 99 and add this before it:

```tsx
{hasError && !isSubmitted && (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-soft-text/60 text-sm mt-4"
  >
    Your wish couldn't fly right now. Please try again.
  </motion.p>
)}
```

- [ ] **Step 4: Reset error state when wish changes**

Add this effect after the state declarations (after line 7):

```typescript
import { useEffect } from 'react'

useEffect(() => {
  if (wish) setHasError(false)
}, [wish])
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`

Expected: Build succeeds with no errors

- [ ] **Step 6: Commit component changes**

```bash
git add src/components/BirthdayWish.tsx
git commit -m "add: POST wishes to serverless API endpoint"
```

---

### Task 4: Test Locally

**Files:**
- None (manual testing)

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

Expected: Dev server starts at `http://localhost:5173`

- [ ] **Step 2: Test the form UI**

Open `http://localhost:5173` in browser, unlock the site, scroll to the wish section.

Expected: Form renders, airplane animation plays on submit (API will fail without env vars, but error message should appear)

- [ ] **Step 3: Verify error handling**

Submit a wish without setting environment variables.

Expected: After animation, error message "Your wish couldn't fly right now. Please try again." appears

- [ ] **Step 4: Test input validation**

Try submitting an empty wish (button should be disabled).

Expected: Button is disabled when input is empty

---

### Task 5: Deploy and Configure

**Files:**
- None (Vercel dashboard configuration)

- [ ] **Step 1: Push changes to GitHub**

Run: `git push`

Expected: Changes pushed to remote repository

- [ ] **Step 2: Set environment variables in Vercel**

Go to Vercel dashboard → Your project → Settings → Environment Variables

Add:
- `GOOGLE_SERVICE_ACCOUNT_JSON` = (full JSON string from service account key file)
- `GOOGLE_SHEET_ID` = (sheet ID from Google Sheets URL)

- [ ] **Step 3: Redeploy**

Trigger a new deployment (Vercel auto-deploys on push, or manually redeploy)

Expected: Deployment succeeds

- [ ] **Step 4: Test the endpoint**

Run: `curl -X POST https://your-domain.vercel.app/api/wish -H "Content-Type: application/json" -d '{"wish":"test wish"}'`

Expected: Response `{"ok":true}` and wish appears in Google Sheet

- [ ] **Step 5: Verify in Google Sheets**

Open the Google Sheet in browser.

Expected: New row with timestamp and wish text appears

---

## Summary

**Total Tasks:** 5
**Estimated Time:** 30-45 minutes (including Google Cloud setup)

**What's built:**
- Vercel serverless function that validates and persists wishes
- Updated BirthdayWish component that POSTs to the API
- Error handling for failed requests
- Secure credential storage via environment variables

**Next steps:**
- Set up Google Cloud service account and Google Sheet (one-time setup, ~10 minutes)
- Configure environment variables in Vercel
- Deploy and test
