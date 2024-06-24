import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const Nav = (): JSX.Element => {
  return (
    <View style={styles.nav}>
      <TouchableOpacity>
        <Text style={styles.navBotton}>北湖北</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.navBotton}>北湖東</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.navBotton}>北湖西</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.navBotton}>南湖東</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.navBotton}>南湖西</Text>
      </TouchableOpacity>
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
