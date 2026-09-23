import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SiteBar } from '@leonida/ui'
import { Stepper, type StepId } from './components/Stepper'
import { ProofCard } from './components/ProofCard'
import { Scout } from './screens/Scout'
import { Design } from './screens/Design'
import { Live } from './screens/Live'
import { Gallery } from './screens/Gallery'
import { BOARDS, type Board } from './data/boards'
import { loadTakeovers, saveTakeovers, type Takeover } from './lib/storage'

export default function App() {
  const [screen, setScreen] = useState<StepId>('scout')
  const [board, setBoard] = useState<Board>(BOARDS[0])
  const [slogans, setSlogans] = useState<Record<string, string>>({})
  const [takeovers, setTakeovers] = useState<Takeover[]>(() => loadTakeovers())
  const [justWentLive, setJustWentLive] = useState(false)
  const [showProof, setShowProof] = useState(false)

  const takeover = useMemo(
    () => takeovers.find((t) => t.boardId === board.id) ?? null,
    [board, takeovers],
  )
  const slogan = slogans[board.id] ?? takeover?.slogan ?? board.slogans[0]

  function go(next: StepId) {
    setJustWentLive(false)
    setScreen(next)
    window.scrollTo({ top: 0 })
  }

  function onSaved(result: { dataUrl: string }) {
    const item: Takeover = {
      id: `${board.id}-${Date.now()}`,
      boardId: board.id,
      boardName: board.name,
      artDataUrl: result.dataUrl,
      slogan,
      createdAt: Date.now(),
    }
    const next = [item, ...takeovers.filter((t) => t.boardId !== board.id)]
    setTakeovers(next)
    saveTakeovers(next)
    setScreen('proof')
    setJustWentLive(true)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-ink-950">
      <SiteBar current="hijack" />

      <div className="sticky top-14 z-20 border-b border-line bg-ink-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-2.5 md:flex-row md:items-center md:justify-between md:px-6">
          <h1 className="type-display whitespace-nowrap text-2xl text-fg">Billboard Hijack</h1>
          <Stepper
            current={screen}
            reachable={{ scout: true, editor: true, proof: !!takeover, gallery: true }}
            onGo={go}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={screen}
          className="flex flex-1 flex-col"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {screen === 'scout' && (
            <Scout
              board={board}
              takeovers={takeovers}
              slogan={slogan}
              onSelect={setBoard}
              onSlogan={(s) => setSlogans((prev) => ({ ...prev, [board.id]: s }))}
              onDesign={() => go('editor')}
              onView={() => go('proof')}
            />
          )}
          {screen === 'editor' && (
            <Design board={board} slogan={slogan} onSaved={onSaved} onBack={() => go('scout')} />
          )}
          {screen === 'proof' && takeover && (
            <Live
              board={board}
              art={takeover.artDataUrl}
              slogan={takeover.slogan}
              justWentLive={justWentLive}
              onHijackAnother={() => {
                const open = BOARDS.find((b) => !takeovers.some((t) => t.boardId === b.id))
                if (open) setBoard(open)
                go('scout')
              }}
              onReEdit={() => go('editor')}
              onProofCard={() => setShowProof(true)}
            />
          )}
          {screen === 'gallery' && (
            <Gallery
              takeovers={takeovers}
              onScout={() => go('scout')}
              onOpen={(t) => {
                const b = BOARDS.find((x) => x.id === t.boardId)
                if (!b) return
                setBoard(b)
                go('proof')
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="mt-auto border-t border-line">
        <p className="mx-auto max-w-[1400px] px-4 py-5 text-xs text-subtle md:px-6">
          Fan parody on fictional Leonida plates. Not affiliated with any game studio.
        </p>
      </footer>

      <ProofCard
        board={board}
        artDataUrl={takeover?.artDataUrl ?? null}
        open={showProof}
        onClose={() => setShowProof(false)}
      />
    </div>
  )
}
