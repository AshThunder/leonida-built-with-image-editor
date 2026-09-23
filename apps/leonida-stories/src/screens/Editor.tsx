import { LeonidaEditor } from '@leonida/ui'
import { FlowHeader } from '../components/FlowHeader'

export function Editor({
  image,
  onSaved,
  onCancel,
}: {
  image: string
  onSaved: (r: { dataUrl: string }) => void
  onCancel: () => void
}) {
  return (
    <div className="flex h-full flex-col bg-ink-950">
      <FlowHeader title="Edit" step={1} onBack={onCancel} backLabel="Back to scenes" />
      <p className="border-b border-line px-4 py-2 text-xs text-muted lg:hidden">
        Filter the mood, add a caption, stamp a sticker, then save.
      </p>
      <div className="min-h-0 flex-1 overflow-auto">
        <LeonidaEditor image={image} onSaved={onSaved} onCancel={onCancel} minHeight="600px" />
      </div>
    </div>
  )
}
