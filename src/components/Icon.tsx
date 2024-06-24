import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

import fontData from '../../assets/fonts/icomoon.ttf'
import fontSelection from '../../assets/fonts/selection.json'

const CustumIcon = createIconSetFromIcoMoon(
  fontSelection,
  'IcoMoon',
  'Icomoon.ttf'
)

interface Props {
  name: string
  size: number
  color: string
}

const Icon = (props: Props): JSX.Element | null => {
  const { name, size, color } = props
  const [fontLoaded] = useFonts({
    IcoMoon: fontData
  })
  if (!fontLoaded) {
    return null
  }
  return (
    <CustumIcon name={name} size={size} color={color} />
  )
}

export default Icon
