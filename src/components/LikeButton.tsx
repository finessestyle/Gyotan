import { TouchableOpacity, Text } from 'react-native'
import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db, auth } from '../config'
import { type Post } from '../../types/post'
import { FontAwesome6 } from '@expo/vector-icons'

interface Props {
  post: Post
}

interface Likes {
  count: number
  users: string[]
}

const LikeButton = ({ post }: Props): JSX.Element => {
  const [likes, setLikes] = useState<{ count: number, users: string[] }>({ count: 0, users: [] })
  const currentUser = auth.currentUser

  useEffect(() => {
    if (post.id === null) return
    const fetchLikes = async (): Promise<void> => {
      const postRef = doc(db, 'posts', post.id)
      const postSnap = await getDoc(postRef)
      if (postSnap.exists()) {
        const data = postSnap.data().likes as Likes
        setLikes(data || { count: 0, users: [] })
      }
    }
    void fetchLikes()
  }, [post.id])

  const toggleLike = async (): Promise<void> => {
    if (currentUser?.uid !== post.userId) return
    const postRef = doc(db, 'posts', post.id)
    const isLiked = likes.users.includes(currentUser.uid)

    await updateDoc(postRef, {
      'likes.count': isLiked ? likes.count - 1 : likes.count + 1,
      'likes.users': isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
    })

    setLikes(prev => ({
      count: isLiked ? prev.count - 1 : prev.count + 1,
      users: isLiked ? prev.users.filter(uid => uid !== currentUser.uid) : [...prev.users, currentUser.uid]
    }))
  }

  return (
    <TouchableOpacity onPress={() => { void toggleLike() }} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FontAwesome6
        icon={likes.users.includes(currentUser?.uid) ? faThumbsUp : faThumbsDown}
        size="lg" // アイコンサイズ
        style={{ marginRight: 5 }}
      />
      <Text>{likes.count}</Text>
    </TouchableOpacity>
  )
}

export default LikeButton
