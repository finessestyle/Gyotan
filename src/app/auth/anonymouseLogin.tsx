import { Button, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { auth } from '../../config'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const AnonymousLogin = (): JSX.Element => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user === null) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  const handleAnonymousLogin = async (): Promise<void> => {
    try {
      const result = await signInAnonymously(auth)
      console.log('User ID:', result.user.uid)
      router.replace('/post/top')
    } catch (error) {
      console.error('Error during anonymous login:', error)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="ゲスト登録はこちらをタップ"
        onPress={() => { handleAnonymousLogin().catch(console.error) }}
      />
      {user !== null
        ? (
        <Text>ログイン済み：{user}</Text>)
        : (
        <View>
          <Text>※釣果の投稿ができません</Text>
          <Text>※エリア別釣果を見ることができません</Text>
          <Text>※釣り場情報を見ることができません</Text>
        </View>)
      }
    </View>
  )
}

export default AnonymousLogin
