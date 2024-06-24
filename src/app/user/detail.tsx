import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import Fish from '../../components/MemoListItem'
import MemoListItem from '../../components/MemoListItem'

const Detail = (): JSX.Element => {
  return (
    <ScrollView>
      <View style={styles.inner}>
        <Text style={styles.title}>ユーザー情報</Text>
        <View style={styles.userImageTop}>
          <Image style={styles.userImage} source={ require('../../../assets/1.jpeg') } />
        </View>
        <View>
          <Text>フィネススタイル さん</Text>
        </View>
        <View>
          <Text>finessestyle@gmail.com</Text>
        </View>
        <View>
          <Text>ホームフィールドは、北湖東岸です！！</Text>
        </View>
        <MemoListItem />
        <MemoListItem />
        <MemoListItem />
      </View>
    </ScrollView>
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
  },
  userImageTop: {
    alignContent: 'center'
  },
  userImage: {
    width: 200,
    height: 200,
    borderRadius: 100
  }
})
export default Detail
