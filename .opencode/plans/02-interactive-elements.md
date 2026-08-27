# Plan 2: Light Interactive Elements

## Overview
Add scratch-to-reveal cards, easter eggs, enhanced hover effects, and upgraded floating elements with depth layers.

## 2a. Scratch-to-Reveal Cards

### New File: `src/components/ScratchCard.tsx`
- Wraps each photo in PhotoGallery
- Canvas overlay with pastel-pink/40 fill covering the photo
- `onMouseMove` / `onTouchMove`: erase canvas along cursor path (`globalCompositeOperation = 'destination-out'`)
- Brush radius: 30px for desktop, 40px for mobile (finger-friendly)
- When >60% erased, fade out remaining overlay with Framer Motion
- Reveal hidden message underneath (from content.ts `scratchMessages`)
- Props: `{ children: ReactNode; message: string; revealed?: boolean }`
- Mobile: touch events for scratch

### Modified: `src/components/PhotoGallery.tsx`
- Wrap each `<PhotoCard>` in `<ScratchCard>`
- Pass scratch message from content config

### Modified: `src/config/content.ts`
- Add `scratchMessage` to each photo entry:
  ```ts
  scratchMessage: 'You make every day an adventure 💫'
  ```

## 2b. Easter Eggs

### Modified: `src/components/Hero.tsx`
- Add `onClick` to the down-arrow SVG at bottom
- On click: trigger burst of 12 mini-hearts radiating outward
- Use Framer Motion stagger with random x/y offsets
- Hearts fade out after 1.5s

### Modified: `src/components/Timeline.tsx`
- On timeline icon click (already opens card), add a small confetti burst
- Use `canvas-confetti` with pastel colors, 30 particles, from icon position

## 2c. Enhanced Hover Effects

### Modified: `src/components/PhotoCard.tsx`
- Add 3D tilt on hover using `onMouseMove` to calculate `rotateX`/`rotateY`
- Max tilt: 8deg
- Add depth shadow that shifts with tilt direction
- Use `transform-style: preserve-3d` on container

### Modified: `src/components/TextCard.tsx`
- Add `whileHover={{ boxShadow: '0 0 30px rgba(255,182,193,0.3)' }}`
- Subtle `scale: 1.02` on hover
- Transition: spring with stiffness 300

## 2d. Floating Elements Upgrade

### Modified: `src/components/FloatingElements.tsx`
- Add new element types: `'flower'`, `'star'`
- Create 3 depth layers:
  - Background (z-0): large, slow, low opacity (0.1-0.15)
  - Midground (z-10): medium size, medium speed, opacity 0.2-0.25
  - Foreground (z-20): small, fast, opacity 0.3-0.4
- Flower: 🌸 emoji or SVG
- Star: ✦ with rotation animation
- Total elements: ~20 (reduced per-layer for performance)

## Testing
- Verify scratch cards work on desktop and mobile
- Verify easter eggs trigger correctly
- Verify 3D tilt on photo cards
- Verify text card glow effect
- Verify floating elements have depth layers
- Check performance on mobile (particle count)
