import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { router } from 'expo-router'

const handlePress = (): void => {
  router.push('/user/detail')
}
const UserImageButton = (): JSX.Element => {
  return (
    <View style={styles.userImageButton}>
      <TouchableOpacity onPress={handlePress}>
        <Image style={styles.userImage} source={ require('../../assets/1.jpeg') } />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePress}>
        <Image style={styles.userImage} source={ require('../../assets/1.jpeg') } />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePress}>
        <Image style={styles.userImage} source={ require('../../assets/1.jpeg') } />
      </TouchableOpacity>
    </View>
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
