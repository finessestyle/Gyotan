import { View, ScrollView, StyleSheet, Text, Button, TouchableOpacity, Modal } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { router } from 'expo-router'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type FishMap } from '../../../types/fishmap'
import MapView, { Marker } from 'react-native-maps'
import Icon from '../../components/Icon'
import CircleButton from '../../components/CircleButton'
import Map from '../../components/Map'

const handlePress = (): void => {
  router.push('/map/create')
}

const List = (): JSX.Element => {
  const [maps, setMaps] = useState<FishMap[]>([])
  const [selectedSeason, setSelectedSeason] = useState<string>('通年')
  const [mapRegion, setMapRegion] = useState({
    latitude: 35.25020910118615,
    longitude: 136.08555032486245,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  })
  const [modalMap, setModalMap] = useState<FishMap | null>(null) // 選択中の Marker 用
  const mapRef = useRef<MapView | null>(null)

  const getSeasonColor = (season?: string): string => {
    switch (season) {
      case '春':
        return 'pink'
      case '夏':
        return 'green'
      case '秋':
        return 'orange'
      case '冬':
        return 'white'
      case '通年':
        return 'blue'
      default:
        return 'gray'
    }
  }

  useEffect(() => {
    if (auth.currentUser === null) return
    const ref = collection(db, 'maps')
    const q = query(ref, orderBy('updatedAt', 'asc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remoteMaps: FishMap[] = []
      snapShot.forEach((doc) => {
        const { userId, images, title, area, season, latitude, longitude, access, toilet, parking, content, updatedAt } = doc.data()
        remoteMaps.push({ id: doc.id, userId, images, title, area, season, latitude, longitude, content, access, toilet, parking, updatedAt })
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

  const filterMaps = selectedSeason === '通年'
    ? maps.filter((map) => map.season === '通年')
    : maps.filter((map) => map.season === selectedSeason)

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={mapRegion} mapType='hybrid'>
        {filterMaps.map((map) => (
          <Marker
            key={map.id}
            coordinate={{ latitude: map.latitude, longitude: map.longitude }}
            onPress={() => setModalMap(map)} // モーダル用
          >
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: getSeasonColor(map.season),
                borderWidth: 2,
                borderColor: '#B0B0B0'
              }} />
              <View style={{
                width: 0,
                height: 0,
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderTopWidth: 10,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: getSeasonColor(map.season)
              }} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* ★季節フィルターボタン */}
      <View style={styles.filterContainer}>
        {['春', '夏', '秋', '冬', '通年'].map((season) => (
          <TouchableOpacity
            key={season}
            style={[styles.filterButton, selectedSeason === season && styles.filterButtonActive]}
            onPress={() => setSelectedSeason(season)}
          >
            <Text style={[styles.filterText, selectedSeason === season && styles.filterTextActive]}>
              {season}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title='MAPを戻す' onPress={resetMapRegion} />
      </View>

      {auth.currentUser?.uid === '3EpeDeL97kN5a2oefZCypnEdXGx2' && (
        <CircleButton onPress={handlePress}>
          <Icon name='plus' size={40} color='#ffffff' />
        </CircleButton>
      )}

      {/* モーダル */}
      <Modal
        visible={modalMap !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setModalMap(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalMap(null)}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (modalMap) {
                    router.push({ pathname: '/map/detail', params: { id: modalMap.id } })
                    setModalMap(null)
                  }
                }}
              >
                <Text style={styles.modalTitle}>{modalMap?.title ?? '場所不明'}</Text>
                <View style={styles.submap}>
                  {modalMap && <Map latitude={modalMap.latitude} longitude={modalMap.longitude} />}
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  submap: { width: 200, height: 200, marginVertical: 8 },
  mapTitle: { color: '#B0B0B0' },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '35%',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    borderRadius: 8
  },
  filterContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    borderRadius: 8,
    padding: 5
  },
  filterButton: {
    marginHorizontal: 5, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6
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
    color: '#B0B0B0',
    fontSize: 16,
    marginBottom: 8
  }
})

export default List
