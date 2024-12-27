import {
  View, Text, TouchableOpacity, StyleSheet, Image
} from 'react-native'
import { Link } from 'expo-router'
import { type Post } from '../../types/post'

interface Props {
  post: Post
}

const TopList = (props: Props): JSX.Element | null => {
  const { post } = props
  const { images } = post
  const imageUri = Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : undefined
  if (images === null) { return null }
  return (
    <Link
      href={{ pathname: '/post/detail', params: { id: post.id } }}
      asChild
    >
      <TouchableOpacity style={styles.listItem}>
        <View style={styles.fishImage}>
          <View>
            <Text>{post?.title}</Text>
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
    width: '50%',
    height: 'auto',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  fishImage: {
    position: 'relative',
    marginHorizontal: 4,
    marginVertical: 4
  },
  listItemImage: {
    height: 120,
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

export default TopList
