import { useId } from 'react'
import { MapPinIcon, PaperPlaneTiltIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { Button } from '@leonida/ui'
import { FlowHeader } from '../components/FlowHeader'

export const CAPTION_MAX = 120

export function Preview({
  image,
  location,
  handle,
  caption,
  onCaption,
  onPost,
  onEditAgain,
  onDiscard,
}: {
  image: string
  location: string
  handle: string
  caption: string
  onCaption: (v: string) => void
  onPost: () => void
  onEditAgain: () => void
  onDiscard: () => void
}) {
  const fieldId = useId()
  const left = CAPTION_MAX - caption.length

  return (
    <div className="flex h-full flex-col">
      <FlowHeader title="Post" step={2} onBack={onEditAgain} backLabel="Back to editor" />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
        <img
          src={image}
          alt="Your edited story"
          className="mx-auto aspect-[4/5] max-h-[46dvh] w-auto rounded-surface bg-ink-800 object-cover md:max-h-[380px]"
        />
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
          <MapPinIcon size={14} aria-hidden />
          {location}
          <span aria-hidden>·</span>
          {handle}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <label htmlFor={fieldId} className="text-sm font-medium text-fg">
            Caption
          </label>
          <textarea
            id={fieldId}
            value={caption}
            maxLength={CAPTION_MAX}
            rows={3}
            onChange={(e) => onCaption(e.target.value)}
            placeholder="What did the loop cameras miss?"
            aria-describedby={`${fieldId}-count`}
            className="resize-none rounded-control border border-line-strong bg-ink-850 px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent"
          />
          <p
            id={`${fieldId}-count`}
            className={`text-right font-mono text-xs ${left <= 10 ? 'text-accent' : 'text-subtle'}`}
          >
            {left} left
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line p-4">
        <Button size="lg" onClick={onPost} icon={<PaperPlaneTiltIcon size={18} weight="fill" aria-hidden />}>
          Post to Leonida
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={onEditAgain} icon={<PencilSimpleIcon size={16} aria-hidden />}>
            Edit again
          </Button>
          <Button variant="danger" onClick={onDiscard} icon={<TrashIcon size={16} aria-hidden />}>
            Discard
          </Button>
        </div>
      </div>
    </div>
  )
}
