import { View, FlatList, StyleSheet, Text } from 'react-native'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type Post } from '../../../types/post'
import ListItem from '../../components/ListItem'

const List = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remotePosts: Post[] = []
      snapShot.forEach((doc) => {
        const { userId, userName, userImage, title, images, weather, content, length, weight, lure, lureColor, catchFish, fishArea, updatedAt } = doc.data()
        remotePosts.push({
          id: doc.id,
          userId,
          userName,
          userImage,
          title,
          images,
          weather,
          content,
          length,
          weight,
          lure,
          lureColor,
          catchFish,
          fishArea,
          updatedAt
        })
      })
      setPosts(remotePosts)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>釣果一覧</Text>
        <FlatList
          data={posts}
          renderItem={({ item }) => <ListItem post={item} /> }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginVertical: 24,
    marginHorizontal: 16
  }
})

export default List
