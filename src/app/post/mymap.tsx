import { View, StyleSheet, Text, Image, Button, Modal, ScrollView, TouchableOpacity } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { collection, onSnapshot, query, orderBy, where, Timestamp } from 'firebase/firestore'
import { db, auth } from '../../config'
import { router } from 'expo-router'
import MapView, { Marker } from 'react-native-maps'

interface ExifData {
  latitude: number
  longitude: number
}

interface Post {
  id: string
  exifData?: ExifData | ExifData[]
  length?: number
  weight?: number
  area?: string
  images?: string[]
  [key: string]: any
}

const MyMap = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedLength, setSelectedLength] = useState<string | null>(null)
  const [mapRegion, setMapRegion] = useState({
    latitude: 35.25020910118615,
    longitude: 136.08555032486245,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  })
  const [modalPost, setModalPost] = useState<Post | null>(null)
  const mapRef = useRef<MapView | null>(null)

  const getLengthColor = (length?: number): string => {
    return '#007AFF' // すべて青に統一
  }

  const filteredPosts = posts.filter((post) => {
    if (!selectedLength) return true // ボタン押していない場合は全件表示
    const l = post.length ?? 0
    switch (selectedLength) {
      case '30cm未満':
        return l <= 29
      case '30cm~':
        return l >= 30 && l <= 39
      case '40cm~':
        return l >= 40 && l <= 49
      case '50cm~':
        return l >= 50 && l <= 59
      case '60cm~':
        return l >= 60
      default:
        return true
    }
  })

  const lengthButtons = ['30cm未満', '30cm~', '40cm~', '50cm~', '60cm~'] as const

  useEffect(() => {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const oneYearAgoTimestamp = Timestamp.fromDate(oneYearAgo)
    const userId = auth.currentUser?.uid

    if (userId === null) return

    const ref = collection(db, 'posts')
    const q = query(
      ref,
      where('updatedAt', '>=', oneYearAgoTimestamp),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remotePosts: Post[] = []
      snapShot.forEach((doc) => {
        remotePosts.push({ id: doc.id, ...doc.data() })
      })
      setPosts(remotePosts)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (posts.length > 0) {
      const exif = Array.isArray(posts[0].exifData) ? posts[0].exifData[0] : posts[0].exifData
      if (exif) {
        setMapRegion({
          latitude: exif.latitude,
          longitude: exif.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5
        })
      }
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
      <Text style={styles.backgroundText}>あなたの釣果</Text>
      <MapView ref={mapRef} style={styles.map} initialRegion={mapRegion} mapType="hybrid">
        {filteredPosts.map((post) => {
          const exif = Array.isArray(post.exifData) ? post.exifData[0] : post.exifData
          if (!exif?.latitude || !exif?.longitude) return null

          return (
            <Marker
              key={post.id}
              coordinate={{ latitude: exif.latitude, longitude: exif.longitude }}
              onPress={() => setModalPost(post)}
            >
              {/* カスタムマーカー */}
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.markerCircle,
                    { backgroundColor: getLengthColor(post.length) }
                  ]}
                />
                <View
                  style={[
                    styles.markerTriangle,
                    { borderTopColor: getLengthColor(post.length) }
                  ]}
                />
              </View>
            </Marker>
          )
        })}
      </MapView>

      {/* モーダル */}
      <Modal
        visible={modalPost !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setModalPost(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalPost(null)}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (modalPost) {
                    router.push({ pathname: '/post/detail', params: { id: modalPost.id } })
                    setModalPost(null)
                  }
                }}
              >
                <Text style={styles.modalTitle}>{modalPost?.area ?? '場所不明'}</Text>
                {modalPost?.images?.[0] && (
                  <Image
                    source={{ uri: modalPost.images[0] }}
                    style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 8 }}
                  />
                )}
                <Text style={styles.modalLength}>
                  {`${modalPost?.length ?? '-'}cm / ${modalPost?.weight ?? '-'}g`}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 長さフィルターボタン */}
      <View style={styles.filterContainer}>
        {lengthButtons.map((length) => (
          <TouchableOpacity
            key={length}
            style={[styles.filterButton, selectedLength === length && styles.filterButtonActive]}
            onPress={() => setSelectedLength(length === selectedLength ? null : length)}
          >
            <Text style={[styles.filterText, selectedLength === length && styles.filterTextActive]}>
              {length}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="MAPを戻す" onPress={resetMapRegion} />
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
  backgroundText: {
    position: 'absolute',
    top: '5%',
    alignSelf: 'center',
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    opacity: 0.5,
    zIndex: 2
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '35%',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    borderRadius: 8
  },
  filterContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    borderRadius: 8
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    margin: 3,
    borderRadius: 8
  },
  filterButtonActive: {
    backgroundColor: '#007AFF'
  },
  filterText: {
    fontSize: 14, color: '#333'
  },
  filterTextActive: {
    color: '#fff', fontWeight: 'bold'
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B0B0B0'
  },
  markerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: 230,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center'
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 8
  },
  modalLength: {
    fontSize: 16,
    marginBottom: 8,
    color: '#B0B0B0'
  }
})

export default MyMap
