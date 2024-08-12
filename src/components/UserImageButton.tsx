import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { Link } from 'expo-router'
import { type User } from '../../types/user'

interface Props {
  user: User
}

const UserImageButton = (props: Props): JSX.Element => {
  const { user } = props
  const { userName, imageUrl } = user // 修正点：重複していた `userName` を修正
  const imageUri = imageUrl || 'https://example.com/default-avatar.png' // 画像がない場合のデフォルト画像

  return (
    <Link href={{ pathname: '/user/detail', params: { id: user.id } }} asChild>
      <View style={styles.userImageButton}>
        <TouchableOpacity>
          <Image
            style={styles.userImage}
            source={{ uri: imageUri }}
          />
          <Text>{userName}</Text>
        </TouchableOpacity>
      </View>
    </Link>
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
