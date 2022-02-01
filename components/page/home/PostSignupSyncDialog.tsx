import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import InitialSyncHandler from '@/lib/logic/app/InitialSyncHandler'
import Dialog from '@/components/modular/Dialog'
import Text from '@/components/modular/Text'
import Spacer from '@/components/modular/Spacer'
import SimpleButton from '@/components/modular/SimpleButton'

const pendingText = 'Syncing your data...'
const completeText = 'Data synced! Now all of your changes will be automatically backed up to the cloud.'

const PostSignupSyncDialog = observer(() => {
  const [showDialog, setShowDialog] = useState(false)
  const { isPerformingPostSignupSync } = container.resolve(InitialSyncHandler)

  if (isPerformingPostSignupSync && !showDialog) {
    setShowDialog(true)
  }

  return (
    <Dialog
      isOpen={showDialog}
      title={isPerformingPostSignupSync ? 'Just a moment' : 'All set!'}
      onOpenChange={setShowDialog}
      preventClosing={isPerformingPostSignupSync}
    >
      <Text>
        {isPerformingPostSignupSync ? pendingText : completeText}
      </Text>
      {!isPerformingPostSignupSync && <>
        <Spacer mb="$4" />
        <SimpleButton
          onClick={() => setShowDialog(false)}
        >
          OK
        </SimpleButton>
      </>}
    </Dialog>
  )
})

export default PostSignupSyncDialog