import { container } from 'tsyringe'
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

const DeleteBoardDialog = ({ isOpen, onOpenChange, boardToDelete }: Props) => {
  const { allBoards, deleteBoard } = container.resolve(BoardsHandler)
  const [disableDeleteButton, setDisableDeleteButton] = useState(false)
  const [allowDelete, setAllowDelete] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const allow = allBoards.length > 1

      if (allow) {
        setDisableDeleteButton(true)
        setAllowDelete(allBoards.length > 1)

        enableDeleteButtonTimeout = setTimeout(() => {
          setDisableDeleteButton(false)
        }, 1000)
      }
    }
    return () => clearTimeout(enableDeleteButtonTimeout as unknown as number)
  }, [isOpen])

  function handleDeleteBoard() {
    deleteBoard(boardToDelete)
    onOpenChange(false)
  }

  return (
    <Dialog
      title={allowDelete ? 'Delete board' : `Can't delete`}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {allowDelete ? <>
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
      </>
        : <Text>{`That's the only board you have!`}</Text>}
    </Dialog>
  )
}

export default DeleteBoardDialog