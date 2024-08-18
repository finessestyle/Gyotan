import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type User } from '../../../types/user'
import UserImageButton from '../../components/UserImageButton'

const List = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const ref = collection(db, 'users')
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
      <Text style={styles.title}>ユーザー一覧</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserImageButton user={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 19,
    paddingVertical: 30
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  listContent: {
    paddingBottom: 30
  }
})

export default List
