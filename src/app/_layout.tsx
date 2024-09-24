import { Tabs, useRouter } from 'expo-router'
import { FontAwesome6 } from '@expo/vector-icons'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

const Layout = (): JSX.Element => {
  const router = useRouter()

  const renderBackButton = (): JSX.Element => {
    return (
      <TouchableOpacity onPress={() => {
        router.back()
      }}>
        <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Tabs screenOptions={{
        headerStyle: {
          backgroundColor: '#467FD3'
        },
        headerTintColor: '#ffffff',
        headerTitle: 'Gyotan',
        headerTitleStyle: {
          fontSize: 26,
          fontWeight: 'bold'
        },
        tabBarActiveTintColor: '#467FD3'
      }}>
        <Tabs.Screen
          name="post/top"
          options={{
            title: '最新釣果',
            tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="fish" color={color} />
          }}
        />
        <Tabs.Screen
          name="post/list"
          options={{
            title: 'エリア釣果',
            tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="list" color={color} />
          }}
        />
        <Tabs.Screen
          name="post/create"
          options={{
            title: '釣果投稿',
            tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="plus" color={color} />
          }}
        />
        <Tabs.Screen
          name="map/list"
          options={{
            title: '釣り場一覧',
            tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="map" color={color} />
          }}
        />
        <Tabs.Screen
          name="user/mypage"
          options={{
            title: 'マイページ',
            tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="user" color={color} />
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
          name="post/detail"
          options={{
            href: null,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => {
                  router.replace('/post/top')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />
        <Tabs.Screen
          name="post/edit"
          options={{
            href: null,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => {
                  router.replace('/post/list')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />
        <Tabs.Screen
          name="map/create"
          options={{
            href: null,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => {
                  router.replace('/map/list')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />

        <Tabs.Screen
          name="map/detail"
          options={{
            href: null,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => {
                  router.replace('/map/list')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />
        <Tabs.Screen
          name="map/edit"
          options={{
            href: null,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => {
                  router.replace('/map/list')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />
        <Tabs.Screen
          name="user/detail"
          options={{
            href: null,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => {
                  router.replace('/post/list')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />
        <Tabs.Screen
          name="user/edit"
          options={{
            href: null,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => {
                  router.replace('/user/mypage')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />
        <Tabs.Screen
          name="user/list"
          options={{
            href: null,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => {
                  router.replace('/auth/signup')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            href: null,
            headerLeft: () => { return renderBackButton() }
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
