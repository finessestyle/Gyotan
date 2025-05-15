import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Tabs, router } from 'expo-router'
import { FontAwesome6 } from '@expo/vector-icons'
import { auth } from '../config'

const Layout = (): JSX.Element => {
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
            title: '釣果情報',
            tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="list" color={color} />
          }}
        />
        <Tabs.Screen
          name="post/map"
          options={{
            title: '釣果MAP',
            tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="fish" color={color} />
          }}
        />
        <Tabs.Screen
          name="post/create"
          options={{
            title: '釣果投稿',
            tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="plus" color={color} />
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault() // ← デフォルトのタブ遷移を防ぐ

              if (auth.currentUser?.isAnonymous) {
                // 匿名ユーザーには警告を表示
                Alert.alert(
                  'ゲストログイン中',
                  'ゲストユーザーは投稿できません。ユーザー情報を登録しますか？',
                  [
                    { text: 'いいえ', style: 'cancel' },
                    { text: 'はい', onPress: () => navigation.navigate('user/anonymouseedit') }
                  ]
                )
              } else {
                // 位置データがない場合の警告
                Alert.alert(
                  '確認',
                  '位置データがない写真は投稿できません。',
                  [
                    { text: 'キャンセル', style: 'cancel' },
                    { text: 'OK', onPress: () => navigation.navigate('post/create') }
                  ]
                )
              }
            }
          })}
        />
        <Tabs.Screen
          name="map/list"
          options={{
            title: '釣り場MAP',
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
          name="auth/passwordReset"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => {
                  router.replace('/auth/login')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />
        <Tabs.Screen
          name="auth/firststep"
          options={{
            href: null,
            tabBarStyle: { display: 'none' }
          }}
        />
        <Tabs.Screen
          name="auth/emailCheck"
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
                  router.replace('/post/map')
                }}>
                  <FontAwesome6 name="arrow-left" size={24} color="#ffffff" style={{ paddingLeft: 24 }} />
                </TouchableOpacity>
              )
            }
          }}
        />
        <Tabs.Screen
          name="post/rule"
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
                  router.replace('/user/mypage')
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
          name="user/anonymouseedit"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
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
          name="user/list"
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
          name="auth/privacy"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
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
          name="auth/term"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
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
