import { motion } from 'framer-motion'

interface TextCardProps {
  title: string
  text: string
  index: number
}

export default function TextCard({ title, text, index }: TextCardProps) {
  return (
    <motion.div
      className="max-w-md mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg shadow-pastel-pink/10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
    >
      <motion.h3
        className="font-display text-xl sm:text-2xl text-soft-text mb-3"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.1, duration: 0.4 }}
      >
        {title}
      </motion.h3>
      <p className="text-soft-text/70 leading-relaxed">{text}</p>
      <motion.div
        className="text-pastel-pink text-2xl mt-4"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.3, duration: 0.3 }}
      >
        ♥
      </motion.div>
    </motion.div>
  )
}
