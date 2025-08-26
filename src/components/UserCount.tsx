import { Text, StyleSheet, Animated } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../config'

const UserCount = (): JSX.Element => {
  const [userCount, setUserCount] = useState<number | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const fetchUserCount = async (): Promise<void> => {
      try {
        const q = collection(db, 'users')
        const snapshot = await getCountFromServer(q)
        setUserCount(snapshot.data().count)
      } catch (e) {
        console.log('ユーザー数取得エラー:', e)
      }
    }

    void fetchUserCount()

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      delay: 300,
      useNativeDriver: true
    }).start()
  }, [])

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }] }>
      <Text style={styles.text}>
        {userCount !== null ? `登録ユーザー数： ${userCount}人` : '読み込み中...'}
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold'
  }
})

export default UserCount
