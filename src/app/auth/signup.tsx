import {
  View, Text, TextInput, Alert,
  StyleSheet, TouchableOpacity, Image, ScrollView
} from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth, db, storage } from '../../config'
import { doc, setDoc } from 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Button from '../../components/Button'
import { Ionicons } from '@expo/vector-icons'
import CheckBox from 'expo-checkbox'
// import * as Notifications from 'expo-notifications'

// const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
//   // Check and request permissions
//   const { status: existingStatus } = await Notifications.getPermissionsAsync()
//   let finalStatus = existingStatus
//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync()
//     finalStatus = status
//   }
//   if (finalStatus !== 'granted') {
//     // If permissions are not granted, return undefined or handle appropriately
//     console.log('Failed to get push token for push notification!')
//     return undefined
//   }

//   // Get the Expo push token
//   try {
//     const token = (await Notifications.getExpoPushTokenAsync()).data
//     console.log('Expo Push Token:', token)
//     return token
//   } catch (error) {
//     console.error('Error getting Expo push token:', error)
//     return undefined
//   }
// }

const handlePress = async (
  email: string,
  password: string,
  userName: string,
  profile: string,
  userImage: string | null,
  isTermsChecked: boolean,
  isPrivacyChecked: boolean
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
    if (password.length < 6) {
      Alert.alert('エラー', 'パスワードは6文字以上入力してください')
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
    if (!isTermsChecked || !isPrivacyChecked) {
      Alert.alert('エラー', '利用規約とプライバシーポリシーに同意してください')
      return
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const userId = user.uid

    // const pushToken = await registerForPushNotificationsAsync()

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
      // ...((pushToken !== undefined && pushToken !== '') && { expoPushToken: pushToken })
    })
    // console.log('取得したトークン', pushToken)
    await sendEmailVerification(user)
    Alert.alert('確認メール送信', 'メールをご確認ください')
    router.replace('/auth/emailCheck')
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('エラー', 'このメールアドレスはすでに使用されています')
    } else {
      Alert.alert('新規登録に失敗しました', error.message)
    }
  }
}

const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [profile, setProfile] = useState('')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const { termsAgreed, privacyAgreed } = useLocalSearchParams()
  const [isTermsChecked, setIsTermsChecked] = useState(false)
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false)

  useEffect(() => {
    if (termsAgreed === 'true') setIsTermsChecked(true)
  }, [termsAgreed])

  useEffect(() => {
    if (privacyAgreed === 'true') setIsPrivacyChecked(true)
  }, [privacyAgreed])

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3
    })
    if (!result.canceled) {
      const selectedAsset = result.assets[0]
      // JPEGに変換（HEIC対応含む）
      const manipulated = await ImageManipulator.manipulateAsync(
        selectedAsset.uri,
        [],
        {
          compress: 0.9,
          format: ImageManipulator.SaveFormat.JPEG
        }
      )
      setUserImage(manipulated.uri)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner} keyboardShouldPersistTaps='handled'>
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
              value={isTermsChecked}
              disabled={true}
            />
            <Link replace href='/auth/term' asChild >
              <TouchableOpacity>
                <Text style={styles.subFooterLink}>利用規約に同意する</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.checkBox}>
            <CheckBox
              value={isPrivacyChecked}
              disabled={true}
            />
            <Link replace href='/auth/privacy' asChild >
              <TouchableOpacity>
                <Text style={styles.subFooterLink}>プライバシーポリシーに同意する</Text>
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
            userImage,
            isTermsChecked,
            isPrivacyChecked
          )
        }}
          buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 32 }}
          labelStyle={{ fontSize: 24, lineHeight: 22 }}
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
    height: 40,
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 20,
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
  subFooterLink: {
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
  },
  footerLink: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 24,
    color: '#467FD3'
  }
})

export default SignUp
