# Plan 1: Background Music & Audio Player

## Overview
Add a floating music player that auto-plays a user-provided song after unlock, with play/pause controls and smooth animations.

## New Files

### `src/components/MusicPlayer.tsx`
- Fixed position bottom-right corner (bottom-6 right-6)
- Circular button (w-12 h-12) with pastel-pink bg, rounded-full
- Icon: music note ♪ when paused, pulsing heart ♥ when playing
- Framer Motion pulse animation on playing state
- onClick toggles play/pause
- HTML5 `<audio>` ref with loop, volume 0.3
- Fade in after unlock (initial opacity 0, animate opacity 1)
- Props: `{ src: string }`
- Handle `NotAllowedError` gracefully (user can still click to play)
- Fade volume in over 1s on play, fade out over 1s on pause

## Modified Files

### `src/App.tsx`
- Import `MusicPlayer`
- Render `<MusicPlayer />` inside the unlocked `<motion.main>`
- Pass `songSrc` from content config

### `src/config/content.ts`
- Add `export const songSrc = '/assets/birthday-song.mp3'`

## Assets
- `public/assets/birthday-song.mp3` — user-provided song file

## Audio Behavior
- `useEffect` on unlock → call `audioRef.play()` (browser allows after user gesture)
- Handle `NotAllowedError` gracefully (user can still click to play)
- Fade volume in over 1s on play, fade out over 1s on pause

## Testing
- Verify music plays after unlock
- Verify play/pause toggle works
- Verify volume fades in/out
- Verify music loops
- Test on mobile (auto-play restrictions)
