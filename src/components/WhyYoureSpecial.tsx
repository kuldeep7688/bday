import { motion } from 'framer-motion'
import { reasonsILoveYou } from '../config/content'
import TextCard from './TextCard'

export default function WhyYoureSpecial() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-white via-pastel-lavender/20 to-white px-4">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-center text-soft-text mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why You&apos;re So Special ♥
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reasonsILoveYou.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
            >
              <TextCard {...reason} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
