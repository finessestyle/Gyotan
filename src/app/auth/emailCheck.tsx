import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import { auth } from '../../config'
import { router } from 'expo-router'
import { sendEmailVerification } from 'firebase/auth'
import { Ionicons } from '@expo/vector-icons'

const EmailCheck = (): JSX.Element => {
  const [checking, setChecking] = useState(false)

  const checkVerification = async (): Promise<void> => {
    setChecking(true)
    try {
      await auth.currentUser?.reload()
      const user = auth.currentUser
      if (user.emailVerified) {
        Alert.alert('認証完了', 'メールアドレスが確認されました')
        router.replace('/post/top')
      } else {
        Alert.alert('未確認', 'まだメールが確認されていません')
      }
    } catch (e) {
      Alert.alert('エラー', '確認中に問題が発生しました')
    } finally {
      setChecking(false)
    }
  }

  const resendVerification = async (): Promise<void> => {
    const user = auth.currentUser
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user)
        Alert.alert('再送信完了', '確認メールを再送しました')
      } catch (e) {
        Alert.alert('送信エラー', '確認メールの送信に失敗しました')
      }
    }
  }

  return (
    <View style={styles.container}>
      <Ionicons name="mail-open-outline" size={120} color="#3478f6" style={{ marginBottom: 24 }} />
      <Text style={styles.title}>確認メールを送信しました</Text>
      <Text style={styles.description}>
        登録したメールアドレスを確認して、リンクをクリックしてください。
      </Text>

      <TouchableOpacity style={styles.button} onPress={checkVerification} disabled={checking}>
        <Text style={styles.buttonText}>認証確認</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendButton} onPress={resendVerification}>
        <Text style={styles.resendText}>メールが届かない場合はこちら</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 24
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24
  },
  button: {
    backgroundColor: '#3478f6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  resendButton: {
    marginTop: 8
  },
  resendText: {
    color: '#3478f6',
    fontSize: 14
  }
})

export default EmailCheck
