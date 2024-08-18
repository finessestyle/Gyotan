import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { Link } from 'expo-router'
import { type User } from '../../types/user'

interface Props {
  user: User
}

const UserImageButton = (props: Props): JSX.Element => {
  const { user } = props
  const imageUri = (user.userImage)
  console.log('UserImageButton imageUrl:', imageUri)

  return (
    <Link
      href={{ pathname: '/user/detail', params: { id: user.id } }}
      asChild
    >
      <TouchableOpacity style={styles.userImageButton}>
        <View>
          <Image
            style={styles.userImage}
            source={{ uri: imageUri }}
          />
          <Text>{user.userName}</Text>
        </View>
      </TouchableOpacity>
    </ Link>
  )
}

const styles = StyleSheet.create({
  userImageButton: {
    flexDirection: 'row',
    alignItems: 'center', // 縦方向の中央揃え
    marginVertical: 8 // 上下の余白を追加
  },
  userImage: {
    width: 102,
    height: 102,
    borderRadius: 51,
    marginHorizontal: 5,
    marginVertical: 12
  }
})

export default UserImageButton
