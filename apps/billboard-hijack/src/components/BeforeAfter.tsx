import { useEffect, useState } from 'react'
import type { Board } from '../data/boards'
import { BillboardFace } from './BillboardFace'

type View = 'before' | 'after'

const VIEWS: { id: View; label: string }[] = [
  { id: 'before', label: 'Before' },
  { id: 'after', label: 'After' },
]

/** The board with a two-option toggle. On `reveal` it shows the stock board first, then flips to the takeover. */
export function BeforeAfter({ board, art, reveal }: { board: Board; art: string; reveal: boolean }) {
  const [view, setView] = useState<View>(reveal ? 'before' : 'after')
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (!reveal) return
    const id = window.setTimeout(() => {
      setView('after')
      setFlash(true)
    }, 900)
    return () => window.clearTimeout(id)
  }, [reveal, art])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-surface border border-line bg-ink-900">
        <img src={board.plate} alt={`${board.name} before the takeover`} className="absolute inset-0 h-full w-full object-cover" />
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${view === 'after' ? 'opacity-100' : 'opacity-0'} ${flash ? 'signal-flash' : ''}`}
          aria-hidden={view !== 'after'}
        >
          <img src={board.plate} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <BillboardFace plateSrc={board.plate} face={board.face} artUrl={art} showArt />
        </div>
      </div>

      <div role="group" aria-label="Show the board" className="flex rounded-full border border-line bg-ink-900 p-1">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={view === v.id}
            onClick={() => {
              setView(v.id)
              setFlash(false)
            }}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              view === v.id ? 'bg-accent text-ink-950' : 'text-fg/75 hover:text-fg'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}
