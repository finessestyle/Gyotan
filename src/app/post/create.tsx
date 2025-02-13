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

interface Area {
  label: string
  value: string
  latitude: number
  longitude: number
}

const handlePress = async (
  images: Array<{ uri: string, exif?: { GPSLatitude?: number, GPSLongitude?: number, DateTimeOriginal?: string } }>,
  area: string,
  fishArea: string,
  weather: string,
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
    router.back()
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
  const [lure, setLure] = useState('')
  const [lureAction, setLureAction] = useState('')
  const [waterDepth, setWaterDepth] = useState('')
  const [structure, setStructure] = useState('')
  const [cover, setCover] = useState('')
  const [length, setLength] = useState<number | null>(null)
  const [weight, setWeight] = useState<number | null>(null)
  const [catchFish, setCatchFish] = useState<number | null>(null)
  const [category, setCategory] = useState<string | null>(null)

  const hokkoNarea: Area[] = [
    { label: '海津大崎エリア', value: '海津大崎エリア', latitude: 35.4463, longitude: 136.091 },
    { label: '大浦湾エリア', value: '大浦湾エリア', latitude: 35.4835, longitude: 136.117 },
    { label: 'アミレンタルボート前エリア', value: 'アミレンタルボート前エリア', latitude: 35.4834, longitude: 136.129 },
    { label: '奥出湾エリア', value: '奥出湾エリア', latitude: 35.4794, longitude: 136.129 },
    { label: '黒土崎エリア', value: '黒土崎エリア', latitude: 35.4557, longitude: 136.132 },
    { label: '月出ワンドエリア', value: '月出ワンドエリア', latitude: 35.5025, longitude: 136.164 },
    { label: '塩津浜エリア', value: '塩津浜エリア', latitude: 35.5127, longitude: 136.164 },
    { label: '藤ケ崎エリア', value: '藤ケ崎エリア', latitude: 35.4999, longitude: 136.173 },
    { label: '飯浦エリア', value: '飯浦エリア', latitude: 35.5034, longitude: 136.182 },
    { label: '西野放水路エリア', value: '西野放水路エリア', latitude: 35.4664, longitude: 136.193 },
    { label: '片山石積みエリア', value: '片山石積みエリア', latitude: 35.4557, longitude: 136.198 },
    { label: '野田沼エリア', value: '野田沼エリア', latitude: 35.4505, longitude: 136.198 }
  ]

  const hokkoEarea: Area[] = [
    { label: '姉川河口エリア', value: '姉川河口エリア', latitude: 35.388, longitude: 136.215 },
    { label: '南浜エリア', value: '南浜エリア', latitude: 35.3875, longitude: 136.227 },
    { label: '相撲周辺エリア', value: '相撲周辺エリア', latitude: 35.3856, longitude: 136.243 },
    { label: 'KBセーレン前エリア', value: 'KBセーレン前エリア', latitude: 35.3791, longitude: 136.256 },
    { label: '長浜港エリア', value: '長浜港エリア', latitude: 35.3712, longitude: 136.265 },
    { label: '神明浜エリア', value: '神明浜エリア', latitude: 35.3455, longitude: 136.275 },
    { label: '天野川河口エリア', value: '天野川河口エリア', latitude: 35.3299, longitude: 136.267 },
    { label: '入江橋エリア', value: '入江橋エリア', latitude: 35.3202, longitude: 136.267 },
    { label: '蒼の湖邸前エリア', value: '蒼の湖邸前エリア', latitude: 35.2981, longitude: 136.254 },
    { label: '彦根新港エリア', value: '彦根新港エリア', latitude: 35.2848, longitude: 136.245 },
    { label: '旧彦根港エリア', value: '旧彦根港エリア', latitude: 35.2797, longitude: 136.255 },
    { label: '芹川河口エリア', value: '芹川河口エリア', latitude: 35.2754, longitude: 136.234 },
    { label: '宇曽川河口エリア', value: '宇曽川河口エリア', latitude: 35.2505, longitude: 136.193 },
    { label: '野田沼エリア', value: '野田沼エリア', latitude: 35.2486, longitude: 136.208 },
    { label: '曽根沼エリア', value: '曽根沼エリア', latitude: 35.2411, longitude: 136.194 },
    { label: '文禄川河口エリア', value: '文禄川河口エリア', latitude: 35.2396, longitude: 136.173 },
    { label: '神上沼エリア', value: '神上沼エリア', latitude: 35.2282, longitude: 136.16 },
    { label: '愛知川河口エリア', value: '愛知川河口エリア', latitude: 35.215, longitude: 136.116 },
    { label: '大同川エリア１', value: '大同川エリア１', latitude: 35.2034, longitude: 136.112 },
    { label: '大同川エリア２', value: '大同川エリア２', latitude: 35.1992, longitude: 136.121 },
    { label: '伊庭内湖エリア１', value: '伊庭内湖エリア１', latitude: 35.1851, longitude: 136.141 },
    { label: '伊庭内湖エリア２', value: '伊庭内湖エリア２', latitude: 35.1741, longitude: 136.141 },
    { label: '西の湖エリア', value: '西の湖エリア', latitude: 35.1582, longitude: 136.114 },
    { label: '長命寺川エリア', value: '長命寺川エリア', latitude: 35.1566, longitude: 136.066 },
    { label: '吉川浄水場前エリア', value: '吉川浄水場前エリア', latitude: 35.1445, longitude: 135.987 },
    { label: '吉川漁港エリア', value: '吉川漁港エリア', latitude: 35.1248, longitude: 135.974 }
  ]

  const hokkoWarea: Area[] = [
    { label: '知内漁港エリア', value: '知内漁港エリア', latitude: 35.4476, longitude: 136.058 },
    { label: '貫川内湖エリア', value: '貫川内湖エリア', latitude: 35.4309, longitude: 136.041 },
    { label: '浜分沼エリア', value: '浜分沼エリア', latitude: 35.4212, longitude: 136.046 },
    { label: '外ヶ浜風車前エリア', value: '外ヶ浜風車前エリア', latitude: 35.35, longitude: 136.07 },
    { label: '安曇川・新堀船溜まり', value: '安曇川・新堀船溜まり', latitude: 35.3248, longitude: 136.08 },
    { label: 'エカイ・十ヶ坪沼エリア', value: 'エカイ・十ヶ坪沼エリア', latitude: 35.3212, longitude: 136.059 },
    { label: '松ノ木内湖エリア', value: '松ノ木内湖エリア', latitude: 35.3127, longitude: 136.051 },
    { label: '萩の浜エリア', value: '萩の浜エリア', latitude: 35.2996, longitude: 136.028 },
    { label: '大溝港エリア', value: '大溝港エリア', latitude: 35.2931, longitude: 136.016 },
    { label: '乙女ヶ池エリア', value: '乙女ヶ池エリア', latitude: 35.29, longitude: 136.015 },
    { label: '滝川河口エリア', value: '滝川河口エリア', latitude: 35.246, longitude: 135.971 },
    { label: 'レイクオーツカ前エリア', value: 'レイクオーツカ前エリア', latitude: 35.2373, longitude: 135.962 },
    { label: '近江舞子・内湖エリア', value: '近江舞子・内湖エリア', latitude: 35.2302, longitude: 135.961 },
    { label: '大谷川河口エリア', value: '大谷川河口エリア', latitude: 35.2054, longitude: 135.936 },
    { label: '木戸川エリア', value: '木戸川エリア', latitude: 35.2003, longitude: 135.925 },
    { label: '八屋戸川エリア', value: '八屋戸川エリア', latitude: 35.1833, longitude: 135.918 },
    { label: '和邇川河口エリア', value: '和邇川河口エリア', latitude: 35.1565, longitude: 135.937 },
    { label: '真野浜周辺エリア', value: '真野浜周辺エリア', latitude: 35.1275, longitude: 135.931 },
    { label: '米プラザ前エリア', value: '米プラザ前エリア', latitude: 35.1246, longitude: 135.929 }
  ]

  const nannkoEarea: Area[] = [
    { label: '木浜埋立地１エリア', value: '木浜埋立地１エリア', latitude: 35.1113, longitude: 135.944 },
    { label: '木浜埋立地２エリア', value: '木浜埋立地２エリア', latitude: 35.1016, longitude: 135.942 },
    { label: '赤野井ワンド', value: '赤野井ワンド', latitude: 35.0807, longitude: 135.947 },
    { label: '烏丸半島周辺エリア', value: '烏丸半島周辺エリア', latitude: 35.0674, longitude: 135.935 },
    { label: '平湖・柳平湖エリア', value: '平湖・柳平湖エリア', latitude: 35.0497, longitude: 135.924 },
    { label: '北山田漁港周辺エリア', value: '北山田漁港周辺エリア', latitude: 35.0315, longitude: 135.912 },
    { label: '矢橋帰帆島周辺エリア', value: '矢橋帰帆島周辺エリア', latitude: 35.0093, longitude: 135.913 },
    { label: '漕艇場護岸エリア', value: '漕艇場護岸エリア', latitude: 34.993, longitude: 135.909 },
    { label: '瀬田川大橋周辺エリア', value: '瀬田川大橋周辺エリア', latitude: 34.9779, longitude: 135.907 },
    { label: '瀬田川・南郷洗堰北エリア', value: '瀬田川・南郷洗堰北エリア', latitude: 34.9457, longitude: 135.911 }
  ]

  const nannkoWarea: Area[] = [
    { label: 'カヤ池エリア', value: 'カヤ池エリア', latitude: 35.1177, longitude: 135.922 },
    { label: '堅田港エリア', value: '堅田港エリア', latitude: 35.115, longitude: 135.924 },
    { label: 'なぎさ漁港エリア', value: 'なぎさ漁港エリア', latitude: 35.1088, longitude: 135.92 },
    { label: '天神川河口エリア', value: '天神川河口エリア', latitude: 35.1026, longitude: 135.915 },
    { label: '山ノ下湾エリア', value: '山ノ下湾エリア', latitude: 35.101, longitude: 135.907 },
    { label: '雄琴港エリア', value: '雄琴港エリア', latitude: 35.087, longitude: 135.896 },
    { label: 'カネカ石積み護岸エリア', value: 'カネカ石積み護岸エリア', latitude: 35.0729, longitude: 135.891 },
    { label: '阪本赤鳥居エリア', value: '阪本赤鳥居エリア', latitude: 35.0574, longitude: 135.879 },
    { label: 'KKRホテルびわこエリア', value: 'KKRホテルびわこエリア', latitude: 35.0531, longitude: 135.876 },
    { label: '浜大津エリア', value: '浜大津エリア', latitude: 35.0113, longitude: 135.871 },
    { label: '由美浜・におの浜エリア１', value: '由美浜・におの浜エリア１', latitude: 35.0072, longitude: 135.883 },
    { label: '由美浜・におの浜エリア２', value: '由美浜・におの浜エリア２', latitude: 35.0056, longitude: 135.892 },
    { label: '膳所港・城跡公園周辺エリア', value: '膳所港・城跡公園周辺エリア', latitude: 34.9951, longitude: 135.896 },
    { label: 'なぎさ公園・青嵐の道エリア', value: 'なぎさ公園・青嵐の道エリア', latitude: 34.9868, longitude: 135.901 }
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

  const softLureActions = [
    { label: 'フリーフォール', value: 'フリーフォール' },
    { label: 'ズル引き', value: 'ズル引き' },
    { label: 'シェイキング', value: 'シェイキング' },
    { label: 'ボトムバンピング', value: 'ボトムバンピング' },
    { label: 'リフトアンドフォール', value: 'リフトアンドフォール' },
    { label: 'ボトムジャーキング', value: 'ボトムジャーキング' },
    { label: 'ミドスト', value: 'ミドスト' }
  ]

  const hardLureActions = [
    { label: 'ただ巻き', value: 'ただ巻き' },
    { label: 'ストップアンドゴー', value: 'ストップアンドゴー' },
    { label: 'トゥイッチング', value: 'トゥイッチング' },
    { label: 'ジャーキング', value: 'ジャーキング' },
    { label: 'リフトアンドフォール', value: 'リフトアンドフォール' },
    { label: 'ドッグウォーク', value: 'ドッグウォーク' }
  ]

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
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
      <ScrollView style={styles.inner}>
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
    backgroundColor: '#F0F4F8'
  },
  inner: {
    marginVertical: 24,
    paddingHorizontal: 8
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
