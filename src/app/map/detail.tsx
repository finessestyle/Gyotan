import React, { View, StyleSheet, Text, ScrollView } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
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
      const { userId, title, area, season, latitude, longitude, content, updatedAt } = mapDoc.data() as FishMap
      setMap({
        id: mapDoc.id,
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
          <Map latitude={map?.latitude ?? 0} longitude={map?.longitude ?? 0} />
          <Weather lat={map?.latitude ?? 0} lon={map?.longitude ?? 0} />
          <View style={styles.fishInfo}>
            <Text>-釣り場情報-</Text>
            <Text style={styles.fishText}>
              {map?.content}
            </Text>
          </View>
        </View>
        {auth.currentUser?.uid === 'fYOX0b2SB9Y9xuiiWMi6RfEIgSN2' && (
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
    backgroundColor: '#f8f8f8'
  },
  inner: {
    marginVertical: 24,
    marginHorizontal: 16
  },
  areaBody: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    marginBottom: 8,
    height: 'auto',
    borderRadius: 8
  },
  fishArea: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 32
  },
  title: {
    fontSize: 18,
    lineHeight: 32
  },
  fishInfo: {
    borderTopWidth: 1,
    borderTopColor: '#D0D0D0',
    height: 'auto',
    lineHeight: 32,
    alignItems: 'center',
    paddingVertical: 8
  },
  fishText: {
    fontSize: 16,
    lineHeight: 24,
    marginHorizontal: 8,
    color: '#000000'
  },
  swiper: {
    height: 322
  }
})

export default Detail
