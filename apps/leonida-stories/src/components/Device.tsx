import type { ReactNode } from 'react'
import { motion } from 'motion/react'

/**
 * Full-screen app surface on phones; a framed device on desktop that widens
 * into a studio panel while the editor is open.
 */
export function Device({ wide, children }: { wide: boolean; children: ReactNode }) {
  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 260, damping: 32 }}
      className={`relative isolate flex h-full w-full flex-col overflow-hidden bg-ink-900 md:h-[min(860px,calc(100dvh-3.5rem-3rem))] md:rounded-[32px] md:border-[6px] md:border-ink-800 md:shadow-[0_30px_80px_rgb(0_0_0/0.55)] ${
        wide ? 'md:max-w-[1100px]' : 'md:max-w-[400px]'
      }`}
    >
      {children}
    </motion.div>
  )
}
