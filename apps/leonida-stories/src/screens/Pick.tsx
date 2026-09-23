import { useState } from 'react'
import { ShuffleIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { Button } from '@leonida/ui'
import { SCENES, type Scene } from '../data/scenes'
import { FlowHeader } from '../components/FlowHeader'

export function Pick({
  onBack,
  onPick,
  onUpload,
}: {
  onBack: () => void
  onPick: (s: Scene) => void
  onUpload: (f: File) => void
}) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accept = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image. Try a JPG or PNG.')
      return
    }
    setError(null)
    onUpload(file)
  }

  return (
    <div className="flex h-full flex-col">
      <FlowHeader title="New story" step={0} onBack={onBack} backLabel="Back to feed" />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
        <label
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            accept(e.dataTransfer.files?.[0])
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-surface border border-dashed p-4 transition-colors focus-within:border-accent ${
            dragging ? 'border-accent bg-accent/10' : 'border-line-strong hover:bg-white/[0.03]'
          }`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-ink-800 text-fg">
            <UploadSimpleIcon size={22} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-fg">Upload a photo</span>
            <span className="block text-xs text-muted">or drop one here. Tall shots work best.</span>
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => accept(e.target.files?.[0])}
          />
        </label>
        {error && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-fg">Leonida scenes</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={<ShuffleIcon size={16} aria-hidden />}
            onClick={() => onPick(SCENES[Math.floor(Math.random() * SCENES.length)])}
          >
            Random
          </Button>
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4">
          {SCENES.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => onPick(s)} className="group block w-full text-left">
                <span className="block overflow-hidden rounded-control bg-ink-800">
                  <img
                    src={s.src}
                    alt=""
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-2 block truncate text-sm font-medium text-fg">{s.title}</span>
                <span className="block truncate text-xs text-muted">{s.location}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
