import {
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image
} from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { useState, useCallback } from 'react'
import { doc, collection, addDoc, Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, auth, storage } from '../../config'
import RNPickerSelect from 'react-native-picker-select'
import * as ImagePicker from 'expo-image-picker'
import Button from '../../components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const handlePress = async (
  images: Array<{ uri: string }>,
  title: string,
  area: string,
  season: string,
  latitude: number | null,
  longitude: number | null,
  content: string
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
    const mapRef = collection(db, 'maps')
    const newMapRef = doc(mapRef)
    const mapId = newMapRef.id

    const imageUrls = await Promise.all(images.map(async (image, index) => {
      const response = await fetch(image.uri)
      const blob = await response.blob()
      const imageName = `image_${Date.now()}_${index}`
      const storageRef = ref(storage, `maps/${mapId}/${imageName}`)
      await uploadBytes(storageRef, blob)
      return await getDownloadURL(storageRef)
    }))

    await addDoc(mapRef, { // Firestoreにドキュメントを追加
      userId,
      title,
      images: imageUrls,
      area,
      season,
      latitude,
      longitude,
      content,
      updatedAt: Timestamp.fromDate(new Date()) // 現在のタイムスタンプを保存
    })
    router.push('/map/list')
  } catch (error) {
    console.log('Error: ', error)
    Alert.alert('投稿に失敗しました')
  }
}

const Create = (): JSX.Element => {
  const [images, setImages] = useState<Array<{ uri: string }>>([])
  const [title, setTitle] = useState('')
  const [area, setArea] = useState('')
  const [season, setSeason] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [content, setContent] = useState('')

  useFocusEffect(
    useCallback(() => {
      setImages([])
      setTitle('')
      setArea('')
      setSeason('')
      setLatitude('')
      setLongitude('')
      setContent('')
    }, [])
  )

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  return (
    <KeyboardAwareScrollView style={styles.scrollContainer}>
      <View style={styles.inner}>
        <Text style={styles.title}>釣り場投稿</Text>
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
          value={latitude !== null ? String(latitude) : ''}
          onChangeText={setLatitude}
          placeholder='緯度を入力してください'
          keyboardType='numeric'
          returnKeyType='done'
        />

        <Text style={styles.textTitle}>経度</Text>
        <TextInput
          style={styles.input}
          value={longitude !== null ? String(longitude) : ''}
          onChangeText={setLongitude}
          placeholder='緯度を入力してください'
          keyboardType='numeric'
          returnKeyType='done'
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
              images,
              title,
              area,
              season,
              parseFloat(latitude),
              parseFloat(longitude),
              content
            )
          }}
            buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30, marginBottom: 24 }}
            labelStyle={{ fontSize: 24, lineHeight: 21 }}
          />
        )}
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
    paddingHorizontal: 16
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginVertical: 16
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

export default Create
