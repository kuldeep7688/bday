import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { timeline } from '../config/content'
import TimelineCard from './TimelineCard'

export default function Timeline() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selectedItem = selectedIndex !== null ? timeline[selectedIndex] : null

  const handleIconClick = (index: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x, y },
        colors: ['#FFB6C1', '#FFD1DC', '#E6E6FA', '#FFF0F5', '#FFD700'],
        startVelocity: 20,
        gravity: 0.8,
        ticks: 80,
      })
    }

    setSelectedIndex(index)
  }

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
                onClick={(e) => handleIconClick(index, e)}
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
