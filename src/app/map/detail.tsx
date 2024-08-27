import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { router, useLocalSearchParams, Link } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type FishMap } from '../../../types/fishmap'
import Button from '../../components/Button'
import Weather from '../../components/Weather'
import Map from '../../components/Map'

const handlePress = (id: string): void => {
  router.push({ pathname: 'map/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [map, setMap] = useState<FishMap | null>(null)

  useEffect(() => {
    if (auth.currentUser === null) { return }

    const mapRef = doc(db, 'maps', id)
    const unsubscribe = onSnapshot(mapRef, (mapDoc) => {
      const { title, area, season, latitude, longitude, content, updatedAt } = mapDoc.data() as FishMap
      setMap({
        id: mapDoc.id,
        title,
        area,
        season,
        latitude,
        longitude,
        content,
        updatedAt
      })
    })
    return unsubscribe
  }, [id])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <View style={styles.postBody}>
          <View style={styles.fishArea}>
            <Text>{map?.title}</Text>
            <Text>[{map?.season}]</Text>
          </View>
          <Map latitude={map?.latitude ?? 0} longitude={map?.longitude ?? 0} />
          <Weather lat={map?.latitude ?? 0} lon={map?.longitude ?? 0} />
          <View style={styles.fishInfo}>
            <Text>-釣り場情報-</Text>
            <Text style={styles.fishText}>
              {map?.content}
            </Text>
          </View>
        </View>
        <Button
          label='編集'
          buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30 }}
          labelStyle={{ fontSize: 24, lineHeight: 21 }}
          onPress={() => { handlePress(id) }}
        />
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
