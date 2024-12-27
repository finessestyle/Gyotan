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

const handlePress = async (
  id: string,
  title: string,
  images: Array<{ uri: string, exif?: { GPSLatitude?: number, GPSLongitude?: number, DateTimeOriginal?: string } }>,
  weather: string,
  content: string,
  length: number | null,
  weight: number | null,
  lure: string,
  lureColor: string,
  catchFish: number | null,
  area: string,
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
    if (area === '') {
      Alert.alert('エラー', '釣果エリアを選択してください')
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

    const exifData = images.map(image => ({
      latitude: image.exif?.GPSLatitude ?? null,
      longitude: image.exif?.GPSLongitude ?? null,
      dateTime: image.exif?.DateTimeOriginal ?? null
    }))

    await setDoc(doc(db, 'posts', id), {
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
      area,
      fishArea,
      exifData: exifData.length > 0 ? exifData : null,
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
  const [weather, setWeather] = useState('')
  const [content, setContent] = useState('')
  const [area, setArea] = useState('')
  const [fishArea, setFishArea] = useState('')
  const [length, setLength] = useState<number | null>(null)
  const [weight, setWeight] = useState<number | null>(null)
  const [lure, setLure] = useState('')
  const [lureColor, setLureColor] = useState('')
  const [catchFish, setCatchFish] = useState<number | null>(null)
  const [category, setCategory] = useState<string | null>(null)

  const hokkoNarea = [
    { label: '海津漁港エリア', value: '海津漁港エリア' },
    { label: '海津大崎エリア', value: '海津大崎エリア' },
    { label: '大浦湾エリア', value: '大浦湾エリア' },
    { label: 'アミレンタルボート前エリア', value: 'アミレンタルボート前エリア' },
    { label: '奥出湾エリア', value: '奥出湾エリア' },
    { label: '黒土崎エリア', value: '黒土崎エリア' },
    { label: '月出ワンドエリア', value: '月出ワンドエリア' },
    { label: '塩津浜エリア', value: '塩津浜エリア' },
    { label: '藤ケ崎エリア', value: '藤ケ崎エリア' },
    { label: '飯浦エリア', value: '飯浦エリア' },
    { label: '西野放水路エリア', value: '西野放水路エリア' },
    { label: '片山石積みエリア', value: '片山石積みエリア' },
    { label: '野田沼エリア', value: '野田沼エリア' }
  ]

  const hokkoEarea = [
    { label: '姉川河口エリア', value: '姉川河口エリア' },
    { label: '南浜エリア', value: '南浜エリア' },
    { label: 'KBセーレン前エリア', value: 'KBセーレン前エリア' },
    { label: '長浜港エリア', value: '長浜港エリア' },
    { label: '神明浜エリア', value: '神明浜エリア' },
    { label: '天野川河口エリア', value: '天野川河口エリア' },
    { label: '入江橋エリア', value: '入江橋エリア' },
    { label: '蒼の湖邸前エリア', value: '蒼の湖邸前エリア' },
    { label: '彦根新港エリア', value: '彦根新港エリア' },
    { label: '旧彦根港エリア', value: '旧彦根港エリア' },
    { label: '芹川河口エリア', value: '芹川河口エリア' },
    { label: '宇曽川河口エリア', value: '宇曽川河口エリア' },
    { label: '野田沼エリア', value: '野田沼エリア' },
    { label: '曽根沼エリア', value: '曽根沼エリア' },
    { label: '文禄川河口エリア', value: '文禄川河口エリア' },
    { label: '神上沼エリア', value: '神上沼エリア' },
    { label: '愛知川河口エリア', value: '愛知川河口エリア' },
    { label: '大同川エリア１', value: '大同川エリア１' },
    { label: '大同川エリア２', value: '大同川エリア２' },
    { label: '伊庭内湖エリア１', value: '伊庭内湖エリア１' },
    { label: '伊庭内湖エリア２', value: '伊庭内湖エリア２' },
    { label: '長命寺川エリア', value: '長命寺川エリア' },
    { label: '吉川浄水場前エリア', value: '吉川浄水場前エリア' },
    { label: '吉川漁港エリア', value: '吉川漁港エリア' }
  ]

  const hokkoWarea = [
    { label: '知内漁港エリア', value: '知内漁港エリア' },
    { label: '貫川内湖エリア', value: '貫川内湖エリア' },
    { label: '浜分沼エリア', value: '浜分沼エリア' },
    { label: '外ヶ浜風車前エリア', value: '外ヶ浜風車前エリア' },
    { label: '安曇川・新堀船溜まり', value: '安曇川・新堀船溜まり' },
    { label: 'エカイ・十ヶ坪沼エリア', value: 'エカイ・十ヶ坪沼エリア' },
    { label: '松ノ木内湖エリア', value: '松ノ木内湖エリア' },
    { label: '萩の浜エリア', value: '萩の浜エリア' },
    { label: '大溝港エリア', value: '大溝港エリア' },
    { label: '乙女ヶ池エリア', value: '乙女ヶ池エリア' },
    { label: '滝川河口エリア', value: '滝川河口エリア' },
    { label: 'レイクオーツカ前エリア', value: 'レイクオーツカ前エリア' },
    { label: '近江舞子・内湖エリア', value: '近江舞子・内湖エリア' },
    { label: '大谷川河口エリア', value: '大谷川河口エリア' },
    { label: '木戸川エリア', value: '木戸川エリア' },
    { label: '八屋戸川エリア', value: '八屋戸川エリア' },
    { label: '和邇川河口エリア', value: '和邇川河口エリア' },
    { label: '真野浜周辺エリア', value: '真野浜周辺エリア' },
    { label: '米プラザ前エリア', value: '米プラザ前エリア' }
  ]

  const nannkoEarea = [
    { label: '木浜埋立地１エリア', value: '木浜埋立地１エリア' },
    { label: '木浜埋立地２エリア', value: '木浜埋立地２エリア' },
    { label: '赤野井ワンド', value: '赤野井ワンド' },
    { label: '烏丸半島周辺エリア', value: '烏丸半島周辺エリア' },
    { label: '平湖・柳平湖エリア', value: '平湖・柳平湖エリア' },
    { label: '北山田漁港周辺エリア', value: '北山田漁港周辺エリア' },
    { label: '矢橋帰帆島周辺エリア', value: '矢橋帰帆島周辺エリア' },
    { label: '漕艇場護岸エリア', value: '漕艇場護岸エリア' },
    { label: '瀬田川大橋周辺エリア', value: '瀬田川大橋周辺エリア' },
    { label: '瀬田川・南郷洗堰北エリア', value: '瀬田川・南郷洗堰北エリア' }
  ]

  const nannkoWarea = [
    { label: 'カヤ池エリア', value: 'カヤ池エリア' },
    { label: '堅田港エリア', value: '堅田港エリア' },
    { label: 'なぎさ漁港エリア', value: 'なぎさ漁港エリア' },
    { label: '天神川河口エリア', value: '天神川河口エリア' },
    { label: '山ノ下湾エリア', value: '山ノ下湾エリア' },
    { label: '雄琴港エリア', value: '雄琴港エリア' },
    { label: 'カネカ石積み護岸エリア', value: 'カネカ石積み護岸エリア' },
    { label: '阪本赤鳥居エリア', value: '阪本赤鳥居エリア' },
    { label: 'KKRホテルびわこエリア', value: 'KKRホテルびわこエリア' },
    { label: '浜大津エリア', value: '浜大津エリア' },
    { label: '由美浜・におの浜エリア１', value: '由美浜・におの浜エリア１' },
    { label: '由美浜・におの浜エリア２', value: '由美浜・におの浜エリア２' },
    { label: '膳所港・城跡公園周辺エリア', value: '膳所港・城跡公園周辺エリア' },
    { label: 'なぎさ公園・青嵐の道エリア', value: 'なぎさ公園・青嵐の道エリア' }
  ]

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

  const areaOptions =
  fishArea === '北湖北'
    ? hokkoNarea
    : fishArea === '北湖東'
      ? hokkoEarea
      : fishArea === '北湖西'
        ? hokkoWarea
        : fishArea === '南湖東'
          ? nannkoEarea
          : fishArea === '南湖西'
            ? nannkoWarea
            : fishArea === null || fishArea === undefined
              ? []
              : []

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

  const removeImage = (index: number): void => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, 'posts', id)
    getDoc(ref)
      .then((docRef) => {
        const data = docRef?.data() as {
          title?: string
          images?: string[]
          weather?: string
          content?: string
          fishArea?: string
          length?: string
          weight?: string
          lure?: string
          lureColor?: string
          catchFish?: string
          exifData?: string
        }
        setTitle(data.title ?? '')
        setImages(data.images?.map((uri: string) => ({ uri })) ?? [])
        setWeather(data.weather ?? '')
        setContent(data.content ?? '')
        setFishArea(data.fishArea ?? '')
        setLength(data?.length !== undefined && data.length !== '' ? parseFloat(data.length) : null)
        setWeight(data?.weight !== undefined && data.weight !== '' ? parseFloat(data.weight) : null)
        setLure(data?.lure ?? '')
        setLureColor(data?.lureColor ?? '')
        setCatchFish(data?.catchFish !== undefined && data.catchFish !== '' ? parseFloat(data.catchFish) : null)
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [id])

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>釣果編集</Text>
        <Text style={styles.textTitle}>タイトル</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => { setTitle(text) }}
          placeholder='タイトルを入力'
          keyboardType='default'
          returnKeyType='done'
          maxLength={12}
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
          placeholder={{ label: '天気を選択してください', value: '' }}
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
          placeholder={{ label: '釣果エリアを選択してください', value: '' }}
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

        <Text style={styles.textTitle}>サイズ</Text>
        <TextInput
          value={length !== null ? String(length) : ''}
          style={styles.input}
          onChangeText={(text) => { setLength(Number(text)) }}
          placeholder='長さを入力してください'
          keyboardType='numeric'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>重さ</Text>
        <TextInput
          value={weight !== null ? String(weight) : ''}
          style={styles.input}
          onChangeText={(text) => { setWeight(Number(text)) }}
          placeholder='重さを入力してください'
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
            value={lureColor}
            onValueChange={(value: string | null) => {
              if (value !== null) {
                setLureColor(value)
              }
            }}
            items={lureColorOptions}
            placeholder={{ label: 'ルアーカラーを選択してください', value: '' }}
            style={pickerSelectStyles}
          />
        )}
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
            title,
            images,
            weather,
            content,
            length,
            weight,
            lure,
            lureColor,
            catchFish,
            area,
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
    borderRadius: 8,
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  imageWrapper: {
    position: 'relative',
    margin: 6,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'silver',
    borderRadius: 20,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 20
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
