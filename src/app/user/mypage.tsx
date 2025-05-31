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

// Constants for areas
const AREAS = ['北湖北岸', '北湖東岸', '北湖西岸', '南湖東岸', '南湖西岸']

const Mypage = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedArea, setSelectedArea] = useState<string>(AREAS[0])

  const navigation = useNavigation()
  const currentUser = auth.currentUser
  const isAnonymous = currentUser?.isAnonymous === true

  // Set header options on mount
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogOutButton />
    })
  }, [navigation])

  // --- Firebase Operations ---

  /**
   * Deletes user-related files and data from Firestore and Storage.
   * @param userId The ID of the user to delete.
   */
  const deleteUserData = async (userId: string): Promise<void> => {
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', userId))

      // Delete user's images from Firebase Storage
      const userStorageRef = ref(storage, `users/${userId}`)
      const { items: userItems } = await listAll(userStorageRef)
      for (const itemRef of userItems) {
        await deleteObject(itemRef)
      }
      console.log('User data and files successfully deleted.')
    } catch (error) {
      console.error('Error deleting user data and files:', error)
      throw new Error('Failed to delete user data.')
    }
  }

  /**
   * Handles the complete user withdrawal process.
   * @param userId The ID of the user to withdraw.
   */
  const handleWithdrawal = async (userId: string): Promise<void> => {
    try {
      if (!currentUser) {
        Alert.alert('エラー', '現在ログイン中のユーザーが見つかりません。')
        return
      }

      await deleteUserData(userId) // Delete data from Firestore and Storage
      await deleteUser(currentUser) // Delete user from Firebase Authentication

      Alert.alert('退会完了', 'アカウントの退会が完了しました。ご利用ありがとうございました。')
      router.replace('/auth/firststep') // Navigate to signup page after successful withdrawal
    } catch (error) {
      console.error('Error during withdrawal:', error)
      Alert.alert('退会失敗', '退会処理中にエラーが発生しました。再度お試しください。')
    }
  }

  /**
   * Confirms user withdrawal with an alert.
   * @param userId The ID of the user to withdraw.
   */
  const confirmWithdrawal = (userId: string): void => {
    Alert.alert(
      '退会の確認',
      '本当に退会しますか？この操作は元に戻せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '退会する',
          style: 'destructive',
          onPress: () => { void handleWithdrawal(userId) }
        }
      ]
    )
  }

  // --- UI Related Functions ---

  /**
   * Handles the press on the settings gear icon, showing action options.
   */
  const handleSettingsPress = (): void => {
    if (!currentUser?.uid) {
      Alert.alert('エラー', 'ユーザー情報が取得できませんでした。')
      return
    }

    Alert.alert(
      'オプションを選択',
      undefined,
      [
        {
          text: 'プロフィール編集',
          onPress: () => { router.push({ pathname: 'user/edit', params: { id: currentUser.uid } }) }
        },
        {
          text: 'フォローユーザー',
          onPress: () => { router.push({ pathname: 'user/list', params: { id: currentUser.uid } }) }
        },
        {
          text: 'お問い合わせ',
          onPress: () => { void Linking.openURL('https://forms.gle/2apUPegk4WrNiMUv5') }
        },
        {
          text: '退会',
          onPress: () => { confirmWithdrawal(currentUser.uid) },
          style: 'destructive'
        },
        { text: 'キャンセル', style: 'cancel' }
      ]
    )
  }

  // --- Data Fetching with useFocusEffect ---

  useFocusEffect(
    useCallback(() => {
      if (!currentUser) {
        console.log('No user logged in, skipping data fetch.')
        return
      }

      // Fetch user data
      const userDocRef = doc(db, 'users', currentUser.uid)
      const unsubscribeUser = onSnapshot(userDocRef, (userDoc) => {
        const data = userDoc.data() as User | undefined
        if (data) {
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
        } else {
          // Handle case where user document might not exist (e.g., new anonymous user)
          setUser({
            id: currentUser.uid,
            userName: '名無し', // Default name for new users or anonymous
            email: currentUser.email || '',
            profile: 'プロフィールが設定されていません。',
            userImage: '',
            userYoutube: '',
            userTiktok: '',
            userInstagram: '',
            userX: '',
            updatedAt: Timestamp.now(),
            followed: []
          })
        }
      }, (error) => {
        console.error('Error fetching user data:', error)
        Alert.alert('エラー', 'ユーザー情報の取得に失敗しました。')
      })

      // Fetch user's posts based on selected area
      const postsCollectionRef = collection(db, 'posts')
      const q = query(
        postsCollectionRef,
        where('fishArea', '==', selectedArea),
        where('userId', '==', currentUser.uid),
        orderBy('updatedAt', 'desc')
      )
      const unsubscribePost = onSnapshot(q, (snapshot) => {
        const fetchedPosts: Post[] = []
        snapshot.forEach((postDoc) => {
          const postData = postDoc.data()
          fetchedPosts.push({
            id: postDoc.id,
            userId: postData.userId,
            userName: postData.userName,
            userImage: postData.userImage,
            images: postData.images,
            weather: postData.weather,
            content: postData.content,
            length: postData.length,
            weight: postData.weight,
            category: postData.category,
            lure: postData.lure,
            lureAction: postData.lureAction,
            waterDepth: postData.waterDepth,
            structure: postData.structure,
            cover: postData.cover,
            catchFish: postData.catchFish,
            fishArea: postData.fishArea,
            area: postData.area,
            updatedAt: postData.updatedAt,
            exifData: postData.exifData,
            likes: postData.likes
          })
        })
        setPosts(fetchedPosts)
      }, (error) => {
        console.error('Error fetching posts:', error)
        Alert.alert('エラー', '釣果情報の取得に失敗しました。')
      })

      // Cleanup function for subscriptions
      return () => {
        unsubscribeUser()
        unsubscribePost()
      }
    }, [selectedArea, currentUser?.uid]) // Re-run if selectedArea or current user ID changes
  )

  // Social media links configuration
  const socialLinks = [
    { name: 'youtube', url: user?.userYoutube, color: '#FF0000' },
    { name: 'instagram', url: user?.userInstagram, color: '#E4405F' },
    { name: 'x-twitter', url: user?.userX, color: '#000000' },
    { name: 'tiktok', url: user?.userTiktok, color: '#69C9D0' }
  ]

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <View style={styles.innerTitle}>
          <Text style={styles.title}>マイページ</Text>
          {currentUser?.uid === user?.id && !isAnonymous && (
            <TouchableOpacity style={styles.setting} onPress={handleSettingsPress}>
              <FontAwesome6 size={24} name="gear" color='#D0D0D0' />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.userTop}>
          {isAnonymous || !currentUser
            ? (
              <View style={styles.userTop}>
                <View style={styles.userImageContainer}>
                  <FontAwesome6 size={100} name='user' color={'#ffffff'} />
                </View>
                <Text style={styles.userName}>ゲストさん</Text>
              </View>
              )
            : (
              <>
                <Image
                  source={{ uri: user?.userImage || 'https://via.placeholder.com/160' }} // Fallback image
                  style={styles.userImage}
                />
                <Text style={styles.userName}>{user?.userName || '名無し'}さん</Text>
                <Text style={styles.userProfile}>{user?.profile || 'プロフィールが設定されていません。'}</Text>
              </>
              )}
        </View>

        <View style={styles.userSnsTop}>
          {socialLinks.map((social, index) =>
            social.url?.trim()
              ? (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    void Linking.openURL(social.url as string).catch(err =>
                      console.error('Failed to open URL:', social.url, err)
                    )
                  }}
                  style={styles.userSns}
                >
                  <FontAwesome6 size={30} name={social.name} color={social.color} />
                </TouchableOpacity>
                )
              : null
          )}
        </View>

        <View>
          <Text style={styles.title}>あなたの最新釣果</Text>
          <View style={styles.tabs}>
            {AREAS.map((area) => (
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
              <View style={styles.emptyListContainer}>
                <Text>選択されたエリアでの投稿がありません。</Text>
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
    flexDirection: 'row',
    alignItems: 'center' // Align items vertically in the center
  },
  setting: {
    marginLeft: 'auto',
    marginRight: 8,
    marginTop: 24 // Keep some margin for alignment with title
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    paddingVertical: 16
  },
  userTop: {
    alignItems: 'center',
    marginBottom: 16
  },
  userImage: {
    width: 160,
    height: 160,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 80, // Half of width/height for perfect circle
    marginBottom: 16,
    backgroundColor: '#E0E0E0' // Placeholder background
  },
  userImageContainer: {
    width: 160,
    height: 160,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80, // Half of width/height for perfect circle
    marginBottom: 8
  },
  userName: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333'
  },
  userProfile: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  userSnsTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24
  },
  userSns: {
    width: 44, // Slightly larger touch target
    height: 44, // Slightly larger touch target
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22, // Half of width/height for perfect circle
    marginHorizontal: 8 // Consistent spacing
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 4
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  selectedTab: {
    borderBottomColor: '#467FD3'
  },
  tabText: {
    fontSize: 16,
    color: '#467FD3',
    fontWeight: '500'
  },
  listContainer: {
    height: 170, // Maintain a fixed height for the horizontal list
    paddingRight: 16 // Add some padding to the end of the horizontal list
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%' // Ensure it takes full width for centering
  }
})

export default Mypage
