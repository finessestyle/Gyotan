import { View, Text, StyleSheet, Image, ScrollView, TouchableWithoutFeedback } from 'react-native'
import { Link } from 'expo-router'
import { type Post } from '../../types/post'

interface Props {
  post: Post
  index: number
}

const ListSizeItem = (props: Props): JSX.Element | null => {
  const { post, index } = props
  const { images } = post

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps='handled'
      >
        <Link
          href={{ pathname: '/post/detail', params: { id: post.id } }}
          asChild
        >
          <TouchableWithoutFeedback>
            <View style={styles.item}>
              <Text style={styles.area}>{post?.area}</Text>
              <Image
                style={styles.listItemImage}
                source= {{ uri: images[0] }}
                resizeMode='contain'
              />
              <Text style={styles.imageNumber}>{index + 1}</Text>
              <Text style={styles.length}>
                {post?.length}cm / {post?.weight}g
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Link>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  item: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
    borderRadius: 8
  },
  area: {
    color: '#B0B0B0'
  },
  listItemImage: {
    width: 160,
    height: 130,
    position: 'relative'
  },
  imageNumber: {
    position: 'absolute',
    top: 17,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    paddingHorizontal: 4,
    fontSize: 16
  },
  length: {
    color: '#B0B0B0'
  }
})

export default ListSizeItem
