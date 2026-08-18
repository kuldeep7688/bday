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
