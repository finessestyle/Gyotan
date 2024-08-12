import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type User } from '../../../types/user'
import UserImageButton from '../../components/UserImageButton'

const List = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (auth.currentUser === null) return

    const ref = collection(db, 'users')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remoteUsers = snapShot.docs.map((doc) => {
        const { userName, profile, imageUrl, updatedAt } = doc.data()
        return {
          id: doc.id,
          userName,
          profile,
          imageUrl, // フィールド名を修正
          updatedAt
        }
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserImageButton user={item} />}
        contentContainerStyle={styles.listContent} // 内側のスタイルを適用
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
    paddingBottom: 30 // 最後の要素が隠れないようにするための余白
  }
})

export default List
