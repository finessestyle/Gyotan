import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

const handleResetPassword = async (email: string): Promise<void> => {
  const auth = getAuth()

  try {
    await sendPasswordResetEmail(auth, email)
    Alert.alert('成功', 'パスワードリセットのメールを送信しました。')
    router.push('/auth/login')
  } catch (error: any) {
    console.error(error)
    Alert.alert('エラー', 'リセットメールの送信に失敗しました。メールアドレスを確認してください。')
  }
}

const passwordReset = (): JSX.Element => {
  const [email, setEmail] = useState('')

  return (
    <View style={styles.container}>
      <Text>登録したメールアドレスを入力してください</Text>
      <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="リセットメールを送信" onPress={() => { void handleResetPassword(email) }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff'
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10
  }
})

export default passwordReset
