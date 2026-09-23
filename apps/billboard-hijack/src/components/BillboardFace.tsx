import { useEffect, useRef } from 'react'
import type { FaceQuad } from '../lib/drawQuadImage'
import {
  drawQuadImage,
  faceToCoverPixels,
  fillFaceQuad,
  strokeFaceBezel,
} from '../lib/drawQuadImage'

type Props = {
  plateSrc: string
  face: FaceQuad
  artUrl?: string | null
  /** When false, draw idle fill instead of art (still draws bezel). */
  showArt?: boolean
  idleLabel?: string
  className?: string
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`failed to load ${src}`))
    img.src = src
  })
}

/**
 * Canvas overlay that paints hijacked art into the board face quad
 * (full ad, perspective strip warp) and strokes a metal bezel.
 * Parent should be position:relative covering the plate image.
 */
export function BillboardFace({
  plateSrc,
  face,
  artUrl,
  showArt = true,
  idleLabel,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    let dead = false
    let plate: HTMLImageElement | null = null
    let art: HTMLImageElement | null = null

    const paint = () => {
      if (dead || !plate) return
      const rect = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const imgW = plate.naturalWidth || plate.width
      const imgH = plate.naturalHeight || plate.height
      if (!imgW || !imgH) return

      const dest = faceToCoverPixels(face, imgW, imgH, 0, 0, w, h)

      if (showArt && art && art.naturalWidth) {
        drawQuadImage(ctx, art, dest, 56)
      } else {
        fillFaceQuad(ctx, dest, 'rgba(8, 12, 16, 0.55)')
        if (idleLabel) {
          const cx = (dest.tl.x + dest.tr.x + dest.br.x + dest.bl.x) / 4
          const cy = (dest.tl.y + dest.tr.y + dest.br.y + dest.bl.y) / 4
          ctx.save()
          ctx.fillStyle = 'rgba(241, 238, 246, 0.8)'
          ctx.font = `500 ${Math.max(9, 11 * dpr)}px "Geist Mono Variable", ui-monospace, monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(idleLabel, cx, cy)
          ctx.restore()
        }
      }
      strokeFaceBezel(ctx, dest, Math.max(1.5, 2.2 * dpr))
    }

    const ro = new ResizeObserver(() => paint())
    ro.observe(parent)

    ;(async () => {
      try {
        plate = await loadImage(plateSrc)
        if (dead) return
        if (showArt && artUrl) {
          try {
            art = await loadImage(artUrl)
          } catch {
            art = null
          }
        }
        if (!dead) paint()
      } catch {
        /* plate missing */
      }
    })()

    return () => {
      dead = true
      ro.disconnect()
    }
  }, [plateSrc, face, artUrl, showArt, idleLabel])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
    />
  )
}
