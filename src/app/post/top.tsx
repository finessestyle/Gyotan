import { View, FlatList, Text, StyleSheet } from 'react-native'
import { useEffect, useState, useRef } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type Post } from '../../../types/post'
import TopList from '../../components/TopList'
import Lottie from 'lottie-react-native'

const top = (): JSX.Element => {
  const [posts, setPosts] = useState<Post []>([])
  const animation = useRef<Lottie>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, [])

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
      {isLoading
        ? (
        <View style={styles.lottieContainer}>
          <Lottie
            ref={animation}
            source={require('../../../assets/fishing.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>)
        : (
        <View style={styles.container}>
          <Text style={styles.title}>最新釣果</Text>
          <FlatList
            data={posts}
            renderItem={({ item }) => <TopList post={item} /> }
          />
        </View>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  lottieContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lottie: {
    width: 300,
    height: 300
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
