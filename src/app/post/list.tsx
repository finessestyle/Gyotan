import { View, ScrollView, StyleSheet } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect } from 'react'

import MemoListItem from '../../components/MemoListItem'
import CircleButton from '../../components/CircleButton'
import Nav from '../../components/Nav'
import Icon from '../../components/Icon'
import LogOutButton from '../../components/LogOutButton'

const handlePress = (): void => {
  router.push('/post/create')
}

const List = (): JSX.Element => {
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> }
    })
  }, [])
  return (
    <View style={styles.container}>
      <Nav />
      <ScrollView>
        <MemoListItem />
        <MemoListItem />
        <MemoListItem />
        <MemoListItem />
        <MemoListItem />
        <MemoListItem />
        <MemoListItem />
      </ScrollView>
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
