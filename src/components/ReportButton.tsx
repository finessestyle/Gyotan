import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from '../config'

interface Props {
  postId: string
  userId: string
}

const ReportButton = (props: Props): JSX.Element => {
  const { postId, userId } = props
  const handleReport = async (): Promise<void> => {
    if (auth.currentUser === null) return
    try {
      const reportData = {
        reporterId: auth.currentUser.uid,
        reportedUserId: userId,
        postId,
        reason: '不適切な投稿',
        reportedAt: new Date()
      }
      await addDoc(collection(db, 'reports'), reportData)
      Alert.alert('通報完了', 'この投稿を通報しました。ご協力ありがとうございます。')
    } catch (error) {
      console.error('通報エラー:', error)
      Alert.alert('通報失敗', '通報に失敗しました。もう一度お試しください。')
    }
  }

  const handleBlock = async (): Promise<void> => {
    if (auth.currentUser === null) return
    try {
      const blockData = {
        blockerId: auth.currentUser.uid,
        blockedUserId: userId,
        blockedAt: new Date()
      }
      await addDoc(collection(db, 'blocks'), blockData)
      Alert.alert('ブロック完了', 'このユーザーをブロックしました。')
    } catch (error) {
      console.error('ブロックエラー:', error)
      Alert.alert('ブロック失敗', 'ブロックに失敗しました。もう一度お試しください。')
    }
  }

  return (
    <View style={styles.reports}>
      <TouchableOpacity style={styles.reportButton} onPress={handleReport} >
        <Text style={styles.reportText}>通報 🚩</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.blockButton} onPress={handleBlock} >
        <Text style={styles.reportText}>ブロック 🚫</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  reports: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 8,
    gap: 12
  },
  reportButton: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ff6961',
    backgroundColor: '#ffe5e5',
    paddingVertical: 6,
    paddingHorizontal: 16
  },
  blockButton: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#999',
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 16
  },
  reportText: {
    color: '#333',
    fontWeight: '600'
  }
})

export default ReportButton
