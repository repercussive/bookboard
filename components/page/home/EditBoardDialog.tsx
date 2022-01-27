import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Board from '@/lib/logic/app/Board'
import Dialog, { CoreDialogProps } from '@/components/modular/Dialog'
import Input from '@/components/modular/Input'
import SimpleButton from '@/components/modular/SimpleButton'
import Spacer from '@/components/modular/Spacer'

interface Props extends CoreDialogProps {
  createNewBoard?: boolean
}

const EditBoardDialog = observer(({ isOpen, onOpenChange, createNewBoard }: Props) => {
  const [boardName, setBoardName] = useState('')
  const { selectedBoard, addBoard } = container.resolve(BoardsHandler)

  useEffect(() => {
    if (isOpen) {
      setBoardName(createNewBoard ? '' : selectedBoard.name)
    }
  }, [isOpen])

  function handleSave() {
    if (createNewBoard) {
      addBoard(new Board({ name: boardName }))
    } else {
      selectedBoard.renameBoard(boardName)
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(value) => onOpenChange(value)}
      title={createNewBoard ? 'Create board' : 'Edit board'}
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
        {createNewBoard ? 'Add' : 'Save'}
      </SimpleButton>
    </Dialog>
  )
})

export default EditBoardDialog