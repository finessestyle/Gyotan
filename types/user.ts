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
  followed: string[]
}

export type { User }

// () 関数の呼び出し
// {} オブジェクトの定義
// [] 配列の定義
