import { View, StyleSheet, Text, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore'
import { db } from '../../config'
import MapView, { Marker, Callout } from 'react-native-maps'

interface ExifData {
  latitude: number
  longitude: number
}

interface Post {
  id: string
  exifData?: ExifData
  length?: number
  lure?: string
  updatedAt?: any
  [key: string]: any
}

const Top = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([])
  const [initialRegion, setInitialRegion] = useState({
    latitude: 35.25020910118615,
    longitude: 136.08555032486245,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  })

  useEffect(() => {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const oneMonthAgoTimestamp = oneMonthAgo.getTime()

    const ref = collection(db, 'posts')
    const q = query(
      ref,
      where('updatedAt', '>=', oneMonthAgoTimestamp),
      orderBy('updatedAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remotePosts: Post[] = []
      snapShot.forEach((doc) => {
        const {
          userId, userName, userImage, images, weather, length, weight, lure,
          lureAction, catchFish, fishArea, area, structure, cover, exifData, updatedAt, content
        } = doc.data()
        console.log(exifData)
        remotePosts.push({
          id: doc.id,
          userId,
          userName,
          userImage,
          images,
          exifData,
          area,
          fishArea,
          weather,
          lure,
          lureAction,
          structure,
          cover,
          length,
          weight,
          catchFish,
          content,
          updatedAt
        })
      })
      setPosts(remotePosts)
    })

    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {posts.map((post) => {
          const exif = Array.isArray(post.exifData) ? post.exifData[0] : post.exifData
          if (!exif?.latitude || !exif?.longitude) return null
          return (
            <Marker
              key={post.id}
              coordinate={{
                latitude: exif.latitude,
                longitude: exif.longitude
              }}
            >
              <Callout>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={{ uri: post.images?.[0] }}
                    style={{ width: 100, height: 100, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                  <Text>{`${post.length ?? '-'}cmバス`}</Text>
                  <Text>{`ヒットルアー: ${post.lure ?? '不明'}`}</Text>
                </View>
             </Callout>
            </Marker>
          )
        })}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  }
})

export default Top
