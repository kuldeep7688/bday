import { motion } from 'framer-motion'

interface AnimatedDividerProps {
  variant?: 'wave' | 'petals' | 'hearts'
}

function WaveDivider() {
  return (
    <div className="py-8 overflow-hidden">
      <svg
        className="w-full h-12"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,60 Q300,20 600,60 T1200,60"
          fill="none"
          stroke="#FFB6C1"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  )
}

function PetalsDivider() {
  const petals = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    delay: i * 0.2,
    y: Math.random() * 20 - 10,
  }))

  return (
    <div className="py-12 relative h-20 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute text-2xl"
          style={{ left: `${petal.id * 15}%` }}
          initial={{ x: -50, y: petal.y, opacity: 0, rotate: 0 }}
          whileInView={{
            x: ['0vw', '100vw'],
            y: [petal.y, petal.y + Math.sin(petal.id) * 30, petal.y],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360],
          }}
          viewport={{ once: true }}
          transition={{
            duration: 4,
            delay: petal.delay,
            ease: 'easeInOut',
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  )
}

function HeartsDivider() {
  const hearts = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    delay: i * 0.3,
    y: Math.random() * 30 - 15,
  }))

  return (
    <div className="py-12 relative h-20 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-pastel-pink text-xl"
          style={{ left: `${heart.id * 20 + 5}%` }}
          initial={{ y: heart.y, opacity: 0, scale: 0 }}
          whileInView={{
            y: [heart.y, heart.y - 20, heart.y],
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1],
          }}
          viewport={{ once: true }}
          transition={{
            duration: 3,
            delay: heart.delay,
            ease: 'easeInOut',
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  )
}

export default function AnimatedDivider({ variant = 'wave' }: AnimatedDividerProps) {
  switch (variant) {
    case 'petals':
      return <PetalsDivider />
    case 'hearts':
      return <HeartsDivider />
    case 'wave':
    default:
      return <WaveDivider />
  }
}
