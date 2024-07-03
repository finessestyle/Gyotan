import { type Timestamp } from 'firebase/firestore'

interface User {
  id: string
  username: string
  profile: string
  image?: string[]
  updatedAt: Timestamp
}

export type { User }
