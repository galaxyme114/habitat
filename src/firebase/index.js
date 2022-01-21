import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const config = {
  apiKey: 'AIzaSyCQRA5P_vvBK-k7evOJYDejemiq75KZtkM',
  authDomain: 'test5chat-132e8.firebaseapp.com',
  projectId: 'test5chat-132e8',
  storageBucket: 'test5chat-132e8.appspot.com',
  messagingSenderId: '365015544099',
  appId: '1:365015544099:web:6750f99949ef51828f5c96',
  measurementId: 'G-LZRFVCFEPS'
}

initializeApp(config)

export const firestoreDb = getFirestore()
export const realtimeDb = getDatabase()
export const storage = getStorage()
