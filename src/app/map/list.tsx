import { View, FlatList, StyleSheet } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { collectionGroup, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type Map } from '../../../types/map'

import ListItem from '../../components/ListItem'
import CircleButton from '../../components/CircleButton'
import Nav from '../../components/Nav'
import Icon from '../../components/Icon'
import LogOutButton from '../../components/LogOutButton'

const handlePress = (): void => {
  router.push('/map/create')
}
const List = (): JSX.Element => {
  const [maps, setMaps] = useState<Map[]>([])
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> }
    })
  }, [])
  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = collectionGroup(db, 'maps')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remoteMaps: Map[] = []
      snapShot.forEach((doc) => {
        const { title, images, content, area, updatedAt } = doc.data()
        remoteMaps.push({
          id: doc.id,
          title,
          images,
          content,
          area,
          updatedAt
        })
      })
      setMaps(remoteMaps)
    },
    (error) => {
      console.error('Error fetching maps:', error)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <Nav />
      <FlatList
        data={maps}
        renderItem={({ item }) => <ListItem map={item} /> }
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
