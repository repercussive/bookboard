import { container } from 'tsyringe'
import { useEffect, useState } from 'react'
import { BookActionDialogProps } from '@/components/page/home/BookActionsDropdown'
import BoardsHandler from '@/logic/app/BoardsHandler'
import Dialog from '@/components/modular/Dialog'
import Text from '@/components/modular/Text'
import SimpleButton from '@/components/modular/SimpleButton'
import Spacer from '@/components/modular/Spacer'

let enableDeleteButtonTimeout = undefined as ReturnType<typeof setTimeout> | undefined

const DeleteBookDialog = ({ isOpen, selectedBook, onOpenChange }: BookActionDialogProps) => {
  const [disableDeleteButton, setDisableDeleteButton] = useState(false)
  const { selectedBoard } = container.resolve(BoardsHandler)

  useEffect(() => {
    if (isOpen) {
      setDisableDeleteButton(true)
      enableDeleteButtonTimeout = setTimeout(() => {
        setDisableDeleteButton(false)
      }, 550)
    }
    return () => clearTimeout(enableDeleteButtonTimeout as unknown as number)
  }, [isOpen])

  function handleDeleteBook() {
    selectedBoard.deleteBook(selectedBook)
    onOpenChange(false)
  }

  return (
    <Dialog
      title={'Delete book'}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Text>
        Permanently delete <span style={{ fontWeight: 900 }}>{selectedBook.title}</span> from this board?
      </Text>
      <Spacer mb="$3" />
      <SimpleButton
        onClick={handleDeleteBook}
        disabled={disableDeleteButton}
      >
        Delete
      </SimpleButton>
    </Dialog>
  )
}

export default DeleteBookDialog