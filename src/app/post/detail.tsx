import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams, Link } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type Post } from '../../../types/post'
import Button from '../../components/Button'
import Map from '../../components/Map'
import Swiper from 'react-native-swiper'

const handlePress = (id: string): void => {
  router.push({ pathname: 'post/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [post, setPost] = useState<Post | null>(null)
  const postImages = post !== null && Array.isArray(post.images) ? post.images : []

  useEffect(() => {
    if (auth.currentUser === null) { return }

    const postRef = doc(db, 'posts', id)
    const unsubscribe = onSnapshot(postRef, (postDoc) => {
      const { userId, userName, userImage, title, images, weather, content, length, weight, lure, lureColor, catchFish, fishArea, updatedAt } = postDoc.data() as Post
      setPost({
        id: postDoc.id,
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
        updatedAt
      })
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <Link href={{ pathname: '/user/detail', params: { id: post?.userId } }} asChild>
          <TouchableOpacity>
            <View style={styles.userInfo} >
              {post?.userImage !== null && <Image source={{ uri: post?.userImage }} style={styles.userImage} />}
              <Text style={styles.userName}>{post?.userName}さん</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <View style={styles.postBody}>
          <View style={styles.fishArea}>
            <Text>釣果エリア: {post?.fishArea}</Text>
          </View>
          <Map latitude={35.284384374460465} longitude={136.24385162899472} />
          <View style={styles.fishTime}>
            <Text>釣果日時: {post?.updatedAt.toDate().toLocaleString('ja-JP')}</Text>
          </View>
          <Swiper style={styles.swiper} showsButtons={true}>
            {postImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.fishImage} />
            ))}
          </Swiper>
          <View style={styles.fishingInfomation}>
            <View style={styles.leftInfo}>
              <Text>天気: {post?.weather}</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text>釣果数: {post?.catchFish}匹</Text>
            </View>
          </View>
          <View style={styles.fishingInfomation}>
            <View style={styles.leftInfo}>
              <Text>サイズ: {post?.length}cm</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text>重さ: {post?.weight}g</Text>
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
        {auth.currentUser?.uid === post?.userId && (
          <Button
            label='編集'
            buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30 }}
            labelStyle={{ fontSize: 24, lineHeight: 21 }}
            onPress={() => { handlePress(id) }}
          />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  inner: {
    marginVertical: 24,
    marginHorizontal: 16
  },
  userInfo: {
    borderWidth: 1,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomWidth: 0,
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    borderColor: '#B0B0B0'
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 20
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
    marginBottom: 10,
    height: 'auto',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8
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
  },
  swiper: {
    height: 322
  }
})

export default Detail
