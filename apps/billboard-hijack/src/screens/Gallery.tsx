import { BroadcastIcon } from '@phosphor-icons/react'
import { Button } from '@leonida/ui'
import { BOARDS } from '../data/boards'
import type { Takeover } from '../lib/storage'
import { BillboardFace } from '../components/BillboardFace'

export function Gallery({
  takeovers,
  onOpen,
  onScout,
}: {
  takeovers: Takeover[]
  onOpen: (t: Takeover) => void
  onScout: () => void
}) {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-5 md:px-6 lg:py-8">
      <h2 className="type-display text-4xl text-fg md:text-5xl">Takeovers</h2>

      {takeovers.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-4 rounded-surface border border-dashed border-line-strong p-8 md:items-center md:text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-800 text-muted">
            <BroadcastIcon size={28} aria-hidden />
          </span>
          <div>
            <p className="font-medium text-fg">No boards hijacked yet</p>
            <p className="mt-1 text-sm text-muted">Pick a board, design an ad, and it shows up here.</p>
          </div>
          <Button onClick={onScout}>Scout boards</Button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {takeovers.map((t) => {
            const board = BOARDS.find((b) => b.id === t.boardId)
            if (!board) return null
            return (
              <li key={t.id}>
                <button type="button" onClick={() => onOpen(t)} className="group block w-full text-left">
                  <span className="relative block aspect-video overflow-hidden rounded-surface border border-line bg-ink-900 transition-colors group-hover:border-accent/50">
                    <img src={board.plate} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <BillboardFace plateSrc={board.plate} face={board.face} artUrl={t.artDataUrl} showArt />
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="truncate font-medium text-fg">{t.boardName}</span>
                    <time className="shrink-0 font-mono text-xs text-subtle" dateTime={new Date(t.createdAt).toISOString()}>
                      {new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </time>
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-xs text-muted">{t.slogan}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
