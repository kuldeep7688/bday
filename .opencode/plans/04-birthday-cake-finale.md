# Plan 4: Birthday Cake Finale

## Overview
Add a final section with an illustrated birthday cake, animated candles, microphone-based blow detection, and a celebration sequence.

## New Files

### `src/hooks/useBlowDetection.ts`
```ts
- Uses navigator.mediaDevices.getUserMedia({ audio: true })
- Creates AudioContext + AnalyserNode
- getByteFrequencyData on each animationFrame
- Calculates average volume level
- Returns { volume: number, isBlowing: boolean, start: () => void, stop: () => void }
- Threshold: average volume > 150 = blowing
- Handles permission denial gracefully (returns isBlowing: false always)
- Stops stream when component unmounts or candles all blown
```

### `src/components/BirthdayCake.tsx`
```tsx
Structure:
- Full-screen section with pastel gradient background
- Cake illustration (CSS/SVG):
  - 3-tier cake using divs with rounded corners + gradients
  - Tier colors: pastel-pink, pastel-rose, pastel-lavender
  - 5 candles on top (thin divs with flame elements)
  - Flames: animated with flicker (scale + opacity oscillation)
  
- State: candlesBlown: number (0-5)
- Prompt text above cake: "Take a deep breath and blow out the candles 🎂"
- Fallback text below: "or tap each candle"

Candle Interaction:
- Each candle is clickable (tap to blow out)
- useBlowDetection: when isBlowing detected for >1s, blow out next candle
- Blow out sequence: flames shrink → disappear → smoke wisp rises
- Smoke: small gray circle that floats up and fades (Framer Motion)

Celebration (when all 5 blown):
- canvas-confetti burst (500 particles, pastel colors)
- Final message fades in: "Make a wish, Archita. You deserve all the happiness in the world ✨"
- Message: font-display text-3xl, centered below cake
- Framer Motion: scale 0.8 → 1, opacity 0 → 1

Mobile:
- Reduced candle count to 3 for smaller screens
- Touch-friendly candle hit areas (min 44px)
```

## Modified Files

### `src/App.tsx`
- Import `BirthdayCake`
- Add `<BirthdayCake />` after `<BirthdayWish />`

### `src/config/content.ts`
```ts
export const cakePrompt = 'Take a deep breath and blow out the candles 🎂'
export const cakeFallback = 'or tap each candle'
export const finalMessage = 'Make a wish, Archita. You deserve all the happiness in the world ✨'
export const candleCount = 5
```

## Mic Permission Flow
```
1. Component mounts → show cake + prompt
2. On first interaction (click anywhere or tap candle) → request mic
3. If granted → start blow detection
4. If denied → show "Tap candles to blow them out" message
5. No blocking — site works either way
```

## Testing
- Verify cake renders correctly
- Verify candles can be tapped to blow out
- Verify mic detection works (blow to extinguish)
- Verify celebration triggers when all candles blown
- Verify fallback works when mic permission denied
- Test on mobile (reduced candle count, touch areas)
- Verify confetti and final message appear
- Check performance on mobile

## Execution Order

1. **Plan 1** (Music) — simplest, standalone, no dependencies
2. **Plan 2** (Interactive) — scratch cards + easter eggs + hover effects
3. **Plan 3** (Visual) — parallax + dividers + transitions (builds on Plan 2 changes)
4. **Plan 4** (Cake Finale) — most complex, adds new section last

Each plan is independent and can be built + tested before moving to the next.
