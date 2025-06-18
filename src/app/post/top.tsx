import {
  View, FlatList, StyleSheet, Text, TouchableOpacity, ScrollView, Animated
} from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { Link, useFocusEffect } from 'expo-router'
import { collection, onSnapshot, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db, auth } from '../../config'
import { type Post } from '../../../types/post'
import ListItem from '../../components/ListItem'
import ListSizeItem from '../../components/ListSizeItem'
import Icon from '../../components/Icon'

const areas = ['北湖北岸', '北湖東岸', '北湖西岸', '南湖東岸', '南湖西岸']

const Top = (): JSX.Element => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [largestPosts, setLargestPosts] = useState<Post[]>([])
  const [latestArea, setLatestArea] = useState<string>(areas[0])
  const [largestArea, setLargestArea] = useState<string>(areas[0])
  const [fadeAnime] = useState(new Animated.Value(0))

  useFocusEffect(
    useCallback(() => {
      fadeAnime.setValue(0)
      Animated.timing(fadeAnime, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      }).start()
    }, [fadeAnime])
  )

  useEffect(() => {
    if (latestPosts.length > 0) {
      fadeAnime.setValue(0)
      Animated.timing(fadeAnime, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      }).start()
    }
  }, [latestPosts])

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, where('fishArea', '==', latestArea), orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      void (async () => {
        const remotePosts: Post[] = []

        if (auth.currentUser === null) return

        let blockedUserIds: string[] = []
        try {
          const blockSnap = await getDocs(
            query(collection(db, 'blocks'), where('blockerId', '==', auth.currentUser.uid))
          )
          blockedUserIds = blockSnap.docs.map((doc) => doc.data().blockedUserId)
        } catch (e) {
          console.warn('ブロック情報の取得に失敗:', e)
        }

        snapShot.forEach((doc) => {
          const {
            userId, userName, userImage, images, weather, content, length, weight, structure, cover,
            category, lure, lureAction, waterDepth, catchFish, area, fishArea, exifData, updatedAt, likes
          } = doc.data()

          if (typeof userId === 'string' && !blockedUserIds.includes(userId)) {
            remotePosts.push({
              id: doc.id,
              userId,
              userName,
              userImage,
              images,
              weather,
              content,
              length,
              weight,
              category,
              lure,
              lureAction,
              waterDepth,
              structure,
              cover,
              catchFish,
              area,
              fishArea,
              updatedAt,
              exifData,
              likes
            })
          }
        })
        setLatestPosts(remotePosts)
      })()
    })
    return unsubscribe
  }, [latestArea])

  useEffect(() => {
    const ref = collection(db, 'posts')
    const q = query(ref, where('fishArea', '==', largestArea), orderBy('length', 'desc'))
    const unsubscribe = onSnapshot(q, (snapShot) => {
      void (async () => {
        const remotePosts: Post[] = []

        if (auth.currentUser === null) return

        let blockedUserIds: string[] = []
        try {
          const blockSnap = await getDocs(
            query(collection(db, 'blocks'), where('blockerId', '==', auth.currentUser.uid))
          )
          blockedUserIds = blockSnap.docs.map((doc) => doc.data().blockedUserId)
        } catch (e) {
          console.warn('ブロック情報の取得に失敗:', e)
        }

        snapShot.forEach((doc) => {
          const {
            userId, userName, userImage, images, weather, content, length, weight, structure, cover,
            category, lure, lureAction, waterDepth, catchFish, area, fishArea, exifData, updatedAt, likes
          } = doc.data()

          if (typeof userId === 'string' && !blockedUserIds.includes(userId)) {
            remotePosts.push({
              id: doc.id,
              userId,
              userName,
              userImage,
              images,
              weather,
              content,
              length,
              weight,
              category,
              lure,
              lureAction,
              waterDepth,
              structure,
              cover,
              catchFish,
              area,
              fishArea,
              updatedAt,
              exifData,
              likes
            })
          }
        })
        setLargestPosts(remotePosts)
      })()
    })
    return unsubscribe
  }, [largestArea])

  return (
    <View style={styles.container}>
      <Link replace href='/post/rule' asChild >
        <TouchableOpacity>
          <View style={styles.rule}>
            <Text style={styles.ruleText}>琵琶湖バス釣りルール</Text>
          </View>
        </TouchableOpacity>
      </Link>
      <ScrollView style={styles.inner}>
        <Text style={styles.title}>最新釣果</Text>
        <View style={styles.tabs}>
          {areas.map((area) => (
            <TouchableOpacity
              key={area}
              style={[styles.tab, latestArea === area && styles.selectedTab]}
              onPress={() => { setLatestArea(area) }}
              activeOpacity={0.7}
            >
              <Text style={styles.tabText}>{area}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={latestPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListItem post={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps='always'
          contentContainerStyle={styles.listContainer}
          initialNumToRender={5}
          ListEmptyComponent={
            <View style={{ padding: 20 }}>
              <Text>投稿がありません...。</Text>
            </View>
          }
        />
        <Text style={styles.title}>今釣れる!?</Text>
        {latestPosts.length > 0 && (
          <View>
            <Animated.View style={[styles.fishingNow, { opacity: fadeAnime }]}>
              <Text style={styles.now}>{latestPosts[0].structure}</Text>
              <Icon name="delete" size={32} color="#888" />
              <Text style={styles.now}>{latestPosts[0].cover}</Text>
              <Icon name="delete" size={32} color="#888" />
              <Text style={styles.now}>
                {latestPosts[0].lure} : {latestPosts[0].lureAction}
              </Text>
            </Animated.View>
          </View>
        )}

        {latestPosts.length === 0 && (
          <View style={{ padding: 20 }}>
            <Text>投稿がありません...。</Text>
          </View>
        )}

        <Text style={styles.title}>ランキング[長さ]</Text>
        <View style={styles.tabs}>
          {areas.map((area) => (
            <TouchableOpacity
              key={area}
              style={[styles.tab, largestArea === area && styles.selectedTab]}
              onPress={() => { setLargestArea(area) }}
              activeOpacity={0.7}
            >
              <Text style={styles.tabText}>{area}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={largestPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ListSizeItem post={item} index={index} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.listContainer}
          initialNumToRender={5}
          ListEmptyComponent={
            <View style={{ padding: 20 }}>
              <Text>投稿がありません...。</Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  rule: {
    height: 'auto',
    width: '100%',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    backgroundColor: 'yellow'
  },
  ruleText: {
    fontSize: 16,
    textAlign: 'center'
  },
  inner: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginVertical: 24
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  tab: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  selectedTab: {
    borderBottomColor: '#467FD3'
  },
  tabText: {
    fontSize: 16,
    color: '#467FD3'
  },
  listContainer: {
    height: 170
  },
  fishingNow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  now: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 300,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#467FD3',
    overflow: 'hidden',
    textAlign: 'center'
  },
  footerLink: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#467FD3',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 24,
    color: '#fffff',
    overflow: 'hidden'
  }
})

export default Top
