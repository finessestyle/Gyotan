import { View, Text, TextInput, StyleSheet, Button, FlatList, Alert, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, addDoc, query, orderBy, Timestamp } from 'firebase/firestore'
import { db, auth } from '../config'
import Modal from 'react-native-modal'

interface Comment {
  id: string
  text: string
  userId: string
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
    if (!postId) return
    const ref = collection(db, 'posts', postId, 'comments')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Comment[] = []
      snapshot.forEach((doc) => {
        const { text, userId, updatedAt } = doc.data()
        list.push({ id: doc.id, text, userId, updatedAt })
      })
      setComments(list)
    })
    return unsubscribe
  }, [postId])

  const handlePress = async () => {
    if (!auth.currentUser || !postId) return
    if (input.trim() === '') return

    try {
      const ref = collection(db, 'posts', postId, 'comments')
      await addDoc(ref, {
        text: input,
        userId: auth.currentUser.uid,
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
                <Text>{item.text}</Text>
              </View>
            )}
            style={{ maxHeight: 300 }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="コメントを書く..."
              style={styles.textInput}
            />
            <Button title="送信" onPress={handlePress} />
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
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: '#ccc'
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
