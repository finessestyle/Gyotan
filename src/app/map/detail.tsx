import { View, StyleSheet, Image, Text, ScrollView, Button } from 'react-native'
import { router, useLocalSearchParams, Link } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../config'
import { type Map } from '../../../types/map'
import ExifReader from 'exif-js'
import Map from '../../components/Map'
import Weather from '../../components/Weather'

const handlePress = (id: string): void => {
  router.push({ pathname: '/map/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  console.log(id)
  const [map, setPost] = useState<Map | null>(null)
  const mapImageUri = map !== null && Array.isArray(map.images) && map.images.length > 0 ? map.images[0] : undefined
  useEffect(() => {
    if (auth.currentUser === null) { return }
    const mapRef = doc(db, `users/${auth.currentUser.uid}/maps`, id)
    const unsubscribe = onSnapshot(mapRef, (mapDoc) => {
      const { title, images, content, area, updatedAt } = mapDoc.data() as Map
      console.log(mapDoc.data())
      setPost({
        id: mapDoc.id,
        title,
        images,
        content,
        length,
        area,
        updatedAt
      })
    })
    return unsubscribe
  }, [])

  const [imageUri, setImageUri] = useState('')
  const [exifData, setExifData] = useState(null)

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const docRef = doc(db, 'images', id)
        const snapshot = await getDoc(docRef)
        const { imageUrl } = snapshot.data()
        setImageUri(imageUrl)

        // Exifデータを取得してstateにセットする例
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        ExifReader.load(blob, (exifData) => {
          setExifData(exifData)
        })
      } catch (error) {
        console.error('Error fetching image data:', error)
      }
    }

    fetchImageData()
  }, [id])

  const lat = 35.6895
  const lon = 139.6917

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <View style={styles.postBody}>
          <View style={styles.fishArea}>
            <Text>釣り場エリア: {map?.area}</Text>
          </View>
          <Weather />
          <View>
            <Image
              style={styles.fishImage}
              source={{ uri: mapImageUri }}
            />
          </View>
          <View style={styles.fishInfo}>
            <Text>-釣果状況-</Text>
            <Text style={styles.fishText}>
              {map?.content}
            </Text>
          </View>
        </View>
        <Button title='投稿' onPress={() => { handlePress(id) }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  inner: {
    marginVertical: 30,
    marginHorizontal: 4
  },
  userInfo: {
    height: 80,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 19,
    alignItems: 'center'
  },
  userImage: {
    width: 64,
    height: 64,
    borderRadius: 32
  },
  userName: {
    paddingLeft: 16,
    fontSize: 20,
    lineHeight: 32,
    color: '#467FD3'
  },
  postBody: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    marginHorizontal: 19,
    marginBottom: 10,
    height: 'auto'
  },
  fishArea: {
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishAreaImage: {
    height: 175,
    width: 'auto'
  },
  fishTime: {
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishingInfomation: {
    height: 32,
    width: 'auto',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#B0B0B0'
  },
  leftInfo: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0'
  },
  rightInfo: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fishImage: {
    height: 322,
    width: 'auto'
  },
  fishInfo: {
    height: 'auto',
    lineHeight: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000'
  }
})

export default Detail
