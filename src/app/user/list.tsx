import { View, Text, StyleSheet, ScrollView } from 'react-native'
import UserImageButton from '../../components/UsreImageButton'

const List = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.inner}>
          <Text style={styles.title}>ユーザー一覧</Text>
          <UserImageButton />
          <UserImageButton />
          <UserImageButton />
          <UserImageButton />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    marginVertical: 30,
    marginHorizontal: 19
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  }
})

export default List
