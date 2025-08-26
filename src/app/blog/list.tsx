import { View, StyleSheet, FlatList } from 'react-native'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { auth, db } from '../../config'
import { type Blog } from '../../../types/blog'

import BlogListItem from '../../components/BlogListItem'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'

const handlePress = (): void => {
  router.push('/blog/create')
}

const List = (): JSX.Element => {
  const [blogs, setBlogs] = useState<Blog []>([])
  useEffect(() => {
    if (auth.currentUser === null) return
    const ref = collection(db, 'blogs')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteBlogs: Blog[] = []
      snapshot.forEach((doc) => {
        const { bodyText, updatedAt } = doc.data()
        remoteBlogs.push({
          id: doc.id,
          bodyText,
          updatedAt
        })
      })
      setBlogs(remoteBlogs)
    })
    return unsubscribe
  }, [])
  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        renderItem={ ({ item }) => <BlogListItem blog={item} />}
      />
      <CircleButton onPress={() => { handlePress() }}>
        <Icon name='plus' size={40} color='#ffffff' />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
})

export default List
