import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SiteBar, useToast } from '@leonida/ui'
import { Device } from './components/Device'
import { ContextRail, type FlowStep } from './components/ContextRail'
import { TabBar, type Tab } from './components/TabBar'
import { StoryViewer, type StoryItem } from './components/StoryViewer'
import { ShareCard } from './components/ShareCard'
import { Feed } from './screens/Feed'
import { You } from './screens/You'
import { Pick } from './screens/Pick'
import { Editor } from './screens/Editor'
import { Preview } from './screens/Preview'
import { NPCS, likesFor, reactionsFor } from './data/npcs'
import { SCENES, type Scene } from './data/scenes'
import { loadLatestPost, saveLatestPost, type StoryPost } from './lib/storage'

type Screen = 'home' | 'pick' | 'editor' | 'preview'

const USER_HANDLE = '@you_on_loop'
const DEFAULT_CAPTION = 'caught this on the loop. don’t ask.'

function sceneFor(id: string) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0]
}

function seedFeedPosts(): StoryPost[] {
  return NPCS.map((npc, i) => {
    const id = `seed-${npc.handle}-${i}`
    return {
      id,
      handle: npc.handle,
      location: npc.location,
      imageDataUrl: sceneFor(npc.sceneId).src,
      caption: npc.caption,
      createdAt: Date.now() - (i + 1) * 3600_000,
      likes: likesFor(id),
      replies: reactionsFor(id),
    }
  })
}

if (import.meta.env.DEV) {
  const dupes = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i)
  const srcDupes = dupes(SCENES.map((s) => s.src))
  const npcDupes = dupes(NPCS.map((n) => n.sceneId))
  if (srcDupes.length) console.warn('[stories] scenes share an image:', srcDupes)
  if (npcDupes.length) console.warn('[stories] NPCs share a scene:', npcDupes)
}

const STEP_OF: Record<Screen, FlowStep> = { home: 0, pick: 1, editor: 2, preview: 3 }

export default function App() {
  const seeded = useMemo(() => seedFeedPosts(), [])
  const stories = useMemo<StoryItem[]>(
    () =>
      NPCS.map((n) => ({
        id: n.handle,
        handle: n.handle,
        location: n.location,
        image: sceneFor(n.sceneId).src,
        caption: n.caption,
      })),
    [],
  )

  const [userPost, setUserPost] = useState<StoryPost | null>(() => loadLatestPost())
  const [screen, setScreen] = useState<Screen>('home')
  const [tab, setTab] = useState<Tab>('feed')
  const [viewer, setViewer] = useState<number | null>(null)
  const [seen, setSeen] = useState<Set<string>>(() => new Set())
  const [liked, setLiked] = useState<Set<string>>(() => new Set())
  const [editImage, setEditImage] = useState<string | null>(null)
  const [savedImage, setSavedImage] = useState<string | null>(null)
  const [pickLocation, setPickLocation] = useState('Leonida Loop')
  const [draftCaption, setDraftCaption] = useState('')
  const [showShare, setShowShare] = useState(false)
  const { toast, show } = useToast()

  const feed = userPost ? [userPost, ...seeded] : seeded

  const markSeen = useCallback((id: string) => {
    setSeen((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }, [])

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openCreate() {
    setSavedImage(null)
    setEditImage(null)
    setDraftCaption('')
    setScreen('pick')
  }

  function startEdit(src: string, location: string) {
    setEditImage(src)
    setPickLocation(location)
    setScreen('editor')
  }

  function onUpload(file: File) {
    const reader = new FileReader()
    reader.onload = () => startEdit(String(reader.result), 'Uploaded sighting')
    reader.readAsDataURL(file)
  }

  function postToLeonida() {
    if (!savedImage) return
    const id = `user-${Date.now()}`
    const post: StoryPost = {
      id,
      handle: USER_HANDLE,
      location: pickLocation,
      imageDataUrl: savedImage,
      caption: draftCaption.trim() || DEFAULT_CAPTION,
      createdAt: Date.now(),
      likes: likesFor(id),
      replies: reactionsFor(id),
    }
    setUserPost(post)
    saveLatestPost(post)
    setTab('feed')
    setScreen('home')
    show('Posted. The locals are already replying.')
  }

  function goStep(step: FlowStep) {
    if (step === 0) setScreen('home')
    else if (step === 1) setScreen('pick')
    else if (step === 2 && savedImage) {
      setEditImage(savedImage)
      setScreen('editor')
    }
  }

  const viewKey = screen === 'home' ? `home-${tab}` : screen

  return (
    <div className="flex h-dvh flex-col bg-ink-950 md:h-auto md:min-h-dvh">
      <SiteBar current="stories" />

      <div className="flex min-h-0 flex-1 md:items-center md:justify-center md:gap-12 md:px-6 md:py-6">
        <ContextRail
          step={STEP_OF[screen]}
          onStep={goStep}
          userPost={userPost}
          onOpenYou={() => {
            setScreen('home')
            setTab('you')
          }}
        />

        <Device wide={screen === 'editor'}>
          {toast}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewKey}
              className="flex min-h-0 flex-1 flex-col"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {screen === 'home' && tab === 'feed' && (
                <Feed
                  posts={feed}
                  stories={stories}
                  seen={seen}
                  userPost={userPost}
                  liked={liked}
                  onLike={toggleLike}
                  onOpenStory={setViewer}
                  onOpenYou={() => setTab('you')}
                  onCreate={openCreate}
                />
              )}
              {screen === 'home' && tab === 'you' && (
                <You
                  post={userPost}
                  liked={!!userPost && liked.has(userPost.id)}
                  onLike={() => userPost && toggleLike(userPost.id)}
                  onShare={() => setShowShare(true)}
                  onCreate={openCreate}
                />
              )}
              {screen === 'pick' && (
                <Pick
                  onBack={() => setScreen('home')}
                  onPick={(s: Scene) => startEdit(s.src, s.location)}
                  onUpload={onUpload}
                />
              )}
              {screen === 'editor' && editImage && (
                <Editor
                  image={editImage}
                  onSaved={(r) => {
                    setSavedImage(r.dataUrl)
                    setScreen('preview')
                  }}
                  onCancel={() => setScreen('pick')}
                />
              )}
              {screen === 'preview' && savedImage && (
                <Preview
                  image={savedImage}
                  location={pickLocation}
                  handle={USER_HANDLE}
                  caption={draftCaption}
                  onCaption={setDraftCaption}
                  onPost={postToLeonida}
                  onEditAgain={() => {
                    setEditImage(savedImage)
                    setScreen('editor')
                  }}
                  onDiscard={() => {
                    setSavedImage(null)
                    setScreen('pick')
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {screen === 'home' && <TabBar tab={tab} onTab={setTab} onCreate={openCreate} />}

          <AnimatePresence>
            {viewer !== null && (
              <StoryViewer
                stories={stories}
                startIndex={viewer}
                onSeen={markSeen}
                onClose={() => setViewer(null)}
              />
            )}
          </AnimatePresence>

          <ShareCard post={userPost} open={showShare} onClose={() => setShowShare(false)} />
        </Device>
      </div>
    </div>
  )
}
