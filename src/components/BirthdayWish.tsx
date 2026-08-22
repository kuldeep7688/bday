import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BirthdayWish() {
  const [wish, setWish] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFlying, setIsFlying] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (wish) setHasError(false)
  }, [wish])

  const handleSubmit = async () => {
    if (!wish.trim()) return

    setIsFlying(true)
    setHasError(false)

    const apiCall = fetch('/api/wish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wish: wish.trim() }),
    }).then(r => {
      if (!r.ok) throw new Error('Failed to send wish')
    }).catch(err => {
      console.error('Failed to send wish:', err)
      setHasError(true)
    })

    const animation = new Promise<void>(resolve => {
      setTimeout(() => {
        setIsFlying(false)
        resolve()
      }, 2500)
    })

    await Promise.all([apiCall, animation])
    setIsSubmitted(true)
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-pastel-lavender/20 to-pastel-blush px-4 overflow-hidden">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.h2
          className="font-display text-4xl sm:text-5xl text-soft-text mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Make a Birthday Wish ✨
        </motion.h2>

        <motion.p
          className="text-lg text-soft-text/70 mb-12 font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Close your eyes, think of something beautiful, and let it fly...
        </motion.p>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="wish-form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <input
                  type="text"
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Make a wish and let it fly..."
                  className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-pastel-pink/30 focus:border-pastel-pink focus:outline-none text-lg text-soft-text placeholder-soft-text/40 shadow-lg shadow-pastel-pink/10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </motion.div>

              <motion.button
                onClick={handleSubmit}
                disabled={!wish.trim() || isFlying}
                className={`px-8 py-4 rounded-full text-lg font-medium transition-all ${
                  wish.trim() && !isFlying
                    ? 'bg-gradient-to-r from-pastel-pink to-pastel-rose text-white shadow-lg shadow-pastel-pink/30 hover:shadow-xl hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={wish.trim() && !isFlying ? { scale: 1.05 } : {}}
                whileTap={wish.trim() && !isFlying ? { scale: 0.95 } : {}}
              >
                {isFlying ? 'Sending...' : '🎁 Send Your Wish'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="wish-sent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="py-8"
            >
              <motion.p
                className="text-2xl sm:text-3xl text-soft-text font-light"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Your wish has been sent to the universe ✨
              </motion.p>
            </motion.div>
          )}
          {hasError && !isSubmitted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-soft-text/60 text-sm mt-4"
            >
              Your wish couldn't fly right now. Please try again.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFlying && (
            <motion.div
              className="fixed left-0 top-1/2 z-40"
              initial={{ x: -50, y: '-50%', opacity: 1 }}
              animate={{
                x: '120vw',
                y: ['-50%', '-80%', '-60%', '-100%'],
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
              }}
            >
              <div className="relative">
                <span className="text-4xl">✈️</span>
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-yellow-400"
                    style={{
                      left: -i * 20,
                      top: Math.random() * 20 - 10,
                      fontSize: 12,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  >
                    ✨
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
