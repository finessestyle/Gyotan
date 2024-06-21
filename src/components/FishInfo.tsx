import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'

const FishInfo = (): JSX.Element => {
  return (
    <ScrollView>
      <View style={styles.userInfo}>
        <Image style={styles.userImage} source={ require('../../assets/2.jpeg') } />
        <Text style={styles.userName}>フィネススタイル さん</Text>
      </View>
      <View style={styles.postBody}>
        <View style={styles.fishArea}>
          <Text>釣果エリア: 北湖北エリア</Text>
        </View>
        <View>
          <Image style={styles.fishAreaImage} source={ require('../../assets/3.png') } />
        </View>
        <View style={styles.fishTime}>
          <Text>釣果日時: 2024年3月21日14:02</Text>
        </View>
        <View>
          <Image style={styles.fishImage} source={ require('../../assets/1.jpeg') } />
        </View>
        <View>
          <View style={styles.fishTime}>
            <Text>天気: 晴れ</Text>
          </View>
          <View style={styles.fishTime}>
            <Text>釣果数: 1匹</Text>
          </View>
          <View style={styles.fishTime}>
            <Text>長さ: 30cm</Text>
          </View>
          <View style={styles.fishTime}>
            <Text>重さ: 600g</Text>
          </View>
          <View style={styles.fishTime}>
            <Text>ルアー: ネコリグ</Text>
          </View>
          <View style={styles.fishTime}>
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
  postInfo: {
  },
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
  postTitle: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 32,
    fontWeight: 'bold'
  },
  postDate: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16
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
  fishImage: {
    height: 322,
    width: 'auto'
  },
  fishInfo: {
    height: 'auto',
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fishText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000'
  }
})

export default FishInfo
