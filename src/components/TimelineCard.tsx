import { motion, AnimatePresence } from 'framer-motion'

interface TimelineCardProps {
  title: string
  date: string
  description: string
  photo: string
  icon: string
  onClose: () => void
}

export default function TimelineCard({
  title,
  date,
  description,
  photo,
  icon,
  onClose,
}: TimelineCardProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative overflow-hidden">
            <img
              src={photo}
              alt={title}
              className="w-full h-auto max-h-[60vh] object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl">{icon}</div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <h3 className="font-display text-xl text-white drop-shadow-lg">
                {title}
              </h3>
            </div>
          </div>
          <div className="p-6">
            <span className="text-xs uppercase tracking-wider text-pastel-pink font-medium">
              {date}
            </span>
            <p className="text-soft-text/70 leading-relaxed mt-2">{description}</p>
          </div>
          <div className="px-6 pb-6">
            <button
              className="w-full py-2 bg-pastel-pink/20 text-pastel-pink rounded-lg hover:bg-pastel-pink/30 transition-colors text-sm font-medium"
              onClick={onClose}
            >
              Close ♥
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
