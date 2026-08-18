# Birthday Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a soft & dreamy single-page birthday website with countdown lock screen, hero, photo/text sections, and interactive timeline.

**Architecture:** Single-page React app with 5 scrollable sections. Framer Motion handles all animations. Tailwind CSS for styling. Content (text, dates, photo paths) lives in a single config file for easy editing.

**Tech Stack:** Vite + React + TypeScript, Framer Motion, Tailwind CSS

---

## File Structure

| File                                | Responsibility                                        |
| ----------------------------------- | ----------------------------------------------------- |
| `package.json`                        | Dependencies                                          |
| `tsconfig.json`                       | TypeScript config                                     |
| `vite.config.ts`                      | Vite configuration                                    |
| `tailwind.config.js`                  | Tailwind with custom pastel colors                    |
| `postcss.config.js`                   | PostCSS config                                        |
| `index.html`                          | HTML entry point with Google Fonts                    |
| `src/main.tsx`                        | App entry point                                       |
| `src/App.tsx`                         | Root component, sections composition                  |
| `src/config/content.ts`               | All text, dates, photo paths, timeline data           |
| `src/components/LockScreen.tsx`       | Countdown + lock overlay                              |
| `src/components/Hero.tsx`             | Birthday greeting + animations                        |
| `src/components/WhyYoureSpecial.tsx`  | Text cards section                                    |
| `src/components/PhotoGallery.tsx`     | Polaroid photos section                               |
| `src/components/Timeline.tsx`         | Horizontal interactive timeline                       |
| `src/components/FloatingElements.tsx` | Hearts, sparkles, clouds                              |
| `src/components/TimelineCard.tsx`     | Individual timeline reveal card                       |
| `src/components/PhotoCard.tsx`        | Single polaroid-style photo                           |
| `src/components/TextCard.tsx`         | Single text card in WhyYoureSpecial                   |
| `src/index.css`                       | Tailwind imports + custom styles                      |
| `public/assets/*`                     | All image assets (photos, icons, decorative elements) |

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/index.css`

```bash
cd /Users/kuldeepsingh/Work/github/bday
```

```json
{
  "name": "birthday-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^12.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^6.0.0"
  }
}
```

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFB6C1',
          lavender: '#E6E6FA',
          blush: '#FFF0F5',
          rose: '#FFD1DC',
        },
        soft: {
          text: '#4A4A4A',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Happy Birthday ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  color: #4A4A4A;
  overflow-x: hidden;
}
```

- [ ] **Step 9: Install dependencies and verify**

```bash
npm install
```

Expected: dependencies installed, no errors

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "init: scaffold birthday website with Vite + React + TypeScript"
```

---

### Task 2: Content Configuration

**Files:**
- Create: `src/config/content.ts`

```typescript
export const UNLOCK_DATE = new Date('2025-09-03T00:00:00')

export const herName = 'Her Name' // Replace with her actual name

export const heroSubtitle = 'Today the world got a little brighter ✨'

export const reasonsILoveYou = [
  {
    title: 'Your Smile',
    text: 'The way your smile lights up a room makes every bad day instantly better.',
  },
  {
    title: 'Your Laugh',
    text: 'That laugh you try to hide but can\'t — it\'s my favorite sound.',
  },
  {
    title: 'Your Kindness',
    text: 'The way you care about everyone around you, even when no one\'s watching.',
  },
  {
    title: 'How You Make Me Feel',
    text: 'Being with you feels like coming home. Every single time.',
  },
]

export const photos = [
  {
    src: '/assets/photo-1.jpg',
    caption: 'Just being you ✨',
    message: 'This is one of my favorite photos of you. You look so beautiful.',
  },
  {
    src: '/assets/photo-2.jpg',
    caption: 'That face 😍',
    message: 'I could look at this photo all day.',
  },
  {
    src: '/assets/photo-3.jpg',
    caption: 'My favorite person 💕',
    message: 'The most beautiful person I know, inside and out.',
  },
  {
    src: '/assets/photo-4.jpg',
    caption: 'Always stunning 🌸',
    message: 'You make the world a better place just by being in it.',
  },
]

export const timeline = [
  {
    icon: '💕',
    title: 'We Matched on Hinge',
    date: 'Date TBD',
    description: 'Swipe right changed everything. Who knew an app could lead to this?',
    photo: '/assets/timeline-1.jpg',
  },
  {
    icon: '☕',
    title: 'First Date',
    date: 'Date TBD',
    description: 'Nervous, excited, and somehow we just clicked. I didn\'t want the night to end.',
    photo: '/assets/timeline-2.jpg',
  },
  {
    icon: '🏠',
    title: 'Met at a Friend\'s Place',
    date: 'Date TBD',
    description: 'Seeing you again felt like fate. The universe was definitely rooting for us.',
    photo: '/assets/timeline-3.jpg',
  },
  {
    icon: '⚽',
    title: 'FIFA World Cup Final',
    date: 'December 18, 2022',
    description: 'Watching the biggest match together — even the game wasn\'t as exciting as being next to you.',
    photo: '/assets/timeline-4.jpg',
  },
  {
    icon: '📚',
    title: 'Started Studying Together',
    date: 'Date TBD',
    description: 'Who knew studying could be fun? Productivity went up 200% when we started doing it together.',
    photo: '/assets/timeline-5.jpg',
  },
  {
    icon: '📖',
    title: 'Still Studying Together',
    date: 'Present',
    description: 'Every study session is a date in disguise. The best kind of distraction.',
    photo: '/assets/timeline-6.jpg',
  },
]
```

- [ ] **Step 2: Commit**

```bash
mkdir -p src/config && git add src/config/content.ts && git commit -m "add: content configuration with all text, dates, and asset paths"
```

---

### Task 3: Floating Elements Component

**Files:**
- Create: `src/components/FloatingElements.tsx`

```typescript
import { motion } from 'framer-motion'

interface FloatingElement {
  id: number
  type: 'heart' | 'sparkle' | 'cloud'
  x: number
  delay: number
  duration: number
  size: number
  opacity: number
}

const hearts: FloatingElement[] = [
  { id: 1, type: 'heart', x: 10, delay: 0, duration: 8, size: 24, opacity: 0.3 },
  { id: 2, type: 'heart', x: 25, delay: 1, duration: 10, size: 18, opacity: 0.2 },
  { id: 3, type: 'heart', x: 45, delay: 2, duration: 7, size: 20, opacity: 0.25 },
  { id: 4, type: 'heart', x: 65, delay: 0.5, duration: 9, size: 16, opacity: 0.2 },
  { id: 5, type: 'heart', x: 80, delay: 1.5, duration: 11, size: 22, opacity: 0.3 },
  { id: 6, type: 'heart', x: 90, delay: 3, duration: 8, size: 14, opacity: 0.15 },
]

const sparkles: FloatingElement[] = [
  { id: 7, type: 'sparkle', x: 15, delay: 0.3, duration: 4, size: 12, opacity: 0.4 },
  { id: 8, type: 'sparkle', x: 35, delay: 1.2, duration: 5, size: 10, opacity: 0.3 },
  { id: 9, type: 'sparkle', x: 55, delay: 2.1, duration: 4.5, size: 14, opacity: 0.35 },
  { id: 10, type: 'sparkle', x: 75, delay: 0.8, duration: 3.5, size: 11, opacity: 0.3 },
  { id: 11, type: 'sparkle', x: 85, delay: 1.7, duration: 5, size: 9, opacity: 0.25 },
]

const clouds: FloatingElement[] = [
  { id: 12, type: 'cloud', x: 5, delay: 0, duration: 20, size: 80, opacity: 0.15 },
  { id: 13, type: 'cloud', x: 50, delay: 5, duration: 25, size: 60, opacity: 0.1 },
  { id: 14, type: 'cloud', x: 85, delay: 10, duration: 22, size: 70, opacity: 0.12 },
]

function FloatingHeart({ element }: { element: FloatingElement }) {
  return (
    <motion.div
      className="fixed pointer-events-none text-pastel-pink"
      style={{
        left: `${element.x}%`,
        bottom: '-30px',
        fontSize: element.size,
        opacity: element.opacity,
      }}
      animate={{
        y: ['0vh', '-110vh'],
        x: [0, Math.sin(element.id) * 30, 0],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: element.duration,
        repeat: Infinity,
        delay: element.delay,
        ease: 'linear',
      }}
    >
      ♥
    </motion.div>
  )
}

function FloatingSparkle({ element }: { element: FloatingElement }) {
  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        left: `${element.x}%`,
        top: `${10 + element.id * 5}%`,
        fontSize: element.size,
        opacity: element.opacity,
      }}
      animate={{
        scale: [1, 1.3, 0.8, 1],
        opacity: [element.opacity, element.opacity * 0.5, element.opacity],
      }}
      transition={{
        duration: element.duration,
        repeat: Infinity,
        delay: element.delay,
        ease: 'easeInOut',
      }}
    >
      ✦
    </motion.div>
  )
}

function FloatingCloud({ element }: { element: FloatingElement }) {
  return (
    <motion.div
      className="fixed pointer-events-none rounded-full bg-pastel-lavender"
      style={{
        top: `${15 + element.id * 10}%`,
        width: element.size,
        height: element.size * 0.6,
        opacity: element.opacity,
        filter: 'blur(20px)',
      }}
      animate={{
        x: ['-100px', '100vw'],
      }}
      transition={{
        duration: element.duration,
        repeat: Infinity,
        delay: element.delay,
        ease: 'linear',
      }}
    />
  )
}

interface FloatingElementsProps {
  hearts?: boolean
  sparkles?: boolean
  clouds?: boolean
}

export default function FloatingElements({
  hearts: showHearts = false,
  sparkles: showSparkles = false,
  clouds: showClouds = false,
}: FloatingElementsProps) {
  return (
    <>
      {showHearts && hearts.map((el) => <FloatingHeart key={el.id} element={el} />)}
      {showSparkles && sparkles.map((el) => <FloatingSparkle key={el.id} element={el} />)}
      {showClouds && clouds.map((el) => <FloatingCloud key={el.id} element={el} />)}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
mkdir -p src/components && git add src/components/FloatingElements.tsx && git commit -m "add: floating hearts, sparkles, and clouds animation components"
```

---

### Task 4: Lock Screen Component

**Files:**
- Create: `src/components/LockScreen.tsx`

```typescript
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UNLOCK_DATE } from '../config/content'
import FloatingElements from './FloatingElements'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const now = new Date().getTime()
  const unlock = UNLOCK_DATE.getTime()
  const diff = unlock - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-semibold text-soft-text"
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="text-xs sm:text-sm mt-2 text-soft-text/70 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const time = getTimeLeft()
      setTimeLeft(time)

      if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
        clearInterval(timer)
        setIsUnlocked(true)
        setTimeout(onUnlock, 1500)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [onUnlock])

  return (
    <AnimatePresence>
      {!isUnlocked && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pastel-blush via-pastel-pink/30 to-pastel-lavender"
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          <FloatingElements hearts />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4"
          >
            <motion.p
              className="text-lg sm:text-xl text-soft-text/80 mb-8 font-light"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Something special is coming...
            </motion.p>

            <div className="flex gap-3 sm:gap-4 justify-center mb-8">
              <TimeBlock value={timeLeft.days} label="Days" />
              <TimeBlock value={timeLeft.hours} label="Hours" />
              <TimeBlock value={timeLeft.minutes} label="Minutes" />
              <TimeBlock value={timeLeft.seconds} label="Seconds" />
            </div>

            <p className="text-sm text-soft-text/50">
              September 3rd can't come soon enough ♥
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LockScreen.tsx && git commit -m "add: lock screen with countdown timer and unlock transition"
```

---

### Task 5: Hero Component

**Files:**
- Create: `src/components/Hero.tsx`

```typescript
import { motion } from 'framer-motion'
import { herName, heroSubtitle } from '../config/content'
import FloatingElements from './FloatingElements'

function StaggeredText({ text }: { text: string }) {
  return (
    <div className="overflow-hidden">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-pastel-blush to-white overflow-hidden px-4">
      <FloatingElements hearts sparkles />

      <div className="relative z-10 text-center">
        <motion.p
          className="text-sm sm:text-base uppercase tracking-[0.3em] text-soft-text/60 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          A little something for you
        </motion.p>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-soft-text mb-6">
          <StaggeredText text={`Happy Birthday, ${herName}`} />
        </h1>

        <motion.p
          className="text-lg sm:text-xl text-soft-text/70 font-light max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {heroSubtitle}
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-pastel-pink"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx && git commit -m "add: hero section with staggered text animation and scroll indicator"
```

---

### Task 6: Why You're Special Component

**Files:**
- Create: `src/components/TextCard.tsx`
- Create: `src/components/WhyYoureSpecial.tsx`

```typescript
import { motion } from 'framer-motion'

interface TextCardProps {
  title: string
  text: string
  index: number
}

export default function TextCard({ title, text, index }: TextCardProps) {
  return (
    <motion.div
      className="max-w-md mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg shadow-pastel-pink/10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
    >
      <motion.h3
        className="font-display text-xl sm:text-2xl text-soft-text mb-3"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.1, duration: 0.4 }}
      >
        {title}
      </motion.h3>
      <p className="text-soft-text/70 leading-relaxed">{text}</p>
      <motion.div
        className="text-pastel-pink text-2xl mt-4"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.3, duration: 0.3 }}
      >
        ♥
      </motion.div>
    </motion.div>
  )
}
```

```typescript
import { motion } from 'framer-motion'
import { reasonsILoveYou } from '../config/content'
import TextCard from './TextCard'

export default function WhyYoureSpecial() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-white via-pastel-lavender/20 to-white px-4">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-center text-soft-text mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why You're So Special ♥
        </motion.h2>

        <div className="space-y-8">
          {reasonsILoveYou.map((reason, index) => (
            <TextCard key={reason.title} {...reason} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TextCard.tsx src/components/WhyYoureSpecial.tsx && git commit -m "add: why you're special section with text cards and scroll animations"
```

---

### Task 7: Photo Gallery Component

**Files:**
- Create: `src/components/PhotoCard.tsx`
- Create: `src/components/PhotoGallery.tsx`

```typescript
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PhotoCardProps {
  src: string
  caption: string
  message: string
  index: number
}

export default function PhotoCard({ src, caption, message, index }: PhotoCardProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <>
      <motion.div
        className="relative group cursor-pointer"
        initial={{ opacity: 0, rotate: 0 }}
        whileInView={{ opacity: 1, rotate: [-3, 3, 0] }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2, duration: 0.6 }}
        whileHover={{
          rotate: [0, -2, 2, 0],
          scale: 1.05,
          y: -8,
        }}
        onClick={() => setIsZoomed(true)}
      >
        <div className="bg-white p-3 pb-12 rounded-lg shadow-lg shadow-pastel-pink/20">
          <img
            src={src}
            alt={caption}
            className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded"
          />
        </div>
        <p className="font-display text-sm text-soft-text/80 text-center mt-2 italic">
          {caption}
        </p>
      </motion.div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <img
                src={src}
                alt={caption}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-soft-text/80 italic">{message}</p>
              <button
                className="mt-4 text-pastel-pink text-sm hover:underline"
                onClick={() => setIsZoomed(false)}
              >
                Close ♥
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

```typescript
import { motion } from 'framer-motion'
import { photos } from '../config/content'
import PhotoCard from './PhotoCard'
import FloatingElements from './FloatingElements'

export default function PhotoGallery() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-white to-pastel-blush/30 relative overflow-hidden px-4">
      <FloatingElements clouds />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-center text-soft-text mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          The Most Beautiful Person I Know 🌸
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          {photos.map((photo, index) => (
            <PhotoCard key={photo.src} {...photo} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PhotoCard.tsx src/components/PhotoGallery.tsx && git commit -m "add: photo gallery with polaroid frames and zoom overlay"
```

---

### Task 8: Timeline Component

**Files:**
- Create: `src/components/TimelineCard.tsx`
- Create: `src/components/Timeline.tsx`

```typescript
import { motion, AnimatePresence } from 'framer-motion'

interface TimelineCardProps {
  title: string
  date: string
  description: string
  photo: string
  icon: string
  onClose: () => void
}

export default function TimelineCard({
  title,
  date,
  description,
  photo,
  icon,
  onClose,
}: TimelineCardProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-48 sm:h-64 overflow-hidden">
            <img
              src={photo}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 text-3xl">{icon}</div>
          </div>
          <div className="p-6">
            <span className="text-xs uppercase tracking-wider text-pastel-pink font-medium">
              {date}
            </span>
            <h3 className="font-display text-xl text-soft-text mt-1 mb-2">
              {title}
            </h3>
            <p className="text-soft-text/70 leading-relaxed">{description}</p>
          </div>
          <div className="px-6 pb-6">
            <button
              className="w-full py-2 bg-pastel-pink/20 text-pastel-pink rounded-lg hover:bg-pastel-pink/30 transition-colors text-sm font-medium"
              onClick={onClose}
            >
              Close ♥
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
```

```typescript
import { useState } from 'react'
import { motion } from 'framer-motion'
import { timeline } from '../config/content'
import TimelineCard from './TimelineCard'

export default function Timeline() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selectedItem = selectedIndex !== null ? timeline[selectedIndex] : null

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-pastel-blush/30 to-pastel-lavender/20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-center text-soft-text mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Story So Far ✨
        </motion.h2>

        <div className="relative">
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-pastel-pink/30 hidden sm:block" />

          <div className="flex justify-between items-start overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 gap-4 sm:gap-0">
            {timeline.map((item, index) => (
              <motion.button
                key={item.title}
                className="flex flex-col items-center min-w-[80px] sm:min-w-0 flex-1 group relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => setSelectedIndex(index)}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-white shadow-md shadow-pastel-pink/20 flex items-center justify-center text-2xl mb-3 group-hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.15 }}
                  animate={
                    selectedIndex === index
                      ? { scale: [1, 1.2, 1] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  {item.icon}
                </motion.div>
                <span className="text-xs text-soft-text/60 text-center leading-tight hidden sm:block">
                  {item.title.split(' ').slice(0, 2).join(' ')}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <TimelineCard
          {...selectedItem}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TimelineCard.tsx src/components/Timeline.tsx && git commit -m "add: horizontal timeline with icon landmarks and slide-up reveal cards"
```

---

### Task 9: App Composition + Final Assembly

**Files:**
- Create: `src/App.tsx`

```typescript
import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LockScreen from './components/LockScreen'
import Hero from './components/Hero'
import WhyYoureSpecial from './components/WhyYoureSpecial'
import PhotoGallery from './components/PhotoGallery'
import Timeline from './components/Timeline'

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleUnlock = useCallback(() => {
    setIsUnlocked(true)
  }, [])

  return (
    <>
      <LockScreen onUnlock={handleUnlock} />

      <AnimatePresence>
        {isUnlocked && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Hero />
            <WhyYoureSpecial />
            <PhotoGallery />
            <Timeline />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2: Run dev server to verify everything works**

```bash
npm run dev
```

Expected: Vite starts, no errors, lock screen appears with countdown.

- [ ] **Step 3: Build to verify production bundle**

```bash
npm run build
```

Expected: Successful build, no TypeScript errors.

- [ ] **Step 4: Final commit**

```bash
git add src/App.tsx && git commit -m "compose: full app with all sections and lock screen integration"
```
