import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Link } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import { type FishMap } from '../../types/fishmap'
import { auth, db } from '../config'
import Icon from './Icon'

interface Props {
  map: FishMap
}

const handlePress = (id: string, map: { userId: string }): void => {
  if (auth.currentUser?.uid === map?.userId) {
    const mapRef = doc(db, 'maps', id)

    Alert.alert('投稿を削除します', 'よろしいですか？', [
      {
        text: 'キャンセル'
      },
      {
        text: '削除する',
        style: 'destructive',
        onPress: () => {
          const deletePost = async (): Promise<void> => {
            try {
              await deleteDoc(mapRef)
              Alert.alert('削除が完了しました')
            } catch (error) {
              Alert.alert('削除に失敗しました')
            }
          }
          void deletePost()
        }
      }
    ])
  }
}

const ListItem = (props: Props): JSX.Element | null => {
  const { map } = props
  const { title, updatedAt } = map
  if (title === null || updatedAt === null) { return null }
  const dateString = map.updatedAt.toDate().toLocaleString('ja-JP')
  return (
    <Link
      href={{ pathname: '/map/detail', params: { id: map.id } }}
      asChild
    >
      <TouchableOpacity style={styles.listItem}>
        <View>
          <Text style={styles.listItemTitle}>{map.title}</Text>
          <Text style={styles.listItemDate}>{dateString}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => { handlePress(map.id, map) }}>
          <Icon name='delete' size={32} color='#B0B0B0' />
        </TouchableOpacity>
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
