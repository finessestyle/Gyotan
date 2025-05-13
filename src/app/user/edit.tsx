import {
  View, Text, TextInput, StyleSheet, ScrollView, Alert, Image
} from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import { setDoc, doc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db, storage } from '../../config'
import * as ImagePicker from 'expo-image-picker'
import RNPickerSelect from 'react-native-picker-select'
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
  fishArea: string
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
    if (fishArea === '') {
      Alert.alert('エラー', 'ホームフィールドを選択してください')
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
      fishArea,
      userYoutube,
      userTiktok,
      userInstagram,
      userX,
      updatedAt: Timestamp.fromDate(new Date())
    }, { merge: true })
    router.back()
  } catch (error) {
    console.log(error)
    Alert.alert('更新に失敗しました')
  }
}

const Edit = (): JSX.Element => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [fishArea, setFishArea] = useState('')
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
          fishArea?: string
          userYoutube?: string
          userTiktok?: string
          userInstagram?: string
          userX?: string
        }
        setEmail(data.email ?? '')
        setUserImage(data.userImage ?? null)
        setUserName(data.userName ?? '')
        setFishArea(data.fishArea ?? '')
        setUserYoutube(data.userYoutube ?? '')
        setUserTiktok(data.userTiktok ?? '')
        setUserInstagram(data.userInstagram ?? '')
        setUserX(data.userX ?? '')
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inner}>
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
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='メールアドレスを入力'
          textContentType='emailAddress'
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
        <Text style={styles.textTitle}>ホームフィールドを選択</Text>
        <RNPickerSelect
          value={fishArea}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setFishArea(value)
            }
          }}
          items={[
            { label: '北湖北岸エリア', value: '北湖北岸' },
            { label: '北湖東岸エリア', value: '北湖東岸' },
            { label: '北湖西岸エリア', value: '北湖西岸' },
            { label: '南湖東岸エリア', value: '南湖東岸' },
            { label: '南湖西岸エリア', value: '南湖西岸' }
          ]}
          placeholder={{ label: 'ホームフィールドを選択してください', value: '' }}
          style={pickerSelectStyles}
        />
        <Text style={styles.textTitle}>Youtube</Text>
        <TextInput
          style={styles.input}
          value={userYoutube}
          onChangeText={(text) => { setUserYoutube(text) }}
          keyboardType='url'
          placeholder='URLを入力'
          textContentType='URL'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>Tiktok</Text>
        <TextInput
          style={styles.input}
          value={userTiktok}
          onChangeText={(text) => { setUserTiktok(text) }}
          keyboardType='url'
          placeholder='URLを入力'
          textContentType='URL'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>Instagram</Text>
        <TextInput
          style={styles.input}
          value={userInstagram}
          onChangeText={(text) => { setUserInstagram(text) }}
          keyboardType='url'
          placeholder='URLを入力'
          textContentType='URL'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>X</Text>
        <TextInput
          style={styles.input}
          value={userX}
          onChangeText={(text) => { setUserX(text) }}
          keyboardType='url'
          placeholder='URLを入力'
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

export default Edit
