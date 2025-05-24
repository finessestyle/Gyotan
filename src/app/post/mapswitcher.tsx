import { View, StyleSheet } from 'react-native'
import ToggleSwitch from '../../components/ToggleSwitch'
import { useState } from 'react'
import Map from '../../app/post/map'
import MyMap from '../../app/post/mymap'

const MapSwitcher = (): JSX.Element => {
  const [isMyMap, setIsMyMap] = useState(false)
  return (
    <View style={styles.container}>
      <ToggleSwitch isEnabled={isMyMap} onToggle={setIsMyMap} />
      {isMyMap ? <MyMap /> : <Map />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  }
})

export default MapSwitcher
