import { View, Text, StyleSheet, ScrollView } from 'react-native'
// import { Feather } from '@expo/vector-icons'
import { useState, useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { onSnapshot, doc } from 'firebase/firestore'
import { auth, db } from '../../config'
import { type Blog } from '../../../types/blog'

import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'

const handlePress = (id: string) => {
  router.push({ pathname: '/blog/edit', params: { id } })
}

const Detaile = () => {
  const id = String(useLocalSearchParams().id)
  const [blog, setBlog] = useState<Blog | null>(null)
  useEffect(() => {
    if (auth.currentUser === null) return
    const ref = doc(db, 'blogs', id)
    const unsubcribe = onSnapshot(ref, (blogDoc) => {
      const { bodyText, updatedAt } = blogDoc.data() as Blog
      setBlog({
        id: blogDoc.id,
        bodyText,
        updatedAt
      })
    })
    return unsubcribe
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.blogHeader}>
          <Text style={styles.blogTitle} numberOfLines={1}>{blog?.bodyText}</Text>
          <Text style={styles.blogDate}>{blog?.updatedAt?.toDate().toLocaleString('ja-JP')}</Text>
      </View>
      <ScrollView style={styles.blogBody }>
          <Text style={styles.blogBodyText}>
            {blog?.bodyText}
          </Text>
      </ScrollView>
      <CircleButton onPress={() => { handlePress(id) }} style={{ top: 60, bottom: 'auto' }}>
        <Icon name='pencil' size={40} color='#ffffff' />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  blogHeader: {
    height: 96,
    backgroundColor: '#467FD3',
    justifyContent: 'center',
    paddingHorizontal: 19,
    paddingVertical: 24
  },
  blogTitle: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  blogDate: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16
  },
  blogBody: {
    paddingHorizontal: 27
  },
  blogBodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    paddingVertical: 32
  }
})

export default Detaile
