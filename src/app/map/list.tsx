import { View, StyleSheet, Text, Button } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { Link, router } from 'expo-router'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type FishMap } from '../../../types/fishmap'
import MapView, { Marker, Callout } from 'react-native-maps'
import Icon from '../../components/Icon'
import CircleButton from '../../components/CircleButton'
import Map from '../../components/Map'

const handlePress = (): void => {
  router.push('/map/create')
}

const List = (): JSX.Element => {
  const [maps, setMaps] = useState<FishMap[]>([])
  const [mapRegion, setMapRegion] = useState({
    latitude: 35.25020910118615,
    longitude: 136.08555032486245,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  })
  const mapRef = useRef<MapView | null>(null)

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
        const {
          userId, images, title, area, season, latitude, longitude, content, updatedAt
        } = doc.data()
        remoteMaps.push({
          id: doc.id,
          userId,
          images,
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

  useEffect(() => {
    if (maps.length > 0) {
      setMapRegion({
        latitude: maps[0].latitude,
        longitude: maps[0].longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      })
    }
  }, [maps])

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
      <MapView ref={mapRef} style={styles.map} initialRegion={mapRegion} mapType='hybrid'>
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
                    <Text style={styles.mapTitle}>{map.title}</Text>
                    <View style={styles.submap} pointerEvents="none">
                      <Map latitude={map?.latitude ?? 0} longitude={map?.longitude ?? 0} />
                    </View>
                  </View>
                </Link>
              </Callout>
            </Marker>
          )
        })}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title='MAPを戻す' onPress={resetMapRegion} />
      </View>
      {auth.currentUser?.uid === '3EpeDeL97kN5a2oefZCypnEdXGx2' && (
        <CircleButton onPress={handlePress}>
          <Icon name='plus' size={40} color='#ffffff' />
        </CircleButton>
      )}
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
  mapTitle: {
    color: '#B0B0B0'
  },
  submap: {
    width: 200,
    height: 200
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '35%',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    borderRadius: 8
  }
})

export default List
