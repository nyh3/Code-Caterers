import 'react-native-url-polyfill/auto'
import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

const projectUrl = "https://tkkkeagmqcijtmriflss.supabase.co"
const projectKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra2tlYWdtcWNpanRtcmlmbHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ2NTUyMDAsImV4cCI6MjAwMDIzMTIwMH0.jIZdGbVy3H3L8DdNN9cqM_HsWIVYutj9W4YnRtxKJi0"

export const supabase = createClient(projectUrl, projectKey, {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    }
});