import {
  ScrollView, Text, TextInput, StyleSheet, Alert
} from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db, auth } from '../../config'
import RNPickerSelect from 'react-native-picker-select'
import Button from '../../components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const handlePress = async (
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

    await addDoc(mapRef, { // Firestoreにドキュメントを追加
      userId,
      title,
      area,
      season,
      latitude,
      longitude,
      content,
      updatedAt: Timestamp.fromDate(new Date()) // 現在のタイムスタンプを保存
    })
    router.back() // 成功したら前のページに戻る
  } catch (error) {
    console.log('Error: ', error)
    Alert.alert('投稿に失敗しました')
  }
}

const Create = (): JSX.Element => {
  const [title, setTitle] = useState('')
  const [area, setArea] = useState('')
  const [season, setSeason] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [content, setContent] = useState('')

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
      <ScrollView style={styles.inner}>
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
        <Text style={styles.textTitle}>エリアを選択</Text>
        <RNPickerSelect
          value={area}
          onValueChange={(value: string | null) => {
            if (value !== null) {
              setArea(value)
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
          placeholder={{ label: 'エリアを選択してください', value: null }}
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
            { label: '冬', value: '冬' }
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: '季節を選択してください', value: null }}
        />
        <Text style={styles.textTitle}>緯度</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => { setLatitude(Number(text)) }}
          placeholder='緯度を入力してください'
          keyboardType='numeric'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>経度</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => { setLongitude(Number(text)) }}
          placeholder='経度を入力してください'
          keyboardType='numeric'
          returnKeyType='done'
        />
        <Text style={styles.textTitle}>釣り場内容</Text>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={(text) => { setContent(text) }}
          placeholder='釣り場内容を入力してください'
          keyboardType='default'
          returnKeyType='done'
        />
        {auth.currentUser?.uid === 'ybY8Ui8KDbWfDof50P6Rf08CkQy1' && (
          <Button label='投稿' onPress={() => {
            void handlePress(
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
