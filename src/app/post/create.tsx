import {
  View, ScrollView, Text, TextInput, Image, StyleSheet, Alert
} from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { collection, Timestamp, getDoc, doc, setDoc, addDoc } from 'firebase/firestore'
import { db, auth, storage } from '../../config'
import RNPickerSelect from 'react-native-picker-select'
import * as ImageMultiplePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Button from '../../components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const handlePress = async (
  title: string,
  images: Array<{ uri: string, exif?: { GPSLatitude?: number, GPSLongitude?: number, DateTimeOriginal?: string } }>,
  weather: string,
  content: string,
  length: number | null,
  weight: number | null,
  lure: string,
  lureColor: string,
  catchFish: number | null,
  fishArea: string
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
    if (weather === '') {
      Alert.alert('エラー', '天気を選択してください')
      return
    }
    if (content === '') {
      Alert.alert('エラー', '釣果内容を入力してください')
      return
    }
    if (fishArea === '') {
      Alert.alert('エラー', '釣果エリアを選択してください')
      return
    }
    if (length === null) {
      Alert.alert('エラー', '長さを入力してください')
      return
    }
    if (weight === null) {
      Alert.alert('エラー', '重さを入力してください')
      return
    }
    if (lure === '') {
      Alert.alert('エラー', 'ルアーを選択してください')
      return
    }
    if (lureColor === '') {
      Alert.alert('エラー', 'ルアーカラーを選択してください')
      return
    }
    if (catchFish === null) {
      Alert.alert('エラー', '釣果数を選択してください')
      return
    }

    if (auth.currentUser === null) return
    const userId = auth.currentUser.uid
    const userDoc = await getDoc(doc(db, 'users', userId)) // ドキュメントのデータを取得
    const userData = userDoc.data()
    const userName = userData?.userName ?? 'ゲスト'
    const userImage = userData?.userImage ?? ''
    const postRef = collection(db, 'posts')
    const newPostRef = await addDoc(postRef, {}) // 新しいドキュメントを追加し、ドキュメントIDを取得
    const postId = newPostRef.id

    const imageUrls = await Promise.all(images.map(async (image, index) => {
      const response = await fetch(image.uri)
      const blob = await response.blob()
      const imageName = `image_${Date.now()}_${index}`
      const storageRef = ref(storage, `posts/${postId}/${imageName}`)
      await uploadBytes(storageRef, blob)
      return await getDownloadURL(storageRef)
    }))

    const exifData = images.map(image => ({
      latitude: image.exif?.GPSLatitude ?? null,
      longitude: image.exif?.GPSLongitude ?? null,
      dateTime: image.exif?.DateTimeOriginal ?? null
    }))

    await setDoc(doc(db, 'posts', postId), {
      userId,
      userName,
      userImage,
      title,
      images: imageUrls,
      weather,
      content,
      length,
      weight,
      lure,
      lureColor,
      catchFish,
      fishArea,
      exifData: exifData.length > 0 ? exifData : null,
      updatedAt: Timestamp.fromDate(new Date()) // 現在のタイムスタンプを保存
    })
    router.back()
  } catch (error) {
    Alert.alert('投稿に失敗しました')
  }
}

const Create = (): JSX.Element => {
  const [title, setTitle] = useState('')
  const [images, setImages] = useState<Array<{ uri: string, exif?: { GPSLatitude?: number, GPSLongitude?: number } }>>([])
  const [weather, setWeather] = useState('')
  const [content, setContent] = useState('')
  const [fishArea, setFishArea] = useState('')
  const [length, setLength] = useState<number | null>(null)
  const [weight, setWeight] = useState<number | null>(null)
  const [lure, setLure] = useState('')
  const [lureColor, setLureColor] = useState('')
  const [catchFish, setCatchFish] = useState<number | null>(null)
  const [category, setCategory] = useState<string | null>(null)

  const softLures = [
    { label: 'スモラバ', value: 'スモラバ' },
    { label: 'ネコリグ', value: 'ネコリグ' },
    { label: 'ミドスト', value: 'ミドスト' },
    { label: 'ノーシンカーリグ', value: 'ノーシンカーリグ' },
    { label: 'ジグヘッドワッキー', value: 'ジグヘッドワッキー' },
    { label: 'ダウンショットリグ', value: 'ダウンショットリグ' },
    { label: '虫系', value: '虫系' },
    { label: 'ヘビキャロ', value: 'ヘビキャロ' },
    { label: 'テキサスリグ', value: 'テキサスリグ' },
    { label: 'スイムベイト', value: 'スイムベイト' },
    { label: 'シャッドテール', value: 'シャッドテール' }
  ]

  const hardLures = [
    { label: 'クランクベイト', value: 'クランクベイト' },
    { label: 'ディープクランク', value: 'ディープクランク' },
    { label: 'ミノー', value: 'ミノー' },
    { label: 'シャッド', value: 'シャッド' },
    { label: 'バイブレーション', value: 'バイブレーション' },
    { label: 'スピナーベイト', value: 'スピナーベイト' },
    { label: 'クランクベイト', value: 'クランクベイト' },
    { label: 'ディープクランク', value: 'ディープクランク' },
    { label: 'ミノー', value: 'ミノー' },
    { label: 'シャッド', value: 'シャッド' },
    { label: 'バイブレーション', value: 'バイブレーション' },
    { label: 'スピナーベイト', value: 'スピナーベイト' },
    { label: 'バズベイト', value: 'バズベイト' },
    { label: 'チャターベイト', value: 'チャターベイト' },
    { label: 'ビッグベイト', value: 'ビッグベイト' },
    { label: 'I字系', value: 'I字系' },
    { label: 'ラバージグ', value: 'ラバージグ' },
    { label: 'フットボールジグ', value: 'フットボールジグ' },
    { label: 'メタルバイブ', value: 'メタルバイブ' },
    { label: 'ウェイクベイト', value: 'ウェイクベイト' },
    { label: 'ポッパー', value: 'ポッパー' },
    { label: 'ペンシルベイト', value: 'ペンシルベイト' },
    { label: 'プロップベイト', value: 'プロップベイト' },
    { label: 'ハネモノ', value: 'ハネモノ' },
    { label: 'フロッグ', value: 'フロッグ' }
  ]

  const softLureColors = [
    { label: 'ウォーターメロン', value: 'ウォーターメロン' },
    { label: 'グリパン', value: 'グリパン' },
    { label: 'スカッパノン', value: 'スカッパノン' },
    { label: 'スモーク', value: 'スモーク' },
    { label: 'クリア', value: 'クリア' },
    { label: 'ホワイト', value: 'ホワイト' },
    { label: 'ブラック', value: 'ブラック' },
    { label: 'ツートン', value: 'ツートン' },
    { label: 'レッド', value: 'レッド' },
    { label: 'ブルー', value: 'ブルー' },
    { label: 'チャート', value: 'チャート' },
    { label: 'パープル', value: 'パープル' },
    { label: 'ピンク', value: 'ピンク' },
    { label: 'ゴールド', value: 'ゴールド' },
    { label: 'シルバー', value: 'シルバー' },
    { label: 'ゴースト', value: 'ゴースト' }
  ]

  const hardLureColors = [
    { label: 'ゴールド', value: 'ゴールド' },
    { label: 'シルバー', value: 'シルバー' },
    { label: 'レッド', value: 'レッド' },
    { label: 'ブルー', value: 'ブルー' },
    { label: 'チャート', value: 'チャート' },
    { label: 'パープル', value: 'パープル' },
    { label: 'ゴースト', value: 'ゴースト' },
    { label: 'ピンク', value: 'ピンク' },
    { label: 'ホワイト', value: 'ホワイト' },
    { label: 'ブラック', value: 'ブラック' },
    { label: 'クロー', value: 'クロー' },
    { label: 'ホロ', value: 'ホロ' },
    { label: 'インナープレート', value: 'インナープレート' },
    { label: 'クリア', value: 'クリア' },
    { label: 'ツートン', value: 'ツートン' }
  ]

  const lureOptions = category === 'ソフトルアー' ? softLures : hardLures
  const lureColorOptions = category === 'ソフトルアー' ? softLureColors : hardLureColors
  const maxLength = 100

  const pickImage = async (): Promise<void> => {
    const result = await ImageMultiplePicker.launchImageLibraryAsync({
      mediaTypes: ImageMultiplePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 0.3,
      exif: true
    })
    if (!result.canceled && result.assets.length > 0) {
      const processedAssets = result.assets.map(asset => ({
        uri: asset.uri,
        exif: asset.exif ?? undefined
      }))
      setImages(processedAssets)
    }
  }

  const generateCatchFishOptions = (): Array<{ label: string, value: number }> => {
    const options = []
    for (let i = 1; i <= 20; i += 1) {
      options.push({ label: `${i} `, value: i })
    }
    return options
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>釣果投稿</Text>
        <Text style={styles.textTitle}>タイトル</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => { setTitle(text) }}
          placeholder='タイトルを入力'
          keyboardType='default'
          returnKeyType='done'
          maxLength={13}
        />
        <Text style={styles.textTitle}>ファイルを選択</Text>
        <Button
          label="釣果画像を選択"
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
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <Text style={styles.imageNumber}>{index + 1}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.textTitle}>釣果内容</Text>
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={(text) => { setContent(text) }}
          placeholder='釣果内容を入力してください'
          keyboardType='default'
          returnKeyType='done'
          multiline
          maxLength={maxLength}
        />
        <Text style={styles.charCount}>
          残り{maxLength - content.length}文字
        </Text>
        <Text style={styles.textTitle}>天気を選択</Text>
        <RNPickerSelect
          value={weather}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setWeather(value)
            }
          }}
          items={[
            { label: '晴れ', value: '晴れ' },
            { label: '曇り', value: '曇り' },
            { label: '雨', value: '雨' },
            { label: '雪', value: '雪' }
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: '天気を選択してください', value: null }}
        />
        <Text style={styles.textTitle}>釣果エリア</Text>
        <RNPickerSelect
          value={fishArea}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setFishArea(value)
            }
          }}
          items={[
            { label: '北湖北', value: '北湖北' },
            { label: '北湖東', value: '北湖東' },
            { label: '北湖西', value: '北湖西' },
            { label: '南湖東', value: '南湖東' },
            { label: '南湖西', value: '南湖西' }
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: '釣果エリアを選択してください', value: null }}
        />

        <Text style={styles.textTitle}>サイズ</Text>
        <TextInput
          style={styles.input}
          value={length !== null ? String(length) : ''}
          onChangeText={(text) => { setLength(Number(text)) }}
          placeholder='長さ(cm)を入力してください'
          keyboardType='number-pad'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>重さ</Text>
        <TextInput
          style={styles.input}
          value={weight !== null ? String(weight) : ''}
          onChangeText={(text) => { setWeight(Number(text)) }}
          placeholder='重さ(g)を入力してください'
          keyboardType='number-pad'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>ルアーを選択</Text>
        <RNPickerSelect
          value={category}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setCategory(value)
              setLure(value)
              setLureColor(value)
            }
          }}
          items={[
            { label: 'ソフトルアー', value: 'ソフトルアー' },
            { label: 'ハードルアー', value: 'ハードルアー' }
          ]}
          placeholder={{ label: 'カテゴリーを選択してください', value: null }}
          style={pickerSelectStyles}
        />
        {category !== null && (
          <RNPickerSelect
            value={lure}
            onValueChange={(value: string | null) => {
              if (value !== null) {
                setLure(value)
              }
            }}
            items={lureOptions}
            placeholder={{ label: 'ルアーを選択してください', value: null }}
            style={pickerSelectStyles}
          />
        )}
        {category !== null && (
          <RNPickerSelect
            value={lureColor}
            onValueChange={(value: string | null) => {
              if (value !== null) {
                setLureColor(value)
              }
            }}
            items={lureColorOptions}
            placeholder={{ label: 'ルアーカラーを選択してください', value: null }}
            style={pickerSelectStyles}
          />
        )}
        <Text style={styles.textTitle}>釣果数</Text>
        <RNPickerSelect
          value={catchFish}
          onValueChange={(value: number | null) => {
            if (value !== null) {
              setCatchFish(value)
            }
          }}
          items={generateCatchFishOptions()}
          style={pickerSelectStyles}
          placeholder={{ label: '釣果数を選択してください', value: null }}
        />
        <Button label='投稿' onPress={() => {
          void handlePress(
            title,
            images,
            weather,
            content,
            length,
            weight,
            lure,
            lureColor,
            catchFish,
            fishArea
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
  contentInput: {
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    height: 100,
    marginVertical: 4,
    alignItems: 'flex-start',
    paddingLeft: 18,
    fontSize: 16
  },
  charCount: {
    textAlign: 'right',
    color: 'gray'
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
  },
  imageNumber: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 4,
    fontSize: 8
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

export default Create
