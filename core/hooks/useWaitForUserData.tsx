import { container } from 'tsyringe'
import { when } from 'mobx'
import { useEffect, useState } from 'react'
import AuthHandler from '@/logic/app/AuthHandler'
import InitialSyncHandler from '@/logic/app/InitialSyncHandler'

export default function useWaitForUserData() {
  const { getCachedAuthState } = container.resolve(AuthHandler)
  const [isWaiting, setIsWaiting] = useState(!!getCachedAuthState())

  useEffect(() => {
    const waitForSync = async () => {
      await when(() => container.resolve(InitialSyncHandler).isSynced === true)
      setIsWaiting(false)
    }

    if (isWaiting) {
      waitForSync()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isWaiting
  }
}