import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import { router } from 'expo-router'
import { auth } from '../../config'
import { signInAnonymously } from 'firebase/auth'
import Button from '../../components/Button'

const handlePress = async (): Promise<void> => {
  try {
    await signInAnonymously(auth)
    router.replace('/post/top')
  } catch (error) {
    console.error('匿名ログイン失敗:', error)
  }
}

const FirstStep = (): JSX.Element => {
  return (
    <ImageBackground
      source={require('../../../assets/1.jpeg')}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Welcome to</Text>
        <View style={styles.subInner}>
          <Text style={styles.subTitle}>Gyotan</Text>
        </View>
        <View style={styles.auth}>
          <Button
            label={'ログイン'}
            buttonStyle={styles.button}
            labelStyle={styles.buttonLabel}
            onPress={() => { router.push('/auth/login') }}
          />
          <Button
            label={'新規登録'}
            buttonStyle={styles.button}
            labelStyle={styles.buttonLabel}
            onPress={() => { router.push('/auth/signup') }}
          />
          <Button
            label={'匿名ログイン'}
            buttonStyle={[styles.button, styles.anonymousButton]}
            labelStyle={styles.buttonLabel}
            onPress={handlePress}
          />
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  inner: {
    width: '100%'
  },
  subInner: {
    alignItems: 'flex-end'
  },
  title: {
    color: 'rgb(218, 221, 226)',
    fontSize: 52,
    fontWeight: '600',
    marginBottom: 10,
    paddingLeft: 16
  },
  subTitle: {
    fontSize: 52,
    fontWeight: 'bold',
    color: 'rgb(218, 221, 226)',
    marginBottom: 40,
    paddingRight: 24
  },
  auth: {
    width: '100%',
    gap: 12
  },
  button: {
    width: '60%',
    height: 'auto',
    marginHorizontal: 'auto',
    borderRadius: 50,
    backgroundColor: 'rgba(60, 145, 224, 0.46)',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonLabel: {
    fontSize: 24,
    lineHeight: 24,
    color: '#fff',
    fontWeight: 'bold'
  },
  anonymousButton: {
    backgroundColor: '#rgba(156, 207, 145, 0.6)'
  }
})

export default FirstStep
