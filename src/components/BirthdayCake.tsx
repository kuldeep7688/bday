import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useBlowDetection } from '../hooks/useBlowDetection'
import { cakePrompt, cakeFallback, finalMessage, candleCount } from '../config/content'

export default function BirthdayCake() {
  const [candlesBlown, setCandlesBlown] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [micRequested, setMicRequested] = useState(false)
  const [blowProcessed, setBlowProcessed] = useState(false)
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
    if (!micRequested || candlesBlown >= candleCount) return

    if (isBlowing && !blowProcessed) {
      setCandlesBlown((prev) => Math.min(prev + 1, candleCount))
      setBlowProcessed(true)
    }

    if (!isBlowing && blowProcessed) {
      setBlowProcessed(false)
    }
  }, [isBlowing, candlesBlown, micRequested, blowProcessed])

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
        <div className="flex justify-center gap-6 mb-2">
          {Array.from({ length: candleCount }, (_, i) => (
            <motion.div
              key={i}
              className="relative cursor-pointer"
              onClick={() => handleCandleClick(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-2 h-14 bg-gradient-to-b from-pastel-rose to-pastel-pink rounded-t-sm shadow-sm" />

              <AnimatePresence>
                {i >= candlesBlown && (
                  <motion.div
                    className="absolute -top-8 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-3 h-5 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full shadow-lg shadow-orange-400/50"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.9, 1, 0.9],
                        rotate: [-2, 2, -2],
                      }}
                      transition={{
                        duration: 0.6,
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
                    className="absolute -top-10 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-400/60 rounded-full"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -40 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="w-56 h-16 bg-gradient-to-b from-pastel-pink to-pastel-rose rounded-t-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-white/30 rounded-t-2xl" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-pastel-rose/50" />
        </div>
        <div className="w-64 h-14 bg-gradient-to-b from-pastel-rose to-pastel-lavender rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-white/20" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-pastel-lavender/50" />
        </div>
        <div className="w-72 h-12 bg-gradient-to-b from-pastel-lavender to-pastel-pink rounded-b-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-white/20" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-pastel-pink/50" />
        </div>
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
