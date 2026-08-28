import { motion } from 'framer-motion'
import { photos } from '../config/content'
import PhotoCard from './PhotoCard'
import FloatingElements from './FloatingElements'

export default function PhotoGallery() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-white to-pastel-blush/30 relative overflow-hidden px-4">
      <FloatingElements clouds />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-center text-soft-text mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          🌸 The Prettiest and Funniest Person I Know in Connecticut 🌸
        </motion.h2>

        <div className="flex flex-nowrap justify-center gap-4 sm:gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.3, duration: 0.6, ease: 'easeOut' }}
            >
              <PhotoCard {...photo} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
