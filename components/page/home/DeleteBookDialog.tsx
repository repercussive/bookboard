import { container } from 'tsyringe'
import { useEffect, useState } from 'react'
import Book from '@/lib/logic/app/Book'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Dialog from '@/components/modular/Dialog'
import Text from '@/components/modular/Text'
import SimpleButton from '@/components/modular/SimpleButton'
import Spacer from '@/components/modular/Spacer'

interface Props {
  isOpen: boolean,
  selectedBook: Book,
  onOpenChange: (open: boolean) => void
}

const DeleteBookDialog = ({ isOpen, selectedBook, onOpenChange }: Props) => {
  const [disableDeleteButton, setDisableDeleteButton] = useState(false)
  const { selectedBoard } = container.resolve(BoardsHandler)

  useEffect(() => {
    if (isOpen) {
      setDisableDeleteButton(true)
      new Promise((resolve) => setTimeout(resolve, 550))
        .then(() => setDisableDeleteButton(false))
    }
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
      <Text>Permanently delete {selectedBook.title} from this board?</Text>
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