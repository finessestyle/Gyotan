import {
  View, StyleSheet, Text, TouchableOpacity, Image
} from 'react-native'
import { Link } from 'expo-router'
import { type User } from '../../types/user'

interface Props {
  user: User
}

const FollowUser = (props: Props): JSX.Element => {
  const { user } = props

  return (
    <Link
      href={{ pathname: '/user/detail', params: { id: user.id } }}
      asChild
    >
      <TouchableOpacity style={styles.userImageButton}>
        <View style={styles.userImageContainer}>
          <Image
            style={styles.userImage}
            source={{ uri: user.userImage }}
          />
          <Text style={styles.userName}>{user.userName}</Text>
        </View>
      </TouchableOpacity>
    </ Link>
  )
}

const styles = StyleSheet.create({
  userImageButton: {
    flex: 1,
    margin: 8
  },
  userImageContainer: {
    alignItems: 'center'
  },
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 40
  },
  userName: {
    fontSize: 16,
    marginTop: 8
  }
})

export default FollowUser
