import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

const Nav = (): JSX.Element => {
  return (
    <View style={styles.nav}>
      <Link href='/post/list' asChild>
        <TouchableOpacity>
          <Text style={styles.navBotton}>北湖北</Text>
        </TouchableOpacity>
      </Link>
      <Link href='/post/list2' asChild>
        <TouchableOpacity>
          <Text style={styles.navBotton}>北湖東</Text>
        </TouchableOpacity>
      </Link>
      <Link href='/post/list3' asChild>
        <TouchableOpacity>
          <Text style={styles.navBotton}>北湖西</Text>
        </TouchableOpacity>
        </Link>
      <Link href='/post/list4' asChild>
        <TouchableOpacity>
          <Text style={styles.navBotton}>南湖東</Text>
        </TouchableOpacity>
      </Link>
      <Link href='/post/list5' asChild>
        <TouchableOpacity>
          <Text style={styles.navBotton}>南湖西</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  nav: {
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 19,
    borderBottomWidth: 1,
    borderColor: '#DDDDDD'
  },
  navBotton: {
    fontSize: 16,
    lineHeight: 32,
    color: '#467FD3'
  }
})

export default Nav
