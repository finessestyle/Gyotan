import {
  Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView
} from 'react-native'
import { useState } from 'react'

import { router } from 'expo-router'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db, auth } from '../../config'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'

const handlePress = (titleText: string): void => {
  if (auth.currentUser === null) { return }
  const ref = collection(db, `users/${auth.currentUser.uid}/posts`)
  addDoc(ref, {
    titleText,
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

const Create = (): JSX.Element => {
  const [titleText, setTitleText] = useState('')
  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>釣果投稿</Text>
        <Text>タイトル</Text>
        <TextInput
          style={styles.input}
          value={titleText}
          onChangeText={(text) => { setTitleText(text) }}
        ></TextInput>
        <Text>ファイルを選択</Text>
        <TextInput style={styles.input}></TextInput>
        <Text>天気を選択</Text>
        <TextInput style={styles.input}></TextInput>
        <Text>釣果内容</Text>
        <TextInput style={styles.input}></TextInput>
        <Text>釣果エリアを選択</Text>
        <TextInput style={styles.input}></TextInput>
        <Text>サイズ</Text>
        <TextInput style={styles.input}></TextInput>
        <Text>重さ</Text>
        <TextInput style={styles.input}></TextInput>
        <Text>ルアールアー種類</Text>
        <TextInput style={styles.input}></TextInput>
        <Text>ルアーカラー</Text>
        <TextInput style={styles.input}></TextInput>
        <Text>釣果数</Text>
        <TextInput style={styles.input}></TextInput>
      </ScrollView>
      <CircleButton onPress={() => { handlePress(titleText) }}>
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
    marginHorizontal: 19
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
    height: 48,
    marginVertical: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10
  }
})

export default Create
