import {
  Text, TextInput, StyleSheet, ScrollView, Alert
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { setDoc, doc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../../config'
import RNPickerSelect from 'react-native-picker-select'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../components/Button'

const handlePress = async (
  id: string,
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

    await setDoc(doc(db, 'maps', id), {
      userId,
      title,
      area,
      season,
      latitude,
      longitude,
      content,
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
  const [area, setArea] = useState('')
  const [season, setSeason] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, 'maps', id)
    getDoc(ref)
      .then((docRef) => {
        const data = docRef.data() as {
          title?: string
          area?: string
          season?: string
          latitude?: string
          longitude?: string
          content?: string
        }
        setTitle(data.title ?? '')
        setArea(data.area ?? '')
        setSeason(data.season ?? '')
        setLatitude(data?.latitude !== undefined && data.latitude !== '' ? parseFloat(data.latitude) : null)
        setLongitude(data?.longitude !== undefined && data.longitude !== '' ? parseFloat(data.longitude) : null)
        setContent(data.content ?? '')
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('データの取得に失敗しました')
      })
  }, [id])

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
      <ScrollView style={styles.inner}>
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
          onChangeText={(text) => { setLatitude(Number(text)) }}
          placeholder='緯度を入力してください'
          keyboardType='decimal-pad'
          returnKeyType='done'
          value={latitude}
        />
        <Text style={styles.textTitle}>経度</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => { setLongitude(Number(text)) }}
          placeholder='経度を入力してください'
          keyboardType='decimal-pad'
          returnKeyType='done'
          value={longitude}
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
        {auth.currentUser?.uid === 'fYOX0b2SB9Y9xuiiWMi6RfEIgSN2' && (
          <Button label='投稿' onPress={() => {
            void handlePress(
              id,
              title,
              area,
              season,
              latitude,
              longitude,
              content
            )
          }}
            buttonStyle={{ width: '100%', marginTop: 8, alignItems: 'center', height: 30 }}
            labelStyle={{ fontSize: 24, lineHeight: 21 }}
          />
        )}
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
    marginHorizontal: 8
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
    height: 'auto',
    marginVertical: 4,
    alignItems: 'flex-start',
    paddingLeft: 18,
    fontSize: 16
  },

  textTitle: {
    paddingVertical: 4
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
