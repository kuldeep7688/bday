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
