import 'dotenv/config'
import type { ExpoConfig } from '@expo/config'

const config: ExpoConfig = {
  name: 'Gyotan',
  slug: 'gyotan',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/splash-icon(1).png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'cover',
    backgroundColor: '#ffffff'
  },
  ios: {
    bundleIdentifier: 'jp.gyotan.Gyotan',
    buildNumber: '8',
    supportsTablet: false,
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
    },
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription: 'このアプリでは釣果投稿の位置情報を記録するために位置情報を使用します。'
    },
    googleServicesFile: './GoogleService-Info.plist'
  },
  android: {
    package: 'jp.gyotan.Gyotan',
    versionCode: 1,
    googleServicesFile: './google-services.json'
  },
  extra: {
    eas: {
      projectId: '06d8c482-4d92-42af-9d1f-afe29526abe6'
    },
    expoPublicFbApiKey: process.env.EXPO_PUBLIC_FB_API_KEY,
    expoPublicFbAuthDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN,
    expoPublicFbProjectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID,
    expoPublicFbStorageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET,
    expoPublicFbMessagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGING_SENDER_ID,
    expoPublicFbWebAppId: process.env.EXPO_PUBLIC_FB_WEB_APP_ID,
    expoPublicFbIosAppId: process.env.EXPO_PUBLIC_FB_IOS_APP_ID,
    expoPublicFbOpenWeatherApiKey: process.env.EXPO_PUBLIC_FB_OPEN_WEATHER_API_KEY,
    expoPublicGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
  },
  runtimeVersion: {
    policy: 'appVersion'
  },
  updates: {
    url: 'https://u.expo.dev/06d8c482-4d92-42af-9d1f-afe29526abe6'
  },
  scheme: 'gyotan'
}

export default config
