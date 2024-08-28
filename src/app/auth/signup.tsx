import {
  View, Text, TextInput, Alert,
  StyleSheet, TouchableOpacity, Image
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db, storage } from '../../config'
import { doc, setDoc } from 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Button from '../../components/Button'

const handlePress = async (
  email: string,
  password: string,
  userName: string,
  profile: string,
  userImage: string | null
): Promise<void> => {
  try {
    if (email === '') {
      Alert.alert('エラー', 'メールアドレスを入力してください')
      return
    }
    if (password === '') {
      Alert.alert('エラー', 'パスワードを入力してください')
      return
    }
    if (userName === '') {
      Alert.alert('エラー', 'ユーザーネームを入力してください')
      return
    }
    if (profile === '') {
      Alert.alert('エラー', 'プロフィールを入力してください')
      return
    }
    if (userImage === null) {
      Alert.alert('エラー', 'ユーザー画像を選択してください')
      return
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const userId = userCredential.user.uid

    if (userImage !== null) {
      const response = await fetch(userImage)
      const blob = await response.blob()
      const storageRef = ref(storage, `users/${userId}/userImage.jpg`)
      await uploadBytes(storageRef, blob)
      userImage = await getDownloadURL(storageRef)
    }

    await setDoc(doc(db, 'users', userId), {
      userName,
      email,
      profile,
      userImage,
      updatedAt: new Date()
    })

    router.replace('/post/list')
  } catch (error) {
    console.log(error)
    Alert.alert('新規登録に失敗しました')
  }
}

const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [profile, setProfile] = useState('')
  const [userImage, setUserImage] = useState<string | null>(null)

  useEffect(() => {
    setEmail('')
    setPassword('')
    setUserName('')
    setProfile('')
    setUserImage(null)
  }, [])

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3
    })
    if (!result.canceled) {
      const selectedAsset = result.assets[0]
      setUserImage(selectedAsset.uri)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>会員登録</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={(text) => { setUserName(text) }}
          autoCapitalize='none'
          placeholder='ユーザーネームを入力'
          keyboardType='default'
          returnKeyType='done'
        />
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
          placeholder='パスワードを入力※６文字以上'
          textContentType='password'
          returnKeyType='done'
        />
        <TextInput
          style={styles.input}
          value={profile}
          onChangeText={(text) => { setProfile(text) }}
          autoCapitalize='none'
          placeholder='プロフィールを入力'
          keyboardType='default'
          returnKeyType='done'
        />
        <Button
          label="ユーザー画像を選択"
          buttonStyle={{ height: 28, backgroundColor: '#F0F0F0' }}
          labelStyle={{ lineHeight: 16, color: '#000000' }}
          onPress={() => {
            pickImage().then(() => {
            }).catch((error) => {
              console.error('Error picking image:', error)
            })
          }}
        />
        <View style={styles.imageBox}>
        {userImage !== null && <Image source={{ uri: userImage }} style={styles.image} />}
        </View>

        <Button label='会員登録' onPress={() => { void handlePress(email, password, userName, profile, userImage) }} />
        <View style={styles.footer}>
          <Link href='/auth/login' asChild replace>
            <TouchableOpacity>
              <Text style={styles.footerLink}>ログインはこちらをクリック</Text>
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    height: 48,
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },
  imagePicker: {
    fontSize: 16
  },
  image: {
    width: 100,
    height: 100
  },
  imageBox: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 'auto',
    width: 'auto',
    marginBottom: 16
  },
  footer: {
    flexDirection: 'row'
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8
  },
  footerLink: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 24,
    color: '#467FD3'
  }
})

export default SignUp
