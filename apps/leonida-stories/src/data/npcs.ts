export type Npc = {
  handle: string
  color: string
  avatar: string
  location: string
  caption: string
  sceneId: string
}

export type Reaction = {
  handle: string
  text: string
}

export const NPCS: Npc[] = [
  {
    handle: '@neonlucia',
    color: '#ff2d95',
    avatar: 'NL',
    location: 'Palmline 24',
    caption: 'saw this twice tonight. second time it blinked.',
    sceneId: 'art-deco',
  },
  {
    handle: '@dockside_jay',
    color: '#2de2c5',
    avatar: 'DJ',
    location: 'Dockside Marina',
    caption: 'boat lights off. engine still warm. mid.',
    sceneId: 'dockside',
  },
  {
    handle: '@loop_mira',
    color: '#f7c948',
    avatar: 'LM',
    location: 'Leonida Loop',
    caption: 'who filmed this from the overpass?',
    sceneId: 'night-drive',
  },
  {
    handle: '@motel_rio',
    color: '#a78bfa',
    avatar: 'MR',
    location: 'Sandbar Motel',
    caption: 'room 214 blinds never close. sunset alibi.',
    sceneId: 'sandbar-motel',
  },
  {
    handle: '@vice_kite',
    color: '#22d3ee',
    avatar: 'VK',
    location: 'Vice Current',
    caption: 'heatwave filter or actual mirage? send location.',
    sceneId: 'vice-current',
  },
]

const REPLY_POOL = [
  'mid',
  'send location',
  'this is fire',
  'who filmed this?',
  'delete this before sunrise',
  'nah that plate is fake',
  'Palmline never sleeps',
  'loop cameras caught it too',
  'bro the grain is perfect',
  'this is going citywide',
]

export function reactionsFor(seed: string): Reaction[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const count = 2 + (h % 3)
  const picks: Reaction[] = []
  for (let i = 0; i < count; i++) {
    const npc = NPCS[(h + i * 7) % NPCS.length]
    const text = REPLY_POOL[(h + i * 13) % REPLY_POOL.length]
    picks.push({ handle: npc.handle, text })
  }
  return picks
}

export function likesFor(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 17 + seed.charCodeAt(i)) >>> 0
  return 40 + (h % 420)
}
