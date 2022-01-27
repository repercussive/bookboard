import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Dialog from '@/components/modular/Dialog'
import Input from '@/components/modular/Input'
import SimpleButton from '@/components/modular/SimpleButton'
import Spacer from '@/components/modular/Spacer'

interface Props {
  isOpen: boolean,
  onOpenChange: (open: boolean) => void
}

const RenameBoardDialog = observer(({ isOpen, onOpenChange }: Props) => {
  const [boardName, setBoardName] = useState('')
  const { selectedBoard } = container.resolve(BoardsHandler)

  useEffect(() => {
    if (isOpen) {
      setBoardName(selectedBoard.name)
    }
  }, [isOpen])

  function handleSave() {
    selectedBoard.renameBoard(boardName)
    onOpenChange(false)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(value) => onOpenChange(value)}
      title="Rename board"
    >
      <label>
        Name
        <Spacer mb="$1" />
        <Input value={boardName} onChange={(e) => setBoardName(e.target.value)} />
      </label>
      <Spacer mb="$4" />
      <SimpleButton
        onClick={handleSave}
        disabled={!boardName}
      >
        Save
      </SimpleButton>
    </Dialog>
  )
})

export default RenameBoardDialog