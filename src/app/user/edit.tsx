import {
  View, Text, TextInput, StyleSheet, ScrollView, Alert, Image
} from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import { setDoc, doc, getDoc, Timestamp } from 'firebase/firestore'
import { onAuthStateChanged, verifyBeforeUpdateEmail } from 'firebase/auth'
import { auth, db, storage } from '../../config'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Button from '../../components/Button'

const handlePress = async (
  id: string,
  email: string,
  userImage: string | null,
  userYoutube: string | null,
  userTiktok: string | null,
  userInstagram: string | null,
  userX: string | null,
  userName: string,
  profile: string
): Promise<void> => {
  try {
    if (email === '') {
      Alert.alert('エラー', 'メールアドレスを入力してください')
      return
    }
    if (userName === '') {
      Alert.alert('エラー', 'ユーザーネームを入力してください')
      return
    }
    if (profile === '') {
      Alert.alert('エラー', 'ホームフィールドを選択してください')
      return
    }
    if (userImage === '') {
      Alert.alert('エラー', 'ユーザー画像を選択してください')
      return
    }

    if (auth.currentUser === null) return
    const userId = auth.currentUser.uid

    // メールアドレスが変更された場合にのみ確認メール送信
    if (auth.currentUser.email !== email) {
      await verifyBeforeUpdateEmail(auth.currentUser, email)
      Alert.alert('確認メール送信', '新しいメールアドレスに確認リンクを送信しました。メールをご確認ください。')
    }

    if (userImage !== null) {
      const response = await fetch(userImage)
      const blob = await response.blob()
      const storageRef = ref(storage, `users/${userId}/userImage.jpg`)
      await uploadBytes(storageRef, blob)
      userImage = await getDownloadURL(storageRef)
    }

    const formattedYoutube = formatSocialUrl('youtube', userYoutube)
    const formattedTiktok = formatSocialUrl('tiktok', userTiktok)
    const formattedInstagram = formatSocialUrl('instagram', userInstagram)
    const formattedX = formatSocialUrl('x', userX)

    await setDoc(doc(db, 'users', id), {
      email,
      userImage,
      userName,
      profile,
      userYoutube: formattedYoutube,
      userTiktok: formattedTiktok,
      userInstagram: formattedInstagram,
      userX: formattedX,
      updatedAt: Timestamp.fromDate(new Date())
    }, { merge: true })
    // メールアドレスが変更されていない、または既に確認済みの場合にのみ画面遷移
    if (auth.currentUser.email === email) {
      router.back()
    }
  } catch (error: any) { // エラー型を明示
    console.log(error)
    // メールアドレス更新に関するより具体的なエラーハンドリング
    if (error.code === 'auth/requires-recent-login') {
      Alert.alert('認証エラー', 'メールアドレスを変更するには、再度ログインする必要があります。一度ログアウトし、再ログインしてからもう一度お試しください。')
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('エラー', '無効なメールアドレスです。')
    } else if (error.code === 'auth/email-already-in-use') {
      Alert.alert('エラー', 'このメールアドレスは既に使用されています。')
    } else {
      Alert.alert('更新に失敗しました', `詳細: ${error.message}`)
    }
  }
}

const formatSocialUrl = (platform: string, handle: string | null): string | null => {
  if (!handle) return null
  if (handle.startsWith('@')) {
    handle = handle.slice(1)
  }
  if (handle.startsWith('http')) {
    return handle // すでにURL形式ならそのまま
  }
  switch (platform) {
    case 'youtube':
      return `https://www.youtube.com/@${handle}`
    case 'tiktok':
      return `https://www.tiktok.com/@${handle}`
    case 'instagram':
      return `https://www.instagram.com/${handle}`
    case 'x':
      return `https://x.com/${handle}`
    default:
      return handle
  }
}

const Edit = (): JSX.Element => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState('')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userYoutube, setUserYoutube] = useState('')
  const [userTiktok, setUserTiktok] = useState('')
  const [userInstagram, setUserInstagram] = useState('')
  const [userX, setUserX] = useState('')

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (auth.currentUser === null) return
      const userId = auth.currentUser.uid
      const ref = doc(db, 'users', userId)
      getDoc(ref)
        .then((docRef) => {
          const data = docRef.data() as {
            email?: string
            userImage?: string
            userName?: string
            profile?: string
            userYoutube?: string
            userTiktok?: string
            userInstagram?: string
            userX?: string
          }
          setEmail(data.email ?? '')
          setUserImage(data.userImage ?? null)
          setUserName(data.userName ?? '')
          setProfile(data.profile ?? '')
          setUserYoutube(data.userYoutube ?? '')
          setUserTiktok(data.userTiktok ?? '')
          setUserInstagram(data.userInstagram ?? '')
          setUserX(data.userX ?? '')
        })
        .catch((error) => {
          console.log(error)
          Alert.alert('データの取得に失敗しました')
        })
    })
    return unsubscribe
  }, [])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ユーザー編集</Text>
        <Text style={styles.textTitle}>ユーザーネーム</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={(text) => { setUserName(text) }}
          placeholder='ユーザーネームを入力'
          placeholderTextColor="#CCCCCC"
          keyboardType='default'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>メールアドレス</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text) }}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='メールアドレスを入力'
          placeholderTextColor="#CCCCCC"
          textContentType='emailAddress'
          returnKeyType='done'
        />
        <Button
          label="ユーザー画像を選択"
          buttonStyle={{ backgroundColor: '#D0D0D0', marginBottom: 3 }}
          labelStyle={{ fontSize: 16, color: '#000000' }}
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
        <Text style={styles.textTitle}>プロフィール</Text>
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
        <Text style={styles.textTitle}>Youtube</Text>
        <TextInput
          style={styles.input}
          value={userYoutube}
          onChangeText={(text) => { setUserYoutube(text) }}
          keyboardType='url'
          placeholder='@ユーザー名 または URL を入力'
          placeholderTextColor="#CCCCCC"
          textContentType='URL'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>Tiktok</Text>
        <TextInput
          style={styles.input}
          value={userTiktok}
          onChangeText={(text) => { setUserTiktok(text) }}
          keyboardType='url'
          placeholder='@ユーザー名 または URL を入力'
          placeholderTextColor="#CCCCCC"
          textContentType='URL'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>Instagram</Text>
        <TextInput
          style={styles.input}
          value={userInstagram}
          onChangeText={(text) => { setUserInstagram(text) }}
          keyboardType='url'
          placeholder='ユーザー名 または URL を入力'
          placeholderTextColor="#CCCCCC"
          textContentType='URL'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>X</Text>
        <TextInput
          style={styles.input}
          value={userX}
          onChangeText={(text) => { setUserX(text) }}
          keyboardType='url'
          placeholder='ユーザー名 または URL を入力'
          placeholderTextColor="#CCCCCC"
          textContentType='URL'
          returnKeyType='done'
        />
        <Button
          label='編集'
          onPress={() => {
            if (auth.currentUser !== null) {
              void handlePress(
                auth.currentUser.uid,
                email,
                userImage,
                userYoutube,
                userTiktok,
                userInstagram,
                userX,
                userName,
                profile
              )
            }
          }}
          buttonStyle={{
            width: '100%',
            marginVertical: 16
          }}
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
    marginVertical: 16
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
  }
})

export default Edit
