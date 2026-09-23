import { useEffect, useId, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { XIcon } from '@phosphor-icons/react'
import { IconButton } from './Button'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  /** Position inside the nearest positioned ancestor instead of the viewport. */
  contained?: boolean
  size?: 'md' | 'lg'
}

/** Bottom sheet on small screens, centered dialog from `md` up. */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  contained = false,
  size = 'md',
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [open])

  const position = contained ? 'absolute' : 'fixed'
  const width = size === 'lg' ? 'md:max-w-3xl' : 'md:max-w-md'

  return (
    <AnimatePresence>
      {open && (
        <div className={`${position} inset-0 z-50 flex items-end justify-center md:items-center md:p-6`}>
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-ink-950/75 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`relative flex max-h-[92%] w-full flex-col overflow-hidden rounded-t-surface border border-line-strong bg-ink-900 outline-none md:rounded-surface ${width}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <div className="flex items-start gap-3 px-5 pb-3 pt-4">
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="type-display text-2xl text-fg">
                  {title}
                </h2>
                {description && <p className="mt-1 text-sm text-muted">{description}</p>}
              </div>
              <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1">
                <XIcon size={20} />
              </IconButton>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
            {footer && (
              <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
