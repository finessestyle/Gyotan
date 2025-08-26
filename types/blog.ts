import { type Timestamp } from 'firebase/firestore'

interface Blog {
  id: string
  bodyText: string
  updatedAt: Timestamp
}

export type { Blog }
