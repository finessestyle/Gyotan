import {
  View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView
} from 'react-native'
import Icon from '../../components/Icon'
import CircleButton from '../../components/CircleButton'

import { router } from 'expo-router'

const handlePress = (): void => {
  router.back()
}

const Edit = (): JSX.Element => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <View style={styles.inner}>
          <Text style={styles.title}>釣果編集</Text>
          <Text>タイトル</Text>
          <TextInput style={styles.input}></TextInput>
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
        </View>
      </ScrollView>
      <CircleButton onPress={handlePress}>
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

export default Edit
