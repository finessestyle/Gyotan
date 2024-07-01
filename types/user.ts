import { type Timestamp } from 'firebase/firestore'

interface User {
  id: string
  email: string
  password: string
  username: string
  profile: string
  image: string[]
  updatedAt: Timestamp
}

export type { User }
