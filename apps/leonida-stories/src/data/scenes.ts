import { assetUrl } from '../lib/assets'

export type Scene = {
  id: string
  title: string
  location: string
  src: string
  vibe: string
}

export const SCENES: Scene[] = [
  {
    id: 'neon-tropics',
    title: 'Tropics Sign',
    location: 'Ocean Drive Strip',
    src: assetUrl('assets/scene-neon-tropics.jpg'),
    vibe: 'cyan / magenta neon',
  },
  {
    id: 'art-deco',
    title: 'McAlpin Glow',
    location: 'Palmline 24',
    src: assetUrl('assets/scene-art-deco-neon.jpg'),
    vibe: 'art deco floodlights',
  },
  {
    id: 'sandbar-motel',
    title: 'Sandbar Pool',
    location: 'Sandbar Motel',
    src: assetUrl('assets/scene-sandbar-motel.jpg'),
    vibe: 'sunset pool neon',
  },
  {
    id: 'vice-current',
    title: 'Speedboat Wake',
    location: 'Vice Current',
    src: assetUrl('assets/scene-vice-current.jpg'),
    vibe: 'night wake / neon beach',
  },
  {
    id: 'dockside',
    title: 'Yacht Row',
    location: 'Dockside Marina',
    src: assetUrl('assets/scene-dockside.jpg'),
    vibe: 'sodium dock lights',
  },
  {
    id: 'ocean-drive',
    title: 'Leslie Night',
    location: 'Ocean Drive',
    src: assetUrl('assets/scene-ocean-drive.jpg'),
    vibe: 'classic deco silhouette',
  },
  {
    id: 'bay-skyline',
    title: 'Bay Mirror',
    location: 'Leonida Bay',
    src: assetUrl('assets/scene-bay-skyline.jpg'),
    vibe: 'dusk skyline leak',
  },
  {
    id: 'coast',
    title: 'Palmline Sunrise',
    location: 'Keys Approach',
    src: assetUrl('assets/scene-coast.jpg'),
    vibe: 'golden hour coast',
  },
  {
    id: 'night-drive',
    title: 'Wet Neon Street',
    location: 'Leonida Loop',
    src: assetUrl('assets/scene-night-drive.jpg'),
    vibe: 'rain reflection drive',
  },
]
