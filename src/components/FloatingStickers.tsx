import { motion } from 'framer-motion'

const stickers = [
  {
    src: '/assets/hair-play.png',
    alt: 'Girl playing with hair',
    position: { top: '10%', left: '3%' },
    size: 'w-20 sm:w-24',
    delay: 0,
    duration: 4,
    rotate: [-3, 3, -3],
  },
  {
    src: '/assets/pouting.png',
    alt: 'Girl pouting',
    position: { top: '40%', right: '3%' },
    size: 'w-16 sm:w-20',
    delay: 1,
    duration: 5,
    rotate: [2, -2, 2],
  },
  {
    src: '/assets/sofa-laptop.png',
    alt: 'Girl sitting on sofa with laptop',
    position: { top: '60%', left: '5%' },
    size: 'w-20 sm:w-28',
    delay: 0.5,
    duration: 6,
    rotate: [-2, 2, -2],
  },
  {
    src: '/assets/black-goggles.png',
    alt: 'Girl wearing black goggles',
    position: { top: '80%', right: '5%' },
    size: 'w-16 sm:w-24',
    delay: 1.5,
    duration: 4.5,
    rotate: [3, -3, 3],
  },
]

export default function FloatingStickers() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stickers.map((sticker) => (
        <motion.div
          key={sticker.alt}
          className={`absolute ${sticker.size} opacity-40`}
          style={sticker.position}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 0.4,
            y: [0, -15, 0],
            rotate: sticker.rotate,
          }}
          transition={{
            delay: sticker.delay,
            duration: sticker.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src={sticker.src}
            alt={sticker.alt}
            className="w-full h-full object-contain"
          />
        </motion.div>
      ))}
    </div>
  )
}
