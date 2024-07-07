import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import detail from '../app/user/detail'
import list from '../app/post/list'

const Tab = createBottomTabNavigator()

const BottomTab = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={detail} />
        <Tab.Screen name="Settings" component={list} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default BottomTab
