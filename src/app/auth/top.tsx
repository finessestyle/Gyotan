import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Link } from 'expo-router'

const Top = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.topInner}>
        <Image style={styles.topImage} source={ require('../../../assets/4.jpeg') } />
        <Text style={styles.topText} >釣果を投稿・共有して琵琶湖にバス釣りに行こう🎣</Text>
      </View>
      <View style={styles.nav}>
        <View style={styles.leftNav}>
          <TouchableOpacity>
            <Link href='auth/login' asChild replace>
              <Text style={styles.navText}>ログイン</Text>
            </Link>
          </TouchableOpacity>
        </View>
        <View style={styles.rightNav}>
          <Link href='auth/signup' asChild replace>
            <TouchableOpacity>
              <Text style={styles.navText}>新規登録</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topInner: {
  },
  topImage: {
    height: 800,
    width: 'auto'
  },
  topText: {
    position: 'absolute',
    top: 20,
    left: 19,
    right: 19,
    fontSize: 40,
    lineHeight: 52,
    fontWeight: 'bold',
    color: '#D0D0D0'
  },
  nav: {
    position: 'absolute',
    bottom: 0,
    width: 'auto',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    flexDirection: 'row',
    backgroundColor: '#467FD3'
  },
  leftNav: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0'
  },
  rightNav: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 32
  }
})

export default Top
