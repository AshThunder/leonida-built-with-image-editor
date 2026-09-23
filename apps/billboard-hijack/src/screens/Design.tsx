import { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { Button, LeonidaEditor, type LeonidaEditorInstance } from '@leonida/ui'
import type { Board } from '../data/boards'
import { AD_CANVAS } from '../data/boards'
import { BillboardFace } from '../components/BillboardFace'
import { TEMPLATES, renderTemplates, type TemplateId } from '../lib/adTemplates'

const TIPS = [
  'Set the slogan huge with the Text tool.',
  'Add a shape behind it so it reads from the road.',
  'Tag a corner with Draw or a sticker.',
  'Save. The art is warped onto the board face.',
]

const POLL_MS = 1000

function confirmDiscard(editor: LeonidaEditorInstance | null) {
  return !editor?.hasChanges() || window.confirm('Discard your current edits?')
}

/** Cover-crop an uploaded file to the 1600x900 ad canvas so it maps onto the face without stretching. */
function fileToAdCanvas(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const W = 1600
      const H = 900
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('no canvas'))
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('unreadable image'))
    }
    img.src = url
  })
}

export function Design({
  board,
  slogan,
  onSaved,
  onBack,
}: {
  board: Board
  slogan: string
  onSaved: (r: { dataUrl: string }) => void
  onBack: () => void
}) {
  const editorRef = useRef<LeonidaEditorInstance | null>(null)
  const [source, setSource] = useState({ image: AD_CANVAS, run: 0 })
  const image = source.image
  // A new start image remounts the editor; swapping the prop while it is still loading can be dropped.
  const setImage = (url: string) => setSource((s) => ({ image: url, run: s.run + 1 }))
  const [templateId, setTemplateId] = useState<TemplateId | 'upload'>('blank')
  const [upload, setUpload] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploadError, setUploadError] = useState(false)
  const [templates, setTemplates] = useState<Record<TemplateId, string> | null>(null)
  const [liveArt, setLiveArt] = useState(AD_CANVAS)

  useEffect(() => {
    let dead = false
    renderTemplates(slogan).then((t) => {
      if (!dead) setTemplates(t)
    })
    return () => {
      dead = true
    }
  }, [slogan])

  useEffect(() => {
    let last = image
    const id = window.setInterval(() => {
      const editor = editorRef.current
      if (!editor || document.hidden) return
      const next = editor.hasChanges() ? editor.getImage() : image
      if (next && next !== last) {
        last = next
        setLiveArt(next)
      }
    }, POLL_MS)
    return () => window.clearInterval(id)
  }, [image])

  function pickTemplate(id: TemplateId) {
    const url = templates?.[id] ?? (id === 'blank' ? AD_CANVAS : null)
    if (!url || !confirmDiscard(editorRef.current)) return
    setTemplateId(id)
    setLiveArt(url)
    setImage(url)
  }

  async function pickUpload(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError(true)
      return
    }
    if (!confirmDiscard(editorRef.current)) return
    try {
      const url = await fileToAdCanvas(file)
      setUploadError(false)
      setUpload(url)
      setTemplateId('upload')
      setLiveArt(url)
      setImage(url)
    } catch {
      setUploadError(true)
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-4 py-5 md:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-8 lg:py-6">
      <section aria-labelledby="live-title" className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 id="live-title" className="type-label flex items-center gap-2 text-fg">
              <span aria-hidden className="h-2 w-2 rounded-full bg-live motion-safe:animate-pulse" />
              Live on board
            </h2>
            <span className="truncate font-mono text-xs text-muted">{board.name}</span>
          </div>
          <div className="relative mt-2 aspect-video overflow-hidden rounded-surface border border-line bg-ink-900">
            <img src={board.plate} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <BillboardFace plateSrc={board.plate} face={board.face} artUrl={liveArt} />
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-fg">Start from</legend>
          <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            {TEMPLATES.map((t) => {
              const src = templates?.[t.id] ?? (t.id === 'blank' ? AD_CANVAS : undefined)
              const active = templateId === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  disabled={!src}
                  onClick={() => pickTemplate(t.id)}
                  className={`flex w-28 shrink-0 flex-col gap-1.5 rounded-control border p-1.5 text-left transition-colors disabled:opacity-50 lg:w-auto ${
                    active ? 'border-accent/70 bg-ink-850' : 'border-line bg-ink-900 hover:border-line-strong'
                  }`}
                >
                  <span className="block aspect-video w-full overflow-hidden rounded-[6px] bg-ink-800">
                    {src && <img src={src} alt="" className="h-full w-full object-cover" />}
                  </span>
                  <span className="truncate px-0.5 text-xs text-fg">{t.name}</span>
                </button>
              )
            })}
            <label
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                void pickUpload(e.dataTransfer.files[0])
              }}
              className={`flex w-28 shrink-0 cursor-pointer flex-col gap-1.5 rounded-control border p-1.5 text-left transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent lg:w-auto ${
                templateId === 'upload' || dragging
                  ? 'border-accent/70 bg-ink-850'
                  : 'border-dashed border-line-strong bg-ink-900 hover:border-accent/50'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  void pickUpload(e.currentTarget.files?.[0])
                  e.currentTarget.value = ''
                }}
              />
              <span className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-[6px] bg-ink-800 text-muted">
                {upload ? (
                  <img src={upload} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UploadSimpleIcon size={20} aria-hidden />
                )}
              </span>
              <span className="truncate px-0.5 text-xs text-fg">{upload ? 'Replace image' : 'Your image'}</span>
            </label>
          </div>
          <p role="status" className={`mt-2 text-xs ${uploadError ? 'text-danger' : 'text-muted'}`}>
            {uploadError ? 'That file could not be read. Try a JPG or PNG.' : 'Upload or drop a photo to use as your ad.'}
          </p>
        </fieldset>
      </section>

      <div className="min-w-0 overflow-hidden rounded-surface border border-line bg-ink-900 lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <LeonidaEditor
          key={source.run}
          image={image}
          onReady={(e) => {
            editorRef.current = e
          }}
          onSaved={onSaved}
          onCancel={onBack}
          minHeight="620px"
        />
      </div>

      <aside className="flex flex-col gap-5 lg:col-start-2 lg:row-start-2">
        <div className="rounded-surface border border-line bg-ink-900 p-4">
          <p className="text-sm text-muted">Your slogan</p>
          <p className="type-display mt-1 text-3xl text-accent">{slogan}</p>
        </div>

        <ol className="flex flex-col gap-3 text-sm text-fg/90">
          {TIPS.map((tip, i) => (
            <li key={tip} className="flex gap-3">
              <span
                aria-hidden
                className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[11px] text-muted"
              >
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ol>

        <Button variant="ghost" onClick={onBack} icon={<ArrowLeftIcon size={16} aria-hidden />} className="self-start">
          Back to boards
        </Button>
      </aside>
    </main>
  )
}
