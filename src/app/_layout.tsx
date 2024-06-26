import { Stack } from 'expo-router'

const Layout = (): JSX.Element => {
  return <Stack screenOptions={{
    headerStyle: {
      backgroundColor: '#467FD3'
    },
    headerTintColor: '#ffffff',
    headerTitle: 'Gyotan',
    headerBackTitle: 'Back',
    headerTitleStyle: {
      fontSize: 26,
      fontWeight: 'bold'
    }
  }} />
}

export default Layout
