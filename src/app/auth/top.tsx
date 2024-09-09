import { View, Text, StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'

const Top = (): JSX.Element => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.replace('/auth/login')
    }, 3000)
  }, [router])

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.innerText}>Gyotan</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    flex: 1,
    backgroundColor: '#467FD3',
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerText: {
    fontSize: 64,
    color: '#ffffff',
    fontFamily: 'block'
  },
  topText: {
    position: 'absolute',
    top: 20,
    left: 19,
    right: 19,
    fontSize: 40,
    lineHeight: 52,
    fontWeight: 'bold',
    color: '#D0D0D0'
  },
  nav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    flexDirection: 'row',
    backgroundColor: '#467FD3'
  },
  leftNav: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightNav: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  separator: {
    width: 1,
    backgroundColor: '#D0D0D0'
  },
  navText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 32
  }
})

export default Top
