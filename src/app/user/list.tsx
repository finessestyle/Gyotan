import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type User } from '../../../types/user'
import FollowedUser from '../../components/FollowedUser'

const List = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (auth.currentUser === null) return
    const ref = collection(db, 'users')
    const q = query(ref, where('followed', 'array-contains', auth.currentUser?.uid), orderBy('updatedAt', 'desc'))

    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remoteUsers: User[] = []
      snapShot.forEach((doc) => {
        const { userName, email, profile, userImage, userYoutube, userTiktok, userInstagram, userX, updatedAt, followed } = doc.data()
        const userId = doc.id
        if (userId !== auth.currentUser?.uid) {
          if (Array.isArray(followed) && followed.includes(auth.currentUser?.uid)) {
            remoteUsers.push({
              id: doc.id,
              userName,
              email,
              profile,
              userImage,
              userYoutube,
              userTiktok,
              userInstagram,
              userX,
              updatedAt,
              followed
            })
          }
        }
      })
      setUsers(remoteUsers)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>フォローユーザー</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => <FollowedUser user={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginVertical: 24,
    marginHorizontal: 16
  },
  columnWrapper: {
    justifyContent: 'space-between' // 列間のアイテムを均等に配置
  }
})

export default List
