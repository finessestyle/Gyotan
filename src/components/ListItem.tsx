import {
  View, Text, TouchableOpacity, StyleSheet, Image
} from 'react-native'
import { Link } from 'expo-router'
import { type Post } from '../../types/post'

interface Props {
  post: Post
}

const ListItem = (props: Props): JSX.Element | null => {
  const { post } = props
  const { images, length, weight, updatedAt, area } = post
  const imageUri = Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : undefined
  if (updatedAt === null || images === null || length === null || weight === null || area === null) { return null }
  // const dateString = post.updatedAt.toDate().toLocaleString('ja-JP')
  return (
    <Link
      href={{ pathname: '/post/detail', params: { id: post.id } }}
      asChild
    >
      <TouchableOpacity style={styles.listItem}>
        <View style={styles.fishImage}>
          <View>
            <Text style={styles.area}>{post?.area}</Text>
          </View>
          <Image
            style={styles.listItemImage}
            source={{ uri: imageUri }}
          />
          <View style={styles.fishInfo}>
            <Text style={styles.length}>{post?.length}cm / </Text>
            <Text style={styles.weight}>{post?.weight}g</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 8,
    width: '49%',
    height: 'auto',
    marginBottom: 8,
    marginHorizontal: 2
  },
  fishImage: {
    position: 'relative'
  },
  area: {
    color: '#B0B0B0'
  },
  listItemImage: {
    height: 140,
    borderRadius: 8
  },
  fishInfo: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 4,
    right: 8
  },
  length: {
    color: '#ffffff',
    fontSize: 14
  },
  weight: {
    color: '#ffffff',
    fontSize: 14
  }
})

export default ListItem
