import { TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { deleteDoc, doc } from 'firebase/firestore'
import { ref, deleteObject, listAll } from 'firebase/storage'
import { auth, db, storage } from '../config'
import { type Post } from '../../types/post'
import Icon from './Icon'

interface Props {
  post: Post
}

const deleteFiles = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId)
    await deleteDoc(postRef)

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

const DeleteButton = ({ post }: Props): JSX.Element | null => {
  if (auth.currentUser?.uid !== post.userId) return null

  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        handlePress(post.id, post)
      }}
    >
      <Icon name="delete" size={32} color="#B0B0B0" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  deleteButton: {
    position: 'absolute',
    right: 5
  }
})

export default DeleteButton
