import {
  View, ScrollView, Text, TextInput, Button, Image, StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db, auth } from '../../config'
import RNPickerSelect from 'react-native-picker-select'
import * as ImagePicker from 'expo-image-picker'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import KeyboardAvoidingView from '../../components/KeybordAvoidingView'

const handlePress = (
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
  const userId = auth.currentUser.uid
  const ref = collection(db, `users/${auth.currentUser.uid}/posts`)
  addDoc(ref, {
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
    userId,
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then((docRef) => {
      console.log('success', docRef.id)
      router.back()
    })
    .catch((error) => {
      console.log(error)
    })
}

const generateLengthOptions = () => {
  const options = []
  for (let i = 20; i <= 80; i += 0.5) {
    options.push({ label: `${i} cm`, value: i })
  }
  return options
}

const generateWeightOptions = () => {
  const options = []
  for (let i = 300; i <= 6000; i += 5) {
    options.push({ label: `${i} g`, value: i })
  }
  return options
}

const generateCatchFishOptions = () => {
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

    if (!result.canceled && result.assets.length > 0) {
      setImages(result.assets.map(asset => ({ uri: asset.uri })))
    }
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
        <Text>天気を選択</Text>
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
        <Text>釣果エリア</Text>
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
        <Text>サイズ</Text>
        <RNPickerSelect
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setLength(value)
            }
          }}
          items={generateLengthOptions()}
          style={pickerSelectStyles}
          placeholder={{ label: '長さを選択してください', value: null }}
        />
        <Text>重さ</Text>
        <RNPickerSelect
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setWeight(value)
            }
          }}
          items={generateWeightOptions()}
          style={pickerSelectStyles}
          placeholder={{ label: '重さを選択してください', value: null }}
        />
        <Text>ルアーを選択</Text>
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
        <Text>ルアーカラー</Text>
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
        <Text>釣果数</Text>
        <RNPickerSelect
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setCatchFish(value)
            }
          }}
          items={generateCatchFishOptions()}
          style={pickerSelectStyles}
          placeholder={{ label: '釣果数を選択してください', value: null }}
        />
        <Text>釣果内容</Text>
        <TextInput
          multiline style={styles.input}
          value={content}
          onChangeText={(text) => { setContent(text) }}
        />
      </ScrollView>
      <CircleButton onPress={() => {
        handlePress(
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
