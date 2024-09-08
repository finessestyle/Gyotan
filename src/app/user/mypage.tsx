import {
  View, Text, StyleSheet, ScrollView, Image,
  FlatList, TouchableOpacity, Alert
} from 'react-native'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject, listAll } from 'firebase/storage'
import { auth, db, storage } from '../../config'
import { deleteUser } from 'firebase/auth'
import { type User } from '../../../types/user'
import { type Post } from '../../../types/post'
import ListItem from '../../components/ListItem'
import Button from '../../components/Button'
import LogOutButton from '../../components/LogOutButton'

const handlePress = (id: string): void => {
  router.push({ pathname: 'user/edit', params: { id } })
}

const deleteFiles = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId)
    await deleteDoc(userRef)

    const userRefInStorage = ref(storage, `users/${userId}`)
    const { items: userItems } = await listAll(userRefInStorage)
    for (const userItemRef of userItems) {
      await deleteObject(userItemRef)
    }
  } catch (error) {
    console.log(error)
  }
}

const handleWithdraw = async (user?: User | null): Promise<void> => {
  if (user === null) {
    Alert.alert('ユーザーが見つかりませんでした')
    return
  }

  const userId = auth.currentUser?.uid

  if (auth.currentUser?.uid === userId) {
    Alert.alert('退会確認', '本当に退会しますか？', [
      {
        text: 'キャンセル',
        style: 'cancel'
      },
      {
        text: '退会する',
        style: 'destructive',
        onPress: () => { void handleDeleteUser(userId) }
      }
    ])
  }
}

const handleDeleteUser = async (userId: string): Promise<void> => {
  try {
    await deleteFiles(userId)
    if (auth.currentUser !== null) {
      await deleteUser(auth.currentUser)
      Alert.alert('退会が完了しました')
    }
  } catch (error) {
    console.log(error)
    Alert.alert('退会に失敗しました')
  }
}

const Mypage = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const areas = ['北湖北', '北湖東', '北湖西', '南湖東', '南湖西']
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedArea, setSelectedArea] = useState<string>(areas[0]) // 初期エリアを設定
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogOutButton />
    })
  }, [navigation])

  useEffect(() => {
    if (auth.currentUser === null) return

    const userRef = doc(db, 'users', auth.currentUser.uid)
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
    const q = query(postRef, where('fishArea', '==', selectedArea), where('userId', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc'))
    const unsubscribePost = onSnapshot(q, (snapshot) => {
      const userPost: Post[] = []
      snapshot.forEach((doc) => {
        const {
          userId, userName, userImage, title, images, weather, content, length,
          weight, lure, lureColor, catchFish, fishArea, exifData, updatedAt
        } = doc.data()
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
  }, [selectedArea])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>マイページ</Text>
        <View style={styles.userTop}>
          <Image
            source={{ uri: user?.userImage }}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{user?.userName}さん</Text>
          <Text style={styles.userProfile}>{user?.profile}</Text>
        </View>
        {auth.currentUser?.uid === user?.id && (
          <View style={styles.buttonStyle}>
            <Button
              label='編集'
              buttonStyle={{ width: '30%', marginTop: 8, marginRight: 8, alignItems: 'center', height: 30 }}
              labelStyle={{ fontSize: 24, lineHeight: 21 }}
              onPress={() => { handlePress(id) }}
            />
            <Button
              label='退会'
              buttonStyle={{ width: '30%', marginTop: 8, alignItems: 'center', height: 30 }}
              labelStyle={{ fontSize: 24, lineHeight: 21 }}
              onPress={() => { void handleWithdraw(user) }}
            />
          </View>
        )}
      </View>
      <View style={styles.subInner}>
        <Text style={styles.title}>あなたの釣果</Text>
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
          renderItem={({ item }) => <ListItem post={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ScrollView>
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
    borderWidth: 1,
    borderColor: '#D0D0D0',
    minHeight: 80,
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 16,
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
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

export default Mypage
