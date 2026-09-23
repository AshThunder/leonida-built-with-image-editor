import { useState } from 'react'
import { motion } from 'motion/react'
import { ChatCircleIcon, HeartIcon, PlusIcon } from '@phosphor-icons/react'
import type { StoryPost } from '../lib/storage'
import type { StoryItem } from '../components/StoryViewer'
import { timeAgo } from '../lib/time'

export function Feed({
  posts,
  stories,
  seen,
  userPost,
  liked,
  onLike,
  onOpenStory,
  onOpenYou,
  onCreate,
}: {
  posts: StoryPost[]
  stories: StoryItem[]
  seen: Set<string>
  userPost: StoryPost | null
  liked: Set<string>
  onLike: (id: string) => void
  onOpenStory: (index: number) => void
  onOpenYou: () => void
  onCreate: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center border-b border-line px-4">
        <h2 className="type-display flex-1 text-[28px] text-fg">Stories</h2>
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div className="no-scrollbar flex gap-4 overflow-x-auto border-b border-line px-4 py-4">
          <button
            type="button"
            onClick={userPost ? onOpenYou : onCreate}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5"
          >
            <span
              className={`relative block h-16 w-16 rounded-full border-2 p-[3px] ${
                userPost ? 'border-line-strong' : 'border-dashed border-line-strong'
              }`}
            >
              {userPost ? (
                <img src={userPost.imageDataUrl} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-ink-800 text-muted">
                  <PlusIcon size={22} aria-hidden />
                </span>
              )}
            </span>
            <span className="w-full truncate text-center text-[11px] text-muted">Your story</span>
          </button>
          {stories.map((s, i) => {
            const isSeen = seen.has(s.id)
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onOpenStory(i)}
                aria-label={`Watch ${s.handle}${isSeen ? ', seen' : ''}`}
                className="flex w-16 shrink-0 flex-col items-center gap-1.5"
              >
                <span
                  className={`block h-16 w-16 rounded-full border-2 p-[3px] transition-colors ${
                    isSeen ? 'border-line-strong' : 'border-accent'
                  }`}
                >
                  <img src={s.image} alt="" className="h-full w-full rounded-full object-cover" />
                </span>
                <span className={`w-full truncate text-center text-[11px] ${isSeen ? 'text-subtle' : 'text-fg'}`}>
                  {s.handle.slice(1)}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-2 py-2">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              mine={p.id === userPost?.id}
              liked={liked.has(p.id)}
              onLike={() => onLike(p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function PostCard({
  post,
  mine,
  liked,
  onLike,
}: {
  post: StoryPost
  mine?: boolean
  liked: boolean
  onLike: () => void
}) {
  const [showReplies, setShowReplies] = useState(false)
  const likes = post.likes + (liked ? 1 : 0)

  return (
    <article className="border-b border-line pb-3 last:border-b-0">
      <div className="flex items-center gap-3 px-4 py-3">
        <img src={post.imageDataUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-fg">
            {post.handle}
            {mine && <span className="ml-2 text-xs font-normal text-accent">You</span>}
          </p>
          <p className="truncate text-xs text-muted">{post.location}</p>
        </div>
        <time className="font-mono text-xs text-subtle" dateTime={new Date(post.createdAt).toISOString()}>
          {timeAgo(post.createdAt)}
        </time>
      </div>

      <img
        src={post.imageDataUrl}
        alt={post.caption}
        loading="lazy"
        className="aspect-[4/5] w-full bg-ink-800 object-cover"
        onDoubleClick={() => !liked && onLike()}
      />

      <div className="flex items-center gap-1 px-2 pt-1">
        <button
          type="button"
          onClick={onLike}
          aria-pressed={liked}
          aria-label={liked ? 'Unlike' : 'Like'}
          className="flex h-10 items-center gap-1.5 rounded-control px-2 text-sm text-fg transition-colors hover:bg-white/5"
        >
          <motion.span
            key={liked ? 'on' : 'off'}
            initial={liked ? { scale: 0.6 } : false}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 14 }}
            className="flex"
          >
            <HeartIcon
              size={24}
              weight={liked ? 'fill' : 'regular'}
              className={liked ? 'text-accent' : ''}
              aria-hidden
            />
          </motion.span>
          <span className="font-mono tabular-nums">{likes}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowReplies((v) => !v)}
          aria-expanded={showReplies}
          className="flex h-10 items-center gap-1.5 rounded-control px-2 text-sm text-fg transition-colors hover:bg-white/5"
        >
          <ChatCircleIcon size={24} aria-hidden />
          <span className="font-mono tabular-nums">{post.replies.length}</span>
          <span className="sr-only">replies</span>
        </button>
      </div>

      <p className="px-4 pt-1 text-sm leading-snug text-fg">
        <span className="font-semibold">{post.handle}</span> {post.caption}
      </p>

      {post.replies.length > 0 && (
        <div className="px-4 pt-1.5">
          {showReplies ? (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-1"
            >
              {post.replies.map((r, i) => (
                <li key={i} className="text-sm leading-snug text-fg/85">
                  <span className="font-semibold text-fg">{r.handle}</span> {r.text}
                </li>
              ))}
            </motion.ul>
          ) : (
            <button
              type="button"
              onClick={() => setShowReplies(true)}
              className="text-sm text-muted hover:text-fg"
            >
              View {post.replies.length} replies
            </button>
          )}
        </div>
      )}
    </article>
  )
}
