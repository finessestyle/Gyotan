import { TextInput, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../../config'

import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import KeyboardAvoidingView from '../../components/KeybordAvoidingView'

const handlePress = (bodyText: string): void => {
  if (auth.currentUser === null) return
  const ref = collection(db, 'blogs')
  addDoc(ref, {
    bodyText,
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then((docRef) => {
      console.log(docRef.id)
      router.back()
    })
    .catch((error) => {
      console.log(error)
      Alert.alert('投稿に失敗しました。')
    })
}

const Create = (): JSX.Element => {
  const [bodyText, setBodyText] = useState('')
  return (
    <KeyboardAvoidingView style={styles.container}>
      <TextInput
        multiline
        style={styles.input}
        value={bodyText}
        onChangeText={(text) => { setBodyText(text) }}
        autoFocus
      />
      <CircleButton onPress={() => { handlePress(bodyText) }}>
        <Icon name='check' size={40} color='#ffffff' />
      </CircleButton>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 27,
    paddingVertical: 32
  }
})

export default Create
