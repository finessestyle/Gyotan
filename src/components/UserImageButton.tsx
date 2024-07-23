import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { Link } from 'expo-router'
import { type User } from '../../types/user'

interface Props {
  user: User
}

const UserImageButton = (props: Props): JSX.Element => {
  const { user } = props
  const { userName, userImage } = user
  const imageUri = Array.isArray(user.userImage) && user.userImage.length > 0 ? user.userImage[0] : undefined

  console.log('UserImageButton imageUrl:', imageUri)

  return (
    <Link href={{ pathname: '/user/detail', params: { id: user.id } }} asChild>
      <View style={styles.userImageButton}>
        <TouchableOpacity >
          <Image
            style={styles.userImage}
            source={{ uri: imageUri }}
          />
          <Text>{user.userName}</Text>
        </TouchableOpacity>
      </View>
    </ Link>
  )
}

const styles = StyleSheet.create({
  userImageButton: {
    flexDirection: 'row'
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
