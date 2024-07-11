import {
  View, Text, TextInput, Alert,
  StyleSheet, TouchableOpacity, Image, Platform
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db, storage } from '../../config'
import { doc, setDoc } from 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Button from '../../components/Button'

const handlePress = async (email: string, password: string, username: string, profile: string, image: string): Promise<void> => {
  try {
    console.log(email, password, username, profile, image)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const userId = userCredential.user.uid
    console.log(userId)

    let imageUrl = ''
    if (image !== null) {
      const response = await fetch(image)
      const blob = await response.blob()
      const storageRef = ref(storage, `users/${userId}/profile.jpg`)
      await uploadBytes(storageRef, blob)
      imageUrl = await getDownloadURL(storageRef)
    }

    await setDoc(doc(db, 'users', userId), {
      username,
      email,
      password,
      profile,
      imageUrl
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
  const [username, setUsername] = useState('')
  const [profile, setProfile] = useState('')
  const [image, setImage] = useState<string | null>(null)

  const pickImage = async (): Promise<void> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Permission to access gallery is required!')
        return
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })

    if (!result.canceled) {
      const selectedAsset = result.assets[0]
      setImage(selectedAsset.uri)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.innner}>
        <Text style={styles.title}>会員登録</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text) }}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='メールアドレスを入力'
          textContentType='emailAddress'
          returnKeyType='next'
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => { setPassword(text) }}
          autoCapitalize='none'
          secureTextEntry
          placeholder='パスワードを入力※６文字以上'
          textContentType='password'
          returnKeyType='next'
        />
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={(text) => { setUsername(text) }}
          autoCapitalize='none'
          placeholder='ユーザーネームを入力'
          returnKeyType='next'
        />
        <TextInput
          style={styles.input}
          value={profile}
          onChangeText={(text) => { setProfile(text) }}
          autoCapitalize='none'
          placeholder='プロフィールを入力'
          returnKeyType='next'
        />

        <TouchableOpacity onPress={pickImage} >
          <Text style={styles.imagePicker}>ユーザー写真を選択</Text>
        </TouchableOpacity>
        <View style={styles.imageBox}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>

        <Button label='会員登録' onPress={() => { handlePress(email, password, username, profile, image) }} />
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
  innner: {
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
    fontSize: 14,
    lineHeight: 24,
    color: '#467FD3'
  }
})

export default SignUp
