import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LockScreen from './components/LockScreen'
import Hero from './components/Hero'
import WhyYoureSpecial from './components/WhyYoureSpecial'
import PhotoGallery from './components/PhotoGallery'
import Timeline from './components/Timeline'

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleUnlock = useCallback(() => {
    setIsUnlocked(true)
  }, [])

  return (
    <>
      <LockScreen onUnlock={handleUnlock} />

      <AnimatePresence>
        {isUnlocked && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Hero />
            <WhyYoureSpecial />
            <PhotoGallery />
            <Timeline />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  )
}
