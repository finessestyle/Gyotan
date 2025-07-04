import { View, StyleSheet, Text, ScrollView, Image } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type FishMap } from '../../../types/fishmap'
import Swiper from 'react-native-swiper'
import Button from '../../components/Button'
import Weather from '../../components/Weather'
import Map from '../../components/Map'

const handlePress = (id: string): void => {
  router.push({ pathname: 'map/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [map, setMap] = useState<FishMap | null>(null)
  const mapImages = map !== null && Array.isArray(map.images) ? map.images : []

  useEffect(() => {
    if (auth.currentUser === null) { return }

    const mapRef = doc(db, 'maps', id)
    const unsubscribe = onSnapshot(mapRef, (mapDoc) => {
      const { userId, title, images, area, season, latitude, longitude, access, toilet, parking, content, updatedAt } = mapDoc.data() as FishMap
      setMap({
        id: mapDoc.id,
        userId,
        title,
        images,
        area,
        season,
        latitude,
        longitude,
        access,
        toilet,
        parking,
        content,
        updatedAt
      })
    })
    return unsubscribe
  }, [id])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.areaBody}>
          <View style={styles.fishArea}>
            <Text style={styles.title}>{map?.title}</Text>
            <Text>[{map?.season}]</Text>
          </View>
          <Map latitude={map?.latitude ?? 0} longitude={map?.longitude ?? 0} viewStyle={{ height: 350 }} showCircle={false} />
          <View style={styles.fishInfo}>
            <Text>-アクセス情報-</Text>
            <Text style={styles.fishText}>
              {map?.access}
            </Text>
          </View>
          <Weather lat={map?.latitude ?? 0} lon={map?.longitude ?? 0} />
          {mapImages.length > 0 && (
            <Swiper style={styles.swiper} showsButtons={false}>
              {mapImages.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.mapImage} />
              ))}
            </Swiper>
          )}
          <View style={styles.feeldInfo}>
            <View style={styles.toile}>
              <Text>トイレ  :  {map?.toilet}</Text>
            </View>
            <View style={styles.parking}>
              <Text>駐車場  :  {map?.parking}</Text>
            </View>
          </View>
          <View style={styles.fishInfo}>
            <Text>-釣り場情報-</Text>
            <Text style={styles.fishText}>
              {map?.content}
            </Text>
          </View>
        </View>
        {auth.currentUser?.uid === '3EpeDeL97kN5a2oefZCypnEdXGx2' && (
          <Button
            label='編集'
            buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30 }}
            labelStyle={{ fontSize: 24, lineHeight: 21 }}
            onPress={() => { handlePress(id) }}
          />
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    marginVertical: 16,
    marginHorizontal: 16
  },
  title: {
    fontSize: 16,
    lineHeight: 32
  },
  areaBody: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 8,
    marginBottom: 8,
    height: 'auto'
  },
  fishArea: {
    height: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#B0B0B0'
  },
  mapImage: {
    height: 400,
    width: 'auto'
  },
  feeldInfo: {
    height: 60,
    width: 'auto',
    flexDirection: 'column',
    borderTopWidth: 1,
    borderColor: '#B0B0B0'
  },
  toile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  parking: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#B0B0B0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fishInfo: {
    borderTopWidth: 1,
    borderColor: '#B0B0B0',
    height: 'auto',
    lineHeight: 32,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1
  },
  fishText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: '#000000'
  },
  swiper: {
    height: 400
  }
})

export default Detail
