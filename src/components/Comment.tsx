import { View, Text, TextInput, StyleSheet, Button, FlatList, Alert, TouchableOpacity, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { Link } from 'expo-router'
import { doc, getDoc, collection, onSnapshot, addDoc, query, orderBy, Timestamp } from 'firebase/firestore'
import { db, auth } from '../config'
import Modal from 'react-native-modal'

interface Comment {
  id: string
  text: string
  userId: string
  userName: string
  userImage: string
  updatedAt: Timestamp
}

interface Props {
  postId: string
}

const Comments = ({ postId }: Props): JSX.Element => {
  const [comments, setComments] = useState<Comment[]>([])
  const [input, setInput] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (postId === null) return
    const ref = collection(db, 'posts', postId, 'comments')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Comment[] = []
      snapshot.forEach((doc) => {
        const { text, userId, userName, userImage, updatedAt } = doc.data()
        list.push({ id: doc.id, text, userId, userName, userImage, updatedAt })
      })
      setComments(list)
    })
    return unsubscribe
  }, [postId])

  const handlePress = async () => {
    if (auth.currentUser === null || postId === null) return
    if (input.trim() === '') return

    const userId = auth.currentUser.uid
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)

    // ドキュメントが存在するか確認する
    if (!userDocSnap.exists()) {
      Alert.alert('エラー', 'ユーザー情報が見つかりません。')
      return
    }
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userData = userDoc.data()
    const userName = userData?.userName
    const userImage = userData?.userImage

    try {
      const ref = collection(db, 'posts', postId, 'comments')
      await addDoc(ref, {
        text: input,
        userId,
        userName,
        userImage,
        updatedAt: Timestamp.fromDate(new Date())
      })
      setInput('')
    } catch (error) {
      Alert.alert('コメントの投稿に失敗しました')
    }
  }

  return (
    <>
      {/* コメントボタン */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={{ color: '#467FD3', marginHorizontal: 16, marginBottom: 16 }}>コメントを見る / 投稿</Text>
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
        avoidKeyboard
        propagateSwipe
      >
        <View style={styles.modalContent}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Link href={{ pathname: '/user/detail', params: { id: item.userId } }} asChild>
                  <TouchableOpacity>
                    <View style={styles.commentHeader}>
                      {item?.userImage && (
                        <Image source={{ uri: item.userImage }} style={styles.userImage} />
                      )}
                      <Text style={styles.userName}>{item?.userName || '匿名ユーザー'}</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
            style={{ maxHeight: 300 }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="コメントを書く..."
              maxLength={100}
              style={styles.textInput}
            />
            <Button title="送信" onPress={() => { void handlePress() } } />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  commentItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  commentHeader: {
    flexDirection: 'row', // 横並び
    alignItems: 'center', // 縦方向中央
    marginBottom: 4
  },
  userImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#B0B0B0',
    flexShrink: 1
  },
  commentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#B0B0B0',
    flexWrap: 'wrap'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8
  }
})

export default Comments
