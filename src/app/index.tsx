import { Redirect, router } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth } from '../config'

const Index = (): JSX.Element => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        router.replace('/post/list')
      }
    })
  }, [])
  return <Redirect href='auth/top' />
}

export default Index
