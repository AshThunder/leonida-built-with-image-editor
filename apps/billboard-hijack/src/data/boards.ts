import { assetUrl } from '../lib/assets'
import type { FaceQuad } from '../lib/drawQuadImage'

export type Board = {
  id: string
  name: string
  district: string
  lighting: string
  plate: string
  /** Advertising face as % of plate width/height (0–100), following perspective. */
  face: FaceQuad
  slogans: string[]
}

export const BOARDS: Board[] = [
  {
    id: 'loop-billboard',
    name: 'Loop Billboard',
    district: 'Leonida Loop',
    lighting: 'Neon rain / palm freeway',
    plate: assetUrl('assets/board-highway-night.jpg'),
    face: {
      tl: { x: 7.57, y: 4.8 },
      tr: { x: 42.47, y: 22.51 },
      br: { x: 42.49, y: 53.02 },
      bl: { x: 8.0, y: 51.0 },
    },
    slogans: ['NO SIGNAL. NO RULES.', 'LOOP RUNS AFTER DARK', 'YOU SAW NOTHING.'],
  },
  {
    id: 'bay-roadside',
    name: 'Bay Roadside',
    district: 'Leonida Bay',
    lighting: 'Pink dusk / teal bay',
    plate: assetUrl('assets/board-roadside-dusk.jpg'),
    face: {
      tl: { x: 7.82, y: 7.27 },
      tr: { x: 37.87, y: 22.65 },
      br: { x: 37.88, y: 55.83 },
      bl: { x: 7.8, y: 53.6 },
    },
    slogans: ['LAND ANYWAY', 'BAY ROAD, NO WITNESSES', 'CLEARANCE DENIED'],
  },
  {
    id: 'vice-neon',
    name: 'Vice Neon',
    district: 'Ocean Drive Strip',
    lighting: 'Cyan / magenta deco neon',
    plate: assetUrl('assets/board-city-neon.jpg'),
    face: {
      tl: { x: 24.29, y: 14.0 },
      tr: { x: 42.72, y: 23.01 },
      br: { x: 42.72, y: 42.02 },
      bl: { x: 24.0, y: 38.2 },
    },
    slogans: ['SIGNAL OVERRIDDEN', 'TROPICS AFTER DARK', 'PAY THE CITY IN RUMORS'],
  },
  {
    id: 'palmline-blank',
    name: 'Palmline Blank',
    district: 'Palmline 24',
    lighting: 'Bleached sun / pastel deco',
    plate: assetUrl('assets/board-blank-structure.jpg'),
    face: {
      tl: { x: 10.99, y: 5.23 },
      tr: { x: 46.97, y: 22.51 },
      br: { x: 46.96, y: 56.81 },
      bl: { x: 10.6, y: 51.2 },
    },
    slogans: ['VACANCY FOR TROUBLE', 'PALMLINE 24-HOUR MIRACLES', 'NOTHING TO SEE HERE'],
  },
  {
    id: 'dockside-overpass',
    name: 'Dockside Overpass',
    district: 'Dockside Marina',
    lighting: 'Marina gold / yacht wash',
    plate: assetUrl('assets/board-overpass.jpg'),
    face: {
      tl: { x: 17.62, y: 21.49 },
      tr: { x: 69.94, y: 28.7 },
      br: { x: 70.0, y: 41.73 },
      bl: { x: 17.9, y: 38.0 },
    },
    slogans: ['MIDNIGHT FERRY', 'BOATS DON’T TALK', 'CHECK OUT NEVER'],
  },
  {
    id: 'port-gantry',
    name: 'Port Gantry',
    district: 'Port Gellhorn',
    lighting: 'Tangerine dusk / crane yard',
    plate: assetUrl('assets/board-port-gantry.jpg'),
    face: {
      tl: { x: 18.56, y: 21.14 },
      tr: { x: 50.02, y: 29.89 },
      br: { x: 50.15, y: 54.53 },
      bl: { x: 18.8, y: 50.7 },
    },
    slogans: ['CONTAINERS DON’T COUNT', 'SHIPPED. NO QUESTIONS.', 'CUSTOMS IS CLOSED'],
  },
  {
    id: 'keys-bridge',
    name: 'Keys Bridge',
    district: 'Overseas Keys',
    lighting: 'Golden hour / turquoise water',
    plate: assetUrl('assets/board-keys-bridge.jpg'),
    face: {
      tl: { x: 66.74, y: 15.31 },
      tr: { x: 96.19, y: 6.74 },
      br: { x: 96.05, y: 42.31 },
      bl: { x: 66.9, y: 42.1 },
    },
    slogans: ['LAST EXIT TO PARADISE', 'NO EXTRADITION PAST MILE 7', 'DRIVE LIKE YOU STOLE IT'],
  },
  {
    id: 'rooftop-downtown',
    name: 'Rooftop Downtown',
    district: 'Vice Downtown',
    lighting: 'Pink rain / skyline neon',
    plate: assetUrl('assets/board-rooftop.jpg'),
    face: {
      tl: { x: 19.9, y: 21.46 },
      tr: { x: 50.52, y: 30.63 },
      br: { x: 50.52, y: 57.33 },
      bl: { x: 20.1, y: 60.8 },
    },
    slogans: ['THE SKYLINE IS FOR SALE', 'RAIN WASHES EVERYTHING', 'LOOK UP. PAY UP.'],
  },
  {
    id: 'strip-mall-pole',
    name: 'Strip Mall Pole',
    district: 'Sunset Plaza',
    lighting: 'Motel neon / wet lot',
    plate: assetUrl('assets/board-strip-mall.jpg'),
    face: {
      tl: { x: 74.23, y: 15.58 },
      tr: { x: 93.28, y: 7.52 },
      br: { x: 93.86, y: 38.36 },
      bl: { x: 74.7, y: 41.5 },
    },
    slogans: ['OPEN 24 HRS. NO REFUNDS.', 'VACANCY FOR VILLAINS', 'CASH ONLY, NO NAMES'],
  },
  {
    id: 'swamp-highway',
    name: 'Swamp Highway',
    district: 'Grassrivers',
    lighting: 'Blue hour / swamp mist',
    plate: assetUrl('assets/board-swamp-highway.jpg'),
    face: {
      tl: { x: 6.8, y: 15.37 },
      tr: { x: 44.22, y: 24.08 },
      br: { x: 44.22, y: 55.19 },
      bl: { x: 7.0, y: 56.1 },
    },
    slogans: ['GATORS KEEP SECRETS', 'NEXT GAS: NEVER', 'THE SWAMP IS LISTENING'],
  },
]

export const AD_CANVAS = assetUrl('assets/ad-blank.png')
