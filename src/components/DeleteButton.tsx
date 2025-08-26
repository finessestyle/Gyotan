import { TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import { ref, deleteObject, listAll } from 'firebase/storage'
import { auth, db, storage } from '../config'
import { type Post } from '../../types/post'
import Button from '../components/Button'

interface Props {
  post: Post
}

const deleteFiles = async (postId: string): Promise<void> => {
  router.replace('/post/top')
  try {
    const postRef = doc(db, 'posts', postId)
    await deleteDoc(postRef)
    const postRefInStorage = ref(storage, `posts/${postId}`)
    const { items } = await listAll(postRefInStorage)

    for (const itemRef of items) {
      await deleteObject(itemRef)
    }
    router.replace('/post/top')
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
    <Button
      label='投稿削除'
      buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30, backgroundColor: 'red', marginBottom: 8 }}
      labelStyle={{ fontSize: 24, lineHeight: 21 }}
      onPress={() => { handlePress(post.id, post) }}
    />
  )
}

export default DeleteButton
