import { Tabs } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { View, StyleSheet } from 'react-native'

const Layout = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Tabs screenOptions={{
        headerStyle: {
          backgroundColor: '#467FD3'
        },
        headerTintColor: '#ffffff',
        headerTitle: 'Gyotan',
        headerBackTitle: '戻る',
        headerTitleStyle: {
          fontSize: 26,
          fontWeight: 'bold'
        },
        tabBarActiveTintColor: 'blue'
      }}>
        <Tabs.Screen
          name="post/list"
          options={{
            title: '釣果',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="pencil" color={color} />
          }}
        />
        <Tabs.Screen
          name="user/detail"
          options={{
            title: 'ユーザー',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />
          }}
        />
        <Tabs.Screen
          name="auth/top"
          options={{
            href: null,
            tabBarStyle: { display: 'none' }
          }}
        />
        <Tabs.Screen
          name="auth/login"
          options={{
            href: null,
            tabBarStyle: { display: 'none' }
          }}
        />
        <Tabs.Screen
          name="auth/signup"
          options={{
            href: null,
            tabBarStyle: { display: 'none' }
          }}
        />
        <Tabs.Screen
          name="post/create"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="post/detail"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="post/edit"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="user/list"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="user/edit"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            href: null
          }}
        />
      </Tabs>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default Layout
