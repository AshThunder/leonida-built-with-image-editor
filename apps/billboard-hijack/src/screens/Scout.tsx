import { useId, useRef, type KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { EyeIcon, MapPinIcon, PaintBrushIcon } from '@phosphor-icons/react'
import { Button } from '@leonida/ui'
import { BOARDS, type Board } from '../data/boards'
import type { Takeover } from '../lib/storage'
import { BillboardFace } from '../components/BillboardFace'

export function Scout({
  board,
  takeovers,
  slogan,
  onSelect,
  onSlogan,
  onDesign,
  onView,
}: {
  board: Board
  takeovers: Takeover[]
  slogan: string
  onSelect: (b: Board) => void
  onSlogan: (s: string) => void
  onDesign: () => void
  onView: () => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const sloganName = useId()
  const taken = takeovers.find((t) => t.boardId === board.id)
  const openCount = BOARDS.filter((b) => !takeovers.some((t) => t.boardId === b.id)).length

  const onListKey = (e: KeyboardEvent) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const i = BOARDS.findIndex((b) => b.id === board.id)
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
    const next = BOARDS[(i + step + BOARDS.length) % BOARDS.length]
    onSelect(next)
    listRef.current?.querySelector<HTMLElement>(`[data-board="${next.id}"]`)?.focus()
  }

  return (
    <main className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 py-5 md:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-10 lg:py-8">
      <section aria-labelledby="boards-title" className="min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="boards-title" className="type-display text-3xl text-fg">
            Boards
          </h2>
          <p className="font-mono text-xs text-muted">
            {openCount} of {BOARDS.length} open
          </p>
        </div>

        <div
          ref={listRef}
          role="radiogroup"
          aria-labelledby="boards-title"
          onKeyDown={onListKey}
          className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:max-h-[calc(100dvh-14rem)] lg:flex-col lg:gap-1 lg:overflow-x-hidden lg:overflow-y-auto lg:px-0"
        >
          {BOARDS.map((b) => {
            const selected = b.id === board.id
            const isTaken = takeovers.some((t) => t.boardId === b.id)
            return (
              <button
                key={b.id}
                type="button"
                role="radio"
                data-board={b.id}
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => onSelect(b)}
                className={`relative flex w-[62%] shrink-0 snap-start flex-col gap-2 rounded-surface border p-2 text-left transition-colors sm:w-[38%] md:w-[28%] lg:w-full lg:flex-row lg:items-center lg:rounded-control ${
                  selected
                    ? 'border-accent/60 bg-ink-850'
                    : 'border-line bg-ink-900 hover:border-line-strong lg:border-transparent lg:bg-transparent lg:hover:bg-ink-900'
                }`}
              >
                <img
                  src={b.plate}
                  alt=""
                  className="aspect-video w-full rounded-[8px] object-cover lg:w-24"
                />
                <span className="min-w-0 flex-1 px-1 pb-1 lg:p-0">
                  <span className="block truncate font-medium text-fg">{b.name}</span>
                  <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
                    <MapPinIcon size={12} aria-hidden />
                    {b.district}
                  </span>
                </span>
                <span
                  className={`absolute right-3 top-3 rounded-full px-2 py-0.5 font-mono text-[11px] lg:static lg:mr-1 ${
                    isTaken ? 'bg-live/15 text-live' : 'bg-ink-950/80 text-muted lg:bg-ink-800'
                  }`}
                >
                  {isTaken ? 'Live' : 'Open'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <motion.section
        key={board.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        aria-labelledby="board-title"
        className="min-w-0"
      >
        <div className="relative aspect-video overflow-hidden rounded-surface border border-line bg-ink-900">
          <img src={board.plate} alt={`${board.name}, ${board.lighting}`} className="absolute inset-0 h-full w-full object-cover" />
          <BillboardFace
            plateSrc={board.plate}
            face={board.face}
            artUrl={taken?.artDataUrl}
            showArt={!!taken}
            idleLabel={taken ? undefined : 'YOUR AD HERE'}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            <h2 id="board-title" className="type-display text-4xl text-fg md:text-5xl">
              {board.name}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {board.district}. {board.lighting}.
            </p>

            <fieldset className="mt-5">
              <legend className="text-sm font-medium text-fg">Slogan</legend>
              <p className="mt-1 text-xs text-muted">Pick a seed. You paint it onto the ad in the editor.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {board.slogans.map((s) => (
                  <label
                    key={s}
                    className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                      slogan === s
                        ? 'border-accent bg-accent/15 text-fg'
                        : 'border-line-strong text-muted hover:text-fg'
                    }`}
                  >
                    <input
                      type="radio"
                      name={sloganName}
                      value={s}
                      checked={slogan === s}
                      onChange={() => onSlogan(s)}
                      className="sr-only"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            {taken && (
              <Button variant="secondary" size="lg" onClick={onView} icon={<EyeIcon size={18} aria-hidden />}>
                View live
              </Button>
            )}
            <Button size="lg" onClick={onDesign} icon={<PaintBrushIcon size={18} weight="fill" aria-hidden />}>
              {taken ? 'Redesign' : 'Design takeover'}
            </Button>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
