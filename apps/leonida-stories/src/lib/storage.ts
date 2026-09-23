export type StoryPost = {
  id: string
  handle: string
  location: string
  imageDataUrl: string
  caption: string
  createdAt: number
  likes: number
  replies: { handle: string; text: string }[]
}

const KEY = 'leonida-stories:latest-post'

export function loadLatestPost(): StoryPost | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoryPost
  } catch {
    return null
  }
}

export function saveLatestPost(post: StoryPost): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(post))
  } catch (e) {
    console.warn('localStorage full or blocked', e)
  }
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
