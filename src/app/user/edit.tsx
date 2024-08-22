import {
  View, Text, TextInput, StyleSheet, Alert, Image
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../../config'
import * as ImagePicker from 'expo-image-picker'
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
    if (userImage === null) {
      Alert.alert('エラー', 'ユーザー画像を選択してください')
      return
    }
    if (auth.currentUser === null) return

    const userRef = doc(db, 'users', id) // 修正された部分
    await setDoc(userRef, {
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
  const id = String(useLocalSearchParams().id)
  const [email, setEmail] = useState('')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [profile, setProfile] = useState('')
  const [loading, setLoading] = useState(true)

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
    const ref = doc(db, 'users', id)
    getDoc(ref)
      .then((docRef) => {
        const data = docRef.data()
        if (data === null) {
          setEmail(data.email || '')
          setUserImage(data.userImage || null)
          setUserName(data.userName || '')
          setProfile(data.profile || '')
        }
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <Text>読み込み中...</Text>
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ユーザー編集</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={(text) => { setUserName(text) }}
          placeholder='ユーザーネームを入力'
          keyboardType='default'
          returnKeyType='done'
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text) }}
          keyboardType='email-address'
          placeholder='メールアドレスを入力'
          textContentType='emailAddress'
          returnKeyType='done'
        />
        <TextInput
          style={styles.input}
          value={profile}
          onChangeText={(text) => { setProfile(text) }}
          placeholder='プロフィールを入力'
          keyboardType='default'
          returnKeyType='done'
        />
        <Button
          label="ユーザー画像を選択"
          buttonStyle={{ height: 48, backgroundColor: '#F0F0F0' }}
          labelStyle={{ lineHeight: 24, color: '#000000' }}
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
            void handlePress(
              id,
              email,
              userImage,
              userName,
              profile
            )
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
    flex: 1
  },
  inner: {
    marginVertical: 24,
    marginHorizontal: 27
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    height: 48,
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
