import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useBlowDetection } from '../hooks/useBlowDetection'
import { cakePrompt, cakeFallback, finalMessage, candleCount } from '../config/content'

export default function BirthdayCake() {
  const [candlesBlown, setCandlesBlown] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [micRequested, setMicRequested] = useState(false)
  const { isBlowing, start, stop, error } = useBlowDetection()

  useEffect(() => {
    if (candlesBlown >= candleCount && !showCelebration) {
      setShowCelebration(true)
      stop()

      confetti({
        particleCount: 500,
        spread: 180,
        origin: { y: 0.6 },
        colors: ['#FFB6C1', '#FFD1DC', '#E6E6FA', '#FFF0F5', '#FFD700'],
        startVelocity: 45,
        gravity: 1.2,
        ticks: 300,
      })
    }
  }, [candlesBlown, showCelebration, stop])

  useEffect(() => {
    if (micRequested && isBlowing && candlesBlown < candleCount) {
      const timer = setTimeout(() => {
        if (isBlowing && candlesBlown < candleCount) {
          setCandlesBlown((prev) => prev + 1)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isBlowing, candlesBlown, micRequested])

  const handleFirstInteraction = () => {
    if (!micRequested) {
      setMicRequested(true)
      start()
    }
  }

  const handleCandleClick = (index: number) => {
    handleFirstInteraction()
    if (index === candlesBlown) {
      setCandlesBlown((prev) => prev + 1)
    }
  }

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-pastel-lavender/20 via-pastel-blush to-pastel-pink/20 px-4 py-20"
      onClick={handleFirstInteraction}
    >
      <motion.p
        className="font-display text-2xl sm:text-3xl text-soft-text text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {cakePrompt}
      </motion.p>

      <div className="relative mb-8">
        <div className="flex justify-center gap-4 mb-4">
          {Array.from({ length: candleCount }, (_, i) => (
            <motion.div
              key={i}
              className="relative cursor-pointer"
              onClick={() => handleCandleClick(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-3 h-16 bg-gradient-to-b from-pastel-rose to-pastel-pink rounded-t-full" />

              <AnimatePresence>
                {i >= candlesBlown && (
                  <motion.div
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-4 h-6 bg-gradient-to-t from-orange-400 via-yellow-300 to-yellow-100 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {i < candlesBlown && (
                  <motion.div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-400/50 rounded-full"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -30 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="w-64 h-20 bg-gradient-to-b from-pastel-pink to-pastel-rose rounded-t-lg shadow-lg" />
        <div className="w-72 h-16 bg-gradient-to-b from-pastel-rose to-pastel-lavender rounded-b-lg shadow-lg -mt-1" />
        <div className="w-80 h-12 bg-gradient-to-b from-pastel-lavender to-pastel-pink rounded-b-xl shadow-lg -mt-1" />
      </div>

      {!micRequested && (
        <motion.p
          className="text-soft-text/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {cakeFallback}
        </motion.p>
      )}

      {error && (
        <motion.p
          className="text-soft-text/60 text-sm mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="font-display text-3xl sm:text-4xl text-soft-text">
              {finalMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
