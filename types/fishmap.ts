import { type Timestamp } from 'firebase/firestore'

interface FishMap {
  id: string
  userId: string
  title: string
  images: []
  area: string
  season: string
  latitude: number
  longitude: number
  access: string
  toilet: string
  parking: string
  content: string
  updatedAt: Timestamp
}

export type { FishMap }
