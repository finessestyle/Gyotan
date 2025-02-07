import {
  View, Text, StyleSheet, Image,
  FlatList, TouchableOpacity, Alert, ScrollView
} from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject, listAll } from 'firebase/storage'
import { auth, db, storage } from '../../config'
import { deleteUser } from 'firebase/auth'
import { type User } from '../../../types/user'
import { type Post } from '../../../types/post'
import ListItem from '../../components/ListItem'
import LogOutButton from '../../components/LogOutButton'
import { FontAwesome6 } from '@expo/vector-icons'

const handlePress = (): void => {
  const userId = auth.currentUser?.uid
  if (userId === undefined || userId === null || userId === '') return
  Alert.alert(
    '選択してください',
    undefined,
    [
      {
        text: '編集',
        onPress: () => {
          router.push({ pathname: 'user/edit', params: { id: userId } })
        }
      },
      {
        text: '退会',
        onPress: () => {
          void handleWithdraw(userId)
        },
        style: 'destructive'
      },
      {
        text: 'キャンセル',
        style: 'cancel'
      }
    ]
  )
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

const handleWithdraw = async (userId: string): Promise<void> => {
  if (userId === undefined || userId === null || userId === '') {
    Alert.alert('ユーザーが見つかりませんでした')
    return
  }

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

const handleDeleteUser = async (userId: string): Promise<void> => {
  try {
    await deleteFiles(userId)
    if (auth.currentUser !== null) {
      await deleteUser(auth.currentUser)
      Alert.alert('退会が完了しました')
      router.replace('/auth/signup')
    }
  } catch (error) {
    console.log(error)
    Alert.alert('退会に失敗しました')
  }
}

const Mypage = (): JSX.Element => {
  const areas = ['北湖北岸', '北湖東岸', '北湖西岸', '南湖東岸', '南湖西岸']
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
          userId, userName, userImage, images, weather, content, length,
          weight, lure, lureAction, structure, cover, catchFish, fishArea, area, exifData, updatedAt
        } = doc.data()
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
  }, [selectedArea])

  const isAnonymous = auth.currentUser?.isAnonymous === true

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <View style={styles.innerTitle}>
          <Text style={styles.title}>マイページ</Text>
          {auth.currentUser?.uid === user?.id && (
            <TouchableOpacity style={styles.setting} onPress={handlePress}>
              <FontAwesome6 size={24} name="gear" color='#D0D0D0' />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.userTop}>
          {isAnonymous
            ? (
            <View style={styles.userTop}>
              <View style={styles.userImageContainer}>
                <FontAwesome6 size={130} name='user' color={'#ffffff'}/>
              </View>
              <Text style={styles.userName}>ゲストさん</Text>
            </View>)
            : (
            <>
            <Image
              source={{ uri: user?.userImage }}
              style={styles.userImage}
            />
            <Text style={styles.userName}>{user?.userName}さん</Text>
            <Text style={styles.userProfile}>{user?.profile}</Text>
            </>)
          }
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
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F4F8'
  },
  inner: {
    marginVertical: 24,
    paddingHorizontal: 8
  },
  innerTitle: {
    flexDirection: 'row'
  },
  setting: {
    marginLeft: 'auto',
    marginRight: 16,
    marginTop: 4
  },
  subInner: {
    marginVertical: 24,
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
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 150,
    marginBottom: 8
  },
  userImageContainer: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150
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
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  listContainer: {
    height: 170,
    marginBottom: 16
  }
})

export default Mypage
