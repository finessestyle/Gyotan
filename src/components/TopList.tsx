import React, {
  View, Text, TouchableOpacity, StyleSheet, Image
} from 'react-native'
import { Link } from 'expo-router'
import { type Post } from '../../types/post'

interface Props {
  post: Post
}

const TopList = (props: Props): JSX.Element | null => {
  const { post } = props
  const { images, updatedAt } = post
  const imageUri = Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : undefined
  if (updatedAt === null || images === null) { return null }
  const dateString = post.updatedAt.toDate().toLocaleString('ja-JP')
  return (
    <Link
      href={{ pathname: '/post/detail', params: { id: post.id } }}
      asChild
    >
      <TouchableOpacity style={styles.listItem}>
        <Link href={{ pathname: '/user/detail', params: { id: post?.userId } }} asChild>
          <TouchableOpacity>
            <View style={styles.userInfo} >
              {post?.userImage !== null && <Image source={{ uri: post?.userImage }} style={styles.userImage} />}
              <Text style={styles.userName}>{post?.userName}さん</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <View style={styles.fishImage}>
          <Image
            style={styles.listItemImage}
            source={{ uri: imageUri }}
          />
          <View style={styles.fishInfo}>
            <Text style={styles.length}>{post?.length}cm / </Text>
            <Text style={styles.weight}>{post?.weight}g</Text>
          </View>
        </View>
        <View style={styles.date}>
          <Text style={styles.listItemDate}>投稿日：{dateString}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#ffffff',
    width: 'auto',
    borderWidth: 1,
    borderRadius: 16,
    borderColor: 'rgba(0,0,0,0.15)',
    height: 'auto',
    marginHorizontal: 8,
    marginBottom: 16
  },
  userInfo: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8
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
  fishImage: {
    position: 'relative'
  },
  fishInfo: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    right: 24
  },
  fishArea: {
    color: '#ffffff',
    fontSize: 24
  },
  length: {
    color: '#ffffff',
    fontSize: 24
  },
  weight: {
    color: '#ffffff',
    fontSize: 24
  },
  listItemImage: {
    width: 'auto',
    height: 300
  },
  date: {
    marginVertical: 8,
    marginHorizontal: 8,
    alignItems: 'flex-start'
  },
  listItemDate: {
    fontSize: 16,
    lineHeight: 16,
    color: '#848484'
  }
})

export default TopList
