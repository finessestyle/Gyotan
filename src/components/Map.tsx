import { View, StyleSheet } from 'react-native'
import MapView, { Circle, UrlTile } from 'react-native-maps'

const Map = (): JSX.Element => {
  const nRadiusHalfKm = 300
  const latitude = 35.4835
  const longitude = 136.117

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType='none'
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >
        <UrlTile
          urlTemplate="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png" // Google MapsタイルURL
          maximumZ={19}
          flipY={false} // 必要に応じて設定
        />
        <Circle
          center={{ latitude, longitude }}
          radius={nRadiusHalfKm}
          strokeColor="#3333FF"
          fillColor="rgba(51, 51, 255, 0.2)"
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
    width: 335,
    height: 174
  }
})

export default Map
