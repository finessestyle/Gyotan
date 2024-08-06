import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { auth, db } from '../../config'
import { type User } from '../../../types/user'
import Button from '../../components/Button'

const handlePress = (id: string): void => {
  router.push({ pathname: '/user/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (auth.currentUser === null) return
    const userId = auth.currentUser.uid
    const userRef = doc(db, 'users', userId)
    const unsubscribe = onSnapshot(userRef, (userDoc) => {
      const data = userDoc.data() as User
      setUser({
        id: userDoc.id,
        userName: data.userName,
        profile: data.profile,
        imageUrl: data.imageUrl,
        updatedAt: data.updatedAt
      })
    })
    return unsubscribe
  }, [id])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ユーザー情報</Text>
        <View style={styles.userTop}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{user?.userName}さん</Text>
          <Text style={styles.userProfile}>{user?.profile}</Text>
        </View>
      </View>
      {auth.currentUser?.uid === user?.id && (
        <Button
        label='編集'
        buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 40 }}
        labelStyle={{ fontSize: 24, lineHeight: 26 }} onPress={() => { handlePress(id) }}
      />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    marginVertical: 30,
    marginHorizontal: 19
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  userTop: {
    alignItems: 'center',
    marginBottom: 8
  },
  userImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 8
  },
  userName: {
    fontSize: 24,
    marginBottom: 8
  },
  userProfile: {
    fontSize: 16
  }
})
export default Detail
