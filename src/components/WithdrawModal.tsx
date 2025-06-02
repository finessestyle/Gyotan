import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import Modal from 'react-native-modal'
import { auth, db, storage } from '../config'
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth'
import { router } from 'expo-router'
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject, listAll } from 'firebase/storage'

interface Props {
  visible: boolean
  onClose: () => void
  userId?: string
  postId?: []
}

const WithdrawModal = (props: Props): JSX.Element => {
  const { visible, onClose } = props
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleWithdraw = async (): Promise<void> => {
    const user = auth.currentUser
    const userId = auth.currentUser?.uid

    if (!user || !user.email || !userId) {
      Alert.alert('エラー', 'ユーザー情報が見つかりません')
      return
    }
    try {
      setLoading(true)
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(user, credential)
      await deleteFiles(userId)
      await deleteUser(user)
      Alert.alert('退会が完了しました')
      onClose()
      router.replace('/auth/firststep')
    } catch (error: any) {
      console.log(error)
      if (error.code === 'auth/wrong-password') {
        Alert.alert('エラー', 'パスワードが間違っています')
      } else {
        Alert.alert('退会に失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteFiles = async (userId: string): Promise<void> => {
    try {
      const userRef = doc(db, 'users', userId)
      await deleteDoc(userRef)
    } catch (e) {
      console.warn(`ユーザードキュメント削除失敗: ${userId}`, e)
    }

    try {
      const userImageRef = ref(storage, `users/${userId}/userImage.jpg`)
      await deleteObject(userImageRef)
    } catch (e) {
      console.warn(`ユーザー画像削除失敗: ${userId}`, e)
    }

    try {
      const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId))
      const querySnapshot = await getDocs(postsQuery)

      for (const docSnap of querySnapshot.docs) {
        const postId = docSnap.id

        try {
          await deleteDoc(doc(db, 'posts', postId))
        } catch (e) {
          console.warn(`Firestore ドキュメント削除失敗: ${postId}`, e)
        }

        try {
          const postFolderRef = ref(storage, `posts/${postId}`)
          const listResult = await listAll(postFolderRef)

          for (const itemRef of listResult.items) {
            try {
              await deleteObject(itemRef)
            } catch (e) {
              console.warn(`画像削除失敗: ${itemRef.fullPath}`, e)
            }
          }
        } catch (e) {
          console.warn(`Storage フォルダ取得失敗: ${postId}`, e)
        }
      }
    } catch (e) {
      console.warn(`投稿データ取得失敗: ${userId}`, e)
    }
  }

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modal}>
        <Text style={styles.title}>退会確認</Text>
        <Text style={styles.text}>パスワードを入力してください</Text>
        <TextInput
          placeholder="パスワード"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title={loading ? '処理中...' : '退会する'}
          onPress={() => {
            void handleWithdraw()
          }}
          disabled={loading}
        />

        <View style={{ marginTop: 8 }}>
          <Button title="キャンセル" onPress={onClose} color="gray" />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
    marginBottom: 12
  }
})

export default WithdrawModal
