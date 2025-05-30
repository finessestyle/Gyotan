import {
  View, Text, StyleSheet, Image,
  FlatList, TouchableOpacity, Alert, ScrollView, Linking
} from 'react-native'
import { router, useNavigation, useFocusEffect } from 'expo-router'
import { useState, useEffect, useCallback } from 'react'
import { collection, onSnapshot, query, where, orderBy, doc, deleteDoc, Timestamp } from 'firebase/firestore'
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
        text: 'フォローユーザー',
        onPress: () => {
          router.push({ pathname: 'user/list', params: { id: userId } })
        }
      },
      {
        text: '問い合わせ',
        onPress: () => {
          void Linking.openURL('https://forms.gle/2apUPegk4WrNiMUv5')
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
  const [selectedArea, setSelectedArea] = useState<string>(areas[0])
  const isAnonymous = auth.currentUser?.isAnonymous === true

  const socialLinks = [
    { name: 'youtube', url: user?.userYoutube, color: '#FF0000' },
    { name: 'instagram', url: user?.userInstagram, color: '#E4405F' },
    { name: 'x-twitter', url: user?.userX, color: '#000000' },
    { name: 'tiktok', url: user?.userTiktok, color: '#69C9D0' }
  ]

  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogOutButton />
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser === null) return
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
        const data = userDoc.data() as User

        if (data === undefined || data === null) {
          setUser({
            id: auth.currentUser?.uid ?? '',
            userName: '',
            email: '',
            profile: '',
            userImage: '',
            userYoutube: '',
            userTiktok: '',
            userInstagram: '',
            userX: '',
            updatedAt: Timestamp.now(),
            followed: []
          })
        } else {
          setUser({
            id: userDoc.id,
            userName: data.userName,
            email: data.email,
            userImage: data.userImage,
            profile: data.profile,
            userYoutube: data.userYoutube,
            userTiktok: data.userTiktok,
            userInstagram: data.userInstagram,
            userX: data.userX,
            updatedAt: data.updatedAt,
            followed: data.followed
          })
        }
      })

      const postRef = collection(db, 'posts')
      const q = query(postRef, where('fishArea', '==', selectedArea), where('userId', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc'))
      const unsubscribePost = onSnapshot(q, (snapshot) => {
        const userPost: Post[] = []
        snapshot.forEach((doc) => {
          const {
            userId, userName, userImage, images, weather, content, length,
            weight, category, lure, lureAction, waterDepth, structure, cover, catchFish, fishArea, area, exifData, updatedAt, likes
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
            category,
            lure,
            lureAction,
            waterDepth,
            structure,
            cover,
            catchFish,
            fishArea,
            area,
            updatedAt,
            exifData,
            likes
          })
        })
        setPosts(userPost)
      })

      return () => {
        unsubscribeUser()
        unsubscribePost()
      }
    }, [selectedArea])
  )

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <View style={styles.innerTitle}>
          <Text style={styles.title}>マイページ</Text>
          {auth.currentUser?.uid === user?.id && !isAnonymous
            ? (
            <TouchableOpacity style={styles.setting} onPress={handlePress}>
              <FontAwesome6 size={24} name="gear" color='#D0D0D0' />
            </TouchableOpacity>)
            : null
          }
        </View>
        <View style={styles.userTop}>
          {isAnonymous || auth.currentUser === null
            ? (
            <View style={styles.userTop}>
              <View style={styles.userImageContainer}>
                <FontAwesome6 size={100} name='user' color={'#ffffff'}/>
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

        <View style={styles.userSnsTop}>
          {socialLinks.map((social, index) =>
            social.url?.trim()
              ? (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  void Linking.openURL(social.url)
                }}
                style={styles.userSns}
              >
                <FontAwesome6 size={30} name={social.name} color={social.color} />
              </TouchableOpacity>)
              : null
          )}
        </View>

        <View>
          <Text style={styles.title}>あなたの最新釣果</Text>
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
            initialNumToRender={5}
            ListEmptyComponent={
              <View style={{ padding: 20 }}>
                <Text>投稿がありません...。</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    paddingHorizontal: 16
  },
  innerTitle: {
    flexDirection: 'row'
  },
  setting: {
    marginLeft: 'auto',
    marginRight: 8,
    marginTop: 24
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    paddingVertical: 16
  },
  userTop: {
    alignItems: 'center'
  },
  userImage: {
    width: 160,
    height: 160,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 150,
    marginBottom: 16
  },
  userImageContainer: {
    width: 160,
    height: 160,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
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
  userSnsTop: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  userSns: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    margin: 8
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  tab: {
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
