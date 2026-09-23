import { AD_CANVAS } from '../data/boards'

export type TemplateId = 'blank' | 'headline' | 'wanted' | 'radio' | 'sale'

export const TEMPLATES: { id: TemplateId; name: string }[] = [
  { id: 'blank', name: 'Blank' },
  { id: 'headline', name: 'Headline' },
  { id: 'wanted', name: 'Wanted' },
  { id: 'radio', name: 'Radio spot' },
  { id: 'sale', name: 'Sale burst' },
]

const W = 1600
const H = 900
const DISPLAY = '"Barlow Condensed", "Arial Narrow", sans-serif'
const MONO = '"Geist Mono Variable", ui-monospace, monospace'

const INK = '#0b0a0f'
const FG = '#f1eef6'
const VICE = '#ff5c93'
const SODIUM = '#ff9a3d'
const LIVE = '#3fd9c0'

/** Break the slogan into at most two balanced lines. */
function splitLines(text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length < 3) return [text]
  let best = [text]
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    const diff = Math.abs(a.length - b.length)
    if (diff < bestDiff) {
      bestDiff = diff
      best = [a, b]
    }
  }
  return best
}

/** Largest font size (<= max) at which every line fits `maxWidth` and all lines fit `maxHeight`. */
function fitSize(ctx: CanvasRenderingContext2D, lines: string[], maxWidth: number, maxHeight: number, max: number, weight = 700) {
  let size = max
  while (size > 24) {
    ctx.font = `${weight} ${size}px ${DISPLAY}`
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width))
    if (widest <= maxWidth && lines.length * size * 0.92 <= maxHeight) break
    size -= 4
  }
  return size
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  centerY: number,
  size: number,
  align: CanvasTextAlign = 'center',
) {
  const lh = size * 0.92
  ctx.font = `700 ${size}px ${DISPLAY}`
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  const top = centerY - (lh * (lines.length - 1)) / 2
  lines.forEach((l, i) => ctx.fillText(l, x, top + i * lh))
}

function mono(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = 'left') {
  ctx.font = `500 ${size}px ${MONO}`
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}

function headline(ctx: CanvasRenderingContext2D, slogan: string) {
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#16121f')
  bg.addColorStop(1, INK)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = SODIUM
  ctx.fillRect(0, 230, W, 440)

  const lines = splitLines(slogan)
  ctx.fillStyle = INK
  drawLines(ctx, lines, W / 2, 450, fitSize(ctx, lines, W - 180, 400, 260))

  mono(ctx, 'LEONIDA OUTDOOR', 90, 120, 34, FG)
  mono(ctx, 'PAID FOR BY NOBODY', W - 90, 780, 30, 'rgba(241,238,246,0.6)', 'right')
}

function wanted(ctx: CanvasRenderingContext2D, slogan: string) {
  ctx.fillStyle = '#eadcbc'
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#2a2118'
  ctx.lineWidth = 14
  ctx.strokeRect(40, 40, W - 80, H - 80)
  ctx.lineWidth = 4
  ctx.strokeRect(66, 66, W - 132, H - 132)

  // Mugshot box with height lines and a silhouette.
  const bx = 120
  const by = 130
  const bw = 520
  const bh = 640
  ctx.fillStyle = '#d3c39f'
  ctx.fillRect(bx, by, bw, bh)
  ctx.strokeStyle = 'rgba(42,33,24,0.35)'
  ctx.lineWidth = 2
  for (let y = by + 60; y < by + bh; y += 80) {
    ctx.beginPath()
    ctx.moveTo(bx, y)
    ctx.lineTo(bx + bw, y)
    ctx.stroke()
  }
  ctx.fillStyle = '#2a2118'
  ctx.beginPath()
  ctx.arc(bx + bw / 2, by + 250, 110, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(bx + bw / 2, by + bh + 40, 230, 260, 0, Math.PI, 0)
  ctx.fill()
  ctx.strokeStyle = '#2a2118'
  ctx.lineWidth = 6
  ctx.strokeRect(bx, by, bw, bh)

  const cx = 1110
  ctx.fillStyle = '#2a2118'
  ctx.font = `700 230px ${DISPLAY}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('WANTED', cx, 240)
  ctx.font = `600 64px ${DISPLAY}`
  ctx.fillText('IN LEONIDA', cx, 380)

  ctx.fillRect(cx - 360, 440, 720, 6)
  const lines = splitLines(slogan)
  ctx.fillStyle = '#8c1d1d'
  drawLines(ctx, lines, cx, 590, fitSize(ctx, lines, 760, 220, 140))
  mono(ctx, 'REWARD · DO NOT APPROACH', cx, 760, 30, '#2a2118', 'center')
}

function radio(ctx: CanvasRenderingContext2D, slogan: string) {
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#2a0f3d')
  bg.addColorStop(1, '#0d0718')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Waveform bars along the bottom.
  const bars = 64
  const gap = W / bars
  for (let i = 0; i < bars; i++) {
    const t = i / bars
    const h = 40 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 220
    ctx.fillStyle = t < 0.5 ? VICE : LIVE
    ctx.globalAlpha = 0.35 + 0.4 * Math.abs(Math.sin(i * 0.4))
    ctx.fillRect(i * gap + 4, H - 60 - h, gap - 8, h)
  }
  ctx.globalAlpha = 1

  ctx.fillStyle = VICE
  ctx.font = `700 200px ${DISPLAY}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('104.7', 100, 280)
  const freqW = ctx.measureText('104.7').width
  ctx.fillStyle = FG
  ctx.font = `600 70px ${DISPLAY}`
  ctx.fillText('FM', 100 + freqW + 24, 280)
  mono(ctx, 'RADIO LEONIDA · ON AIR', 104, 110, 32, LIVE)

  ctx.fillStyle = LIVE
  ctx.beginPath()
  ctx.arc(W - 130, 110, 18, 0, Math.PI * 2)
  ctx.fill()

  const lines = splitLines(slogan)
  ctx.fillStyle = FG
  drawLines(ctx, lines, 100, 470, fitSize(ctx, lines, W - 200, 250, 170), 'left')
}

function sale(ctx: CanvasRenderingContext2D, slogan: string) {
  ctx.fillStyle = VICE
  ctx.fillRect(0, 0, W, H)

  const cx = 420
  const cy = 450
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, 2200, a, a + Math.PI / 24)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  const points = 22
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 330 : 270
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = '#ffd23f'
  ctx.fill()
  ctx.lineWidth = 10
  ctx.strokeStyle = INK
  ctx.stroke()

  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 150px ${DISPLAY}`
  ctx.fillText('100%', cx, cy - 50)
  ctx.font = `700 90px ${DISPLAY}`
  ctx.fillText('OFF', cx, cy + 60)
  mono(ctx, 'TODAY ONLY', cx, cy + 150, 30, INK, 'center')

  const lines = splitLines(slogan)
  const tx = 1210
  const size = fitSize(ctx, lines, 700, 520, 190)
  ctx.fillStyle = INK
  drawLines(ctx, lines, tx + 8, 458, size)
  ctx.fillStyle = FG
  drawLines(ctx, lines, tx, 450, size)
}

const PAINTERS: Record<Exclude<TemplateId, 'blank'>, (ctx: CanvasRenderingContext2D, slogan: string) => void> = {
  headline,
  wanted,
  radio,
  sale,
}

async function loadFonts() {
  if (!document.fonts) return
  await Promise.all([
    document.fonts.load(`700 100px ${DISPLAY}`),
    document.fonts.load(`600 100px ${DISPLAY}`),
    document.fonts.load(`500 40px ${MONO}`),
  ]).catch(() => undefined)
}

/** Render every template for `slogan` as a 1600x900 PNG data URL. `blank` is the stock ad canvas. */
export async function renderTemplates(slogan: string): Promise<Record<TemplateId, string>> {
  await loadFonts()
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const out = { blank: AD_CANVAS } as Record<TemplateId, string>
  for (const [id, paint] of Object.entries(PAINTERS) as [Exclude<TemplateId, 'blank'>, typeof headline][]) {
    if (!ctx) {
      out[id] = AD_CANVAS
      continue
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, W, H)
    paint(ctx, slogan.toUpperCase())
    out[id] = canvas.toDataURL('image/png')
  }
  return out
}
