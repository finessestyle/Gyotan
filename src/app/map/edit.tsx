import {
  View, Text, TextInput, StyleSheet, ScrollView, Alert, Image
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { collection, addDoc, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { auth, db, storage } from '../../config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import * as ImageMultiplePicker from 'expo-image-picker'
import Button from '../../components/Button'

const handlePress = async (
  id: string,
  title: string,
  images: string[],
  content: string
): Promise<void> => {
  try {
    if (title === '') {
      Alert.alert('エラー', 'タイトルを入力してください')
      return
    }
    if (images.length === 0) {
      Alert.alert('エラー', '釣果画像を選択してください')
      return
    }
    if (content === '') {
      Alert.alert('エラー', '釣果内容を入力してください')
      return
    }
    if (auth.currentUser === null) return

    const userId = auth.currentUser.uid
    const mapRef = collection(db, 'maps')
    const mapId = mapRef.id

    let imageUrls = ''
    if (images === null) {
      try {
        const response = await fetch(images)
        const blob = await response.blob()
        const storageRef = ref(storage, `maps/${mapId}/mapImage.jpg`)
        await uploadBytes(storageRef, blob)
        imageUrls = await getDownloadURL(storageRef)
      } catch (error) {
        Alert.alert('写真を選択してください')
      }
    }

    await addDoc(doc(mapRef, mapId), {
      userId,
      title,
      images: imageUrls,
      content,
      updatedAt: Timestamp.fromDate(new Date())
    })
    router.back()
  } catch (error) {
    console.log(error)
    Alert.alert('更新に失敗しました')
  }
}

const Edit = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [title, setTitle] = useState('')
  const [images, setImages] = useState<Array<{ uri: string }>>([])
  const [content, setContent] = useState('')

  const pickImage = async (): Promise<void> => {
    const result = await ImageMultiplePicker.launchImageLibraryAsync({
      mediaTypes: ImageMultiplePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 1
    })
    if (!result.canceled) {
      setImages(prevImages => [...prevImages, ...result.assets.map(asset => ({ uri: asset.uri }))])
    }
  }

  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, 'maps', id)
    getDoc(ref)
      .then((docRef) => {
        const data = docRef.data()
        if (data !== null) {
          setTitle(data.title || '')
          setImages(data.images?.map((uri: string) => ({ uri })) || [])
          setContent(data.content || '')
        }
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [id])

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>釣り場編集</Text>
        <Text style={styles.textTitle}>タイトル</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => { setTitle(text) }}
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
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.image} />
          ))}
        </View>
        <Text style={styles.textTitle}>釣り場内容</Text>
        <TextInput
          value={content}
          style={styles.input}
          onChangeText={(text) => { setContent(text) }}
          placeholder='釣り場内容を入力してください'
          keyboardType='default'
          returnKeyType='done'
        />
        <Button label='投稿' onPress={() => {
          void handlePress(
            id,
            title,
            images.map(img => img.uri),
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
    borderRadius: 4,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  image: {
    width: 100,
    height: 100,
    margin: 6.5
  }
})

export default Edit
