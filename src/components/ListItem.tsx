import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'
import { Link } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { type Post } from '../../types/post'
import { auth, db, storage } from '../config'
import Icon from '../components/Icon'

interface Props {
  post: Post
}

const handlePress = (id: string, post?: Post): void => {
  if (auth.currentUser?.uid === post?.userId) {
    const postRef = doc(db, 'posts', id)
    const storageRef = ref(storage, `posts/${id}`)

    Alert.alert('投稿を削除します', 'よろしいですか？', [
      {
        text: 'キャンセル'
      },
      {
        text: '削除する',
        style: 'destructive',
        onPress: () => {
          const deletePost = async (): Promise<void> => {
            try {
              await deleteDoc(postRef)
              await deleteObject(storageRef)
              Alert.alert('削除が完了しました')
            } catch (error) {
              console.log('ファイルが存在しません:', error)
              Alert.alert('削除に失敗しました')
            }
          }
          void deletePost()
        }
      }
    ])
  }
}

const ListItem = (props: Props): JSX.Element | null => {
  const { post } = props
  const { title, images, updatedAt } = post
  const imageUri = Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : undefined
  if (title === null || updatedAt === null || images === null) { return null }
  const dateString = post.updatedAt.toDate().toLocaleString('ja-JP')
  return (
    <Link
      href={{ pathname: '/post/detail', params: { id: post.id } }}
      asChild
    >
      <TouchableOpacity style={styles.listItem}>
        <View>
          <Image
            style={styles.listItemImage}
            source={{ uri: imageUri }}
          />
        </View>
        <View>
          <Text style={styles.listItemTitle}>{post.title}</Text>
          <Text style={styles.listItemDate}>{dateString}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => { handlePress(post.id, post) }}>
          <Icon name='delete' size={32} color='#B0B0B0' />
        </TouchableOpacity>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 19,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    height: 80,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8
  },
  listItemImage: {
    width: 80,
    height: 64
  },
  listItemTitle: {
    paddingLeft: 16,
    fontSize: 16,
    lineHeight: 16
  },
  listItemDate: {
    paddingLeft: 16,
    fontSize: 12,
    lineHeight: 16,
    color: '#848484'
  },
  deleteButton: {
    position: 'absolute',
    right: 19
  }
})

export default ListItem
