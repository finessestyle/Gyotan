import { type Timestamp } from 'firebase/firestore'

interface Map {
  id: string
  title: string
  images: string[]
  content: string
  area: string
  updatedAt: Timestamp
}

export type { Map }
