import {
  View, StyleSheet, Text
} from 'react-native'
import { useState, useEffect } from 'react'
import { Link, router } from 'expo-router'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type FishMap } from '../../../types/fishmap'
import Icon from '../../components/Icon'
import CircleButton from '../../components/CircleButton'
import MapView, { Marker, Callout } from 'react-native-maps'
import Map from '../../components/Map'

const handlePress = (): void => {
  router.push('/map/create')
}

const List = (): JSX.Element => {
  const [maps, setMaps] = useState<FishMap[]>([])
  const [initialRegion, setInitialRegion] = useState({
    latitude: 35.25020910118615,
    longitude: 136.08555032486245,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  })

  useEffect(() => {
    if (auth.currentUser === null) return
    const ref = collection(db, 'maps')
    const q = query(
      ref,
      orderBy('updatedAt', 'asc')
    )
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remoteMaps: FishMap[] = []
      snapShot.forEach((doc) => {
        const { userId, title, area, season, latitude, longitude, content, updatedAt } = doc.data()
        remoteMaps.push({
          id: doc.id,
          userId,
          title,
          area,
          season,
          latitude,
          longitude,
          content,
          updatedAt
        })
      })
      setMaps(remoteMaps)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {maps.map((map) => {
          return (
            <Marker
              key={map.id}
              coordinate={{
                latitude: map.latitude,
                longitude: map.longitude
              }}
            >
              <Callout>
              <Link href={{ pathname: '/map/detail', params: { id: map.id } }}>
                <View style={{ alignItems: 'center' }}>
                  <Text>{map.title}</Text>
                  <View style={styles.submap} pointerEvents="none">
                    <Map latitude={map?.latitude ?? 0} longitude={map?.longitude ?? 0} />
                  </View>
                </View>
              </Link>
             </Callout>
            </Marker>
          )
        })}
        {auth.currentUser?.uid === 'fYOX0b2SB9Y9xuiiWMi6RfEIgSN2' && (
          <CircleButton onPress={handlePress}>
            <Icon name='plus' size={40} color='#ffffff' />
          </CircleButton>
        )}
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
  },
  submap: {
    width: 200,
    height: 200
  }
})

export default List
