import { View, StyleSheet, Text, Image, Button, TouchableWithoutFeedback } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { collection, onSnapshot, query, orderBy, where, Timestamp } from 'firebase/firestore'
import { db } from '../../config'
import { Link } from 'expo-router'
import MapView, { Marker, Callout } from 'react-native-maps'

interface ExifData {
  latitude: number
  longitude: number
}

interface Post {
  id: string
  exifData?: ExifData | ExifData[]
  length?: number
  lure?: string
  updatedAt?: any
  [key: string]: any
}

const Map = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([])
  const [mapRegion, setMapRegion] = useState({
    latitude: 35.25020910118615,
    longitude: 136.08555032486245,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  })
  const mapRef = useRef<MapView | null>(null)

  useEffect(() => {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const oneMonthAgoTimestamp = Timestamp.fromDate(oneMonthAgo)

    const ref = collection(db, 'posts')
    const q = query(
      ref,
      where('createdAt', '>=', oneMonthAgoTimestamp),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remotePosts: Post[] = []
      snapShot.forEach((doc) => {
        const {
          userId, userName, userImage, images, weather, length, weight, lure,
          lureAction, catchFish, fishArea, area, structure, cover, exifData, updatedAt, createdAt, content
        } = doc.data()
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
          createdAt,
          updatedAt
        })
      })
      setPosts(remotePosts)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (posts.length > 0) {
      setMapRegion({
        latitude: posts[0].latitude,
        longitude: posts[0].longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      })
    }
  }, [posts])

  const resetMapRegion = (): void => {
    if (mapRef.current !== null) {
      mapRef.current.animateToRegion({
        latitude: 35.25020910118615,
        longitude: 136.08555032486245,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      })
    }
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={mapRegion}>
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
              style={{ zIndex: 1 }}
            >
              <Callout>
                <TouchableWithoutFeedback>
                  <Link
                    href={{ pathname: '/post/detail', params: { id: post.id } }}
                  >
                    <View style={{ alignItems: 'center', position: 'relative' }}>
                      <Image
                        source={{ uri: post.images?.[0] }}
                        style={{ width: 200, height: 200, borderRadius: 10 }}
                      />
                      <Text style={styles.length}>{`${post.length ?? '-'}cm / ${post.weight}g`}</Text>
                    </View>
                  </Link>
                </TouchableWithoutFeedback>
             </Callout>
            </Marker>
          )
        })}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title='MAPを戻す' onPress={resetMapRegion} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  length: {
    fontSize: 18,
    color: '#ffffff',
    position: 'absolute',
    bottom: 0,
    right: 8
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '35%',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    borderRadius: 8
  }
})

export default Map
