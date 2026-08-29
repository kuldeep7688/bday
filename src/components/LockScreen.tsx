import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UNLOCK_DATE } from '../config/content'
import FloatingElements from './FloatingElements'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const now = new Date().getTime()
  const unlock = UNLOCK_DATE.getTime()
  const diff = unlock - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-semibold text-soft-text"
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="text-xs sm:text-sm mt-2 text-soft-text/70 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const time = getTimeLeft()
      setTimeLeft(time)

      if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
        clearInterval(timer)
        setIsUnlocked(true)
        setTimeout(onUnlock, 1500)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [onUnlock])

  return (
    <AnimatePresence>
      {!isUnlocked && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pastel-blush via-pastel-pink/30 to-pastel-lavender"
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          <FloatingElements hearts />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4"
          >
            <motion.p
              className="text-lg sm:text-xl text-soft-text/80 mb-8 font-light"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Something I made to surprise you !!!
            </motion.p>

            <div className="flex gap-3 sm:gap-4 justify-center mb-8">
              <TimeBlock value={timeLeft.days} label="Days" />
              <TimeBlock value={timeLeft.hours} label="Hours" />
              <TimeBlock value={timeLeft.minutes} label="Minutes" />
              <TimeBlock value={timeLeft.seconds} label="Seconds" />
            </div>

            <p className="text-sm text-soft-text/50">
              September 3rd can&apos;t come soon enough ♥
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
