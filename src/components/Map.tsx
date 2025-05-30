import { View, StyleSheet } from 'react-native'
import MapView, { Circle, UrlTile } from 'react-native-maps'

interface Props {
  latitude: number
  longitude: number
}

const Map = ({ latitude, longitude }: Props): JSX.Element => {
  const nRadiusHalfKm = 300

  return (
    <View style={styles.container}>
      {latitude !== 0 && longitude !== 0 && (
      <MapView
        style={styles.map}
        mapType='standard'
        scrollEnabled={false}
        region={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >
        <UrlTile
          urlTemplate='https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
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
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  map: {
    width: 'auto',
    height: 200
  }
})

export default Map
