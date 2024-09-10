import { useEffect } from 'react'

const confirmationMessage = 'Changes you made have not yet been synced.'

export default function useWarnUnsavedChanges(warnCondition: boolean) {
  useEffect(() => {
    if (warnCondition) {
      window.addEventListener('beforeunload', beforeUnloadHandler)
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }

    return () => window.removeEventListener('beforeunload', beforeUnloadHandler)
  }, [warnCondition])

  function beforeUnloadHandler(e: BeforeUnloadEvent) {
    (e || window.event).returnValue = confirmationMessage
    return confirmationMessage
  }
}