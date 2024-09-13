import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native'
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
  const areas = ['北湖北', '北湖東', '北湖西', '南湖東', '南湖西']
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedArea, setSelectedArea] = useState<string>(areas[0]) // 初期エリアを設定

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
        const { userId, userName, userImage, title, images, weather, content, length, weight, lure, lureColor, catchFish, fishArea, exifData, updatedAt } = doc.data()
        userPost.push({
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
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    marginVertical: 24,
    marginHorizontal: 19
  },
  subInner: {
    marginVertical: 8,
    marginHorizontal: 19
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
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 8
  },
  userName: {
    fontSize: 24,
    marginBottom: 8
  },
  userProfile: {
    fontSize: 16
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
export default Detail
