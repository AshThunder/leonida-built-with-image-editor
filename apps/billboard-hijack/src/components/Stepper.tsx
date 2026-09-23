import { CheckIcon, LockSimpleIcon } from '@phosphor-icons/react'

export type StepId = 'scout' | 'editor' | 'proof' | 'gallery'

const STEPS: { id: StepId; label: string }[] = [
  { id: 'scout', label: 'Scout' },
  { id: 'editor', label: 'Design' },
  { id: 'proof', label: 'Go live' },
  { id: 'gallery', label: 'Gallery' },
]

export function Stepper({
  current,
  reachable,
  onGo,
}: {
  current: StepId
  reachable: Record<StepId, boolean>
  onGo: (id: StepId) => void
}) {
  const currentIndex = STEPS.findIndex((s) => s.id === current)
  return (
    <nav aria-label="Hijack steps" className="no-scrollbar overflow-x-auto">
      <ol className="flex items-center gap-1">
        {STEPS.map((s, i) => {
          const active = s.id === current
          const open = reachable[s.id]
          const done = i < currentIndex && s.id !== 'gallery'
          return (
            <li key={s.id} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden className="h-px w-4 bg-line-strong md:w-6" />}
              <button
                type="button"
                disabled={!open || active}
                onClick={() => onGo(s.id)}
                aria-current={active ? 'step' : undefined}
                aria-label={open ? undefined : `${s.label}, locked`}
                className={`flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm transition-colors disabled:cursor-default ${
                  active
                    ? 'bg-accent font-semibold text-ink-950'
                    : open
                      ? 'text-fg hover:bg-white/5'
                      : 'text-subtle'
                }`}
              >
                {done && <CheckIcon size={14} weight="bold" aria-hidden />}
                {!open && <LockSimpleIcon size={14} aria-hidden />}
                {s.label}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
