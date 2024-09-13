import { Redirect, router } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth } from '../config'

const Index = (): JSX.Element => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        router.replace('/post/top')
      }
    })
    return unsubscribe
  }, [])
  return <Redirect href="auth/top" />
}

export default Index
