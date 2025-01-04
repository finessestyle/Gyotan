import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { type FishMap } from '../../types/fishmap'
import Map from '../components/Map'

interface Props {
  map: FishMap
}

const MapListItem = (props: Props): JSX.Element | null => {
  const { map } = props
  const { title, content } = map
  if (title === null || content === null) { return null }
  return (
    <Link
      href={{ pathname: '/map/detail', params: { id: map.id } }}
      asChild
    >
      <TouchableWithoutFeedback>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>{map.title}</Text>
          <Map
            latitude={map.latitude ?? 0}
            longitude={map.longitude ?? 0}
          />
        </View>
      </TouchableWithoutFeedback>
    </Link>
  )
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    height: 'auto'
  },
  listItemTitle: {
    paddingLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
    marginBottom: 8
  }
})

export default MapListItem
