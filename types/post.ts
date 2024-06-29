import { type Timestamp } from 'firebase/firestore'

interface Post {
  id: string
  title: string
  images: string[]
  weather: string
  content: string
  length: number
  weight: number
  lure: string
  lureColor: string
  catchFish: number
  fishArea: string
  updatedAt: Timestamp
}

export type { Post }
