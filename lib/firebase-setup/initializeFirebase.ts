import type { Auth } from '@firebase/auth'
import type { Firestore } from '@firebase/firestore'
import { container } from 'tsyringe'
import { FirebaseApp, FirebaseOptions, initializeApp } from '@firebase/app'
import { connectAuthEmulator, getAuth } from '@firebase/auth'
import { connectFirestoreEmulator, getFirestore } from '@firebase/firestore'

const consoleInfo = console.info

export type FirebaseServices = {
  app: FirebaseApp,
  auth: Auth,
  db: Firestore
}

export default function initializeFirebase() {
  const firebaseConfig: FirebaseOptions = {
    projectId: 'bookboard-app',
    apiKey: 'AIzaSyCBAIJd9jIGE9sCyOqOthj7-CUCyku9_dE',
    authDomain: 'bookboard-app.firebaseapp.com',
    storageBucket: 'bookboard-app.appspot.com',
    messagingSenderId: '486746080815',
    appId: '1:486746080815:web:16ce2529dab5ac35a5e8da'
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)

  // EMULATOR
  if (typeof window === 'undefined' || window.location.hostname.includes('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080)
    console.info = () => { }
    connectAuthEmulator(auth, 'http://localhost:9099')
    console.info = consoleInfo
  }
  // PRODUCTION
  else {
    // todo: configure App Check here
  }

  const firebase: FirebaseServices = {
    app,
    auth,
    db
  }

  registerFirebaseInjectionTokens(firebase)

  return firebase
}

export function registerFirebaseInjectionTokens(firebase: FirebaseServices) {
  container.register('Auth', { useValue: firebase.auth })
  container.register('Firestore', { useValue: firebase.db })
}