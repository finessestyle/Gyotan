import { View, StyleSheet, Text, Image, Button } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { collection, onSnapshot, query, orderBy, where, Timestamp, getDocs } from 'firebase/firestore'
import { db, auth } from '../../config'
import { router } from 'expo-router'
import MapView, { Marker, Callout, CalloutSubview } from 'react-native-maps'

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
      where('updatedAt', '>=', oneMonthAgoTimestamp),
      orderBy('updatedAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapShot) => {
      void (async () => {
        const remotePosts: Post[] = []

        if (auth.currentUser === null) return

        let blockedUserIds: string[] = []
        try {
          const blockSnap = await getDocs(
            query(collection(db, 'blocks'), where('blockerId', '==', auth.currentUser.uid))
          )
          blockedUserIds = blockSnap.docs.map((doc) => doc.data().blockedUserId)
        } catch (e) {
          console.warn('ブロック情報の取得に失敗:', e)
        }

        snapShot.forEach((doc) => {
          const {
            userId, userName, userImage, images, weather, length, weight, lure,
            lureAction, catchFish, fishArea, area, structure, cover, exifData, updatedAt, content
          } = doc.data()

          if (typeof userId === 'string' && !blockedUserIds.includes(userId)) {
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
          }
        })

        setPosts(remotePosts)
      })()
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
      <Text style={styles.backgroundText}>みんなの釣果</Text>
      <MapView ref={mapRef} style={styles.map} initialRegion={mapRegion} mapType='hybrid'>
        {posts.map((post) => {
          const exif = Array.isArray(post.exifData) ? post.exifData[0] : post.exifData
          if (exif?.latitude === null || exif?.longitude === null) return null
          return (
            <Marker
              key={post.id}
              coordinate={{
                latitude: exif?.latitude,
                longitude: exif?.longitude
              }}
            >
              <Callout
                onPress={() => {
                  router.push({ pathname: '/post/detail', params: { id: post.id } })
                }}
              >
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.area}>{post.area}</Text>
                  <Image
                    source={{ uri: post.images?.[0] }}
                    style={{ width: 200, height: 200, borderRadius: 10 }}
                  />
                  <Text style={styles.length}>{`${post.length ?? '-'}cm / ${post.weight}g`}</Text>
                </View>
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
  area: {
    color: '#B0B0B0'
  },
  map: {
    flex: 1
  },
  backgroundText: {
    position: 'absolute',
    top: '5%',
    alignSelf: 'center',
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    opacity: 0.5, // ← ここで薄くする
    zIndex: 2
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
