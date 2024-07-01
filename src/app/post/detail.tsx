import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams, Link } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { auth, db } from '../../config'
import { type Post } from '../../../types/post'
import { type User } from '../../../types/user'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import Map from '../../components/Map'

const handlePress = (id: string): void => {
  router.push({ pathname: '/post/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  console.log(id)
  const [post, setPost] = useState<Post | null>(null)
  const postImageUri = post !== null && Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : undefined
  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/posts`, id)
    const unsubscribe = onSnapshot(ref, (postDoc) => {
      const { title, images, weather, content, length, weight, lure, lureColor, catchFish, fishArea, updatedAt } = postDoc.data() as Post
      console.log(postDoc.data())
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

  console.log(id)
  const [user, setUser] = useState<User | null>(null)
  const userImageUri = user !== null && Array.isArray(user.image) && user.image.length > 0 ? user.image[0] : undefined
  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/users`, id)
    const unsubscribe = onSnapshot(ref, (userDoc) => {
      const { email, password, username, profile, image, updatedAt } = userDoc.data() as User
      console.log(userDoc.data())
      setUser({
        id: userDoc.id,
        email,
        password,
        username,
        profile,
        image,
        updatedAt
      })
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView>
        <Link href='/user/detail'>
          <TouchableOpacity>
            <View style={styles.userInfo} >
              <Image
                style={styles.userImage}
                source={{ uri: userImageUri }}
              />
              <Text style={styles.userName}>{user?.username}さん</Text>

            </View>
          </TouchableOpacity>
        </Link>
        <View style={styles.postBody}>
          <View style={styles.fishArea}>
            <Text>釣果エリア: {post?.fishArea}</Text>
          </View>
          <Map />
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
        <CircleButton onPress={() => { handlePress(id) }} style={{ bottom: 60 }}>
          <Icon name='pencil' size={40} color='#ffffff' />
        </CircleButton>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
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
