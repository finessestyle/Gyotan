import { View, FlatList, StyleSheet } from 'react-native'
import { router, useNavigation } from 'expo-router' // Correct import
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type Post } from '../../../types/post'

import ListItem from '../../components/ListItem'
import CircleButton from '../../components/CircleButton'
import Nav from '../../components/Nav'
import Icon from '../../components/Icon'
import LogOutButton from '../../components/LogOutButton'

const handlePress = (): void => {
  router.push('/post/create')
}
const List = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([])
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> }
    })
  }, [])
  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = collection(db, `users/${auth.currentUser.uid}/posts`)
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remotePosts: Post[] = []
      snapShot.forEach((doc) => {
        console.log('post', doc.data())
        const { title, images, weather, content, length, weight, lure, lureColor, catchFish, fishArea, updatedAt } = doc.data()
        remotePosts.push({
          id: doc.id,
          title,
          images,
          weather,
          content,
          length,
          weight,
          lure,
          lureColor,
          catchFish,
          fishArea,
          updatedAt
        })
      })
      setPosts(remotePosts)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <Nav />
      <FlatList
        data={posts}
        renderItem={({ item }) => <ListItem post={item} /> }
      />
      <CircleButton onPress={handlePress}>
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
