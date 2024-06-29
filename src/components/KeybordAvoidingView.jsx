/* eslint-disable  */
import React, { useRef, useState, useEffect } from 'react'
import {
  Keyboard, Dimensions, Animated
} from 'react-native'

const KeyboardSafeView = ({ children, style }) => {
  const initialViewHeight = useRef(null)
  const animatedViewHeight = useRef(null)
  const [viewHeight, setViewHeight] = useState(null)

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', handleShow)
    const hideSubscription = Keyboard.addListener('keyboardDidHide', handleHide)
    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  useEffect(() => {
    if ([initialViewHeight, animatedViewHeight, viewHeight].some((val) => val === null)) { return }
    // height is not supported with useNativeDriver: true
    // https://github.com/react-native-community/react-native-modal/issues/163
    if (viewHeight === initialViewHeight.current) {
      Animated.timing(animatedViewHeight.current,
        { toValue: initialViewHeight.current, duration: 300, useNativeDriver: false }).start()
    } else {
      Animated.timing(animatedViewHeight.current,
        { toValue: viewHeight, duration: 300, useNativeDriver: false }).start()
    }
  }, [viewHeight])

  const handleShow = ({ endCoordinates }) => {
    if (endCoordinates.height && initialViewHeight.current) {
      const keyboardHeight = Dimensions.get('window').height - endCoordinates.screenY
      setViewHeight(initialViewHeight.current - keyboardHeight - 80)
    }
  }

  const handleHide = () => {
    setViewHeight(initialViewHeight.current - 80)
  }

  const handleLayout = ({ nativeEvent }) => {
    if (!initialViewHeight.current) {
      const { height } = nativeEvent.layout
      // keep viewHeight as null not to trigger useEffect on mounting.
      // Don't do this: setViewHeight(height);
      initialViewHeight.current = height
      animatedViewHeight.current = new Animated.Value(height)
    }
  }

  const animatedStyle = viewHeight
    ? {
        height: animatedViewHeight.current,
        flex: 0
      }
    : {}
  return (
    <Animated.View style={[style, animatedStyle]} onLayout={handleLayout}>
      {children}
    </Animated.View>
  )
}
export default KeyboardSafeView
