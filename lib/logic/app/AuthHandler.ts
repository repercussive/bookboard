import type { Auth } from 'firebase/auth'
import { makeAutoObservable } from 'mobx'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { inject, singleton } from 'tsyringe'
import InitialSyncHandler from '@/lib/logic/app/InitialSyncHandler'

const isBrowser = typeof window !== 'undefined'

@singleton()
export default class AuthHandler {
  public auth
  public isAuthenticated = false

  constructor(@inject('Auth') auth: Auth, private initialSyncHandler: InitialSyncHandler) {
    this.auth = auth
    onAuthStateChanged(auth, (user) => this.setIsAuthenticated(!!user))
    makeAutoObservable(this)
  }

  public signIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(this.auth, provider)
    } catch (error) {
      console.error(error)
    }
  }

  public signOut = async () => {
    await firebaseSignOut(this.auth)
    if (isBrowser) {
      window.location.replace('/')
    }
  }

  public getCachedAuthState = () => {
    if (!isBrowser) return false
    return !!localStorage.getItem('authState')
  }

  private setIsAuthenticated = (isAuthenticated: boolean) => {
    this.isAuthenticated = isAuthenticated
    if (isAuthenticated) {
      this.initialSyncHandler.syncData()
    }
    if (isBrowser) {
      if (isAuthenticated) {
        localStorage.setItem('authState', '1')
      } else {
        localStorage.removeItem('authState')
      }
    }
  }
}