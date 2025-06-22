import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'
import { db, auth } from '../config'
import { FontAwesome6 } from '@expo/vector-icons'

interface User {
  followed: string[]
}

const FollowButton = ({ userId }: { userId: string }): JSX.Element => {
  const [followed, setFollowed] = useState(false)

  const shakeAnim = useRef(new Animated.Value(0)).current
  const startShake = (): void => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]).start()
  }

  const rotate = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg']
  })

  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) return
    const currentUserRef = doc(db, 'users', currentUser.uid)
    const unsubscribe = onSnapshot(currentUserRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User
        const followedList = Array.isArray(data?.followed) ? data.followed : []
        setFollowed(followedList.includes(userId))
      }
    })
    return unsubscribe
  }, [userId])

  const handlePress = async (): Promise<void> => {
    const currentUser = auth.currentUser
    if (!currentUser || userId === currentUser.uid) return
    const currentUserRef = doc(db, 'users', currentUser.uid)
    const targetUserRef = doc(db, 'users', userId)
    if (followed) {
      // アンフォロー処理
      await Promise.all([
        updateDoc(currentUserRef, {
          followed: arrayRemove(userId)
        }),
        updateDoc(targetUserRef, {
          follower: arrayRemove(currentUser.uid)
        })
      ])
    } else {
      // フォロー処理
      await Promise.all([
        updateDoc(currentUserRef, {
          followed: arrayUnion(userId)
        }),
        updateDoc(targetUserRef, {
          follower: arrayUnion(currentUser.uid)
        })
      ])
    }
    setFollowed(!followed)
    startShake() // ハートを震わせる
  }

  return (
    <View style={styles.followButtonContainer}>
      <TouchableOpacity style={styles.followButton} onPress={handlePress}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <FontAwesome6
            name='heart'
            size={24}
            color='red'
            solid={followed}
          />
        </Animated.View>
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
