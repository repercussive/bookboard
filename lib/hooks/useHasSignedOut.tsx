import AuthHandler from '@/lib/logic/app/AuthHandler'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { container } from 'tsyringe'

const useHasSignedOut = () => {
  const { auth } = container.resolve(AuthHandler)
  const [hasSignedIn, setHasSignedIn] = useState(false)
  const [hasSignedOut, setHasSignedOut] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!!user) {
        setHasSignedIn(true)
      } else if (hasSignedIn) {
        setHasSignedOut(true)
      }
    })
    return () => unsubscribe()
  }, [hasSignedIn])

  return { hasSignedOut }
}

export default useHasSignedOut