import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams, Link } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../config'
import { type Post } from '../../../types/post'
import Button from '../../components/Button'

const handlePress = (id: string): void => {
  router.push({ pathname: '/post/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [post, setPost] = useState<Post | null>(null)
  const [userName, setUserName] = useState<string>('ゲスト')
  const postImageUri = post !== null && Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : undefined

  useEffect(() => {
    if (auth.currentUser === null) { return }

    const postRef = doc(db, `users/${auth.currentUser.uid}/posts`, id)
    const unsubscribe = onSnapshot(postRef, (postDoc) => {
      const { title, images, weather, content, length, weight, lure, lureColor, catchFish, fishArea, updatedAt } = postDoc.data() as Post
      setPost({
        id: postDoc.id,
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
        updatedAt
      })
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const fetchUserName = async (): Promise<void> => {
      try {
        const userId = auth.currentUser?.uid
        if (userId === null) {
          const userDoc = await getDoc(doc(db, 'users', userId))
          if (userDoc.exists()) {
            const userData = userDoc.data() as { username?: string }
            setUserName(userData.username ?? 'ゲスト')
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error)
      }
    }
    void fetchUserName()
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <Link href='/user/detail'>
          <TouchableOpacity>
            <View style={styles.userInfo} >
              {/* <Image
                style={styles.userImage}
                source={{ uri: ImageUri }}
              /> */}
              <Text style={styles.userName}>{userName}さん</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <View style={styles.postBody}>
          <View style={styles.fishArea}>
            <Text>釣果エリア: {post?.fishArea}</Text>
          </View>
          <View style={styles.fishTime}>
            <Text>釣果日時: {post?.updatedAt.toDate().toLocaleString('ja-JP')}</Text>
          </View>
          <View>
            <Image
              style={styles.fishImage}
              source={{ uri: postImageUri }}
            />
          </View>
          <View style={styles.fishingInfomation}>
            <View style={styles.leftInfo}>
              <Text>天気: {post?.weather}</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text>釣果数: {post?.catchFish}</Text>
            </View>
          </View>
          <View style={styles.fishingInfomation}>
            <View style={styles.leftInfo}>
              <Text>サイズ: {post?.length}</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text>重さ: {post?.weight}</Text>
            </View>
          </View>
          <View style={styles.fishingInfomation}>
            <View style={styles.leftInfo}>
              <Text>ルアー: {post?.lure}</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text>カラー: {post?.lureColor}</Text>
            </View>
          </View>
          <View style={styles.fishInfo}>
            <Text>-釣果状況-</Text>
            <Text style={styles.fishText}>
              {post?.content}
            </Text>
          </View>
        </View>
        <Button label='編集' onPress={() => { handlePress(id) }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  inner: {
    marginVertical: 24,
    marginHorizontal: 8
  },
  userInfo: {
    height: 80,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 19,
    alignItems: 'center'
  },
  userImage: {
    width: 64,
    height: 64,
    borderRadius: 32
  },
  userName: {
    paddingLeft: 16,
    fontSize: 20,
    lineHeight: 32,
    color: '#467FD3'
  },
  postBody: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    marginHorizontal: 19,
    marginBottom: 10,
    height: 'auto'
  },
  fishArea: {
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishAreaImage: {
    height: 175,
    width: 'auto'
  },
  fishTime: {
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishingInfomation: {
    height: 32,
    width: 'auto',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#B0B0B0'
  },
  leftInfo: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0'
  },
  rightInfo: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fishImage: {
    height: 322,
    width: 'auto'
  },
  fishInfo: {
    height: 'auto',
    lineHeight: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000'
  }
})

export default Detail
