import { useState, useCallback } from 'react'
import LockScreen from './components/LockScreen'
import { herName } from './config/content'

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleUnlock = useCallback(() => {
    setIsUnlocked(true)
  }, [])

  return (
    <>
      <LockScreen onUnlock={handleUnlock} />
      {isUnlocked && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-blush via-pastel-pink/30 to-pastel-lavender">
          <p className="text-2xl text-soft-text">Happy Birthday, {herName}! 🎉</p>
        </div>
      )}
    </>
  )
}
