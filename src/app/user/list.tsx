import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type User } from '../../../types/user'
import Follower from '../../components/FollowUser'

const List = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const ref = collection(db, 'users')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remoteUsers: User[] = []
      snapShot.forEach((doc) => {
        const { userName, profile, userImage, userYoutube, userTiktok, userInstagram, userX, updatedAt, follower } = doc.data()
        remoteUsers.push({
          id: doc.id,
          userName,
          profile,
          userImage,
          userYoutube,
          userTiktok,
          userInstagram,
          userX,
          updatedAt,
          follower
        })
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
        renderItem={({ item }) => <Follower user={item} />}
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
