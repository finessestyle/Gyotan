import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type FishMap } from '../../../types/fishmap'
import MapListItem from '../../components/MapListItem'
import Icon from '../../components/Icon'
import CircleButton from '../../components/CircleButton'

const areas = ['北湖北', '北湖東', '北湖西', '南湖東', '南湖西']

const handlePress = (): void => {
  router.push('/map/create')
}

const List = (): JSX.Element => {
  const [maps, setMaps] = useState<FishMap[]>([])
  const [selectedArea, setSelectedArea] = useState<string>(areas[0]) // 初期エリアを設定

  useEffect(() => {
    const ref = collection(db, 'maps')
    const q = query(ref, where('area', '==', selectedArea), orderBy('updatedAt', 'desc'))
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
  }, [selectedArea]) // selectedAreaが変更されたら再度クエリを実行

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>釣り場一覧</Text>
        <View style={styles.tabs}>
          {areas.map((area) => (
            <TouchableOpacity
              key={area}
              style={[styles.tab, selectedArea === area && styles.selectedTab]}
              onPress={() => { setSelectedArea(area) }}
            >
              <Text style={styles.tabText}>{area}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={maps}
          renderItem={({ item }) => <MapListItem map={item} /> }
          keyExtractor={(item) => item.id}
        />
        <CircleButton onPress={handlePress}>
          <Icon name='plus' size={40} color='#ffffff' />
        </CircleButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginVertical: 24,
    marginHorizontal: 16
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  tab: {
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  selectedTab: {
    borderBottomColor: '#467FD3'
  },
  tabText: {
    fontSize: 16,
    color: '#467FD3'
  }
})

export default List
