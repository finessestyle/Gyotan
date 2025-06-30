import {
  View, Text, StyleSheet, Image, TouchableWithoutFeedback, ScrollView
} from 'react-native'
import { Link } from 'expo-router'
import { type Post } from '../../types/post'

interface Props {
  post: Post
}

const ListItem = (props: Props): JSX.Element | null => {
  const { post } = props
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
              <View style={styles.listItemImageFooter}>
                <Text style={styles.length}>{post?.length}cm / {post?.weight}g</Text>
              </View>
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
    height: 120,
    backgroundColor: '#B0B0B0'
  },
  length: {
    color: '#B0B0B0'
  },
  listItemImageFooter: {
    flexDirection: 'row'
  }
})

export default ListItem
