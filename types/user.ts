import { type Timestamp } from 'firebase/firestore'

interface User {
  id: string
  userName: string
  email: string
  password: string
  profile: string
  userImage: string
  userYoutube: string
  userTiktok: string
  userInstagram: string
  userX: string
  updatedAt: Timestamp
  follower: string[]
}

export type { User }
