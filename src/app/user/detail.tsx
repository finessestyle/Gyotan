import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where, orderBy, doc } from 'firebase/firestore'
import { db } from '../../config'
import { type User } from '../../../types/user'
import { type Post } from '../../../types/post'
import ListItem from '../../components/ListItem'

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [user, setUser] = useState<User | null>(null)
  const areas = ['北湖北岸', '北湖東岸', '北湖西岸', '南湖東岸', '南湖西岸']
  const [selectedArea, setSelectedArea] = useState<string>(areas[0]) // 初期エリアを設定
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const userRef = doc(db, 'users', id)
    const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
      const data = userDoc.data() as User
      setUser({
        id: userDoc.id,
        userName: data.userName,
        profile: data.profile,
        userImage: data.userImage,
        updatedAt: data.updatedAt
      })
    })

    const postRef = collection(db, 'posts')
    const q = query(postRef, where('fishArea', '==', selectedArea), where('userId', '==', id), orderBy('updatedAt', 'desc'))
    const unsubscribePost = onSnapshot(q, (snapshot) => {
      const userPost: Post[] = []
      snapshot.forEach((doc) => {
        const { userId, userName, userImage, images, weather, content, length, weight, structure, cover, lure, lureAction, catchFish, fishArea, area, exifData, updatedAt } = doc.data()
        userPost.push({
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
          fishArea,
          area,
          updatedAt,
          exifData
        })
      })
      setPosts(userPost)
    })

    return () => {
      unsubscribeUser()
      unsubscribePost()
    }
  }, [selectedArea, id])

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ユーザー情報</Text>
        <View style={styles.userTop}>
          <Image
            source={{ uri: user?.userImage }}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{user?.userName}さん</Text>
          <Text style={styles.userProfile}>{user?.profile}</Text>
        </View>
      </View>
      <View style={styles.subInner}>
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListItem post={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps='always'
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    marginVertical: 24,
    marginHorizontal: 8
  },
  subInner: {
    flex: 1,
    marginVertical: 12,
    marginHorizontal: 8
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  userTop: {
    alignItems: 'center',
    marginBottom: 8
  },
  userImage: {
    width: 160,
    height: 160,
    borderColor: '#D0D0D0',
    borderRadius: 150,
    marginBottom: 8
  },
  userName: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  userProfile: {
    fontSize: 14
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
  },
  listContainer: {
    height: 170,
    marginBottom: 16
  }
})
export default Detail
