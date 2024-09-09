import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useEffect, useState, useRef } from 'react'
import { router } from 'expo-router'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type Post } from '../../../types/post'
import ListItem from '../../components/ListItem'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import Lottie from 'lottie-react-native'

const areas = ['北湖北', '北湖東', '北湖西', '南湖東', '南湖西']

const handlePress = (): void => {
  router.push('/post/create')
}

const List = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedArea, setSelectedArea] = useState<string>(areas[0]) // 初期エリアを設定
  const animation = useRef<Lottie>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, [])

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, where('fishArea', '==', selectedArea), orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remotePosts: Post[] = []
      snapShot.forEach((doc) => {
        const { userId, userName, userImage, title, images, weather, content, length, weight, lure, lureColor, catchFish, fishArea, exifData, updatedAt } = doc.data()
        remotePosts.push({
          id: doc.id,
          userId,
          userName,
          userImage,
          title,
          images,
          weather,
          content,
          length,
          weight,
          lure,
          lureColor,
          catchFish,
          fishArea,
          updatedAt,
          exifData
        })
      })
      setPosts(remotePosts)
    })
    return unsubscribe
  }, [selectedArea]) // selectedAreaが変更されたら再度クエリを実行

  return (
    <View style={styles.container}>
      {isLoading
        ? (
        <View style={styles.lottieContainer}>
          <Lottie
            ref={animation}
            source={require('../../../assets/fishing.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>)
        : (
        <View style={styles.container}>
          <Text style={styles.title}>釣果一覧</Text>
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
            renderItem={({ item }) => <ListItem post={item} /> }
            // keyExtractor={(item) => item.id}
          />
          <CircleButton onPress={handlePress}>
            <Icon name='plus' size={40} color='#ffffff' />
          </CircleButton>
        </View>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  lottieContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lottie: {
    width: 300,
    height: 300
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
