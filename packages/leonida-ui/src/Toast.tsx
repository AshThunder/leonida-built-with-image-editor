import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircleIcon } from '@phosphor-icons/react'

type ToastState = { id: number; message: string } | null

/**
 * Returns a toast element to render (inside a positioned container) and a
 * `show` function. Only one toast is visible at a time.
 */
export function useToast(duration = 2800): { toast: ReactNode; show: (message: string) => void } {
  const [state, setState] = useState<ToastState>(null)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback(
    (message: string) => {
      window.clearTimeout(timer.current)
      setState({ id: Date.now(), message })
      timer.current = window.setTimeout(() => setState(null), duration)
    },
    [duration],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toast = (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center px-4"
    >
      <AnimatePresence>
        {state && (
          <motion.div
            key={state.id}
            role="status"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="flex items-center gap-2 rounded-full border border-live/30 bg-ink-850 py-2 pl-3 pr-4 text-sm text-fg shadow-[0_12px_32px_rgb(0_0_0/0.45)]"
          >
            <CheckCircleIcon size={18} weight="fill" className="text-live" aria-hidden />
            {state.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return { toast, show }
}
