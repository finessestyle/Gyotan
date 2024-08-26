import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Link } from 'expo-router'
import { type Post } from '../../types/post'

interface Props {
  post: Post
}

const ListItem = (props: Props): JSX.Element | null => {
  const { post } = props
  const { title, images, updatedAt } = post
  const imageUri = Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : undefined
  if (title === null || updatedAt === null || images === null) { return null }
  const dateString = post.updatedAt.toDate().toLocaleString('ja-JP')
  return (
    <Link
      href={{ pathname: '/post/detail', params: { id: post.id } }}
      asChild
    >
      <TouchableOpacity style={styles.listItem}>
        <View>
          <Image
            style={styles.listItemImage}
            source={{ uri: imageUri }}
          />
        </View>
        <View>
          <Text style={styles.listItemTitle}>{post.title}</Text>
          <Text style={styles.listItemDate}>{dateString}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 19,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    height: 80,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8
  },
  listItemImage: {
    width: 80,
    height: 64
  },
  listItemTitle: {
    paddingLeft: 16,
    fontSize: 16,
    lineHeight: 16
  },
  listItemDate: {
    paddingLeft: 16,
    fontSize: 12,
    lineHeight: 16,
    color: '#848484'
  },
  deleteButton: {
    position: 'absolute',
    right: 19
  }
})

export default ListItem
