import type { ReactNode } from 'react'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { IconButton } from '@leonida/ui'

const LABELS = ['Pick', 'Edit', 'Post']

/** Top bar for the create flow: back, title, and a three-part progress track. */
export function FlowHeader({
  title,
  step,
  onBack,
  backLabel,
  action,
}: {
  title: string
  step: 0 | 1 | 2
  onBack: () => void
  backLabel: string
  action?: ReactNode
}) {
  return (
    <header className="relative z-10 border-b border-line bg-ink-900 px-2 pb-3 pt-2">
      <div className="flex items-center gap-1">
        <IconButton label={backLabel} onClick={onBack}>
          <ArrowLeftIcon size={20} />
        </IconButton>
        <h2 className="type-display flex-1 truncate text-2xl text-fg">{title}</h2>
        {action}
      </div>
      <ol aria-label="Progress" className="mt-2 grid grid-cols-3 gap-1.5 px-2">
        {LABELS.map((label, i) => (
          <li key={label} aria-current={i === step ? 'step' : undefined}>
            <span
              aria-hidden
              className={`block h-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-ink-700'}`}
            />
            <span className={`mt-1.5 block text-[11px] ${i === step ? 'text-fg' : 'text-subtle'}`}>
              {label}
            </span>
          </li>
        ))}
      </ol>
    </header>
  )
}
