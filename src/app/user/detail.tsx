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
  const imageUri = user !== null && Array.isArray(user.userImage)

  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/users`, id)
    const unsubscribe = onSnapshot(ref, (userDoc) => {
      const { userName, profile, userImage, updatedAt } = userDoc.data() as User
      setUser({
        id: userDoc.id,
        userName,
        profile,
        userImage,
        updatedAt
      })
    })
    return unsubscribe
  }, [id])

  return (
    <ScrollView>
      <View style={styles.inner}>
        <Text style={styles.title}>ユーザー情報</Text>
        <View style={styles.userImageTop}>
          <Image
            style={styles.userImage}
            source={{ uri: imageUri }}
          />
        </View>
        <View>
          <Text>{user?.userName}さん</Text>
        </View>
        <View>
          <Text>{user?.profile}</Text>
        </View>
      </View>
      <Button label='編集' onPress={() => { handlePress(id) }} />
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
  userImageTop: {
    alignItems: 'center'
  },
  userImage: {
    width: 200,
    height: 200,
    borderRadius: 100
  }
})
export default Detail
