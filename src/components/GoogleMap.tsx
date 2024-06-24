import { View, StyleSheet, Dimensions } from 'react-native'
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps'

const GoogleMap = (): JSX.Element => {
  const nRadiusHalfKm = 300
  const latitude = 35.28537173798231
  const longitude = 136.09664223303773

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >
        <Circle
          center={{ latitude, longitude }}
          radius={nRadiusHalfKm}
          strokeColor="#3333FF"
          strokeOpacity={0.2}
          strokeWeight={2}
          fillColor="#3333FF"
          fillOpacity={0.2}
        />
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2
  }
})

export default GoogleMap
