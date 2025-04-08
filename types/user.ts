import { type Timestamp } from 'firebase/firestore'

interface User {
  id: string
  userName: string
  email: string
  profile: string
  userImage: string
  userYoutube: string
  userTiktok: string
  userInstagram: string
  userX: string
  updatedAt: Timestamp
  followers: string[]
}

export type { User }
