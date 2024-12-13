import React, {
  Text, TouchableOpacity, StyleSheet,
  type ViewStyle, type TextStyle
} from 'react-native'

interface Props {
  label: string
  buttonStyle?: ViewStyle
  labelStyle?: TextStyle
  onPress?: () => void
}

const Button = (props: Props): JSX.Element => {
  const { label, buttonStyle, labelStyle, onPress } = props
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]} >
      <Text style={[styles.buttonLabel, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#467FD3',
    borderRadius: 4,
    alignSelf: 'flex-start',
    width: 'auto',
    height: 'auto'
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 32,
    color: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 24
  }
})

export default Button
