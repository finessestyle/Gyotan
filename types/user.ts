import { type Timestamp } from 'firebase/firestore'

interface User {
  id: string
  userName: string
  profile: string
  imageUrl: string
  updatedAt: Timestamp
}

export type { User }
