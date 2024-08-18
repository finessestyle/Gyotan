import { View, StyleSheet, Image, Text, ScrollView } from 'react-native'
import { router, useLocalSearchParams, Link } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type Post } from '../../../types/post'
import Button from '../../components/Button'
import Map from '../../components/Map'
import Swiper from 'react-native-swiper'

const handlePress = (id: string): void => {
  router.push({ pathname: 'map/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [map, setMap] = useState<Post | null>(null)
  const mapImages = map !== null && Array.isArray(map.images) ? map.images : []

  useEffect(() => {
    if (auth.currentUser === null) { return }

    const mapRef = doc(db, 'maps', id)
    const unsubscribe = onSnapshot(postRef, (mapDoc) => {
      const { userId, title, images, content, updatedAt } = mapDoc.data() as Map
      setMap({
        id: mapDoc.id,
        userId,
        title,
        images,
        content,
        updatedAt
      })
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <View style={styles.postBody}>
          <View style={styles.fishArea}>
            <Text>釣り場エリア: {map?.fishArea}</Text>
          </View>
          <Map latitude={35.284384374460465} longitude={136.24385162899472} />
          <Swiper style={styles.swiper} showsButtons={true}>
            {mapImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.fishImage} />
            ))}
          </Swiper>
          <View style={styles.fishInfo}>
            <Text>-釣り場情報-</Text>
            <Text style={styles.fishText}>
              {map?.content}
            </Text>
          </View>
        </View>
        {auth.currentUser?.uid === map?.userId && (
          <Button
            label='編集'
            buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30 }}
            labelStyle={{ fontSize: 24, lineHeight: 21 }}
            onPress={() => { handlePress(id) }}
          />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  inner: {
    marginVertical: 24,
    marginHorizontal: 16
  },
  postBody: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    marginBottom: 10,
    height: 'auto',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8
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
  },
  swiper: {
    height: 322
  }
})

export default Detail
