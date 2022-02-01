import { makeAutoObservable } from 'mobx'
import { Auth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
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
      await this.initialSyncHandler.syncData()
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

  public getCachedAuthState() {
    if (!isBrowser) return false
    return !!localStorage.getItem('authState')
  }

  private setIsAuthenticated(state: boolean) {
    this.isAuthenticated = state
    if (!isBrowser) return
    if (state) {
      localStorage.setItem('authState', '1')
    } else {
      localStorage.removeItem('authState')
    }
  }
}