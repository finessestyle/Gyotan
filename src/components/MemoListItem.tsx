import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Link } from 'expo-router'
import { type Post } from '../../types/post'
import Icon from './Icon'

interface Props {
  post: Post
}

// const handlePress = (id: string): void => {
//   if (auth.currentUser === null) { return }
//   const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
//   Alert.alert('投稿を削除します', 'よろしいですか？', [
//     {
//       text: 'キャンセル'
//     },
//     {
//       text: '削除する',
//       style: 'destructive',
//       onPress: () => {
//         deleteDoc(ref)
//           .catch(() => { Alert.alert('削除に失敗しました') })
//       }
//     }
//   ])
// }

const MemoListItem = (props: Props): JSX.Element | null => {
  const { post } = props
  const { title, images, updatedAt } = post
  const imageUri = Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : undefined
  if (title === null || updatedAt === null || images === null) { return null }
  const dateString = post.updatedAt.toDate().toLocaleString('ja-JP')
  return (
    <Link
      href={{ pathname: '/post/detail', params: { id: post.id } }}>
      <TouchableOpacity >
        <View style={styles.memoListItem}>
          <View>
          <Image
            style={styles.memoListItemImage}
            source={{ uri: imageUri }}
          />
          </View>
          <View >
            <Text style={styles.memoListItem}>{post.title}</Text>
            <Text style={styles.memoListItemDate}>{dateString}</Text>
          </View>
          <TouchableOpacity>
            <Icon name='delete' size={32} color='#B0B0B0' />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  memoListItem: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 19,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    height: 80
  },
  memoListItemImage: {
    width: 80,
    height: 64
  },
  memoListItemTitle: {
    paddingLeft: 16,
    fontSize: 16,
    lineHeight: 32
  },
  memoListItemDate: {
    paddingLeft: 16,
    fontSize: 12,
    lineHeight: 16,
    color: '#848484'
  }
})

export default MemoListItem
