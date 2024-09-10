import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
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
        <View>
          <Link href={{ pathname: '/user/detail', params: { id: post?.userId } }} asChild>
            <TouchableOpacity>
              <View style={styles.userInfo} >
                {post?.userImage !== null && <Image source={{ uri: post?.userImage }} style={styles.userImage} />}
                <Text style={styles.userName}>{post?.userName}さん</Text>
              </View>
            </TouchableOpacity>
          </Link>
          <Image
            style={styles.listItemImage}
            source={{ uri: imageUri }}
          />
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
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(0,0,0,0.15)',
    height: 'auto',
    marginHorizontal: 16
  },
  userInfo: {
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
  listItemImage: {
    width: 320,
    height: 300,
    borderRadius: 20
  },
  date: {
    marginVertical: 8
  },
  listItemDate: {
    fontSize: 16,
    lineHeight: 16,
    color: '#848484'
  }
})

export default TopList
