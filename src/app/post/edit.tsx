import {
  View, Text, TextInput, StyleSheet, ScrollView, Alert, Button, Image
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../../config'
import * as ImagePicker from 'expo-image-picker'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import KeyboardAvoidingView from '../../components/KeybordAvoidingView'

const handlePress = (
  id: string,
  title: string,
  images: string[],
  weather: string,
  content: string,
  length: number,
  weight: number,
  lure: string,
  lureColor: string,
  catchFish: number,
  fishArea: string
): void => {
  if (auth.currentUser === null) { return }
  const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
  setDoc(ref, {
    title,
    images,
    weather,
    content,
    length,
    weight,
    lure,
    lureColor,
    catchFish,
    fishArea,
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
  const [title, setTitle] = useState('')
  const [images, setImages] = useState<Array<{ uri: string }>>([])
  const [weather, setWeather] = useState('')
  const [content, setContent] = useState('')
  const [fishArea, setFishArea] = useState('')
  const [length, setLength] = useState('')
  const [weight, setWeight] = useState('')
  const [lure, setLure] = useState('')
  const [lureColor, setLureColor] = useState('')
  const [catchFish, setCatchFish] = useState('')

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 1
    })
    if (!result.canceled && result.assets) {
      setImages(prevImages => [...prevImages, ...result.assets.map(asset => ({ uri: asset.uri }))])
    }
  }

  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/posts`, id)
    getDoc(ref)
      .then((docRef) => {
        const data = docRef.data()
        if (data === null) {
          setTitle(data.title || '')
          setImages(data.images?.map((uri: string) => ({ uri })) || [])
          setWeather(data.weather || '')
          setContent(data.content || '')
          setFishArea(data.fishArea || '')
          setLength(data.length || '')
          setWeight(data.weight || '')
          setLure(data.lure || '')
          setLureColor(data.lureColor || '')
          setCatchFish(data.catchFish || '')
        }
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [id])

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>釣果投稿</Text>
        <Text>タイトル</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => { setTitle(text) }}
        />
        <Text>ファイルを選択</Text>
        <Button title="画像を選択" onPress={pickImage} />
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.image} />
          ))}
        </View>
        <Text>天気を選択</Text>
        <TextInput
          style={styles.input}
          value={weather}
          onChangeText={(text) => { setWeather(text) }}
        />
        <Text>釣果内容</Text>
        <TextInput
          multiline style={styles.input}
          value={content}
          onChangeText={(text) => { setContent(text) }}
        />
        <Text>釣果エリアを選択</Text>
        <TextInput
          style={styles.input}
          value={fishArea}
          onChangeText={(text) => { setFishArea(text) }}
        />
        <Text>サイズ</Text>
        <TextInput
          style={styles.input}
          value={length}
          onChangeText={(text) => { setLength(text) }}
        />
        <Text>重さ</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={(text) => { setWeight(text) }}
        />
        <Text>ルアー種類</Text>
        <TextInput
          style={styles.input}
          value={lure}
          onChangeText={(text) => { setLure(text) }}
        />
        <Text>ルアーカラー</Text>
        <TextInput
          style={styles.input}
          value={lureColor}
          onChangeText={(text) => { setLureColor(text) }}
        />
        <Text>釣果数</Text>
        <TextInput
          style={styles.input}
          value={catchFish}
          onChangeText={(text) => { setCatchFish(text) }}
        />
      </ScrollView>
      <CircleButton onPress={() => {
        handlePress(
          id,
          title,
          images.map(img => img.uri),
          weather,
          content,
          parseFloat(length),
          parseFloat(weight),
          lure,
          lureColor,
          parseInt(catchFish, 10),
          fishArea
        )
      }}>
        <Icon name='check' size={40} color='#ffffff' />
      </CircleButton>
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
    borderWidth: 1,
    borderColor: '#D0D0D0',
    height: 32,
    marginVertical: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  image: {
    width: 100,
    height: 100,
    margin: 5
  }
})

export default Edit
