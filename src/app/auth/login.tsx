import {
  View, Text, TextInput, Alert, TouchableOpacity, StyleSheet
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config'
import Button from '../../components/Button'

const handlePress = async (email: string, password: string): Promise<void> => {
  try {
    await auth.signOut()
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log(userCredential.user.uid)
    router.replace('post/top')
  } catch (error) {
    Alert.alert('ログインに失敗しました')
  }
}

const LogIn = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ログイン</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text) }}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='メールアドレスを入力'
          textContentType='emailAddress'
          returnKeyType='done'
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => { setPassword(text) }}
          autoCapitalize='none'
          secureTextEntry
          placeholder='パスワードを入力'
          textContentType='password'
          returnKeyType='done'
        />
        <Button label='ログイン' onPress={() => { void handlePress(email, password) }} />
        <View style={styles.footer}>
          <Link href='/auth/signup' asChild replace>
            <TouchableOpacity>
              <Text style={styles.footerLink}>新規会員登録はこちらをクリック</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    paddingVertical: 24,
    paddingHorizontal: 27
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 48,
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
    color: '#000000'
  },
  footer: {
    flexDirection: 'row'
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
    color: '#000000'
  },
  footerLink: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 24,
    color: '#467FD3'
  }
})

export default LogIn
