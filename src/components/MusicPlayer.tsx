import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MusicPlayerProps {
  src: string
}

export default function MusicPlayer({ src }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const clearFadeInterval = () => {
    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0

    const playAudio = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        clearFadeInterval()
        fadeIntervalRef.current = window.setInterval(() => {
          if (audio.volume < 0.3) {
            audio.volume = Math.min(audio.volume + 0.05, 0.3)
          } else {
            clearFadeInterval()
          }
        }, 100)
      } catch (err) {
        console.log('Auto-play prevented:', err)
      }
    }

    playAudio()

    return () => {
      clearFadeInterval()
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    clearFadeInterval()

    if (isPlaying) {
      fadeIntervalRef.current = window.setInterval(() => {
        if (audio.volume > 0) {
          audio.volume = Math.max(audio.volume - 0.05, 0)
        } else {
          clearFadeInterval()
          audio.pause()
          setIsPlaying(false)
        }
      }, 100)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
        fadeIntervalRef.current = window.setInterval(() => {
          if (audio.volume < 0.3) {
            audio.volume = Math.min(audio.volume + 0.05, 0.3)
          } else {
            clearFadeInterval()
          }
        }, 100)
      } catch (err) {
        console.log('Play prevented:', err)
      }
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      <motion.button
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-pastel-pink shadow-xl flex items-center justify-center text-white text-2xl cursor-pointer hover:scale-110 transition-transform"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={togglePlay}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        {isPlaying ? (
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ♥
          </motion.span>
        ) : (
          <span>♪</span>
        )}
      </motion.button>
    </>
  )
}
