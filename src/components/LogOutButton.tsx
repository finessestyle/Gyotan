import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native'
import { signOut } from '@firebase/auth'
import { useRouter } from 'expo-router'
import { auth } from '../config'

const LogOutButton = (): JSX.Element => {
  const router = useRouter()

  const handlePress = (): void => {
    signOut(auth)
      .then(() => {
        router.replace('/auth/login')
      })
      .catch(() => {
        Alert.alert('ログアウトに失敗しました')
      })
  }

  return (
    <TouchableOpacity style={{ marginRight: 16 }} onPress={handlePress}>
      <Text style={styles.text}>ログアウト</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.7)'
  }
})

export default LogOutButton
