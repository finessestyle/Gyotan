import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'
import { db } from '../config'
import { FontAwesome6 } from '@expo/vector-icons'

interface Post {
  likes: string[]
  likesCount: number
}

const LikeButton = ({ postId, userId }: { postId: string, userId: string }): JSX.Element => {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    const postRef = doc(db, 'posts', postId)
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Post
        const likes = Array.isArray(data?.likes) ? data.likes : []
        setCount(likes.length)
        setLiked(likes.includes(userId))
      } else {
        console.log('No such document')
      }
    })
    return unsubscribe
  }, [postId, userId])

  const handlePress = async (): Promise<void> => {
    const postRef = doc(db, 'posts', postId)
    if (liked) {
      await updateDoc(postRef, {
        likesCount: count - 1,
        likes: arrayRemove(userId)
      })
    } else {
      await updateDoc(postRef, {
        likesCount: count + 1,
        likes: arrayUnion(userId)
      })
    }
    setLiked(!liked)
  }

  return (
    <View style={styles.likeButtonContainer}>
      <TouchableOpacity style={styles.likeButton} onPress={handlePress}>
        <FontAwesome6
          name='heart'
          size={18}
          color='red'
          solid={liked}
        />
        <Text style={styles.likeButtonCount}>{count}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  likeButtonContainer: {
    height: 60,
    width: 60,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    top: 4,
    right: 10,
    zIndex: 10
  },
  likeButton: {
    flexDirection: 'row',
    marginHorizontal: 8
  },
  likeButtonCount: {
    paddingLeft: 4,
    fontSize: 18,
    alignItems: 'center'
  }
})

export default LikeButton
