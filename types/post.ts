import { type Timestamp } from 'firebase/firestore'

interface ExifData {
  latitude: number
  longitude: number
  dateTime: string
}

interface Post {
  id: string
  userId: string
  userName: string
  userImage: string
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
  exifData: ExifData[]
  updatedAt: Timestamp
}

export type { Post }
