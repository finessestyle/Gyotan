import { View, TextInput, StyleSheet, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../../config'

import KeyboardAvoidingView from '../../components/KeybordAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'

const handlePress = (id: string, bodyText: string) => {
  if (auth.currentUser === null) return
  const ref = doc(db, 'blogs', id)
  setDoc(ref, {
    bodyText,
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then(() => {
      router.back()
    })
    .catch((error) => {
      console.log(error)
      Alert.alert('更新に失敗しました')
    })
}

const Edit = () => {
  const [bodyText, setBodyText] = useState('')
  const id = String(useLocalSearchParams().id)
  useEffect(() => {
    if (auth.currentUser === null) return
    const ref = doc(db, 'blogs', id)
    getDoc(ref)
      .then((docRef) => {
        const remoteBodyText = docRef?.data()?.bodyText
        setBodyText(remoteBodyText)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
        multiline
        style={styles.input}
        value={bodyText}
        autoFocus
        onChangeText={(text) => { setBodyText(text) }}
      />
      </View>
      {auth.currentUser?.uid === '3EpeDeL97kN5a2oefZCypnEdXGx2' && (
        <CircleButton onPress={() => { handlePress(id, bodyText) }}>
          <Icon name='check' size={40} color='#ffffff' />
        </CircleButton>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  inputContainer: {
    paddingHorizontal: 27,
    paddingVertical: 32,
    flex: 1
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24
  }
})

export default Edit
