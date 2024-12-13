import { Redirect, router } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { auth } from '../config'

const Index = (): JSX.Element => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        router.replace('/post/top')
      }
    })
  }, [])
  return <Redirect href="auth/login" />
}

export default Index
