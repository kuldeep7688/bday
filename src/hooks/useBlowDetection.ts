import { useState, useEffect, useRef, useCallback } from 'react'

interface BlowDetectionResult {
  volume: number
  isBlowing: boolean
  start: () => void
  stop: () => void
  error: string | null
}

export function useBlowDetection(threshold = 150): BlowDetectionResult {
  const [volume, setVolume] = useState(0)
  const [isBlowing, setIsBlowing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isActiveRef = useRef(false)

  const analyze = useCallback(() => {
    if (!isActiveRef.current || !analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    setVolume(average)
    setIsBlowing(average > threshold)

    animationFrameRef.current = requestAnimationFrame(analyze)
  }, [threshold])

  const start = useCallback(async () => {
    if (isActiveRef.current) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      isActiveRef.current = true
      setError(null)
      analyze()
    } catch (err) {
      console.error('Microphone access denied:', err)
      setError('Microphone access denied. Tap candles to blow them out.')
      setIsBlowing(false)
    }
  }, [analyze])

  const stop = useCallback(() => {
    isActiveRef.current = false

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setIsBlowing(false)
    setVolume(0)
  }, [])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { volume, isBlowing, start, stop, error }
}
