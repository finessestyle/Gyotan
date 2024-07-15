import {
  View, ScrollView, Text, TextInput, Image, StyleSheet, Platform, Alert
} from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { collection, addDoc, Timestamp, getDoc, doc } from 'firebase/firestore'
import { db, auth, storage } from '../../config'
import RNPickerSelect from 'react-native-picker-select'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import KeyboardAvoidingView from '../../components/KeybordAvoidingView'
import Button from '../../components/Button'

const handlePress = async/* 非同期処理 */ (
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
): Promise<void> => {
  try {
    if (auth.currentUser === null) { return } // ユーザーがログインしていない場合、関数を終了

    const userId = auth.currentUser.uid
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userData = userDoc.data()
    const userName = userData?.userName ?? 'ゲスト'
    const userImage = userData?.imageUrl ?? ''
    const postRef = collection(db, `users/${userId}/posts`) // Firestoreのコレクション参照を取得

    const imageUrls = await Promise.all(images.map(async (image, index) => {
      const response = await fetch(image) // 画像をfetch
      const blob = await response.blob() // fetchした画像をblobに変換
      const imageName = `image_${index}`
      const storageRef = ref(storage, `posts/${userId}/${imageName}`)
      await uploadBytes(storageRef, blob) // 画像をストレージにアップロード
      return await getDownloadURL(storageRef) // アップロードした画像のダウンロードURLを取得
    }))

    await addDoc(postRef, { // Firestoreにドキュメントを追加
      userId,
      userName,
      userImage,
      title,
      images: imageUrls, // 取得した画像のURLを保存
      weather,
      content,
      length,
      weight,
      lure,
      lureColor,
      catchFish,
      fishArea,
      updatedAt: Timestamp.fromDate(new Date()) // 現在のタイムスタンプを保存
    })

    router.back() // 成功したら前のページに戻る
  } catch (error) {
    console.log(error)
    Alert.alert('投稿に失敗しました')
  }
}

const generateCatchFishOptions = (): Array<{ label: string, value: number }> => {
  const options = []
  for (let i = 1; i <= 20; i += 1) {
    options.push({ label: `${i} `, value: i })
  }
  return options
}

const Create = (): JSX.Element => {
  const [title, setTitle] = useState('')
  const [images, setImages] = useState<Array<{ uri: string }>>([])
  const [weather, setWeather] = useState('')
  const [content, setContent] = useState('')
  const [fishArea, setFishArea] = useState('')
  const [length, setLength] = useState<number | null>(null)
  const [weight, setWeight] = useState<number | null>(null)
  const [lure, setLure] = useState('')
  const [lureColor, setLureColor] = useState('')
  const [catchFish, setCatchFish] = useState<number | null>(null)

  const pickImage = async (): Promise<void> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        return
      }
    }
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

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>釣果投稿</Text>
        <Text style={styles.textTitle}>タイトル</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => { setTitle(text) }}
          placeholder='タイトルを入力'
          keyboardType='default'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>ファイルを選択</Text>
        <Button label="釣果画像を選択" onPress={pickImage} />
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.image} />
          ))}
        </View>
        <Text style={styles.textTitle}>釣果内容</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => { setContent(text) }}
          placeholder='釣果内容を入力してください'
          keyboardType='default'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>天気を選択</Text>
        <RNPickerSelect
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
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setFishArea(value)
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
          placeholder={{ label: '釣果エリアを選択してください', value: null }}
        />

        <Text style={styles.textTitle}>サイズ</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => { setLength(Number(text)) }}
          placeholder='長さを入力してください'
          keyboardType='numeric'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>重さ</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => { setWeight(Number(text)) }}
          placeholder='重さを入力してください'
          keyboardType='number-pad'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>ルアーを選択</Text>
        <RNPickerSelect
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setLure(value)
            }
          }}
          items={[
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
            { label: 'フロッグ', value: 'フロッグ' },
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
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'ルアーを選択してください', value: null }}
        />
        <Text style={styles.textTitle}>ルアーカラー</Text>
        <RNPickerSelect
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setLureColor(value)
            }
          }}
          items={[
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
            { label: 'ウォーターメロン', value: 'ウォーターメロン' },
            { label: 'グリパン', value: 'グリパン' },
            { label: 'スカッパノン', value: 'スカッパノン' },
            { label: 'スモーク', value: 'スモーク' },
            { label: 'ツートン', value: 'ツートン' }
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: '釣果エリアを選択してください', value: null }}
        />
        <Text style={styles.textTitle}>釣果数</Text>
        <RNPickerSelect
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
            images.map(img => img.uri),
            weather,
            content,
            length ?? 0,
            weight ?? 0,
            lure,
            lureColor,
            catchFish ?? 10,
            fishArea
          )
        }} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
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
