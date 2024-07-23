import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../../config'
import * as ImagePicker from 'expo-image-picker'
import KeyboardAvoidingView from '../../components/KeybordAvoidingView'
import Button from '../../components/Button'

const handlePress = (
  id: string,
  title: string,
  userImage: string,
  userName: string,
  profile: string
): void => {
  if (auth.currentUser === null) { return }
  const ref = doc(db, `users/${auth.currentUser.uid}/users`, id)
  setDoc(ref, {
    title,
    userImage,
    userName,
    profile,
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then(() => {
      router.back()
    })
    .catch((error) => {
      console.log(error)
      Alert.alert('更新に失敗しました')
    })
}

const Edit = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [email, setEmail] = useState('')
  const [userImage, setImage] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [profile, setProfile] = useState('')

  const pickImage = async (): Promise<void> => {
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

  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/posts`, id)
    getDoc(ref)
      .then((docRef) => {
        const data = docRef.data()
        if (data === null) {
          setEmail(data.email || '')
          setImage(data.image || '')
          setUserName(data.userName || '')
          setProfile(data.profile || '')
        }
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [id])

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>会員登録</Text>
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
          value={userName}
          onChangeText={(text) => { setUserName(text) }}
          autoCapitalize='none'
          placeholder='ユーザーネームを入力'
          keyboardType='default'
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
        <TouchableOpacity onPress={pickImage} >
          <Text style={styles.imagePicker}>ユーザー写真を選択</Text>
        </TouchableOpacity>
        <View style={styles.imageBox}>
        {userImage !== null && <Image source={{ uri: userImage }} style={styles.userImage} />}
        </View>

        <Button label='編集' onPress={() => { void handlePress(id, email, userName, profile, userImage) }} />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    marginVertical: 30,
    marginHorizontal: 19
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
    height: 32,
    marginVertical: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10
  },
  textTitle: {
    paddingVertical: 4
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  userImage: {
    width: 100,
    height: 100,
    margin: 5
  },
  imagePicker: {
    fontSize: 16
  },
  imageBox: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 'auto',
    width: 'auto',
    marginBottom: 16
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginVertical: 4
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 19,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D0D0D0',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30
  }
})

export default Edit
