import {
  View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { setDoc, doc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db, storage } from '../../config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import RNPickerSelect from 'react-native-picker-select'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../components/Button'
import Lottie from '../../components/Lottie'

const handlePress = async (
  id: string,
  title: string,
  images: Array<{ uri: string }>,
  area: string,
  season: string,
  latitude: number | null,
  longitude: number | null,
  content: string,
  setLoading: (value: boolean) => void
): Promise<void> => {
  try {
    if (title === '') {
      Alert.alert('エラー', 'タイトルを入力してください')
      return
    }
    if (area === '') {
      Alert.alert('エラー', 'エリアを入力してください')
      return
    }
    if (season === '') {
      Alert.alert('エラー', '季節を入力してください')
      return
    }
    if (latitude === null) {
      Alert.alert('エラー', '緯度を入力してください')
      return
    }
    if (longitude === null) {
      Alert.alert('エラー', '経度を入力してください')
      return
    }
    if (content === '') {
      Alert.alert('エラー', '釣り場内容を入力してください')
      return
    }
    if (auth.currentUser === null) return

    const userId = auth.currentUser.uid
    const mapRef = doc(db, 'maps', id)
    const mapId = mapRef.id

    const imageUrls = await Promise.all(images.map(async (image, index) => {
      const response = await fetch(image.uri)
      const blob = await response.blob()
      const imageName = `image_${Date.now()}_${index}`
      const storageRef = ref(storage, `posts/${mapId}/${imageName}`)
      await uploadBytes(storageRef, blob)
      return await getDownloadURL(storageRef)
    }))

    setLoading(true)

    await setDoc(doc(db, 'maps', id), {
      userId,
      title,
      images: imageUrls,
      area,
      season,
      latitude,
      longitude,
      content,
      updatedAt: Timestamp.fromDate(new Date())
    })
    await new Promise(resolve => setTimeout(resolve, 3000))
    router.replace('map/list')
  } catch (error) {
    console.log(error)
    Alert.alert('更新に失敗しました')
  } finally {
    setLoading(false)
  }
}

const Edit = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [title, setTitle] = useState('')
  const [images, setImages] = useState<Array<{ uri: string }>>([])
  const [area, setArea] = useState('')
  const [season, setSeason] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 0.3,
      exif: true
    })
    if (!result.canceled && result.assets.length > 0) {
      const processedAssets = await Promise.all(
        result.assets.map(async (asset) => {
          const manipulated = await ImageManipulator.manipulateAsync(
            asset.uri,
            [],
            {
              compress: 0.9,
              format: ImageManipulator.SaveFormat.JPEG
            }
          )
          return {
            uri: manipulated.uri,
            exif: asset.exif ?? undefined
          }
        })
      )
      setImages(processedAssets)
    }
  }

  const removeImage = (index: number): void => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, 'maps', id)
    getDoc(ref)
      .then((docRef) => {
        const data = docRef.data() as {
          title?: string
          images?: string[]
          area?: string
          season?: string
          latitude?: string
          longitude?: string
          content?: string
        }
        setTitle(data.title ?? '')
        setImages(data.images?.map((uri: string) => ({ uri })) ?? [])
        setArea(data.area ?? '')
        setSeason(data.season ?? '')
        setLatitude(data?.latitude ?? '')
        setLongitude(data?.longitude ?? '')
        setContent(data.content ?? '')
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
        <View style={styles.inner}>
          <Text style={styles.title}>釣り場編集</Text>
          <Text style={styles.textTitle}>タイトル</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => { setTitle(text) }}
            value={title}
            placeholder='タイトルを入力'
            keyboardType='default'
            returnKeyType='done'
          />
          <Text style={styles.textTitle}>ファイルを選択</Text>
          <Button
            label="釣り場画像を選択"
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
          <Text style={styles.textTitle}>エリアを選択</Text>
          <RNPickerSelect
            value={area}
            onValueChange={(value: string | null) => {
              if (value !== null) {
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
            style={pickerSelectStyles}
            placeholder={{ label: 'エリアを選択してください', value: '' }}
          />
          <Text style={styles.textTitle}>季節を選択</Text>
          <RNPickerSelect
            value={season}
            onValueChange={(value: string | null) => {
              if (value !== null) {
                setSeason(value)
              }
            }}
            items={[
              { label: '春', value: '春' },
              { label: '夏', value: '夏' },
              { label: '秋', value: '秋' },
              { label: '冬', value: '冬' },
              { label: '通年', value: '通年' }
            ]}
            style={pickerSelectStyles}
            placeholder={{ label: '季節を選択してください', value: '' }}
          />
          <Text style={styles.textTitle}>緯度</Text>
          <TextInput
            style={styles.input}
            onChangeText={setLatitude}
            placeholder='緯度を入力してください'
            keyboardType='decimal-pad'
            returnKeyType='done'
            value={latitude !== null ? String(latitude) : ''}
          />
          <Text style={styles.textTitle}>経度</Text>
          <TextInput
            style={styles.input}
            onChangeText={setLongitude}
            placeholder='経度を入力してください'
            keyboardType='numeric'
            returnKeyType='done'
            value={longitude !== null ? String(longitude) : ''}
          />
          <Text style={styles.textTitle}>釣り場内容</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={(text) => { setContent(text) }}
            placeholder='釣り場内容を入力してください'
            keyboardType='default'
            returnKeyType='done'
            multiline
          />
          {auth.currentUser?.uid === '3EpeDeL97kN5a2oefZCypnEdXGx2' && (
            <Button label='投稿' onPress={() => {
              void handlePress(
                id,
                title,
                images,
                area,
                season,
                parseFloat(latitude),
                parseFloat(longitude),
                content,
                setLoading
              )
            }}
              buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30, marginBottom: 24 }}
              labelStyle={{ fontSize: 24, lineHeight: 21 }}
            />
          )}
        </View>
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
    paddingHorizontal: 16
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
    borderRadius: 8,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    height: 'auto',
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },
  textTitle: {
    paddingVertical: 4
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
    borderRadius: 10
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
