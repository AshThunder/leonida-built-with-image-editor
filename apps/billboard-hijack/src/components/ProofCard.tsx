import { useEffect, useState } from 'react'
import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { Button, Sheet } from '@leonida/ui'
import type { Board } from '../data/boards'
import {
  coverSourceRect,
  drawQuadImage,
  faceToCoverPixels,
  strokeFaceBezel,
} from '../lib/drawQuadImage'
import { downloadDataUrl } from '../lib/storage'

type Props = {
  board: Board
  artDataUrl: string | null
  open: boolean
  onClose: () => void
}

const W = 1280
const H = 720
const INK = '#0b0a0f'
const FG = '#f1eef6'
const MUTED = '#a39fb0'
const SODIUM = '#ff9a3d'

type Layout = 'proof' | 'board'

const LAYOUTS: Record<Layout, { label: string; description: string; alt: string; file: string }> = {
  proof: {
    label: 'Before + after',
    description: 'Before and after, side by side, as a 16:9 PNG.',
    alt: 'Before and after proof',
    file: 'proof',
  },
  board: {
    label: 'Board only',
    description: 'Just the hijacked board, full size, as a 16:9 PNG.',
    alt: 'The hijacked board',
    file: 'board',
  },
}

export function ProofCard({ board, artDataUrl, open, onClose }: Props) {
  const [layout, setLayout] = useState<Layout>('proof')
  const [urls, setUrls] = useState<Record<Layout, string> | null>(null)

  useEffect(() => {
    if (!open || !artDataUrl) return
    let dead = false
    setUrls(null)
    Promise.all([renderProof(board, artDataUrl), renderBoard(board, artDataUrl)]).then(([proof, boardOnly]) => {
      if (!dead) setUrls({ proof, board: boardOnly })
    })
    return () => {
      dead = true
    }
  }, [open, board, artDataUrl])

  const url = urls?.[layout] ?? null
  const meta = LAYOUTS[layout]

  return (
    <Sheet
      open={open}
      onClose={onClose}
      size="lg"
      title="Proof card"
      description={meta.description}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            disabled={!url}
            onClick={() => url && downloadDataUrl(url, `billboard-hijack-${board.id}-${meta.file}.png`)}
            icon={<DownloadSimpleIcon size={18} weight="bold" aria-hidden />}
          >
            Download PNG
          </Button>
        </>
      }
    >
      <div role="group" aria-label="Proof layout" className="mb-3 inline-flex rounded-full border border-line bg-ink-900 p-1">
        {(Object.keys(LAYOUTS) as Layout[]).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={layout === id}
            onClick={() => setLayout(id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              layout === id ? 'bg-accent text-ink-950' : 'text-fg/75 hover:text-fg'
            }`}
          >
            {LAYOUTS[id].label}
          </button>
        ))}
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-control bg-ink-800">
        {url ? (
          <img src={url} alt={meta.alt} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full animate-pulse bg-ink-700" aria-label="Rendering proof card" />
        )}
      </div>
    </Sheet>
  )
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** The plate at its native size with the art on the face. */
async function renderBoard(board: Board, artDataUrl: string): Promise<string> {
  const [plate, art] = await Promise.all([loadImage(board.plate), loadImage(artDataUrl)])
  const w = plate.naturalWidth
  const h = plate.naturalHeight
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(plate, 0, 0, w, h)
  const dest = faceToCoverPixels(board.face, w, h, 0, 0, w, h)
  drawQuadImage(ctx, art, dest, 64)
  strokeFaceBezel(ctx, dest, 2.5)
  return canvas.toDataURL('image/png')
}

async function renderProof(board: Board, artDataUrl: string): Promise<string> {
  await Promise.all([
    document.fonts.load('700 40px "Barlow Condensed"'),
    document.fonts.load('500 18px "Geist Mono Variable"'),
  ]).catch(() => undefined)
  const [plate, art] = await Promise.all([loadImage(board.plate), loadImage(artDataUrl)])

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = INK
  ctx.fillRect(0, 0, W, H)

  const pad = 40
  const gap = 24
  const panelW = (W - pad * 2 - gap) / 2
  const panelH = Math.round(panelW * (9 / 16))
  const panelY = 120
  const beforeX = pad
  const afterX = pad + panelW + gap

  const drawCover = (x: number) => {
    const { sx, sy, sw, sh } = coverSourceRect(plate.width, plate.height, panelW, panelH)
    ctx.drawImage(plate, sx, sy, sw, sh, x, panelY, panelW, panelH)
  }
  drawCover(beforeX)
  drawCover(afterX)

  const dest = faceToCoverPixels(board.face, plate.naturalWidth, plate.naturalHeight, afterX, panelY, panelW, panelH)
  drawQuadImage(ctx, art, dest, 64)
  strokeFaceBezel(ctx, dest, 2.5)

  ctx.fillStyle = FG
  ctx.font = '700 56px "Barlow Condensed", "Arial Narrow", sans-serif'
  ctx.fillText(board.name.toUpperCase(), pad, 78)

  ctx.font = '500 18px "Geist Mono Variable", ui-monospace, monospace'
  ctx.fillStyle = MUTED
  ctx.fillText('BEFORE', beforeX, panelY + panelH + 36)
  ctx.fillStyle = SODIUM
  ctx.fillText('AFTER', afterX, panelY + panelH + 36)

  ctx.fillStyle = MUTED
  ctx.fillText(board.district.toUpperCase(), pad, H - 44)
  ctx.textAlign = 'right'
  ctx.fillText('BILLBOARD HIJACK  #BuiltWithImageEditor', W - pad, H - 44)

  return canvas.toDataURL('image/png')
}
