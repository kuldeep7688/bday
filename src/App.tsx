import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import LockScreen from './components/LockScreen'
import Hero from './components/Hero'
import WhyYoureSpecial from './components/WhyYoureSpecial'
import PhotoGallery from './components/PhotoGallery'
import Timeline from './components/Timeline'
import FloatingStickers from './components/FloatingStickers'

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)

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
            <FloatingStickers />
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
