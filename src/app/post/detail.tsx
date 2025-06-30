import {
  View, StyleSheet, Image, Text, ScrollView, TouchableOpacity
} from 'react-native'
import { router, useLocalSearchParams, Link } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type Post } from '../../../types/post'
import Swiper from 'react-native-swiper'
import { format } from 'date-fns'
import Button from '../../components/Button'
import Map from '../../components/Map'
import LikeButton from '../../components/LikeButton'
import ReportButton from '../../components/ReportButton'
// import DeleteButton from '../../components/DeleteButton'

const formatExifDateTime = (dateTime: unknown): string => {
  if (typeof dateTime !== 'string' || dateTime === null) return '不明'
  const properDateStr = dateTime.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3').replace(' ', 'T')
  const date = new Date(properDateStr)
  if (isNaN(date.getTime())) return '不明'
  return format(date, 'yyyy年 M月 d日 H時')
}

const handlePress = (id: string): void => {
  router.push({ pathname: 'post/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [post, setPost] = useState<Post | null>(null)
  const postImages = post !== null && Array.isArray(post.images) ? post.images : []

  useEffect(() => {
    if (auth.currentUser === null) return
    const postRef = doc(db, 'posts', id)
    const unsubscribe = onSnapshot(postRef, (postDoc) => {
      const { userId, userName, userImage, images, weather, length, weight, category, lure, lureAction, waterDepth, structure, cover, catchFish, area, fishArea, exifData, updatedAt, likes } = postDoc.data() as Post
      let newContent = `天気は${weather}。${fishArea}/${area}で${lure}を使用し、${structure}の${cover}を狙いました。`
      if (catchFish > 0) {
        newContent += `${waterDepth}を${lureAction}でアプローチしたところ、${length}cm/${weight}gのバスが釣れました。`
      } else {
        newContent += `${waterDepth}を${lureAction}アクションでアプローチしましたが、残念ながら今回は釣果がありませんでした。\n次回に期待です・・・。`
      }
      setPost({
        id: postDoc.id,
        userId,
        userName,
        userImage,
        images,
        exifData,
        area,
        fishArea,
        weather,
        length,
        weight,
        structure,
        cover,
        category,
        lure,
        lureAction,
        waterDepth,
        catchFish,
        content: newContent,
        updatedAt,
        likes
      })
    })
    return unsubscribe
  }, [id])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.postBody}>
          <Link href={{ pathname: '/user/detail', params: { id: post?.userId ?? 'default-id' } }} asChild>
            <TouchableOpacity>
              <View style={styles.userInfo} >
                <Text>投稿者  :  </Text>
                {post?.userImage !== null && <Image source={{ uri: post?.userImage }} style={styles.userImage} />}
                <Text style={styles.userName}>{post?.userName}さん</Text>
              </View>
            </TouchableOpacity>
          </Link>
          <LikeButton postId={id} userId={auth.currentUser.uid}/>
          {/* {post !== null && <DeleteButton post={post} />} */}
          <Swiper style={styles.swiper} showsButtons={false}>
            {postImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.fishImage} resizeMode='contain'/>
            ))}
          </Swiper>
          <View style={styles.fishTime}>
            <Text>
              {post?.exifData && post.exifData.length > 0 && post.exifData[0]?.dateTime
                ? `釣果日時  :  ${formatExifDateTime(post.exifData[0].dateTime)}`
                : post?.updatedAt
                  ? `投稿日時  :  ${post.updatedAt.toDate().toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`
                  : '日時不明'}
            </Text>
          </View>
          <View style={styles.fishingInfomation}>
            <View style={styles.leftInfo}>
              <Text>天気  :  {post?.weather}</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text>釣果数  :  {post?.catchFish}匹</Text>
            </View>
          </View>
          <View style={styles.fishingInfomation}>
            <View style={styles.leftInfo}>
              <Text>サイズ  :  {post?.length}cm</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text>重さ  :  {post?.weight}g</Text>
            </View>
          </View>
          <View style={styles.fishingInfomation}>
            <View style={styles.rightInfo}>
              <Text>ルアー  :  {post?.lure} / {post?.lureAction}</Text>
            </View>
          </View>
          <View style={styles.fishArea}>
            <Text>{post?.fishArea}  :  {post?.area}</Text>
          </View>
          <Map
            latitude={post?.exifData[0]?.latitude ?? 0}
            longitude={post?.exifData[0]?.longitude ?? 0}
            viewStyle={{ height: 300 }}
            showCircle
          />
          <View style={styles.fishInfo}>
            <Text>-釣果状況-</Text>
            <Text style={styles.fishText}>
              {post?.content}
            </Text>
          </View>
        </View>
        {auth.currentUser?.uid !== post?.userId && (
          <ReportButton postId={post?.id} userId={post?.userId} />
        )}
        {auth.currentUser?.uid === post?.userId && (
          <Button
            label='編集'
            buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30 }}
            labelStyle={{ fontSize: 24, lineHeight: 21 }}
            onPress={() => { handlePress(id) }}
          />
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    marginVertical: 16,
    marginHorizontal: 16
  },
  postBody: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    height: 'auto',
    borderRadius: 8
  },
  fishArea: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0'
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
    height: 400,
    width: 'auto',
    backgroundColor: '#B0B0B0'
  },
  userInfo: {
    height: 32,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    borderColor: '#B0B0B0'
  },
  userImage: {
    width: 20,
    height: 20,
    borderRadius: 20
  },
  userName: {
    paddingLeft: 8,
    fontSize: 16,
    lineHeight: 32,
    color: '#467FD3'
  },
  fishInfo: {
    height: 'auto',
    lineHeight: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishText: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000'
  },
  swiper: {
    height: 400
  }
})

export default Detail
