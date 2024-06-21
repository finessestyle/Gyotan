import { View, StyleSheet } from 'react-native'
import Header from '../../components/Header'
import CircleButton from '../../components/CircleButton'
import FishInfo from '../../components/FishInfo'

const Detail = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Header />
      <FishInfo />
      <CircleButton>＋</CircleButton>
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
