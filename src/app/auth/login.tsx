import {
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../config'
import { doc, updateDoc } from 'firebase/firestore'
import Button from '../../components/Button'
import { Ionicons } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'

const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
  // Check and request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') {
    // If permissions are not granted, return undefined or handle appropriately
    console.log('Failed to get push token for push notification!')
    return undefined
  }

  // Get the Expo push token
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data
    console.log('Expo Push Token:', token)
    return token
  } catch (error) {
    console.error('Error getting Expo push token:', error)
    return undefined
  }
}

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
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Expo Push Token を取得
    const token = await registerForPushNotificationsAsync()
    if (typeof token === 'string' && token.trim() !== '') {
      // Firestore に保存
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        expoPushToken: token
      })
    }
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
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>ログイン</Text>
        <TextInput
          style={styles.input}
          value={email}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='メールアドレスを入力'
          placeholderTextColor="#CCCCCC"
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
            placeholderTextColor="#CCCCCC"
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
        <Button
          label='ログイン'
          onPress={() => { void handlePress(email, password) }}
          buttonStyle={{ width: '100%', marginTop: 8 }}
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
      </ScrollView>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 40,
    fontSize: 16,
    marginBottom: 16
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 20,
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
    lineHeight: 16,
    color: '#467FD3',
    marginBottom: 8
  }
})

export default LogIn
