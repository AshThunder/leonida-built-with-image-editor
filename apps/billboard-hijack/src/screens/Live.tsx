import { ArrowCounterClockwiseIcon, DownloadSimpleIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { Button } from '@leonida/ui'
import type { Board } from '../data/boards'
import { BeforeAfter } from '../components/BeforeAfter'

export function Live({
  board,
  art,
  slogan,
  justWentLive,
  onHijackAnother,
  onReEdit,
  onProofCard,
}: {
  board: Board
  art: string
  slogan: string
  justWentLive: boolean
  onHijackAnother: () => void
  onReEdit: () => void
  onProofCard: () => void
}) {
  return (
    <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 px-4 py-5 md:px-6 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-live">
            <span aria-hidden className="h-2 w-2 rounded-full bg-live" />
            Signal overridden
          </p>
          <h2 className="type-display mt-2 text-4xl text-fg md:text-5xl">{board.name}</h2>
          <p className="mt-1 text-sm text-muted">
            {board.district}. Running <span className="font-mono text-fg">{slogan}</span>
          </p>
        </div>
        <Button onClick={onProofCard} size="lg" icon={<DownloadSimpleIcon size={18} weight="bold" aria-hidden />}>
          Proof card
        </Button>
      </div>

      <BeforeAfter key={art} board={board} art={art} reveal={justWentLive} />

      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={onReEdit} icon={<PencilSimpleIcon size={16} aria-hidden />}>
          Edit art
        </Button>
        <Button variant="secondary" onClick={onHijackAnother} icon={<ArrowCounterClockwiseIcon size={16} aria-hidden />}>
          Hijack another
        </Button>
      </div>
    </main>
  )
}
