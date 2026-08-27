import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PhotoCardProps {
  src: string
  caption: string
  message: string
  index: number
}

export default function PhotoCard({ src, caption, message, index }: PhotoCardProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <>
      <motion.div
        className="relative group cursor-pointer"
        initial={{ opacity: 0, rotate: 0 }}
        whileInView={{ opacity: 1, rotate: [-3, 3, 0] }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2, duration: 0.6 }}
        whileHover={{
          rotate: [0, -2, 2, 0],
          scale: 1.05,
          y: -8,
        }}
        onClick={() => setIsZoomed(true)}
      >
        <div className="bg-white p-3 pb-12 rounded-lg shadow-lg shadow-pastel-pink/20">
          <img
            src={src}
            alt={caption}
            className="w-72 h-72 sm:w-80 sm:h-80 object-cover rounded"
          />
        </div>
        <p className="font-display text-sm text-soft-text/80 text-center mt-2 italic">
          {caption}
        </p>
      </motion.div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-[90vw] max-h-[90vh] overflow-auto text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={caption}
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-lg mb-4"
              />
              <p className="text-soft-text/80 italic">{message}</p>
              <button
                className="mt-4 text-pastel-pink text-sm hover:underline"
                onClick={() => setIsZoomed(false)}
              >
                Close ♥
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
