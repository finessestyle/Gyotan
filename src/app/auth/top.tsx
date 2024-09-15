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
    fontWeight: 'bold'
  }
})

export default Top
