import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { XIcon } from '@phosphor-icons/react'
import { IconButton } from '@leonida/ui'

export type StoryItem = {
  id: string
  handle: string
  location: string
  image: string
  caption: string
}

const DURATION_MS = 5000
const HOLD_MS = 220

/**
 * Full-screen story player. Tap the left third to go back, anywhere else to
 * advance; press and hold to pause. Arrow keys and Escape work too.
 */
export function StoryViewer({
  stories,
  startIndex,
  onSeen,
  onClose,
}: {
  stories: StoryItem[]
  startIndex: number
  onSeen: (id: string) => void
  onClose: () => void
}) {
  const [index, setIndex] = useState(startIndex)
  const [paused, setPaused] = useState(false)
  const pressedAt = useRef(0)
  const holdTimer = useRef<number | undefined>(undefined)
  const story = stories[index]

  useEffect(() => {
    if (story) onSeen(story.id)
  }, [story, onSeen])

  const next = () => (index < stories.length - 1 ? setIndex(index + 1) : onClose())
  const prev = () => setIndex(Math.max(0, index - 1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  if (!story) return null

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Story from ${story.handle}`}
      className="absolute inset-0 z-40 flex flex-col bg-ink-950"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
    >
      <img
        key={story.id}
        src={story.image}
        alt={story.caption}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_10_15/0.7)_0%,transparent_22%,transparent_60%,rgb(11_10_15/0.85)_100%)]"
      />

      <div className="relative z-10 flex gap-1 px-3 pt-3">
        {stories.map((s, i) => (
          <span key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
            {i < index && <span className="block h-full w-full bg-white" />}
            {i === index && (
              <span
                key={`${s.id}-${index}`}
                className="story-progress block h-full w-full bg-white"
                style={{
                  ['--story-duration' as string]: `${DURATION_MS}ms`,
                  animationPlayState: paused ? 'paused' : 'running',
                }}
                onAnimationEnd={next}
              />
            )}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-3 px-3 pt-3">
        <img src={story.image} alt="" className="h-9 w-9 rounded-full border border-white/30 object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{story.handle}</p>
          <p className="truncate text-xs text-white/70">{story.location}</p>
        </div>
        <IconButton label="Close story" onClick={onClose} className="text-white hover:text-white">
          <XIcon size={22} />
        </IconButton>
      </div>

      <div
        className="relative z-0 flex flex-1"
        onPointerDown={() => {
          pressedAt.current = Date.now()
          holdTimer.current = window.setTimeout(() => setPaused(true), HOLD_MS)
        }}
        onPointerUp={(e) => {
          window.clearTimeout(holdTimer.current)
          const held = Date.now() - pressedAt.current >= HOLD_MS
          setPaused(false)
          if (held) return
          const rect = e.currentTarget.getBoundingClientRect()
          if (e.clientX - rect.left < rect.width / 3) prev()
          else next()
        }}
        onPointerLeave={() => {
          window.clearTimeout(holdTimer.current)
          setPaused(false)
        }}
      />

      <p className="relative z-10 px-4 pb-6 text-lg font-medium leading-snug text-white">{story.caption}</p>
      <p className="sr-only" aria-live="polite">
        Story {index + 1} of {stories.length}
      </p>
    </motion.div>
  )
}
