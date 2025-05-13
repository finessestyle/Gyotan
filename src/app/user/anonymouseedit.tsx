import { ScrollView, View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { setDoc, doc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db, storage } from '../../config'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import RNPickerSelect from 'react-native-picker-select'
import Button from '../../components/Button'
import { Ionicons } from '@expo/vector-icons'
import { type User } from '../../../types/user'
import { updateProfile, linkWithCredential, EmailAuthProvider } from 'firebase/auth'

const handlePress = async (
  id: string,
  userName: string,
  email: string,
  password: string,
  userImage: string | null,
  fishArea: string
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
    if (userImage === null) {
      Alert.alert('エラー', 'ユーザー画像を選択してください')
      return
    }
    if (fishArea === '') {
      Alert.alert('エラー', 'ホームフィールドを選択してください')
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
      fishArea,
      updatedAt: Timestamp.fromDate(new Date())
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

const anonymouseedit = (): JSX.Element => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [fishArea, setFishArea] = useState('')
  const [userImage, setUserImage] = useState<string | null>(null)

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
        if (docRef.exists()) {
          const data = docRef.data() as User
          setUserName(data.userName ?? '')
          setEmail(data.email ?? '')
          setPassword('')
          setUserImage(data.userImage ?? null)
          setFishArea(data.fishArea ?? '')
        }
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>ユーザー情報を登録</Text>
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
          autoCapitalize='none'
        />
        <View>
          <Text style={styles.textTitle}>パスワード</Text>
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
        <Text style={styles.textTitle}>ホームフィールド選択</Text>
        <RNPickerSelect
          value={fishArea}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setFishArea(value)
            }
          }}
          items={[
            { label: '北湖北岸', value: '北湖北岸' },
            { label: '北湖東岸', value: '北湖東岸' },
            { label: '北湖西岸', value: '北湖西岸' },
            { label: '南湖東岸', value: '南湖東岸' },
            { label: '南湖西岸', value: '南湖西岸' }
          ]}
          placeholder={{ label: 'ホームフィールドを選択してください', value: '' }}
          style={pickerSelectStyles}
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
          label='登録'
          onPress={() => {
            if (auth.currentUser !== null) {
              void handlePress(
                auth.currentUser.uid,
                userName,
                email,
                password,
                userImage,
                fishArea
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
  icon: {
    position: 'absolute',
    right: 16,
    top: 40,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    height: 32,
    marginVertical: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10
  },
  inputAndroid: {
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    height: 32,
    marginVertical: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10
  }
})

export default anonymouseedit
