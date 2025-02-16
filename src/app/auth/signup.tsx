import {
  View, Text, TextInput, Alert,
  StyleSheet, TouchableOpacity, Image, ScrollView
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db, storage } from '../../config'
import { doc, setDoc } from 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Button from '../../components/Button'
import Icon from 'react-native-vector-icons/Ionicons'
import CheckBox from 'expo-checkbox'

const handlePress = async (
  email: string,
  password: string,
  userName: string,
  profile: string,
  userImage: string | null
): Promise<void> => {
  try {
    if (userName === '') {
      Alert.alert('エラー', 'ユーザーネームを入力してください')
      return
    }
    if (email === '') {
      Alert.alert('エラー', 'メールアドレスを入力してください')
      return
    }
    if (password === '') {
      Alert.alert('エラー', 'パスワードを入力してください')
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

    router.replace('/post/top')
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)

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
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>新規登録</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={(text) => { setUserName(text) }}
          autoCapitalize='none'
          placeholder='ユーザーネームを入力※10文字以内'
          maxLength={10}
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

        <View style={styles.inputcontainer}>
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
            <Icon
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={profile}
          onChangeText={(text) => { setProfile(text) }}
          autoCapitalize='none'
          placeholder='プロフィールを入力※30文字以内'
          maxLength={30}
          keyboardType='default'
          returnKeyType='done'
        />
        <Button
          label="ユーザー画像を選択"
          buttonStyle={{ height: 28, backgroundColor: '#D0D0D0', marginBottom: 3 }}
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

        <View style={styles.subFooter}>
          <View style={styles.checkBox}>
            <CheckBox
              value={termsChecked}
              onValueChange={setTermsChecked}
            />
            <Link replace href='/auth/term' asChild >
              <TouchableOpacity>
                <Text style={styles.footerLink}>利用規約に同意する</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.checkBox}>
            <CheckBox
              value={privacyChecked}
              onValueChange={setPrivacyChecked}
            />
            <Link replace href='/auth/privacy' asChild >
              <TouchableOpacity>
                <Text style={styles.footerLink}>プライバシーポリシーに同意する</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <Button label='新規登録' onPress={() => {
          void handlePress(
            email,
            password,
            userName,
            profile,
            userImage
          )
        }}
          buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30 }}
          labelStyle={{ fontSize: 24, lineHeight: 21 }}
        />
        <View style={styles.footer}>
          <Link replace href='/auth/login' asChild >
            <TouchableOpacity>
              <Text style={styles.footerLink}>ログインはこちらをクリック</Text>
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
    paddingVertical: 24,
    paddingHorizontal: 16
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 40,
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },
  inputcontainer: {
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 16,
    transform: [{ translateY: -12 }]
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8
  },
  imageBox: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 100,
    width: 100,
    marginTop: 4,
    marginBottom: 8
  },
  subFooter: {
    flexDirection: 'column'
  },
  footerLink: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 28,
    color: '#467FD3'
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footer: {
    flexDirection: 'row'
  }
})

export default SignUp
