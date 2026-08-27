# Plan 3: Visual Upgrades

## Overview
Add parallax scrolling, animated section dividers, and cinematic transitions to make the site feel more dynamic and polished.

## 3a. Parallax & Depth

### New File: `src/hooks/useParallax.ts`
```ts
- Custom hook using scroll event listener
- Returns scrollY value (throttled with requestAnimationFrame)
- Used by FloatingElements and section backgrounds
```

### Modified: `src/components/FloatingElements.tsx`
- Accept `scrollY` prop or use `useParallax` hook
- Background layer: `translateY = scrollY * 0.1`
- Midground layer: `translateY = scrollY * 0.3`
- Foreground layer: `translateY = scrollY * 0.5`

### Modified: All section components
- `Hero.tsx`, `WhyYoureSpecial.tsx`, `PhotoGallery.tsx`, `Timeline.tsx`, `BirthdayWish.tsx`
- Add subtle background gradient shift based on scroll position
- Use `useParallax` to adjust `background-position` or gradient angle
- Keep changes minimal: ±5% gradient shift

## 3b. Animated Section Dividers

### New File: `src/components/AnimatedDivider.tsx`
```tsx
- Renders between sections
- SVG wavy line or floating petals animation
- Framer Motion: path drawing animation (strokeDashoffset)
- Props: { variant: 'wave' | 'petals' | 'hearts' }
- 'wave': animated SVG path with stroke animation
- 'petals': 5-7 small petal shapes floating across
- 'hearts': small hearts drifting horizontally
- Auto-detects variant based on position
```

### Modified: `src/App.tsx`
- Import `AnimatedDivider`
- Place between each section:
  - Hero → wave
  - WhyYoureSpecial → petals
  - PhotoGallery → hearts
  - Timeline → wave
  - BirthdayWish → petals

## 3c. Cinematic Transitions

### Modified: `src/components/PhotoGallery.tsx`
- Cards cascade in with stagger: 0.3s delay between each
- `whileInView` with viewport once
- Entry animation: `opacity 0 → 1, y: 60 → 0, scale: 0.9 → 1`

### Modified: `src/components/Timeline.tsx`
- Timeline line draws in from left to right
- Use Framer Motion `pathLength` animation on the horizontal line
- Icons pop in sequentially after line reaches them

### Modified: `src/components/WhyYoureSpecial.tsx`
- Cards enter with stagger from alternating sides
- Odd cards: `x: -40 → 0`
- Even cards: `x: 40 → 0`
- Creates a weaving entrance effect

## Testing
- Verify parallax effect on scroll
- Verify section dividers animate correctly
- Verify cinematic transitions trigger on scroll
- Check performance on mobile (reduce particle count if needed)
- Test responsive layout at all breakpoints
