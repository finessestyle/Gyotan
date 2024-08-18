import { type Timestamp } from 'firebase/firestore'

interface Map {
  id: string
  userId: string
  title: string
  images: string[]
  content: string
  updatedAt: Timestamp
}

export type { Map }
