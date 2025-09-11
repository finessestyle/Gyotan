import {
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
    borderRadius: 8,
    alignSelf: 'flex-start',
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonLabel: {
    fontSize: 16,
    color: '#ffffff',
    paddingHorizontal: 24
  }
})

export default Button
