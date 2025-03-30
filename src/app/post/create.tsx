import {
  View, Text, TextInput, Image, StyleSheet, Alert
} from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { useState, useCallback } from 'react'
import { collection, Timestamp, getDoc, doc, setDoc, addDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, auth, storage } from '../../config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select'
import * as ImageMultiplePicker from 'expo-image-picker'
import Button from '../../components/Button'
import { hokkoNarea, hokkoEarea, hokkoWarea, nannkoEarea, nannkoWarea } from '../../../types/areas'
import { softLures, hardLures, softLureActions, hardLureActions } from '../../../types/lure'

// () 関数の呼び出し
// {} オブジェクトの定義
// [] 配列の定義

const handlePress = async (
  images: Array<{ uri: string, exif?: { GPSLatitude?: number, GPSLongitude?: number, DateTimeOriginal?: string } }>,
  area: string,
  fishArea: string,
  weather: string,
  category: string,
  lure: string,
  lureAction: string,
  waterDepth: string,
  structure: string,
  cover: string,
  length: number | null,
  weight: number | null,
  catchFish: number | null,
  hokkoNarea: Array<{ label: string, value: string, latitude: number, longitude: number }>,
  hokkoEarea: Array<{ label: string, value: string, latitude: number, longitude: number }>,
  hokkoWarea: Array<{ label: string, value: string, latitude: number, longitude: number }>,
  nannkoEarea: Array<{ label: string, value: string, latitude: number, longitude: number }>,
  nannkoWarea: Array<{ label: string, value: string, latitude: number, longitude: number }>
): Promise<void> => {
  try {
    if (images.length === 0) {
      Alert.alert('エラー', '釣果画像を選択してください')
      return
    }
    if (area === '') {
      Alert.alert('エラー', '釣果エリアを選択してください')
      return
    }
    if (fishArea === '') {
      Alert.alert('エラー', '釣果エリアを選択してください')
      return
    }
    if (weather === '') {
      Alert.alert('エラー', '天気を選択してください')
      return
    }
    if (category === '') {
      Alert.alert('エラー', 'カテゴリーを選択してください')
      return
    }
    if (lure === '') {
      Alert.alert('エラー', 'ルアーを選択してください')
      return
    }
    if (lureAction === '') {
      Alert.alert('エラー', 'ルアーアクションを選択してください')
      return
    }
    if (waterDepth === '') {
      Alert.alert('エラー', '水深を選択してください')
      return
    }
    if (structure === '') {
      Alert.alert('エラー', 'ストラクチャーを選択してください')
      return
    }
    if (cover === '') {
      Alert.alert('エラー', 'カバーを選択してください')
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
    if (catchFish === null) {
      Alert.alert('エラー', '釣果数を選択してください')
      return
    }

    if (auth.currentUser === null) return
    const userId = auth.currentUser.uid
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userData = userDoc.data()
    const userName = userData?.userName ?? 'ゲスト'
    const userImage = userData?.userImage ?? ''
    const postRef = collection(db, 'posts')
    const newPostRef = await addDoc(postRef, {})
    const postId = newPostRef.id

    const imageUrls = await Promise.all(images.map(async (image, index) => {
      const response = await fetch(image.uri)
      const blob = await response.blob()
      const imageName = `image_${Date.now()}_${index}`
      const storageRef = ref(storage, `posts/${postId}/${imageName}`)
      await uploadBytes(storageRef, blob)
      return await getDownloadURL(storageRef)
    }))

    const biwakoAreas = [
      ...hokkoNarea,
      ...hokkoEarea,
      ...hokkoWarea,
      ...nannkoEarea,
      ...nannkoWarea
    ]
    const selectedArea = biwakoAreas.find(area => area.value === fishArea)
    const exifData = images.map(image => ({
      latitude: image.exif?.GPSLatitude ?? selectedArea?.latitude ?? null,
      longitude: image.exif?.GPSLongitude ?? selectedArea?.longitude ?? null,
      dateTime: image.exif?.DateTimeOriginal ?? null
    }))

    await setDoc(doc(db, 'posts', postId), {
      userId,
      userName,
      userImage,
      images: imageUrls,
      exifData: exifData.length > 0 ? exifData : null,
      area,
      fishArea,
      category,
      lure,
      lureAction,
      waterDepth,
      weather,
      structure,
      cover,
      length,
      weight,
      catchFish,
      updatedAt: Timestamp.fromDate(new Date()) // 現在のタイムスタンプを保存
    }, { merge: true })
    router.replace('/post/top')
  } catch (error) {
    console.log(error)
    Alert.alert('投稿に失敗しました')
  }
}

const Create = (): JSX.Element => {
  const [images, setImages] = useState<Array<{ uri: string, exif?: { GPSLatitude?: number, GPSLongitude?: number } }>>([])
  const [area, setArea] = useState('')
  const [fishArea, setFishArea] = useState('')
  const [weather, setWeather] = useState('')
  const [category, setCategory] = useState('')
  const [lure, setLure] = useState('')
  const [lureAction, setLureAction] = useState('')
  const [waterDepth, setWaterDepth] = useState('')
  const [structure, setStructure] = useState('')
  const [cover, setCover] = useState('')
  const [length, setLength] = useState<number | null>(null)
  const [weight, setWeight] = useState<number | null>(null)
  const [catchFish, setCatchFish] = useState<number | null>(null)

  useFocusEffect(
    useCallback(() => {
      setImages([])
      setArea('')
      setFishArea('')
      setWeather('')
      setCategory('')
      setLure('')
      setLureAction('')
      setWaterDepth('')
      setStructure('')
      setCover('')
      setLength(null)
      setWeight(null)
      setCatchFish(null)
    }, [])
  )

  const areaOptions =
  fishArea === '北湖北岸'
    ? hokkoNarea
    : fishArea === '北湖東岸'
      ? hokkoEarea
      : fishArea === '北湖西岸'
        ? hokkoWarea
        : fishArea === '南湖東岸'
          ? nannkoEarea
          : fishArea === '南湖西岸'
            ? nannkoWarea
            : fishArea === null || fishArea === undefined
              ? []
              : []

  const lureOptions = category === 'ソフトルアー' ? softLures : hardLures
  const lureActionOptions = category === 'ソフトルアー' ? softLureActions : hardLureActions

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

  return (
    <KeyboardAwareScrollView style={styles.scrollContainer}>
      <View style={styles.inner}>
        <Text style={styles.title}>釣果投稿</Text>
        <Text style={styles.textTitle}>ファイルを選択</Text>
        <Button
          label="釣果画像を選択"
          buttonStyle={{ height: 24, backgroundColor: '#D0D0D0' }}
          labelStyle={{ lineHeight: 12, color: '#000000' }}
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

        <Text style={styles.textTitle}>釣果エリアを選択</Text>
        <RNPickerSelect
          value={fishArea}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setFishArea(value)
              setArea(value)
            }
          }}
          items={[
            { label: '北湖北岸', value: '北湖北岸' },
            { label: '北湖東岸', value: '北湖東岸' },
            { label: '北湖西岸', value: '北湖西岸' },
            { label: '南湖東岸', value: '南湖東岸' },
            { label: '南湖西岸', value: '南湖西岸' }
          ]}
          placeholder={{ label: 'エリアを選択してください', value: '' }}
          style={pickerSelectStyles}
        />
        {fishArea !== null && (
          <RNPickerSelect
            value={area}
            onValueChange={(value: string | null) => {
              if (value !== null) {
                setArea(value)
              }
            }}
            items={areaOptions}
            placeholder={{ label: 'エリアを選択してください', value: '' }}
            style={pickerSelectStyles}
          />
        )}

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
          placeholder={{ label: '天気を選択してください', value: '' }}
          style={pickerSelectStyles}
        />

        <Text style={styles.textTitle}>ルアーを選択</Text>
        <RNPickerSelect
          value={category}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setCategory(value)
              setLure(value)
              setLureAction(value)
            }
          }}
          items={[
            { label: 'ソフトルアー', value: 'ソフトルアー' },
            { label: 'ハードルアー', value: 'ハードルアー' }
          ]}
          placeholder={{ label: 'カテゴリーを選択してください', value: '' }}
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
            placeholder={{ label: 'ルアーを選択してください', value: '' }}
            style={pickerSelectStyles}
          />
        )}
        {category !== null && (
          <RNPickerSelect
            value={lureAction}
            onValueChange={(value: string | null) => {
              if (value !== null) {
                setLureAction(value)
              }
            }}
            items={lureActionOptions}
            placeholder={{ label: 'ルアーアクションを選択してください', value: '' }}
            style={pickerSelectStyles}
          />
        )}

        <Text style={styles.textTitle}>水深を選択</Text>
        <RNPickerSelect
          value={waterDepth}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setWaterDepth(value)
            }
          }}
          items={[
            { label: 'トップ', value: 'トップ' },
            { label: 'ミドル', value: 'ミドル' },
            { label: 'ボトム', value: 'ボトム' }
          ]}
          placeholder={{ label: '水深を選択してください', value: '' }}
          style={pickerSelectStyles}
        />

        <Text style={styles.textTitle}>ストラクチャー（地形変化）を選択</Text>
        <RNPickerSelect
          value={structure}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setStructure(value)
            }
          }}
          items={[
            { label: 'ブレイク', value: 'ブレイク' },
            { label: 'シャローフラット', value: 'シャローフラット' },
            { label: 'ディープ', value: 'ディープ' },
            { label: '岬', value: '岬' },
            { label: 'ワンド', value: 'ワンド' },
            { label: 'ゴロタ石', value: 'ゴロタ石' },
            { label: 'リップラップ', value: 'リップラップ' },
            { label: 'チャネル', value: 'チャネル' },
            { label: 'サンドバー', value: 'サンドバー' },
            { label: '浚渫跡', value: '浚渫跡' },
            { label: 'ハンプ', value: 'ハンプ' },
            { label: '流れ込み', value: '流れ込み' },
            { label: '河口', value: '河口' },
            { label: '漁港', value: '漁港' }
          ]}
          placeholder={{ label: 'ストラクチャーを選択してください', value: '' }}
          style={pickerSelectStyles}
        />

        <Text style={styles.textTitle}>カバー（障害物）を選択</Text>
        <RNPickerSelect
          value={cover}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setCover(value)
            }
          }}
          items={[
            { label: '護岸際', value: '護岸際' },
            { label: 'ウィード', value: 'ウィード' },
            { label: '取水塔', value: '取水塔' },
            { label: '桟橋', value: '桟橋' },
            { label: '橋脚', value: '橋脚' },
            { label: 'オーバーハング', value: 'オーバーハング' },
            { label: '立木', value: '立木' },
            { label: 'ブッシュ', value: 'ブッシュ' },
            { label: 'レイダウン', value: 'レイダウン' },
            { label: 'リリーパッド', value: 'リリーパッド' },
            { label: 'ゴミ溜まり', value: 'ゴミ溜まり' },
            { label: 'オダ', value: 'オダ' },
            { label: '杭', value: '杭' },
            { label: '水門', value: '水門' },
            { label: '漁礁', value: '漁礁' },
            { label: '消波ブロック', value: '消波ブロック' },
            { label: '大岩', value: '大岩' },
            { label: '沈船', value: '沈船' }
          ]}
          placeholder={{ label: 'カバーを選択してください', value: '' }}
          style={pickerSelectStyles}
        />

        <Text style={styles.textTitle}>長さを入力(cm)</Text>
        <TextInput
          style={styles.input}
          value={length !== null ? String(length) : ''}
          onChangeText={(text) => {
            const numericValue = Number(text)
            if (!isNaN(numericValue)) {
              setLength(Number(text))
            }
          }}
          placeholder='長さ(cm)を入力してください'
          keyboardType='number-pad'
          returnKeyType='done'
        />

        <Text style={styles.textTitle}>重さを入力(g)</Text>
        <TextInput
          style={styles.input}
          value={weight !== null ? String(weight) : ''}
          onChangeText={(text) => {
            const numericValue = Number(text)
            if (!isNaN(numericValue)) {
              setWeight(Number(text))
            }
          }}
          placeholder='重さ(g)を入力してください'
          keyboardType='number-pad'
          returnKeyType='done'
        />

        <Text style={styles.textTitle}>釣果数</Text>
        <TextInput
          style={styles.input}
          value={catchFish !== null ? String(catchFish) : ''}
          onChangeText={(text) => {
            const numericValue = Number(text)
            if (!isNaN(numericValue)) {
              setCatchFish(Number(text))
            }
          }}
          placeholder='釣果数を入力してください'
          keyboardType='number-pad'
          returnKeyType='done'
        />

        <Button label='投稿' onPress={() => {
          void handlePress(
            images,
            area,
            fishArea,
            weather,
            category,
            lure,
            lureAction,
            waterDepth,
            structure,
            cover,
            length,
            weight,
            catchFish,
            hokkoNarea,
            hokkoEarea,
            hokkoWarea,
            nannkoEarea,
            nannkoWarea
          )
        }}
          buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30, marginBottom: 24 }}
          labelStyle={{ fontSize: 24, lineHeight: 21 }}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    paddingHorizontal: 8
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginVertical: 16
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
  textTitle: {
    paddingVertical: 8
  },
  imageContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  imageWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 4
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8
  },
  imageNumber: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 4,
    fontSize: 10
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
    marginVertical: 4,
    pointerEvents: 'none'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 19,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D0D0D0',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    pointerEvents: 'none'
  }
})

export default Create
