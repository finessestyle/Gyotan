import {
  View, FlatList, StyleSheet, Text, TouchableOpacity
} from 'react-native'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type Post } from '../../../types/post'
import ListItem from '../../components/ListItem'

const areas = ['北湖北岸', '北湖東岸', '北湖西岸', '南湖東岸', '南湖西岸']

const List = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedArea, setSelectedArea] = useState<string>(areas[0]) // 初期エリアを設定

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, where('fishArea', '==', selectedArea), orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remotePosts: Post[] = []
      snapShot.forEach((doc) => {
        const { userId, userName, userImage, images, weather, content, length, weight, structure, cover, lure, lureAction, catchFish, area, fishArea, exifData, updatedAt } = doc.data()
        remotePosts.push({
          id: doc.id,
          userId,
          userName,
          userImage,
          images,
          weather,
          content,
          length,
          weight,
          lure,
          lureAction,
          structure,
          cover,
          catchFish,
          area,
          fishArea,
          updatedAt,
          exifData
        })
      })
      setPosts(remotePosts)
    })
    return unsubscribe
  }, [selectedArea])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>エリア別釣果</Text>
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
        data={posts}
        numColumns={2}
        renderItem={({ item }) => <ListItem post={item} /> }
        style={{ marginHorizontal: 8 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginVertical: 24,
    marginHorizontal: 16
  },
  mapLink: {
    fontSize: 16,
    lineHeight: 32,
    color: '#467FD3',
    marginBottom: 24,
    marginVertical: 24,
    marginHorizontal: 50,
    borderWidth: 0.5,
    borderRadius: 8
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
