import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Board from '@/lib/logic/app/Board'
import Dialog, { CoreDialogProps } from '@/components/modular/Dialog'
import SimpleButton from '@/components/modular/SimpleButton'
import Spacer from '@/components/modular/Spacer'
import Text from '@/components/modular/Text'

interface Props extends CoreDialogProps {
  boardToDelete: Board
}

let enableDeleteButtonTimeout = undefined as ReturnType<typeof setTimeout> | undefined

const DeleteBoardDialog = observer(({ isOpen, onOpenChange, boardToDelete }: Props) => {
  const { allBoards, deleteBoard } = container.resolve(BoardsHandler)
  const [disableDeleteButton, setDisableDeleteButton] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const allowDelete = allBoards.length > 1
  const boardTitle = isDeleting ? 'Just a moment' : (allowDelete ? 'Delete board' : `Can't delete`)

  useEffect(() => {
    if (isOpen) {
      setDisableDeleteButton(true)
      enableDeleteButtonTimeout = setTimeout(() => {
        setDisableDeleteButton(false)
      }, 1000)
    }
    return () => clearTimeout(enableDeleteButtonTimeout as unknown as number)
  }, [isOpen])

  async function handleDeleteBoard() {
    setIsDeleting(true)
    await deleteBoard(boardToDelete)
    setIsDeleting(false)
    onOpenChange(false)
  }

  return (
    <Dialog
      title={boardTitle}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      preventClosing={isDeleting}
    >
      {isDeleting ? <Text>Deleting board...</Text> : <>
        {!allowDelete && <Text>{`That's the only board you have!`}</Text>}
        {allowDelete && <>
          <Text>
            Permanently delete board <span style={{ fontWeight: 900 }}>{boardToDelete.name}</span>?
          </Text>
          <Spacer mb="$3" />
          <SimpleButton
            onClick={handleDeleteBoard}
            disabled={disableDeleteButton}
          >
            Delete
          </SimpleButton>
        </>}
      </>}
    </Dialog>
  )
})

export default DeleteBoardDialog