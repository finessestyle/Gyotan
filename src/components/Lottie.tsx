import { View, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

interface LottieProps {
  onFinish: () => void
}

const Lottie = ({ onFinish }: LottieProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/fonts/lottie/fishing.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish}
        style={styles.lottie}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  lottie: {
    width: 200,
    height: 200
  }
})

export default Lottie
