# Birthday Website Cute Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add confetti on unlock, heart cursor trail, and birthday wish finale section

**Architecture:** Three independent features that can be implemented sequentially: canvas-confetti integration, Framer Motion heart trail component, and a final interactive wish section with paper airplane animation

**Tech Stack:** canvas-confetti, Framer Motion, React, Tailwind CSS

---

### Task 1: Confetti on Unlock

**Files:**
- Modify: `package.json` (add `canvas-confetti`)
- Modify: `src/App.tsx` (trigger confetti on unlock)

- [ ] **Step 1: Install canvas-confetti**

Run: `npm install canvas-confetti`

Expected: Package added to dependencies

- [ ] **Step 2: Add confetti trigger to App.tsx**

Modify `src/App.tsx`:

Add import at top:
```tsx
import confetti from 'canvas-confetti'
```

Update the `handleUnlock` callback to trigger confetti:
```tsx
const handleUnlock = useCallback(() => {
  setIsUnlocked(true)
  
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#FFB6C1', '#FFD1DC', '#E6E6FA', '#FFF0F5', '#FFD700'],
    })
    
    confetti({
      ...defaults,
      particleCount: particleCount * 0.7,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#FFB6C1', '#FFD1DC', '#E6E6FA', '#FFF0F5', '#FFD700'],
    })
  }, 250)
}, [])
```

- [ ] **Step 3: Verify confetti works**

Run: `npm run dev`
Expected: When lock screen unlocks, confetti bursts for 3 seconds with pastel colors

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/App.tsx
git commit -m "add: confetti celebration on lock screen unlock"
```

---

### Task 2: Heart Cursor Trail Component

**Files:**
- Create: `src/components/HeartTrail.tsx`
- Modify: `src/App.tsx` (add HeartTrail import and render)

- [ ] **Step 1: Create HeartTrail component**

Create `src/components/HeartTrail.tsx`:

```tsx
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Heart {
  id: number
  x: number
  y: number
}

export default function HeartTrail() {
  const [hearts, setHearts] = useState<Heart[]>([])
  const [lastSpawn, setLastSpawn] = useState(0)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now()
    if (now - lastSpawn < 100) return

    setLastSpawn(now)
    setHearts((prev) => [
      ...prev.slice(-15),
      { id: now, x: e.clientX, y: e.clientY },
    ])
  }, [lastSpawn])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => prev.filter((h) => Date.now() - h.id < 2000))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="fixed pointer-events-none z-50"
          style={{ left: heart.x, top: heart.y }}
          initial={{ opacity: 0.8, scale: 0.5, y: 0 }}
          animate={{
            opacity: 0,
            scale: [0.5, 1.2, 0.8],
            y: [0, -40, -80],
          }}
          transition={{
            duration: 2,
            ease: 'easeOut',
          }}
          onAnimationComplete={() => {
            setHearts((prev) => prev.filter((h) => h.id !== heart.id))
          }}
        >
          <span
            className="text-pastel-pink"
            style={{
              fontSize: `${8 + Math.random() * 8}px`,
            }}
          >
            ♥
          </span>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Add HeartTrail to App.tsx**

Modify `src/App.tsx`:

Add import:
```tsx
import HeartTrail from './components/HeartTrail'
```

Add HeartTrail inside the unlocked main:
```tsx
<motion.main
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  <HeartTrail />
  <FloatingStickers />
  <Hero />
  <WhyYoureSpecial />
  <PhotoGallery />
  <Timeline />
</motion.main>
```

- [ ] **Step 3: Verify heart trail works**

Run: `npm run dev`
Expected: Moving mouse creates a comet-tail of hearts that float upward and fade

- [ ] **Step 4: Commit**

```bash
git add src/components/HeartTrail.tsx src/App.tsx
git commit -m "add: heart cursor trail with comet-tail effect"
```

---

### Task 3: Birthday Wish Finale Section

**Files:**
- Create: `src/components/BirthdayWish.tsx`
- Modify: `src/App.tsx` (add BirthdayWish import and render)

- [ ] **Step 1: Create BirthdayWish component**

Create `src/components/BirthdayWish.tsx`:

```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BirthdayWish() {
  const [wish, setWish] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFlying, setIsFlying] = useState(false)

  const handleSubmit = () => {
    if (!wish.trim()) return
    
    setIsFlying(true)
    
    setTimeout(() => {
      setIsFlying(false)
      setIsSubmitted(true)
    }, 2500)
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-pastel-lavender/20 to-pastel-blush px-4 overflow-hidden">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.h2
          className="font-display text-4xl sm:text-5xl text-soft-text mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Make a Birthday Wish ✨
        </motion.h2>

        <motion.p
          className="text-lg text-soft-text/70 mb-12 font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Close your eyes, think of something beautiful, and let it fly...
        </motion.p>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="wish-form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <input
                  type="text"
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Make a wish and let it fly..."
                  className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-pastel-pink/30 focus:border-pastel-pink focus:outline-none text-lg text-soft-text placeholder-soft-text/40 shadow-lg shadow-pastel-pink/10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </motion.div>

              <motion.button
                onClick={handleSubmit}
                disabled={!wish.trim() || isFlying}
                className={`px-8 py-4 rounded-full text-lg font-medium transition-all ${
                  wish.trim() && !isFlying
                    ? 'bg-gradient-to-r from-pastel-pink to-pastel-rose text-white shadow-lg shadow-pastel-pink/30 hover:shadow-xl hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={wish.trim() && !isFlying ? { scale: 1.05 } : {}}
                whileTap={wish.trim() && !isFlying ? { scale: 0.95 } : {}}
              >
                {isFlying ? 'Sending...' : '🎁 Send Your Wish'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="wish-sent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="py-8"
            >
              <motion.p
                className="text-2xl sm:text-3xl text-soft-text font-light"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Your wish has been sent to the universe ✨
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFlying && (
            <motion.div
              className="fixed left-0 top-1/2 z-40"
              initial={{ x: -50, y: '-50%', opacity: 1 }}
              animate={{
                x: '120vw',
                y: ['-50%', '-80%', '-60%', '-100%'],
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
              }}
            >
              <div className="relative">
                <span className="text-4xl">✈️</span>
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-yellow-400"
                    style={{
                      left: -i * 20,
                      top: Math.random() * 20 - 10,
                      fontSize: 12,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  >
                    ✨
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add BirthdayWish to App.tsx**

Modify `src/App.tsx`:

Add import:
```tsx
import BirthdayWish from './components/BirthdayWish'
```

Add BirthdayWish as the final section:
```tsx
<motion.main
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  <HeartTrail />
  <FloatingStickers />
  <Hero />
  <WhyYoureSpecial />
  <PhotoGallery />
  <Timeline />
  <BirthdayWish />
</motion.main>
```

- [ ] **Step 3: Verify birthday wish section works**

Run: `npm run dev`
Expected: 
1. Final section appears after timeline
2. Typing a wish and clicking submit triggers paper airplane animation
3. Airplane flies across screen with sparkle trail
4. Success message appears after animation

- [ ] **Step 4: Commit**

```bash
git add src/components/BirthdayWish.tsx src/App.tsx
git commit -m "add: birthday wish finale section with paper airplane animation"
```

---

### Task 4: Final Verification & Build

**Files:**
- Verify all components work together

- [ ] **Step 1: Run development server**

Run: `npm run dev`
Expected: All features work seamlessly together

- [ ] **Step 2: Test responsive design**

Check at:
- Mobile: 320px width (heart trail should be hidden)
- Tablet: 768px width
- Desktop: 1024px+ width

Expected: All features work on desktop, heart trail hidden on mobile

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Commit final changes**

```bash
git add .
git commit -m "style: finalize cute features - confetti, heart trail, birthday wish"
```
