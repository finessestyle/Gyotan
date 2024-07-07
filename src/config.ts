import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import ReactNativeAsyncStrage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FB_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGINGSENDER_ID,
  appId: process.env.EXPO_PUBLIC_FB_APP_ID,
  openWeatherApiKey: process.env.EXPO_PUBLIC_FB_OPEN_WEATHER_API_KEY
}

const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStrage)
})
const db = getFirestore(app)
const storage = getStorage(app)
const { openWeatherApiKey } = firebaseConfig

export { app, auth, db, storage, openWeatherApiKey }
