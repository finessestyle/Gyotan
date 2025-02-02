import {
  View, FlatList, StyleSheet, Text, TouchableOpacity
} from 'react-native'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type Post } from '../../../types/post'
import ListItem from '../../components/ListItem'
import ListSizeItem from '../../components/ListSizeItem'

const areas = ['北湖北岸', '北湖東岸', '北湖西岸', '南湖東岸', '南湖西岸']

const Top = (): JSX.Element => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [largestPosts, setLargestPosts] = useState<Post[]>([])
  const [latestArea, setLatestArea] = useState<string>(areas[0])
  const [largestArea, setLargestArea] = useState<string>(areas[0])

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, where('fishArea', '==', latestArea), orderBy('updatedAt', 'desc'))
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
      setLatestPosts(remotePosts)
    })
    return unsubscribe
  }, [latestArea])

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, where('fishArea', '==', largestArea), orderBy('length', 'desc'))
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
      setLargestPosts(remotePosts)
    })
    return unsubscribe
  }, [largestArea])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>最新釣果</Text>
      <View style={styles.tabs}>
        {areas.map((area) => (
          <TouchableOpacity
            key={area}
            style={[styles.tab, latestArea === area && styles.selectedTab]}
            onPress={() => { setLatestArea(area) }}
          >
            <Text style={styles.tabText}>{area}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={latestPosts}
        numColumns={2}
        renderItem={({ item }) => <ListItem post={item} />}
        style={{ marginHorizontal: 8 }}
      />

      <Text style={styles.title}>最大サイズ釣果</Text>
      <View style={styles.tabs}>
        {areas.map((area) => (
          <TouchableOpacity
            key={area}
            style={[styles.tab, largestArea === area && styles.selectedTab]}
            onPress={() => { setLargestArea(area) }}
          >
            <Text style={styles.tabText}>{area}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={largestPosts}
        numColumns={2}
        renderItem={({ item }) => <ListSizeItem post={item} />}
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
    marginVertical: 8,
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

export default Top
