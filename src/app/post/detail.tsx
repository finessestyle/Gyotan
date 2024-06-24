import { View, StyleSheet } from 'react-native'

import CircleButton from '../../components/CircleButton'
import Fish from '../../components/Fish'
import Icon from '../../components/Icon'
import { router } from 'expo-router'

const handlePress = (): void => {
  router.push('/post/edit')
}

const Detail = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Fish />
      <CircleButton onPress={handlePress}>
        <Icon name='pencil' size={40} color='#ffffff' />
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

export default Detail
