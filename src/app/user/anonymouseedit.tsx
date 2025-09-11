import { ScrollView, View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { setDoc, doc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db, storage } from '../../config'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Button from '../../components/Button'
import { Ionicons } from '@expo/vector-icons'
import { type User } from '../../../types/user'
import CheckBox from 'expo-checkbox'
import * as Notifications from 'expo-notifications'
import { updateProfile, linkWithCredential, EmailAuthProvider } from 'firebase/auth'

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

const handlePress = async (
  id: string,
  userName: string,
  email: string,
  password: string,
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

    if (auth.currentUser === null) return
    const userId = auth.currentUser.uid
    const pushToken = await registerForPushNotificationsAsync()

    if (userImage !== null) {
      const response = await fetch(userImage)
      const blob = await response.blob()
      const storageRef = ref(storage, `users/${userId}/userImage.jpg`)
      await uploadBytes(storageRef, blob)
      userImage = await getDownloadURL(storageRef)
    }

    await setDoc(doc(db, 'users', id), {
      userName,
      email,
      userImage,
      profile,
      updatedAt: Timestamp.fromDate(new Date()),
      ...((pushToken !== undefined && pushToken !== '') && { expoPushToken: pushToken })
    }, { merge: true })
    if (auth.currentUser.isAnonymous) {
      try {
        const credential = EmailAuthProvider.credential(email, password)
        await linkWithCredential(auth.currentUser, credential)
        await updateProfile(auth.currentUser, { displayName: userName })
      } catch (error) {
        Alert.alert('認証情報のリンクに失敗しました')
        return
      }
    } else {
      await updateProfile(auth.currentUser, { displayName: userName })
    }
    router.back()
  } catch (error) {
    console.log(error)
    Alert.alert('更新に失敗しました')
  }
}

const Anonymouseedit = (): JSX.Element => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [profile, setProfile] = useState('')
  const [userImage, setUserImage] = useState<string | null>(null)
  const { termsAgreed, privacyAgreed } = useLocalSearchParams()
  const [isTermsChecked, setIsTermsChecked] = useState(false)
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false)

  useEffect(() => {
    if (termsAgreed === 'true') setIsTermsChecked(true)
    if (privacyAgreed === 'true') setIsPrivacyChecked(true)
  }, [termsAgreed, privacyAgreed])

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

  useEffect(() => {
    if (auth.currentUser === null) return
    const userId = auth.currentUser.uid
    const ref = doc(db, 'users', userId)
    getDoc(ref)
      .then((docRef) => {
        if (docRef.exists()) {
          const data = docRef.data() as User
          setUserName(data.userName ?? '')
          setEmail(data.email ?? '')
          setPassword('')
          setUserImage(data.userImage ?? null)
          setProfile(data.profile ?? '')
        }
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ユーザー情報を登録</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={(text) => { setUserName(text) }}
          placeholder='ユーザーネームを入力'
          placeholderTextColor="#CCCCCC"
          keyboardType='default'
          returnKeyType='done'
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text) }}
          keyboardType='email-address'
          placeholder='メールアドレスを入力'
          placeholderTextColor="#CCCCCC"
          textContentType='emailAddress'
          returnKeyType='done'
          autoCapitalize='none'
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
        <TextInput
          style={styles.input}
          value={profile}
          onChangeText={(text) => { setProfile(text) }}
          placeholder='プロフィールを入力'
          placeholderTextColor="#CCCCCC"
          keyboardType='default'
          maxLength={30}
          returnKeyType='done'
        />
        <Button
          label="ユーザー画像を選択"
          buttonStyle={{ height: 20, backgroundColor: '#D0D0D0', marginBottom: 3 }}
          labelStyle={{ lineHeight: 16, color: '#000000' }}
          onPress={() => {
            pickImage().then(() => {
            }).catch((error) => {
              console.error('Error picking image:', error)
            })
          }}
        />
        <View style={styles.imageBox}>
          {userImage !== null && <Image source={{ uri: userImage }} style={styles.userImage} />}
        </View>

        <View style={styles.subFooter}>
          <View style={styles.checkBox}>
            <CheckBox
              value={isTermsChecked}
              onValueChange={setIsTermsChecked}
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
              onValueChange={setIsPrivacyChecked}
            />
            <Link replace href='/auth/privacy' asChild >
              <TouchableOpacity>
                <Text style={styles.subFooterLink}>プライバシーポリシーに同意する</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <Button
          label='登録'
          onPress={() => {
            if (auth.currentUser !== null) {
              void handlePress(
                auth.currentUser.uid,
                userName,
                email,
                password,
                userImage,
                profile,
                isTermsChecked,
                isPrivacyChecked
              )
            }
          }}
          buttonStyle={{ width: '100%', marginTop: 8 }}
        />
      </View>
    </ScrollView>
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
  textTitle: {
    paddingVertical: 4
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
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 8
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

export default Anonymouseedit
