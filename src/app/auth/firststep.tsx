import { View, Text, StyleSheet, ImageBackground, Alert, Animated } from 'react-native'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { auth } from '../../config'
import { signInAnonymously } from 'firebase/auth'
import Button from '../../components/Button'
import UserCount from '../../components/UserCount'

const FirstStep = (): JSX.Element => {
  const [fadeAnim] = useState(new Animated.Value(0))

  const handlePress = async (): Promise<void> => {
    try {
      await signInAnonymously(auth)
      router.replace('/post/top')
    } catch (error) {
      Alert.alert('匿名ログインに失敗しました')
    }
  }

  useEffect(() => {
    // コンポーネントがマウントされた後にアニメーション開始
    Animated.timing(fadeAnim, {
      toValue: 1, // 完全に表示させる
      duration: 2000, // 2秒で表示
      delay: 300, // 300ms後にアニメーション開始
      useNativeDriver: true // ネイティブドライバを使用
    }).start()
  }, [])

  return (
    <ImageBackground
      source={require('../../../assets/1.jpeg')}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.subInner}>
          <Text style={styles.title}>Gyotan</Text>
          <Text style={styles.subTitle}>琵琶湖でバス釣りを本気で楽しむあなたへ</Text>
          <Text style={styles.subTitle}>釣果を共有して、釣れるヒントを見つけよう</Text>
        </View>
        <Animated.View style={{ opacity: fadeAnim, gap: 14 }}>
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
            label={'試してみる'}
            buttonStyle={[styles.button, styles.anonymousButton]}
            labelStyle={styles.buttonLabel}
            onPress={handlePress}
          />
        </Animated.View>
        <UserCount />
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
    alignItems: 'center',
    marginBottom: 80
  },
  title: {
    color: '#ffffff',
    fontSize: 80,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8
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
    alignItems: 'center'
  },
  buttonLabel: {
    fontSize: 24,
    lineHeight: 30,
    color: '#fff',
    fontWeight: 'bold'
  },
  anonymousButton: {
    backgroundColor: '#rgba(156, 207, 145, 0.6)'
  }
})

export default FirstStep
