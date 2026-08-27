import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScratchCard from './ScratchCard'
import { scratchMessages } from '../config/content'

interface FloatingMessage {
  id: string
  text: string
  x: number
  y: number
  delay: number
  duration: number
}

const initialCards: FloatingMessage[] = scratchMessages.map((text, index) => ({
  id: String(index + 1),
  text,
  x: 0,
  y: 0,
  delay: index * 0.5,
  duration: 12 + index * 2,
}))

const getRandomPosition = () => ({
  x: Math.random() * 75 + 5,
  y: Math.random() * 60 + 15,
})

export default function FloatingScratchCards() {
  const [cardPositions, setCardPositions] = useState(() =>
    initialCards.map((card) => ({
      ...card,
      ...getRandomPosition(),
    }))
  )
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set())
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const dragRef = useRef<{
    id: string
    startX: number
    startY: number
    startCardX: number
    startCardY: number
    hasMoved: boolean
  } | null>(null)

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

  const handlePointerDown = useCallback((id: string, e: React.PointerEvent) => {
    const card = cardPositions.find((c) => c.id === id)
    if (!card) return

    if (!revealedCards.has(id)) {
      e.currentTarget.setPointerCapture(e.pointerId)
      dragRef.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        startCardX: card.x,
        startCardY: card.y,
        hasMoved: false,
      }
    } else {
      e.currentTarget.setPointerCapture(e.pointerId)
      dragRef.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        startCardX: card.x,
        startCardY: card.y,
        hasMoved: false,
      }
    }
  }, [cardPositions, revealedCards])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return

    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragRef.current.hasMoved = true
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const currentX = (dragRef.current.startCardX / 100) * viewportWidth
    const currentY = (dragRef.current.startCardY / 100) * viewportHeight

    const newX = Math.max(0, Math.min(85, ((currentX + dx) / viewportWidth) * 100))
    const newY = Math.max(0, Math.min(85, ((currentY + dy) / viewportHeight) * 100))

    setCardPositions((prev) =>
      prev.map((c) =>
        c.id === dragRef.current!.id ? { ...c, x: newX, y: newY } : c
      )
    )
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current) return

    if (!dragRef.current.hasMoved && !revealedCards.has(dragRef.current.id)) {
      setActiveCard(dragRef.current.id)
    }

    dragRef.current = null
  }, [revealedCards])

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
        <div
          key={card.id}
          className="absolute pointer-events-auto"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            animation: `float-${card.id} ${card.duration}s ease-in-out infinite`,
            animationDelay: `${card.delay}s`,
          }}
        >
          <div
            className="cursor-grab active:cursor-grabbing touch-none select-none"
            onPointerDown={(e) => handlePointerDown(card.id, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <ScratchCard
              width={180}
              height={70}
              onReveal={() => handleReveal(card.id)}
            />
          </div>
        </div>
      ))}

      <style>{`
        ${initialCards.map((card) => `
          @keyframes float-${card.id} {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(6px, -10px); }
            50% { transform: translate(-4px, -18px); }
            75% { transform: translate(10px, -8px); }
          }
        `).join('')}
      `}</style>

      <AnimatePresence>
        {activeCard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-40"
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
            className="absolute pointer-events-auto cursor-grab active:cursor-grabbing touch-none select-none"
            style={{ left: `${msg.x}%`, top: `${msg.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -15, 0],
              x: [0, 8, 0],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              y: {
                duration: msg.duration,
                repeat: Infinity,
                delay: msg.delay,
                ease: 'easeInOut',
              },
              x: {
                duration: msg.duration * 0.8,
                repeat: Infinity,
                delay: msg.delay,
                ease: 'easeInOut',
              },
            }}
            onPointerDown={(e) => handlePointerDown(msg.id, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
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
