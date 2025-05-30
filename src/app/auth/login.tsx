import {
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config'
import Button from '../../components/Button'
import { Ionicons } from '@expo/vector-icons'

const handlePress = async (email: string, password: string): Promise<void> => {
  try {
    if (email === '') {
      Alert.alert('エラー', 'メールアドレスを入力してください')
      return
    }
    if (password === '') {
      Alert.alert('エラー', 'パスワードを入力してください')
      return
    }
    await signInWithEmailAndPassword(auth, email, password)
    router.replace('post/top')
  } catch (error) {
    Alert.alert('ログインに失敗しました')
  }
}

const LogIn = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ログイン</Text>
        <TextInput
          style={styles.input}
          value={email}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='メールアドレスを入力'
          textContentType='emailAddress'
          returnKeyType='done'
          onChangeText={(text) => { setEmail(text) }}
        />
        <View>
          <TextInput
            style={styles.input}
            value={password}
            autoCapitalize='none'
            secureTextEntry={!isPasswordVisible}
            placeholder='パスワードを入力'
            textContentType='password'
            returnKeyType='done'
            onChangeText={(text) => { setPassword(text) }}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => { setIsPasswordVisible(!isPasswordVisible) }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <Button label='ログイン' onPress={() => {
          void handlePress(
            email,
            password
          )
        }}
          buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 32 }}
          labelStyle={{ fontSize: 24, lineHeight: 22 }}
        />
        <View style={styles.footer}>
          <Link replace href='/auth/signup' asChild >
            <TouchableOpacity>
              <Text style={styles.footerLink}>新規登録はこちらをクリック</Text>
            </TouchableOpacity>
          </Link>
          <Link replace href='/auth/passwordReset' asChild >
            <TouchableOpacity>
              <Text style={styles.footerLink}>パスワードを忘れた場合はこちらをクリック</Text>
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
    paddingHorizontal: 16
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginVertical: 24
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 32,
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 16,
    transform: [{ translateY: -12 }]
  },
  footer: {
    flexDirection: 'column',
    marginTop: 16
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
    color: '#000000'
  },
  footerLink: {
    fontSize: 14,
    lineHeight: 24,
    color: '#467FD3',
    marginBottom: 8
  }
})

export default LogIn
