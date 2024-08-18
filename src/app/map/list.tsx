import { View, FlatList, StyleSheet, Text } from 'react-native'
import { useEffect, useState } from 'react'
import { useNavigation, router } from 'expo-router'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import { type Map } from '../../../types/post'
import ListItem from '../../components/ListItem'
import LogOutButton from '../../components/LogOutButton'
import Icon from '../../components/Icon'
import CircleButton from '../../components/CircleButton'

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
    const ref = collection(db, 'maps')
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remoteMaps: Map[] = []
      snapShot.forEach((doc) => {
        const { userId, title, images, content, updatedAt } = doc.data()
        console.log(doc.data())
        remoteMaps.push({
          id: doc.id,
          userId,
          title,
          images,
          content,
          length,
          updatedAt
        })
      })
      setMaps(remoteMaps)
      console.log(remoteMaps)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>釣り場一覧</Text>
        <FlatList
          data={maps}
          renderItem={({ item }) => <ListItem post={item} /> }
        />
        <CircleButton onPress={handlePress}>
          <Icon name='plus' size={40} color='#ffffff' />
        </CircleButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginVertical: 24,
    marginHorizontal: 16
  }
})

export default List
