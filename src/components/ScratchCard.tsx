import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScratchCardProps {
  width?: number
  height?: number
  onReveal?: () => void
  autoSelect?: boolean
}

export default function ScratchCard({ width = 180, height = 100, onReveal, autoSelect = false }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isSelected, setIsSelected] = useState(autoSelect)
  const [isRevealed, setIsRevealed] = useState(false)
  const checkTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#FFB6C1')
    gradient.addColorStop(0.5, '#E6E6FA')
    gradient.addColorStop(1, '#FFD1DC')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✨ Tap to scratch ✨', canvas.width / 2, canvas.height / 2)

    return () => {
      if (checkTimeoutRef.current !== null) {
        clearTimeout(checkTimeoutRef.current)
      }
    }
  }, [])

  const handleClick = () => {
    if (!isSelected) {
      setIsSelected(true)
    }
  }

  const scratch = (x: number, y: number) => {
    if (!isSelected) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 25, 0, Math.PI * 2)
    ctx.fill()

    scheduleCheckReveal()
  }

  const scheduleCheckReveal = () => {
    if (checkTimeoutRef.current !== null) {
      clearTimeout(checkTimeoutRef.current)
    }

    checkTimeoutRef.current = window.setTimeout(() => {
      checkReveal()
      checkTimeoutRef.current = null
    }, 150)
  }

  const checkReveal = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let transparentPixels = 0

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++
    }

    const totalPixels = pixels.length / 4
    const percentage = (transparentPixels / totalPixels) * 100

    if (percentage > 60) {
      setIsRevealed(true)
      onReveal?.()
    }
  }

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    }
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSelected) return
    e.preventDefault()
    const coords = getCoordinates(e)
    if (coords) scratch(coords.x, coords.y)
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSelected) return
    e.preventDefault()
    const coords = getCoordinates(e)
    if (coords) scratch(coords.x, coords.y)
  }

  return (
    <AnimatePresence>
      {!isRevealed && (
        <motion.div
          className="relative cursor-pointer"
          style={{ width, height }}
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: isSelected ? 1.05 : 1,
            boxShadow: isSelected
              ? '0 0 30px rgba(255, 182, 193, 0.6)'
              : '0 4px 20px rgba(255, 182, 193, 0.3)',
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          <canvas
            ref={canvasRef}
            width={width * 2}
            height={height * 2}
            className="w-full h-full rounded-xl"
            style={{ cursor: isSelected ? 'crosshair' : 'pointer' }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
          />
          {isSelected && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-pastel-pink pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
