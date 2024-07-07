import {
  View, ScrollView, Text, TextInput, Button, Image, StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db, auth, storage } from '../../config'
import RNPickerSelect from 'react-native-picker-select'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import KeyboardAvoidingView from '../../components/KeybordAvoidingView'

const handlePress = async (
  title: string,
  images: string[],
  content: string,
  area: string
): Promise<void> => {
  try {
    if (auth.currentUser === null) { return }
    const userId = auth.currentUser.uid
    const mapRef = collection(db, `users/${userId}/maps`)

    const imageUrls = await Promise.all(images.map(async (image) => {
      const response = await fetch(image)
      const blob = await response.blob()
      const storageRef = ref(storage, `users/${userId}/maps`)
      await uploadBytes(storageRef, blob)
      return await getDownloadURL(storageRef)
    }))

    await addDoc(mapRef, {
      title,
      images: imageUrls,
      content,
      area,
      updatedAt: Timestamp.fromDate(new Date())
    })
    router.back()
  } catch (error) {
    console.log('投稿に失敗しました')
  }
}

const Create = (): JSX.Element => {
  const [title, setTitle] = useState('')
  const [images, setImages] = useState<Array<{ uri: string }>>([])
  const [content, setContent] = useState('')
  const [area, setArea] = useState('')

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 1
    })

    if (!result.canceled && result.assets.length > 0) {
      setImages(result.assets.map(asset => ({ uri: asset.uri })))
    }
  }

  const onPressHandler = (): void => {
    handlePress(
      title,
      images.map(img => img.uri),
      content,
      area
    ).catch(error => console.log(error))
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>釣果投稿</Text>
        <Text>タイトル</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => { setTitle(text) }}
        />
        <Text>ファイルを選択</Text>
        <Button title="釣果画像を選択" onPress={pickImage} />
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.image} />
          ))}
        </View>
        <Text>エリア</Text>
        <RNPickerSelect
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setArea(value)
            }
          }}
          items={[
            { label: '北湖北エリア', value: '北湖北エリア' },
            { label: '北湖東エリア', value: '北湖東エリア' },
            { label: '北湖西エリア', value: '北湖西エリア' },
            { label: '南湖東エリア', value: '南湖東エリア' },
            { label: '南湖西エリア', value: '南湖西エリア' }
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'エリアを選択してください', value: null }}
        />
        <Text>エリア情報内容</Text>
        <TextInput
          multiline style={styles.input}
          value={content}
          onChangeText={(text) => { setContent(text) }}
        />
      </ScrollView>
      <Button title='投稿する'
        onPress={onPressHandler}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    marginVertical: 30,
    marginHorizontal: 19,
    flex: 1
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    height: 32,
    marginVertical: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10
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
    margin: 5
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30
  }
})

export default Create
