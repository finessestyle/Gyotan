import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { collectionGroup, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type User } from '../../../types/user'

import UserImageButton from '../../components/UsreImageButton'
import LogOutButton from '../../components/LogOutButton'

const List = (): JSX.Element => {
  const [ users, setUsers] = useState<User[]>([])
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton />}
    })
  }, [])
  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = collectionGroup(db, 'users')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remoteUsers: User[] = []
      snapShot.forEach((doc) => {
        const { userName, profile, userImage, updatedAt } = doc.data()
        remoteUsers.push({
          id: doc.id,
          userName,
          profile,
          userImage,
          updatedAt
        })
      })
      setUsers(remoteUsers)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.inner}>
          <Text style={styles.title}>ユーザー一覧</Text>
          <FlatList
            data={users}
            renderItem={({ item }) => <UserImageButton user={item} />}
          />
        </View>
      </ScrollView>
    </View>
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
  }
})

export default List
