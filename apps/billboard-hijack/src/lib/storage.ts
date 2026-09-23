export type Takeover = {
  id: string
  boardId: string
  boardName: string
  artDataUrl: string
  slogan: string
  createdAt: number
}

const KEY = 'billboard-hijack:takeovers'

export function loadTakeovers(): Takeover[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as Takeover[]
  } catch {
    return []
  }
}

export function saveTakeovers(items: Takeover[]): void {
  try {
    // keep latest few to avoid quota blowups with data URLs
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, 5)))
  } catch (e) {
    console.warn('localStorage save failed', e)
    try {
      localStorage.setItem(KEY, JSON.stringify(items.slice(0, 1)))
    } catch {
      /* ignore */
    }
  }
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}
