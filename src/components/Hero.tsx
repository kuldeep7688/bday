import { motion } from 'framer-motion'
import { herName, heroSubtitle } from '../config/content'
import FloatingElements from './FloatingElements'

function StaggeredText({ text }: { text: string }) {
  return (
    <div className="overflow-hidden pb-2 sm:pb-3">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-pastel-blush to-white overflow-hidden px-4">
      <FloatingElements hearts sparkles />

      <div className="relative z-10 text-center">
        <motion.p
          className="text-sm sm:text-base uppercase tracking-[0.3em] text-soft-text/60 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          A little something for you
        </motion.p>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-soft-text mb-6">
          <StaggeredText text={`Happy Birthday, ${herName}`} />
        </h1>

        <motion.p
          className="text-lg sm:text-xl text-soft-text/70 font-light max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {heroSubtitle}
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-pastel-pink"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  )
}
