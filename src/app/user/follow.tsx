import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useEffect, useState, useCallback } from 'react'
import { collection, doc, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type User } from '../../../types/user'
import FollowedUser from '../../components/FollowUser'
import { chunk } from 'lodash'

const TAB_LABELS = ['フォロー', 'フォロワー']

const Follow = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([])
  const [followed, setFollowed] = useState<string[]>([])
  const [follower, setFollower] = useState<string[]>([])
  const [selectedTab, setSelectedTab] = useState<'フォロー' | 'フォロワー'>('フォロー')

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser === null) return
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()
          setFollowed(Array.isArray(data?.followed) ? data.followed : [])
          setFollower(Array.isArray(data?.follower) ? data.follower : [])
        }
      })
      return unsubscribe
    }, [])
  )

  useEffect(() => {
    if (auth.currentUser === null) return

    const targetIds = selectedTab === 'フォロー' ? followed : follower
    if (targetIds.length === 0) {
      setUsers([])
      return
    }

    const fetchUsers = async (): Promise<void> => {
      const chunks = chunk(targetIds, 10)
      const promises = chunks.map(async (chunkIds) => {
        const ref = collection(db, 'users')
        const q = query(ref, where('__name__', 'in', chunkIds))
        const snap = await getDocs(q)

        const usersChunk: User[] = snap.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            userName: data.userName,
            email: data.email,
            profile: data.profile,
            userImage: data.userImage,
            userYoutube: data.userYoutube,
            userTiktok: data.userTiktok,
            userInstagram: data.userInstagram,
            userX: data.userX,
            updatedAt: data.updatedAt,
            followed: data.followed,
            follower: data.follower
          }
        })

        return usersChunk
      })

      const resultChunks = await Promise.all(promises)
      setUsers(resultChunks.flat())
    }

    void fetchUsers()
  }, [selectedTab, followed, follower])

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TAB_LABELS.map((label) => (
          <TouchableOpacity
            key={label}
            style={[styles.tab, selectedTab === label && styles.selectedTab]}
            onPress={() => { setSelectedTab(label as 'フォロー' | 'フォロワー') }}
            activeOpacity={0.7}
          >
            <Text style={styles.tabText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={users}
        renderItem={({ item }) => <FollowedUser user={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text>表示するユーザーがいません...。</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginVertical: 24,
    marginHorizontal: 16
  },
  columnWrapper: {
    justifyContent: 'space-between'
  },
  tabs: {

    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24
  },
  tab: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingBottom: 4
  },
  selectedTab: {
    borderBottomColor: '#467FD3'
  },
  tabText: {
    fontSize: 16,
    color: '#467FD3'
  }
})

export default Follow
