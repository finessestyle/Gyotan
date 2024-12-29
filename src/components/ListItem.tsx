import {
  View, Text, TouchableOpacity, StyleSheet, Image, Alert
} from 'react-native'
import { Link } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import { ref, deleteObject, listAll } from 'firebase/storage'
import { type Post } from '../../types/post'
import { auth, db, storage } from '../config'
import Icon from '../components/Icon'

interface Props {
  post: Post
}

const deleteFiles = async (postId: string): Promise<void> => {
  try {
    // Firestoreのドキュメント削除
    const postRef = doc(db, 'posts', postId)
    await deleteDoc(postRef)

    // posts/{postId} 内のすべてのファイルを削除
    const postRefInStorage = ref(storage, `posts/${postId}`)
    const { items } = await listAll(postRefInStorage)

    for (const itemRef of items) {
      await deleteObject(itemRef)
    }

    Alert.alert('削除が完了しました')
  } catch (error) {
    console.log(error)
    Alert.alert('削除に失敗しました')
  }
}

const handlePress = (id: string, post?: Post): void => {
  if (post === null) {
    Alert.alert('投稿が見つかりませんでした')
    return
  }
  if (auth.currentUser?.uid === post?.userId) {
    Alert.alert('投稿を削除します', 'よろしいですか？', [
      {
        text: 'キャンセル',
        style: 'cancel'
      },
      {
        text: '投稿を削除する',
        style: 'destructive',
        onPress: () => {
          void deleteFiles(id)
        }
      }
    ])
  }
}

const ListItem = (props: Props): JSX.Element | null => {
  const { post } = props
  const { images, length, weight, updatedAt, area } = post
  const imageUri = Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : undefined
  if (updatedAt === null || images === null || length === null || weight === null || area === null) { return null }
  // const dateString = post.updatedAt.toDate().toLocaleString('ja-JP')
  return (
    <Link
      href={{ pathname: '/post/detail', params: { id: post.id } }}
      asChild
    >
      <TouchableOpacity style={styles.listItem}>
        <View style={styles.fishImage}>
          <View>
            <Text style={styles.area}>{post?.area}</Text>
          </View>
          <Image
            style={styles.listItemImage}
            source={{ uri: imageUri }}
          />
          <View style={styles.fishInfo}>
            <Text style={styles.length}>{post?.length}cm / </Text>
            <Text style={styles.weight}>{post?.weight}g</Text>
          </View>
        </View>
        {auth.currentUser?.uid === post?.userId && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => { handlePress(post.id, post) }}>
            <Icon name='delete' size={32} color='#B0B0B0' />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 8,
    width: '50%',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  fishImage: {
    position: 'relative',
    marginHorizontal: 3,
    marginVertical: 3
  },
  area: {
    color: '#B0B0B0'
  },
  listItemImage: {
    height: 120,
    borderRadius: 8
  },
  fishInfo: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 4,
    right: 8
  },
  length: {
    color: '#ffffff',
    fontSize: 14
  },
  weight: {
    color: '#ffffff',
    fontSize: 14
  },
  deleteButton: {
    position: 'absolute',
    top: 20,
    right: 5
  }
})

export default ListItem
