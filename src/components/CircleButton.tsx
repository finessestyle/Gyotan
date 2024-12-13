import React, {
  Text, TouchableOpacity, StyleSheet, type ViewStyle
} from 'react-native'

interface Props {
  children: JSX.Element
  style?: ViewStyle
  onPress: () => void
}
const CircleButton = (props: Props): JSX.Element => {
  const { children, style, onPress } = props
  return (
    <TouchableOpacity style={[styles.circleButton, style]} onPress={onPress}>
      <Text style={styles.circleButtonLabel}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    color: '#ffffff',
    fontSize: 40,
    lineHeight: 48
  }
})

export default CircleButton
