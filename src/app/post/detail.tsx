import { View, StyleSheet, Image, Text } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { auth, db } from '../../config'
import { type Post } from '../../../types/post'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import GoogleMap from '../../components/GoogleMap'

const handlePress = (): void => {
  router.push('/post/edit')
}

const Detail = (): JSX.Element => {
  const { id } = useLocalSearchParams()
  console.log(id)
  const [post, setPost] = useState<Post | null>(null)
  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/posts`, String(id))
    onSnapshot(ref, (postDoc) => {
      const { title, images, weather, content, weight, lure, lureColor, catchFish, fishArea, updatedAt } = postDoc.data() as Post
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
  })
  return (
    <View style={styles.container}>
      <View style={styles.userInfo} >
        <Image style={styles.userImage} source={ require('../../../assets/2.jpeg') } />
        <Text style={styles.userName} onPress={handlePress}>フィネススタイルさん</Text>
      </View>
      <View style={styles.postBody}>
        <View style={styles.fishArea}>
          <Text>釣果エリア: {post?.fishArea}</Text>
        </View>
        <GoogleMap />
        <View style={styles.fishTime}>
          <Text>釣果日時: {post?.updatedAt.toDate().toLocaleString('ja-JP')}</Text>
        </View>
        <View>
          <Image style={styles.fishImage} source={ require('../../../assets/1.jpeg') } />
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
      <CircleButton onPress={handlePress}>
        <Icon name='pencil' size={40} color='#ffffff' />
      </CircleButton>
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
