import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'
import { db, auth } from '../config'
import { FontAwesome6 } from '@expo/vector-icons'

interface User {
  followed: string[]
}

const FollowButton = ({ userId }: { userId: string }): JSX.Element => {
  const [followed, setFollowed] = useState(false)

  useEffect(() => {
    const userRef = doc(db, 'users', userId)
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User
        const followed = Array.isArray(data?.followed) ? data.followed : []
        setFollowed(followed.includes(userId))
      } else {
        console.log('No such document')
      }
    })
    return unsubscribe
  }, [userId])

  const handlePress = async (): Promise<void> => {
    const currentUser = auth.currentUser?.uid
    if (userId === auth.currentUser?.uid) return
    const userRef = doc(db, 'users', currentUser)
    if (followed) {
      await updateDoc(userRef, {
        followed: arrayRemove(userId)
      })
    } else {
      await updateDoc(userRef, {
        followed: arrayUnion(userId)
      })
    }
    setFollowed(!followed)
  }

  return (
    <View style={styles.followButtonContainer}>
      <TouchableOpacity style={styles.followButton} onPress={handlePress}>
        <FontAwesome6
          name='heart'
          size={18}
          color='red'
          solid={followed}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  followButtonContainer: {
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
  followButton: {
    flexDirection: 'row',
    marginHorizontal: 8
  },
  followButtonCount: {
    paddingLeft: 4,
    fontSize: 18,
    alignItems: 'center'
  }
})

export default FollowButton
