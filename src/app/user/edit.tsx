import {
  View, Text, TextInput, StyleSheet, Alert, Image
} from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import { setDoc, doc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db, storage } from '../../config'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import KeyboardAvoidingView from '../../components/KeybordAvoidingView'
import Button from '../../components/Button'

const handlePress = async (
  id: string,
  email: string,
  userImage: string | null,
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
      Alert.alert('エラー', 'プロフィールを入力してください')
      return
    }
    if (userImage === '') {
      Alert.alert('エラー', 'ユーザー画像を選択してください')
      return
    }

    if (auth.currentUser === null) return
    const userId = auth.currentUser.uid

    if (userImage !== null) {
      const response = await fetch(userImage)
      const blob = await response.blob()
      const storageRef = ref(storage, `users/${userId}/userImage.jpg`)
      await uploadBytes(storageRef, blob)
      userImage = await getDownloadURL(storageRef)
    }

    await setDoc(doc(db, 'users', id), {
      email,
      userImage,
      userName,
      profile,
      updatedAt: Timestamp.fromDate(new Date())
    }, { merge: true })
    router.back()
  } catch (error) {
    console.log(error)
    Alert.alert('更新に失敗しました')
  }
}

const Edit = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [profile, setProfile] = useState('')

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

  useEffect(() => {
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
        }
        setEmail(data.email ?? '')
        setUserImage(data.userImage ?? null)
        setUserName(data.userName ?? '')
        setProfile(data.profile ?? '')
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [])

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ユーザー編集</Text>
        <Text style={styles.textTitle}>ユーザーネーム</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={(text) => { setUserName(text) }}
          placeholder='ユーザーネームを入力'
          keyboardType='default'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>メールアドレス</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text) }}
          keyboardType='email-address'
          placeholder='メールアドレスを入力'
          textContentType='emailAddress'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>プロフィール</Text>
        <TextInput
          style={styles.input}
          value={profile}
          onChangeText={(text) => { setProfile(text) }}
          placeholder='プロフィールを入力'
          keyboardType='default'
          maxLength={30}
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
          {userImage !== null && <Image source={{ uri: userImage }} style={styles.userImage} />}
        </View>

        <Button
          label='編集'
          onPress={() => {
            if (auth.currentUser !== null) {
              void handlePress(
                auth.currentUser.uid,
                email,
                userImage,
                userName,
                profile
              )
            }
          }}
          buttonStyle={{
            width: '100%',
            marginTop: 8,
            alignItems: 'center',
            height: 30
          }}
          labelStyle={{
            fontSize: 24,
            lineHeight: 21
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    marginVertical: 24,
    marginHorizontal: 8
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  textTitle: {
    paddingVertical: 4,
    fontWeight: 'bold'
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    height: 32,
    marginVertical: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10
  },
  imageBox: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 'auto',
    width: 'auto',
    marginBottom: 16
  },
  userImage: {
    width: 100,
    height: 100,
    margin: 5
  }
})

export default Edit
