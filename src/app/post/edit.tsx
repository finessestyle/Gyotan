import {
  View, Text, TextInput, StyleSheet,
  ScrollView, Alert, Image, TouchableOpacity
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { auth, db, storage } from '../../config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import RNPickerSelect from 'react-native-picker-select'
import * as ImageMultiplePicker from 'expo-image-picker'
import Button from '../../components/Button'
import { hokkoNarea, hokkoEarea, hokkoWarea, nannkoEarea, nannkoWarea } from '../../../types/areas'
import { softLures, hardLures, softLureActions, hardLureActions } from '../../../types/lure'
import Lottie from '../../components/Lottie'

const handlePress = async (
  id: string,
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
  nannkoWarea: Array<{ label: string, value: string, latitude: number, longitude: number }>,
  setLoading: (value: boolean) => void
): Promise<void> => {
  try {
    const requiredFields = [
      { key: images.length === 0, message: '釣果画像を選択してください' },
      { key: area === '', message: '釣果エリアを選択してください' },
      { key: fishArea === '', message: '釣果エリアを選択してください' },
      { key: weather === '', message: '天気を選択してください' },
      { key: category === '', message: 'カテゴリーを選択してください' },
      { key: lure === '', message: 'ルアーを選択してください' },
      { key: lureAction === '', message: 'ルアーアクションを選択してください' },
      { key: waterDepth === '', message: '水深を選択してください' },
      { key: structure === '', message: 'ストラクチャーを選択してください' },
      { key: cover === '', message: 'カバーを選択してください' },
      { key: length === null, message: '長さを入力してください' },
      { key: weight === null, message: '重さを入力してください' },
      { key: catchFish === null, message: '釣果数を選択してください' }
    ]
    for (const field of requiredFields) {
      if (field.key) {
        Alert.alert('エラー', field.message)
        return
      }
    }

    if (auth.currentUser === null) return
    const userId = auth.currentUser.uid
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userData = userDoc.data()
    const userName = userData?.userName ?? 'ゲスト'
    const userImage = userData?.userImage ?? ''
    const postRef = doc(db, 'posts', id)
    const postId = postRef.id

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

    setLoading(true)

    await setDoc(doc(db, 'posts', id), {
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
    })
    await new Promise(resolve => setTimeout(resolve, 3000))
    router.back()
  } catch (error) {
    console.log(error)
    Alert.alert('更新に失敗しました')
  } finally {
    setLoading(false)
  }
}

const Edit = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
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
  const [length, setLength] = useState('')
  const [weight, setWeight] = useState<number | null>(null)
  const [catchFish, setCatchFish] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

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

  const removeImage = (index: number): void => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (auth.currentUser === null) return
    const ref = doc(db, 'posts', id)
    getDoc(ref)
      .then((docRef) => {
        const data = docRef?.data() as {
          images?: string[]
          exifData?: string
          area?: string
          fishArea?: string
          weather?: string
          category?: string
          lure?: string
          lureAction?: string
          waterDepth?: string
          structure?: string
          cover?: string
          length?: string
          weight?: string
          catchFish?: string
        }
        setImages(data.images?.map((uri: string) => ({ uri })) ?? [])
        setArea(data.area ?? '')
        setFishArea(data.fishArea ?? '')
        setWeather(data.weather ?? '')
        setCategory(data.category ?? '')
        setLure(data?.lure ?? '')
        setLureAction(data?.lureAction ?? '')
        setWaterDepth(data.waterDepth ?? '')
        setStructure(data?.structure ?? '')
        setCover(data?.cover ?? '')
        setLength(data?.length ?? '')
        setWeight(data?.weight !== undefined && data.weight !== '' ? parseFloat(data.weight) : null)
        setCatchFish(data?.catchFish !== undefined && data.catchFish !== '' ? parseFloat(data.catchFish) : null)
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [id])

  return (
    <>
      {loading && <Lottie onFinish={() => { setLoading(false) }} />}
      <KeyboardAwareScrollView style={styles.scrollContainer}>
        <ScrollView style={styles.inner}>

          <Text style={styles.title}>釣果編集</Text>

          <Text style={styles.textTitle}>ファイルを選択</Text>
          <Button
            label="釣果画像を選択"
            buttonStyle={{ height: 28, backgroundColor: '#D0D0D0' }}
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
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    removeImage(index)
                  }}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={styles.textTitle}>釣果エリア</Text>
          <RNPickerSelect
            value={fishArea}
            onValueChange={(value: string | null) => {
              if (value !== null) {
                setFishArea(value)
                setArea('')
              }
            }}
            items={[
              { label: '北湖北岸', value: '北湖北岸' },
              { label: '北湖東岸', value: '北湖東岸' },
              { label: '北湖西岸', value: '北湖西岸' },
              { label: '南湖東岸', value: '南湖東岸' },
              { label: '南湖西岸', value: '南湖西岸' }
            ]}
            placeholder={{ label: '釣果エリアを選択してください', value: '' }}
            style={pickerSelectStyles}
          />
          {fishArea !== '' && (
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
                setLure('')
                setLureAction('')
              }
            }}
            items={[
              { label: 'ソフトルアー', value: 'ソフトルアー' },
              { label: 'ハードルアー', value: 'ハードルアー' }
            ]}
            placeholder={{ label: 'カテゴリーを選択してください', value: '' }}
            style={pickerSelectStyles}
          />
          {category !== '' && (
            <RNPickerSelect
              value={lure}
              onValueChange={(value: string | null) => {
                if (value !== null) {
                  setLure(value)
                  setLureAction('')
                }
              }}
              items={lureOptions}
              placeholder={{ label: 'ルアーを選択してください', value: '' }}
              style={pickerSelectStyles}
            />
          )}
          {lure !== '' && (
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
              { label: '表層', value: '表層' },
              { label: '中層', value: '中層' },
              { label: '底層', value: '底層' }
            ]}
            placeholder={{ label: '水深を選択してください', value: '' }}
            style={pickerSelectStyles}
          />

          <Text style={styles.textTitle}>ストラクチャー（水中の地形変化）を選択</Text>
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
              { label: 'ウィード', value: 'ウィード' },
              { label: '取水塔', value: '取水塔' },
              { label: '桟橋', value: '桟橋' },
              { label: '橋脚', value: '橋脚' },
              { label: '護岸際', value: '護岸際' },
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
            value={length !== null ? String(length) : ''}
            style={styles.input}
            onChangeText={setLength}
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
              id,
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
              parseFloat(length),
              weight,
              catchFish,
              hokkoNarea,
              hokkoEarea,
              hokkoWarea,
              nannkoEarea,
              nannkoWarea,
              setLoading
            )
          }}
            buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30, marginBottom: 24 }}
            labelStyle={{ fontSize: 24, lineHeight: 21 }}
          />
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    paddingHorizontal: 16,
    paddingVertical: 24
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginVertical: 24
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 40,
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    height: 100,
    marginVertical: 4,
    alignItems: 'flex-start',
    paddingLeft: 18,
    fontSize: 16
  },
  charCount: {
    textAlign: 'right',
    justifyContent: 'center',
    color: 'gray'
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
  removeButton: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: 'silver',
    borderRadius: 16, // 半径は width/2 に
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14, // 調整可能
    lineHeight: 16, // 高さを詰めるために追加
    textAlign: 'center'// 念のため中央寄せ
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 40,
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
    pointerEvents: 'none'
  },
  inputAndroid: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 40,
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
    pointerEvents: 'none'
  }
})

export default Edit
