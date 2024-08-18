import {
  View, ScrollView, Text, TextInput, Image, StyleSheet, Alert
} from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { collection, Timestamp, doc, setDoc, addDoc } from 'firebase/firestore'
import { db, auth, storage } from '../../config'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Button from '../../components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const handlePress = async (
  title: string,
  mapImage: string,
  content: string
): Promise<void> => {
  try {
    if (title === '') {
      Alert.alert('エラー', 'タイトルを入力してください')
      return
    }
    if (mapImage === null) {
      Alert.alert('エラー', '釣り場画像を選択してください')
      return
    }
    if (content === '') {
      Alert.alert('エラー', '釣り場内容を入力してください')
      return
    }
    if (auth.currentUser === null) return

    const userId = auth.currentUser.uid
    const mapRef = collection(db, 'maps')
    const newMapRef = await addDoc(mapRef, {}) // 新しいドキュメントを追加し、ドキュメントIDを取得
    const mapId = newMapRef.id

    if (mapImage !== null) {
      const response = await fetch(mapImage)
      const blob = await response.blob()
      const storageRef = ref(storage, `maps/${mapId}/mapImage.jpg`)
      await uploadBytes(storageRef, blob)
      mapImage = await getDownloadURL(storageRef)
    }

    await setDoc(doc(db, 'maps', mapId), { // Firestoreにドキュメントを追加
      userId,
      title,
      mapImage,
      content,
      updatedAt: Timestamp.fromDate(new Date()) // 現在のタイムスタンプを保存
    })

    router.back() // 成功したら前のページに戻る
  } catch (error) {
    console.log('Error: ', error)
    Alert.alert('投稿に失敗しました')
  }
}

const Create = (): JSX.Element => {
  const [title, setTitle] = useState('')
  const [mapImage, setMapImage] = useState('')
  const [content, setContent] = useState('')

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 1,
      quality: 1
    })
    if (!result.canceled) {
      const selectedAsset = result.assets[0]
      setMapImage(selectedAsset.uri)
    }
  }
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>釣り場投稿</Text>
        <Text style={styles.textTitle}>タイトル</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => { setTitle(text) }}
          value={title}
          placeholder='タイトルを入力'
          keyboardType='default'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>ファイルを選択</Text>
        <Button
          label="釣り場画像を選択"
          buttonStyle={{ height: 28, backgroundColor: '#F0F0F0' }}
          labelStyle={{ lineHeight: 16, color: '#000000' }}
          onPress={() => {
            pickImage().then(() => {
            }).catch((error) => {
              console.error('Error picking image:', error)
            })
          }}
        />
        <View style={styles.imageBox}>
        {mapImage !== null && <Image source={{ uri: mapImage }} style={styles.image} />}
        </View>
        <Text style={styles.textTitle}>釣り場内容</Text>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={(text) => { setContent(text) }}
          placeholder='釣り場内容を入力してください'
          keyboardType='default'
          returnKeyType='done'
        />
        <Button label='投稿' onPress={() => {
          void handlePress(
            title,
            mapImage,
            content
          )
        }}
          buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30 }}
          labelStyle={{ fontSize: 24, lineHeight: 21 }}
        />
      </ScrollView>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  inner: {
    marginVertical: 24,
    marginHorizontal: 16
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
    height: 32,
    marginVertical: 4,
    alignItems: 'flex-start',
    paddingLeft: 18,
    fontSize: 16
  },
  textTitle: {
    paddingVertical: 4
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    flexDirection: 'row'
  },
  imageWrapper: {
    position: 'relative',
    margin: 6
  },
  image: {
    width: 100,
    height: 100
  }
})

export default Create
