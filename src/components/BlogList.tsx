import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Link } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '../config'
import Icon from './Icon'
import { type Blog } from '../../types/blog'

interface Props {
  blog: Blog
}

const handlePress = (id: string) => {
  if (auth.currentUser === null) return
  const ref = doc(db, 'blogs', id)
  Alert.alert('ブログを削除します', 'よろしいですか？', [
    {
      text: 'キャンセル'
    },
    {
      text: '削除する',
      style: 'destructive',
      onPress: () => {
        deleteDoc(ref)
          .catch(() => { Alert.alert('削除に失敗しました') })
      }
    }
  ])
}

const BlogList = (props: Props) => {
  const { blog } = props
  const { bodyText, updatedAt } = blog
  if (bodyText === null || updatedAt === null) return null
  const datestring = blog.updatedAt.toDate().toLocaleString('ja-JP')
  return (
    <Link
      href={{ pathname: '/blog/detail', params: { id: blog.id } }}
      asChild
    >
      <TouchableOpacity>
        <View style={styles.memoListItem}>
          <View>
            <Text numberOfLines={1} style={styles.memoListItemTitle}>{bodyText}</Text>
            <Text style={styles.memoListItemDate}>{datestring}</Text>
          </View>
          <TouchableOpacity onPress={() => { handlePress(blog.id) }}>
            <Icon name='delete' size={30} color='#B0B0B0' />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#rgba(0,0,0,0.15)'
  },
  memoListItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 32
  },
  memoListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484'
  }
})

export default BlogList
