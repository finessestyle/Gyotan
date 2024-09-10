import { View, FlatList, Text, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type Post } from '../../../types/post'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import TopList from '../../components/TopList'

const handlePress = (): void => {
  router.push('/post/create')
}

const top = (): JSX.Element => {
  const [posts, setPosts] = useState<Post []>([])

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remotePosts: Post[] = []
      snapshot.forEach((doc) => {
        const { userId, userName, userImage, title, images, weather, content, length, weight, lure, lureColor, catchFish, fishArea, exifData, updatedAt } = doc.data()
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
          updatedAt,
          exifData
        })
      })
      setPosts(remotePosts)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
       <Text style={styles.title}>最新釣果</Text>
       <FlatList
         data={posts}
         renderItem={({ item }) => <TopList post={item} /> }
       />
      <CircleButton onPress={handlePress}>
        <Icon name='plus' size={40} color='#ffffff' />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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

export default top
