import { View, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'
import { useRef, useState, useEffect } from 'react'

interface LottieProps {
  onFinish: () => void
}

const Lottie = ({ onFinish }: LottieProps): JSX.Element => {
  const animationRef = useRef<LottieView>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    animationRef.current?.play()
  }, [])

  const handleAnimationFinish = (): void => {
    setVisible(false)
    onFinish()
  }

  if (!visible) return null

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../../assets/fonts/lottie/fishing.json')}
        autoPlay
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        style={styles.lottie}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  lottie: {
    width: 150,
    height: 150
  }
})

export default Lottie
