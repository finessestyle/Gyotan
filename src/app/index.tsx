import { Redirect, router } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth } from '../config'

const Index = (): JSX.Element => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        void (async () => {
          try {
            await user.reload()
            if (user.emailVerified) {
              router.replace('post/top')
            } else {
              router.replace('/auth/emailCheck')
            }
          } catch (error) {
            console.error('認証確認エラー', error)
          }
        })()
      }
    })
    return unsubscribe
  }, [])

  return <Redirect href="auth/firststep" />
}

export default Index
