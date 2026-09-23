import { ImageSquareIcon, PlusIcon, ShareNetworkIcon } from '@phosphor-icons/react'
import { Button } from '@leonida/ui'
import type { StoryPost } from '../lib/storage'
import { PostCard } from './Feed'

export function You({
  post,
  liked,
  onLike,
  onShare,
  onCreate,
}: {
  post: StoryPost | null
  liked: boolean
  onLike: () => void
  onShare: () => void
  onCreate: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center border-b border-line px-4">
        <h2 className="type-display flex-1 text-[28px] text-fg">Your story</h2>
      </header>

      {post ? (
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
          <PostCard post={post} mine liked={liked} onLike={onLike} />
          <div className="grid grid-cols-2 gap-2 p-4">
            <Button variant="secondary" onClick={onShare} icon={<ShareNetworkIcon size={18} aria-hidden />}>
              Share card
            </Button>
            <Button variant="secondary" onClick={onCreate} icon={<PlusIcon size={18} aria-hidden />}>
              New story
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-800 text-muted">
            <ImageSquareIcon size={30} aria-hidden />
          </span>
          <div>
            <p className="font-medium text-fg">Nothing posted yet</p>
            <p className="mt-1 text-sm text-muted">
              Pick a scene, edit it, and your story shows up here and at the top of the feed.
            </p>
          </div>
          <Button onClick={onCreate} icon={<PlusIcon size={18} weight="bold" aria-hidden />}>
            Create story
          </Button>
        </div>
      )}
    </div>
  )
}
