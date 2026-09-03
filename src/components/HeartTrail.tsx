import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FLOWERS = ['🌸', '🌺', '🌷', '🌹', '💐']

interface TrailItem {
  id: number
  x: number
  y: number
  flower: string
}

export default function HeartTrail() {
  const [items, setItems] = useState<TrailItem[]>([])
  const [lastSpawn, setLastSpawn] = useState(0)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now()
    if (now - lastSpawn < 100) return

    setLastSpawn(now)
    setItems((prev) => [
      ...prev.slice(-15),
      { id: now, x: e.clientX, y: e.clientY, flower: FLOWERS[Math.floor(Math.random() * FLOWERS.length)] },
    ])
  }, [lastSpawn])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => prev.filter((h) => Date.now() - h.id < 2000))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="fixed pointer-events-none z-50"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0.8, scale: 0.5, y: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            scale: [0.5, 1.2, 0.8],
            y: [0, -40, -80],
            rotate: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: 2,
            ease: 'easeOut',
          }}
          onAnimationComplete={() => {
            setItems((prev) => prev.filter((h) => h.id !== item.id))
          }}
        >
          <span
            style={{
              fontSize: `${12 + Math.random() * 10}px`,
            }}
          >
            {item.flower}
          </span>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
