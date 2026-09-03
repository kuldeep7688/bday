import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MusicPlayerProps {
  videoId: string
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function MusicPlayer({ videoId }: MusicPlayerProps) {
  const playerRef = useRef<any>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const clearFadeInterval = () => {
    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }
  }

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute()
            event.target.playVideo()
            setIsReady(true)
          },
        },
      })
    }

    return () => {
      clearFadeInterval()
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [videoId])

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && isReady && playerRef.current) {
        setHasInteracted(true)
        playerRef.current.unMute()
        playerRef.current.setVolume(0)
        fadeIntervalRef.current = window.setInterval(() => {
          const currentVolume = playerRef.current.getVolume()
          if (currentVolume < 30) {
            playerRef.current.setVolume(Math.min(currentVolume + 5, 30))
          } else {
            clearFadeInterval()
            setIsPlaying(true)
          }
        }, 100)
      }
    }

    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('touchstart', handleInteraction, { once: true })
    document.addEventListener('keydown', handleInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [isReady, hasInteracted])

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return

    if (!hasInteracted) {
      setHasInteracted(true)
      playerRef.current.unMute()
      playerRef.current.setVolume(0)
      clearFadeInterval()
      fadeIntervalRef.current = window.setInterval(() => {
        const currentVolume = playerRef.current.getVolume()
        if (currentVolume < 30) {
          playerRef.current.setVolume(Math.min(currentVolume + 5, 30))
        } else {
          clearFadeInterval()
          setIsPlaying(true)
        }
      }, 100)
      return
    }

    clearFadeInterval()

    if (isPlaying) {
      fadeIntervalRef.current = window.setInterval(() => {
        const currentVolume = playerRef.current.getVolume()
        if (currentVolume > 0) {
          playerRef.current.setVolume(Math.max(currentVolume - 5, 0))
        } else {
          clearFadeInterval()
          playerRef.current.pauseVideo()
          setIsPlaying(false)
        }
      }, 100)
    } else {
      playerRef.current.playVideo()
      setIsPlaying(true)
      fadeIntervalRef.current = window.setInterval(() => {
        const currentVolume = playerRef.current.getVolume()
        if (currentVolume < 30) {
          playerRef.current.setVolume(Math.min(currentVolume + 5, 30))
        } else {
          clearFadeInterval()
        }
      }, 100)
    }
  }

  return (
    <>
      <div id="youtube-player" />
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
