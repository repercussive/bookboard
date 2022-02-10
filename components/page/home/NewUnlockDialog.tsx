import { container } from 'tsyringe'
import { useState } from 'react'
import { styled } from '@/styles/stitches.config'
import UserDataHandler, { PlantId, ThemeId, themesData, unlockableThemes, unlocks } from '@/lib/logic/app/UserDataHandler'
import Dialog from '@/components/modular/Dialog'
import PlantSvg from '@/components/page/home/PlantSvg'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import SimpleButton from '@/components/modular/SimpleButton'
import Text from '@/components/modular/Text'

const NewUnlockDialog = () => {
  const { completedBooksCount } = container.resolve(UserDataHandler)
  const [showDialog, setShowDialog] = useState(false)
  const [preventClosing, setPreventClosing] = useState(false)
  const [previousCompletedBooksCount, setPreviousCompletedBooksCount] = useState(completedBooksCount)

  async function runDialogSequence() {
    await new Promise(resolve => setTimeout(resolve, 500))
    setShowDialog(true)
    setPreventClosing(true)
    setPreviousCompletedBooksCount(completedBooksCount)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPreventClosing(false)
  }

  if (completedBooksCount > previousCompletedBooksCount) {
    runDialogSequence()
  }

  const unlockInfo = unlocks.find((item) => item.booksRequired === completedBooksCount)

  if (!unlockInfo) return null

  const unlockType: 'theme' | 'plant' = unlockableThemes.some((item) => item.id === unlockInfo.id) ? 'theme' : 'plant'

  return (
    <Dialog
      title={`${unlockType === 'theme' ? 'Theme' : 'Plant'} unlocked!`}
      isOpen={showDialog}
      onOpenChange={setShowDialog}
      preventClosing={preventClosing}
    >
      {unlockType === 'plant' && <>
        <Flex center>
          <PlantSvg plantId={unlockInfo.id as PlantId} />
        </Flex>
        <Text css={{ mt: '$4' }}>
          Select a plant on a shelf to swap it out with a different one.
        </Text>
      </>}
      {unlockType === 'theme' && <>
        <Flex center>
          <ThemeText css={{ color: `var(--${unlockInfo.id}-color-primary)`, bg: `var(--${unlockInfo.id}-color-bg)` }}>
            {themesData[unlockInfo.id as ThemeId].name}
          </ThemeText>
        </Flex>
        <Text css={{ mt: '$4' }}>
          Select the lightbulb in the top right corner to switch themes.
        </Text>
      </>}
      <Spacer mb="$4" />
      <SimpleButton onClick={() => setShowDialog(false)}>
        OK
      </SimpleButton>
    </Dialog>
  )
}

const ThemeText = styled('p', {
  padding: '$3 $4',
  color: 'var(--color)',
  bg: 'var(--bg)',
  borderRadius: '8px',
  fontSize: '1.2rem !important',
})

export default NewUnlockDialog