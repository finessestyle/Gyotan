import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Link } from 'expo-router'
import { type User } from '../../types/user'

interface Props {
  user: User
}

const UserImageButton = (props: Props): JSX.Element => {
  const { user } = props
  const { image } = user
  const imageUri = Array.isArray(user.image) && user.image.length > 0 ? user.image[0] : undefined
  return (
    <Link href={{ pathname: '/user/detail', params: { id: user.id } }} asChild>
      <View style={styles.userImageButton}>
        <TouchableOpacity >
          <Image
            style={styles.userImage}
            source={{ uri: imageUri }}
          />
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
