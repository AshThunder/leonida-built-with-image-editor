import { CheckIcon } from '@phosphor-icons/react'
import type { StoryPost } from '../lib/storage'

export type FlowStep = 0 | 1 | 2 | 3

const STEPS: { title: string; tip: string }[] = [
  { title: 'Feed', tip: 'Tap a face to watch their story. Like a post or open its replies.' },
  { title: 'Pick', tip: 'Choose a Leonida scene or drop in your own photo. Tall shots work best.' },
  { title: 'Edit', tip: 'Filter the mood, add a caption, stamp a sticker, then save.' },
  { title: 'Post', tip: 'Write the rumor and post it. The locals reply right away.' },
]

/** Desktop-only side panel: where you are in the flow and how to go back. */
export function ContextRail({
  step,
  onStep,
  userPost,
  onOpenYou,
}: {
  step: FlowStep
  onStep: (step: FlowStep) => void
  userPost: StoryPost | null
  onOpenYou: () => void
}) {
  return (
    <aside className="hidden w-[300px] shrink-0 flex-col gap-8 lg:flex">
      <div>
        <h1 className="type-display text-5xl text-fg">Leonida Stories</h1>
        <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-muted">
          The night feed for everything the loop cameras missed.
        </p>
      </div>

      <nav aria-label="Story flow">
        <ol className="flex flex-col gap-1">
          {STEPS.map((s, i) => {
            const active = i === step
            const done = i < step
            const reachable = i === 0 || done
            return (
              <li key={s.title}>
                <button
                  type="button"
                  disabled={!reachable || active}
                  onClick={() => onStep(i as FlowStep)}
                  aria-current={active ? 'step' : undefined}
                  className={`group relative flex w-full gap-3 rounded-control px-3 py-3 text-left transition-colors disabled:cursor-default ${
                    active ? 'bg-ink-850' : reachable ? 'hover:bg-ink-900' : ''
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${
                      active
                        ? 'border-accent bg-accent text-ink-950'
                        : done
                          ? 'border-line-strong text-fg'
                          : 'border-line text-subtle'
                    }`}
                  >
                    {done ? <CheckIcon size={12} weight="bold" /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={`block font-medium ${active || done ? 'text-fg' : 'text-subtle'}`}>
                      {s.title}
                    </span>
                    {active && <span className="mt-1 block text-sm leading-snug text-muted">{s.tip}</span>}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {userPost && (
        <button
          type="button"
          onClick={onOpenYou}
          className="mt-auto flex items-center gap-3 rounded-surface border border-line bg-ink-900 p-2 pr-4 text-left transition-colors hover:border-line-strong"
        >
          <img src={userPost.imageDataUrl} alt="" className="h-14 w-11 rounded-md object-cover" />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-fg">Your latest story</span>
            <span className="block truncate text-xs text-muted">{userPost.caption}</span>
          </span>
        </button>
      )}
    </aside>
  )
}
