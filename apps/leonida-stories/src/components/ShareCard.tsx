import { useEffect, useState } from 'react'
import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { Button, Sheet } from '@leonida/ui'
import type { StoryPost } from '../lib/storage'
import { downloadDataUrl } from '../lib/storage'

type Props = {
  post: StoryPost | null
  open: boolean
  onClose: () => void
}

const W = 720
const H = 1280
const INK = '#0b0a0f'
const FG = '#f1eef6'
const MUTED = '#a39fb0'
const VICE = '#ff5c93'

export function ShareCard({ post, open, onClose }: Props) {
  const [cardUrl, setCardUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !post) return
    let dead = false
    setCardUrl(null)
    renderCard(post).then((url) => {
      if (!dead) setCardUrl(url)
    })
    return () => {
      dead = true
    }
  }, [open, post])

  return (
    <Sheet
      open={open}
      onClose={onClose}
      contained
      title="Share card"
      description="A 9:16 PNG of your story, ready to post anywhere."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            disabled={!cardUrl}
            onClick={() => cardUrl && downloadDataUrl(cardUrl, 'leonida-story.png')}
            icon={<DownloadSimpleIcon size={18} weight="bold" aria-hidden />}
          >
            Download PNG
          </Button>
        </>
      }
    >
      <div className="mx-auto aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-control bg-ink-800">
        {cardUrl ? (
          <img src={cardUrl} alt="Share card preview" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full animate-pulse bg-ink-700" aria-label="Rendering share card" />
        )}
      </div>
    </Sheet>
  )
}

async function renderCard(post: StoryPost): Promise<string> {
  await Promise.all([
    document.fonts.load('700 56px "Barlow Condensed"'),
    document.fonts.load('600 32px "Geist Variable"'),
    document.fonts.load('400 22px "Geist Mono Variable"'),
  ]).catch(() => undefined)

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = reject
    el.src = post.imageDataUrl
  })

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = INK
  ctx.fillRect(0, 0, W, H)

  const pad = 48
  const iw = W - pad * 2
  const ih = Math.round(iw * 1.25)
  ctx.save()
  roundRect(ctx, pad, pad, iw, ih, 24)
  ctx.clip()
  drawCover(ctx, img, pad, pad, iw, ih)
  ctx.restore()

  let y = pad + ih + 64
  ctx.fillStyle = FG
  ctx.font = '600 32px "Geist Variable", system-ui, sans-serif'
  ctx.fillText(post.handle, pad, y)
  y += 38
  ctx.fillStyle = MUTED
  ctx.font = '400 24px "Geist Variable", system-ui, sans-serif'
  ctx.fillText(post.location, pad, y)
  y += 56
  ctx.fillStyle = FG
  ctx.font = '400 28px "Geist Variable", system-ui, sans-serif'
  for (const line of wrap(ctx, post.caption, iw).slice(0, 2)) {
    ctx.fillText(line, pad, y)
    y += 38
  }

  ctx.fillStyle = VICE
  ctx.font = '700 56px "Barlow Condensed", "Arial Narrow", sans-serif'
  ctx.fillText('LEONIDA STORIES', pad, H - 100)
  ctx.fillStyle = MUTED
  ctx.font = '400 22px "Geist Mono Variable", ui-monospace, monospace'
  ctx.fillText('#BuiltWithImageEditor', pad, H - 56)

  return canvas.toDataURL('image/png')
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > max && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const ir = img.width / img.height
  const tr = w / h
  let sx = 0
  let sy = 0
  let sw = img.width
  let sh = img.height
  if (ir > tr) {
    sw = img.height * tr
    sx = (img.width - sw) / 2
  } else {
    sh = img.width / tr
    sy = (img.height - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}
