# Wish Persistence Feature Design

## Overview

Add the ability to persist birthday wishes submitted through the `BirthdayWish` component to a Google Sheet, allowing the site owner to read them later. The architecture uses a Vercel serverless function as a secure proxy to keep Google Sheets credentials hidden from the client.

## Architecture

```
┌─────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│  BirthdayWish   │  POST   │  Vercel Serverless   │  API    │  Google Sheets  │
│   Component     │────────▶│  Function /api/wish  │────────▶│                 │
│   (React)       │         │  (Node.js)           │         │  [timestamp]    │
└─────────────────┘         └──────────────────────┘         │  [wish text]    │
                                                              └─────────────────┘
                                   ▲
                                   │
                      Environment Variables
                      (GOOGLE_SERVICE_ACCOUNT_JSON,
                       GOOGLE_SHEET_ID)
```

### Flow

1. User types wish in `BirthdayWish` component and clicks "Send Your Wish"
2. Component makes POST request to `/api/wish` with `{ wish: string }`
3. Serverless function validates input, authenticates with Google Sheets API using service account credentials
4. Function appends a new row: `[ISO timestamp, wish text]`
5. Returns success/failure to client
6. Client shows "Your wish has been sent to the universe" animation (existing behavior)

## Security

- Service account JSON stored in Vercel env vars (server-side only)
- Client never sees credentials or sheet ID
- Basic input validation (max length, no HTML/script tags)
- Recipient cannot access the Google Sheet directly

## Component Changes

### BirthdayWish Component

**Current behavior:**
- Accepts wish input
- Plays airplane animation on submit
- Shows "Your wish has been sent to the universe" message

**New behavior:**
- All existing behavior preserved
- Add `fetch` POST to `/api/wish` inside `handleSubmit`, alongside the existing animation
- Handle error state: if the API call fails, show a gentle "wish couldn't fly, try again" message
- No loading spinner needed — the existing airplane animation already covers the wait period

**Error handling:**
- If API returns non-200, show error message after animation completes
- Allow user to retry
- Don't block the UI — animation plays regardless

## Serverless Function

### `/api/wish.ts`

**Accepts:**
- `POST` with JSON body `{ wish: string }`

**Validates:**
- Wish is non-empty
- Wish is max 500 characters
- Wish doesn't contain HTML/script tags

**Returns:**
- `200 { ok: true }` on success
- `400 { error: string }` on validation failure
- `405 { error: string }` on non-POST method
- `500 { error: string }` on server error

**Implementation:**
- Uses `googleapis` package with service account credentials from env vars
- Appends row to the Google Sheet: `[new Date().toISOString(), wish]`
- Requires env vars: `GOOGLE_SERVICE_ACCOUNT_JSON`, `GOOGLE_SHEET_ID`

## Google Sheet Setup (One-Time)

1. Create a Google Sheet with two columns: `Timestamp` | `Wish`
2. Create a Google Cloud service account
3. Download the service account JSON key
4. Share the sheet with the service account email (as editor)
5. Copy the sheet ID from the URL (between `/d/` and `/edit`)

## Environment Variables

Set in Vercel dashboard:

- `GOOGLE_SERVICE_ACCOUNT_JSON` — the full service account key JSON (stringified)
- `GOOGLE_SHEET_ID` — the Google Sheet ID (from URL)

## Dependencies

Add to `package.json`:
- `googleapis` — official Google API client for Node.js

## File Structure

```
src/
├── components/
│   └── BirthdayWish.tsx       # Modified to POST to /api/wish
└── api/
    └── wish.ts                # New: serverless function
```

## Testing

- Manual testing: submit wish, verify it appears in Google Sheet
- Error testing: submit with empty/invalid input, verify validation
- Network error testing: disconnect network, verify error message appears
- Build verification: `npm run build` must succeed

## Deployment

1. Set environment variables in Vercel dashboard
2. Deploy to Vercel (auto-deploys from GitHub)
3. Test the endpoint: `curl -X POST https://your-domain.vercel.app/api/wish -H "Content-Type: application/json" -d '{"wish":"test"}'`

## Future Enhancements (Out of Scope)

- Admin page to view wishes on the site
- Rate limiting to prevent abuse
- CAPTCHA for additional security
- Wish counter display
- Export wishes to CSV
