import { View, Switch, StyleSheet } from 'react-native'

interface Props {
  isEnabled: boolean
  onToggle: (value: boolean) => void
}

const ToggleSwitch = ({ isEnabled, onToggle }: Props): JSX.Element => {
  return (
    <View style={styles.container}>
      <Switch
        onValueChange={onToggle}
        value={isEnabled}
        trackColor={{ true: 'blue' }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 40,
    right: 16,
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'silver',
    borderWidth: 2,
    borderColor: '#B0B0B0',
    borderRadius: 30
  },
  text: {
    fontSize: 12,
    color: '#ffffff'
  }
})

export default ToggleSwitch
