/** Perspective-ish warp: draw an image into a destination quad on Canvas2D. */

export type Pt = { x: number; y: number }

export type FaceQuad = {
  tl: Pt
  tr: Pt
  br: Pt
  bl: Pt
}

export function dist(a: Pt, b: Pt): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

/** Average width/height of a quad in the same units as its points. */
export function quadSize(q: FaceQuad): { w: number; h: number } {
  const w = (dist(q.tl, q.tr) + dist(q.bl, q.br)) / 2
  const h = (dist(q.tl, q.bl) + dist(q.tr, q.br)) / 2
  return { w, h }
}

export function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

/** Convert face % (0–100 of plate image) → pixel points inside a cover-fitted box. */
export function faceToCoverPixels(
  face: FaceQuad,
  imgW: number,
  imgH: number,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
): FaceQuad {
  const scale = Math.max(boxW / imgW, boxH / imgH)
  const dispW = imgW * scale
  const dispH = imgH * scale
  const ox = boxX + (boxW - dispW) / 2
  const oy = boxY + (boxH - dispH) / 2
  const map = (p: Pt): Pt => ({
    x: ox + (p.x / 100) * imgW * scale,
    y: oy + (p.y / 100) * imgH * scale,
  })
  return { tl: map(face.tl), tr: map(face.tr), br: map(face.br), bl: map(face.bl) }
}

/** object-fit:cover source rect for drawing `img` into box (w×h). */
export function coverSourceRect(
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number,
): { sx: number; sy: number; sw: number; sh: number } {
  const ir = imgW / imgH
  const tr = boxW / boxH
  if (ir > tr) {
    const sw = imgH * tr
    return { sx: (imgW - sw) / 2, sy: 0, sw, sh: imgH }
  }
  const sh = imgW / tr
  return { sx: 0, sy: (imgH - sh) / 2, sw: imgW, sh }
}

function imageSize(img: CanvasImageSource): { w: number; h: number } {
  if (img instanceof HTMLImageElement) {
    return { w: img.naturalWidth || img.width, h: img.naturalHeight || img.height }
  }
  if (img instanceof HTMLCanvasElement) {
    return { w: img.width, h: img.height }
  }
  if (typeof ImageBitmap !== 'undefined' && img instanceof ImageBitmap) {
    return { w: img.width, h: img.height }
  }
  const any = img as { width: number; height: number }
  return { w: any.width, h: any.height }
}

/**
 * Draw the whole of `img` onto the destination quad, the way a printed ad
 * covers a board: nothing is cropped, and columns follow the perspective so
 * the far side of the face is foreshortened.
 */
export function drawQuadImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  dest: FaceQuad,
  strips = 48,
): void {
  const { w: dw, h: dh } = quadSize(dest)
  if (dw < 1 || dh < 1) return

  const { w: iw, h: ih } = imageSize(img)
  if (!iw || !ih) return

  const sx = 0
  const sy = 0
  const sw = iw
  const sh = ih
  const n = Math.max(8, Math.min(96, Math.round(strips)))
  const h = computeHomography(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    [dest.tl, dest.tr, dest.br, dest.bl],
  )
  const at = (u: number, v: number): Pt => {
    const w = h[6] * u + h[7] * v + h[8]
    return { x: (h[0] * u + h[1] * v + h[2]) / w, y: (h[3] * u + h[4] * v + h[5]) / w }
  }

  for (let i = 0; i < n; i++) {
    const u0 = i / n
    const u1 = (i + 1) / n
    const srcX = sx + sw * u0
    const baseW = sw / n
    const top0 = at(u0, 0)
    const top1 = at(u1, 0)
    const bot0 = at(u0, 1)
    const bot1 = at(u1, 1)

    // Affine: local (0,0)→top0, (baseW,0)→top1, (0,sh)→bot0
    const a = (top1.x - top0.x) / baseW
    const b = (top1.y - top0.y) / baseW
    const c = (bot0.x - top0.x) / sh
    const d = (bot0.y - top0.y) / sh

    // Each strip runs ~1px under the next one. Without the overlap, two
    // anti-aliased edges share the seam pixel and the plate shows through.
    const last = i === n - 1
    const seam = last ? 0 : 1
    const srcW = last ? baseW : Math.min(baseW + seam / Math.max(0.01, Math.abs(a)), sx + sw - srcX)

    ctx.save()
    // The affine strip follows the top edge's slope; clip it to the true strip
    // so the art cannot spill past the face's bottom edge.
    ctx.beginPath()
    ctx.moveTo(top0.x, top0.y)
    ctx.lineTo(top1.x + seam, top1.y)
    ctx.lineTo(bot1.x + seam, bot1.y)
    ctx.lineTo(bot0.x, bot0.y)
    ctx.closePath()
    ctx.clip()
    ctx.setTransform(a, b, c, d, top0.x, top0.y)
    ctx.drawImage(img, srcX, sy, srcW, sh, 0, 0, srcW, sh)
    ctx.restore()
  }
}

/** Stroke a thin metal bezel along the quad edges. */
export function strokeFaceBezel(
  ctx: CanvasRenderingContext2D,
  dest: FaceQuad,
  lineWidth = 2.5,
): void {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(dest.tl.x, dest.tl.y)
  ctx.lineTo(dest.tr.x, dest.tr.y)
  ctx.lineTo(dest.br.x, dest.br.y)
  ctx.lineTo(dest.bl.x, dest.bl.y)
  ctx.closePath()
  ctx.strokeStyle = 'rgba(26, 34, 40, 0.95)'
  ctx.lineWidth = lineWidth + 1.5
  ctx.lineJoin = 'round'
  ctx.stroke()
  ctx.strokeStyle = 'rgba(180, 196, 208, 0.55)'
  ctx.lineWidth = lineWidth
  ctx.stroke()
  ctx.strokeStyle = 'rgba(34, 240, 255, 0.28)'
  ctx.lineWidth = Math.max(1, lineWidth * 0.45)
  ctx.stroke()
  ctx.restore()
}

/** Fill the face quad (e.g. dark idle inventory). */
export function fillFaceQuad(
  ctx: CanvasRenderingContext2D,
  dest: FaceQuad,
  fillStyle: string,
): void {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(dest.tl.x, dest.tl.y)
  ctx.lineTo(dest.tr.x, dest.tr.y)
  ctx.lineTo(dest.br.x, dest.br.y)
  ctx.lineTo(dest.bl.x, dest.bl.y)
  ctx.closePath()
  ctx.fillStyle = fillStyle
  ctx.fill()
  ctx.restore()
}

/** CSS clip-path polygon from face % of the containing box. */
export function faceClipPath(face: FaceQuad): string {
  const p = (pt: Pt) => `${pt.x}% ${pt.y}%`
  return `polygon(${p(face.tl)}, ${p(face.tr)}, ${p(face.br)}, ${p(face.bl)})`
}

/**
 * Projective matrix3d mapping element local (0..elW)×(0..elH) onto quad points
 * in the parent’s coordinate space (same units as the quad).
 */
export function quadMatrix3d(q: FaceQuad, elW: number, elH: number): string {
  const src: Pt[] = [
    { x: 0, y: 0 },
    { x: elW, y: 0 },
    { x: elW, y: elH },
    { x: 0, y: elH },
  ]
  const dst = [q.tl, q.tr, q.br, q.bl]
  const [h00, h01, h02, h10, h11, h12, h20, h21, h22] = computeHomography(src, dst)
  return `matrix3d(${h00},${h10},0,${h20},${h01},${h11},0,${h21},0,0,1,0,${h02},${h12},0,${h22})`
}

function computeHomography(
  src: Pt[],
  dst: Pt[],
): [number, number, number, number, number, number, number, number, number] {
  const A: number[][] = []
  for (let i = 0; i < 4; i++) {
    const { x, y } = src[i]
    const { x: u, y: v } = dst[i]
    A.push([-x, -y, -1, 0, 0, 0, x * u, y * u, u])
    A.push([0, 0, 0, -x, -y, -1, x * v, y * v, v])
  }
  const B = A.map((row) => row.slice(0, 8))
  const rhs = A.map((row) => -row[8])
  const sol = solveLinear(B, rhs)
  return [...sol, 1] as [number, number, number, number, number, number, number, number, number]
}

function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length
  const M = A.map((row, i) => [...row, b[i]])
  for (let col = 0; col < n; col++) {
    let piv = col
    for (let i = col + 1; i < n; i++) {
      if (Math.abs(M[i][col]) > Math.abs(M[piv][col])) piv = i
    }
    ;[M[col], M[piv]] = [M[piv], M[col]]
    const div = M[col][col] || 1e-12
    for (let j = col; j <= n; j++) M[col][j] /= div
    for (let i = 0; i < n; i++) {
      if (i === col) continue
      const f = M[i][col]
      for (let j = col; j <= n; j++) M[i][j] -= f * M[col][j]
    }
  }
  return M.map((row) => row[n])
}
