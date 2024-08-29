import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, Alert } from 'react-native'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject, listAll } from 'firebase/storage'
import { auth, db, storage } from '../../config'
import { type User } from '../../../types/user'
import { type Post } from '../../../types/post'
import ListItem from '../../components/ListItem'
import Button from '../../components/Button'
import LogOutButton from '../../components/LogOutButton'

const handlePress = (id: string): void => {
  router.push({ pathname: 'user/edit', params: { id } })
}

const handleWithdraw = async (userId: string): Promise<void> => {
  Alert.alert(
    '退会確認',
    '本当に退会しますか？この操作は元に戻せません。',
    [
      {
        text: 'キャンセル',
        style: 'cancel'
      },
      {
        text: '退会する',
        style: 'destructive',
        onPress: async (): Promise<void> => {
          try {
            // ユーザー情報の削除
            const userRef = doc(db, 'users', userId)
            await deleteDoc(userRef)

            // ストレージ内のユーザー関連ファイルの削除
            const userRefInStorage = ref(storage, `users/${userId}`)
            const { items } = await listAll(userRefInStorage)

            for (const itemRef of items) {
              await deleteObject(itemRef)
            }

            // Firebase Authentication のユーザーアカウント削除
            if (auth.currentUser) {
              await auth.currentUser.delete()
            }

            Alert.alert('退会が完了しました')
            router.push('auth/top')
          } catch (error) {
            console.error('退会に失敗しました:', error)
            Alert.alert('退会に失敗しました')
          }
        }
      }
    ]
  )
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
          <Button
            label='編集'
            buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30 }}
            labelStyle={{ fontSize: 24, lineHeight: 21 }}
            onPress={() => handlePress(id)}
          />
        )}
        {auth.currentUser?.uid === user?.id && (
          <Button
            label='退会'
            buttonStyle={{ width: '100%', marginTop: 16, alignItems: 'center', height: 30 }}
            labelStyle={{ fontSize: 24, color: 'red', lineHeight: 21 }}
            onPress={() => handleWithdraw(auth.currentUser.uid)}
          />
        )}
      </View>
      <View style={styles.subInner}>
        <Text style={styles.title}>あなたの釣果</Text>
        <View style={styles.tabs}>
          {areas.map((area) => (
            <TouchableOpacity
              key={area}
              style={[styles.tab, selectedArea === area && styles.selectedTab]}
              onPress={() => setSelectedArea(area)}
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

export default Mypage
