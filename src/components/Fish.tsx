import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { router } from 'expo-router'
import GoogleMap from '../components/GoogleMap'

const handlePress = (): void => {
  router.push('/user/detail')
}

const Fish = (): JSX.Element => {
  return (
    <ScrollView>
      <View style={styles.userInfo} >
        <Image style={styles.userImage} source={ require('../../assets/2.jpeg') } />
        <Text style={styles.userName} onPress={handlePress}>フィネススタイル さん</Text>
      </View>
      <View style={styles.postBody}>
        <View style={styles.fishArea}>
          <Text>釣果エリア: 北湖北エリア</Text>
        </View>
        <GoogleMap />
        <View style={styles.fishTime}>
          <Text>釣果日時: 2024年3月21日14:02</Text>
        </View>
        <View>
          <Image style={styles.fishImage} source={ require('../../assets/1.jpeg') } />
        </View>
        <View style={styles.fishingInfomation}>
          <View style={styles.leftInfo}>
            <Text>天気: 晴れ</Text>
          </View>
          <View style={styles.rightInfo}>
            <Text>釣果数: 1匹</Text>
          </View>
        </View>
        <View style={styles.fishingInfomation}>
          <View style={styles.leftInfo}>
            <Text>サイズ: 30cm</Text>
          </View>
          <View style={styles.rightInfo}>
            <Text>重さ: 500g</Text>
          </View>
        </View>
        <View style={styles.fishingInfomation}>
          <View style={styles.leftInfo}>
            <Text>ルアー: ネコリグ</Text>
          </View>
          <View style={styles.rightInfo}>
            <Text>カラー: グリパン</Text>
          </View>
        </View>
        <View style={styles.fishInfo}>
          <Text>-釣果状況-</Text>
          <Text style={styles.fishText}>
            あああああああああああああああああああああああああああ
            あああああああああああああああああああああああああああ
            ああああああああああああああああああああああああああああ
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  userInfo: {
    height: 80,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 19,
    alignItems: 'center'
  },
  userImage: {
    width: 64,
    height: 64,
    borderRadius: 32
  },
  userName: {
    paddingLeft: 16,
    fontSize: 20,
    lineHeight: 32,
    color: '#467FD3'
  },
  postBody: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    marginHorizontal: 19,
    marginBottom: 10,
    height: 'auto'
  },
  fishArea: {
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishAreaImage: {
    height: 175,
    width: 'auto'
  },
  fishTime: {
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishingInfomation: {
    height: 32,
    width: 'auto',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#B0B0B0'
  },
  leftInfo: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0'
  },
  rightInfo: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fishImage: {
    height: 322,
    width: 'auto'
  },
  fishInfo: {
    height: 'auto',
    lineHeight: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000'
  }
})

export default Fish
