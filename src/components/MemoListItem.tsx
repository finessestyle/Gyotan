import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import Icon from './Icon'
import { Link } from 'expo-router'

const MemoListItem = (): JSX.Element => {
  return (
    <Link href='/post/detail' asChild>
      <TouchableOpacity >
        <View style={styles.memoListItem}>
          <View>
            <Image style={styles.memoListItemImage} source={ require('../../assets/1.jpeg') } />
          </View>
          <View >
            <Text style={styles.memoListItemTitle}>買い物リスト</Text>
            <Text style={styles.memoListItemDate}>2024年6月18日23:19</Text>
          </View>
          <TouchableOpacity style={styles.deliteButton}>
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
  },
  deliteButton: {
    position: 'absolute',
    right: 20
  }
})

export default MemoListItem
