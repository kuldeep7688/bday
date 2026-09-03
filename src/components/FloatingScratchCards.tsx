import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScratchCard from './ScratchCard'
import { scratchMessages } from '../config/content'

interface FloatingMessage {
  id: string
  text: string
  x: number
  y: number
}

const initialCards: FloatingMessage[] = scratchMessages.map((text, index) => ({
  id: String(index + 1),
  text,
  x: 0,
  y: 0,
}))

const getRandomPosition = () => ({
  x: Math.random() * 75 + 5,
  y: Math.random() * 60 + 15,
})

export default function FloatingScratchCards() {
  const [cardPositions] = useState(() =>
    initialCards.map((card) => ({
      ...card,
      ...getRandomPosition(),
    }))
  )
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set())
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      setIsVisible(window.scrollY > heroHeight * 0.8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleReveal = (id: string) => {
    setRevealedCards((prev) => new Set([...prev, id]))
    setTimeout(() => setActiveCard(null), 500)
  }

  const handleDoubleClick = (id: string) => {
    if (!revealedCards.has(id)) {
      setActiveCard(id)
    }
  }

  const unrevealedCards = cardPositions.filter((card) => !revealedCards.has(card.id))
  const revealedMessages = cardPositions.filter((card) => revealedCards.has(card.id))

  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {unrevealedCards.map((card) => (
        <motion.div
          key={card.id}
          className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
          }}
          drag
          dragElastic={0}
          dragMomentum={false}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onDoubleClick={() => handleDoubleClick(card.id)}
        >
          <div className="bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-rose px-5 py-3 rounded-xl shadow-lg border border-white/50 backdrop-blur-sm select-none">
            <p className="text-white text-sm font-semibold whitespace-nowrap">
              ✨ Double-click to scratch ✨
            </p>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {activeCard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-40 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCard(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto"
            >
              <ScratchCard
                width={180}
                height={70}
                onReveal={() => handleReveal(activeCard)}
                autoSelect
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {revealedMessages.map((msg) => (
          <motion.div
            key={`revealed-${msg.id}`}
            className="absolute pointer-events-auto select-none cursor-grab active:cursor-grabbing"
            style={{ left: `${msg.x}%`, top: `${msg.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
            }}
            drag
            dragElastic={0}
            dragMomentum={false}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-pastel-pink/30"
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <p className="text-soft-text text-sm font-medium whitespace-nowrap">
                {msg.text}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
