import MapView, { Heatmap } from 'react-native-maps'

interface Point {
  latitude: number
  longitude: number
}

const HeatMap: React.FC<{ points: Point[] }> = ({ points }): JSX.Element => (
  <MapView
    style={{ flex: 1 }}
    initialRegion={{
      latitude: 35.4, // 琵琶湖の中心
      longitude: 136.0,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5
    }}
  >
    <Heatmap
      points={points} // [{latitude, longitude, weight}]
      radius={50} // ヒートポイントの半径
      opacity={0.6} // ヒートマップの透明度
    />
  </MapView>
)

export default HeatMap
