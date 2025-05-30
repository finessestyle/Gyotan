import {
  Text, TouchableOpacity, StyleSheet, type ViewStyle
} from 'react-native'

interface Props {
  children: JSX.Element
  style?: ViewStyle
  onPress?: () => void
}
const CircleButton = (props: Props): JSX.Element => {
  const { children, style, onPress } = props
  return (
    <TouchableOpacity onPress={onPress} style={[styles.circleButton, style]}>
      <Text style={styles.circleButtonLabel}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  circleButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#467FD3',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 40,
    bottom: 40,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  circleButtonLabel: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 40
  }
})

export default CircleButton
