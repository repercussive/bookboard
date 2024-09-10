import { container } from 'tsyringe'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { maxBooksPerDocument } from '@/logic/app/DbHandler'
import { Book } from '@/logic/app/Board'
import BoardsHandler from '@/logic/app/BoardsHandler'
import AuthHandler from '@/logic/app/AuthHandler'
import Dialog, { CoreDialogProps } from '@/components/modular/Dialog'
import Spacer from '@/components/modular/Spacer'
import SimpleButton from '@/components/modular/SimpleButton'
import Input from '@/components/modular/Input'
import Text from '@/components/modular/Text'

interface Props extends CoreDialogProps {
  triggerElement?: JSX.Element,
  selectedBook?: Book
}

const emptyBookInfo = { title: '', author: '' }

const EditBookInfoDialog = ({ triggerElement, selectedBook, isOpen, onOpenChange }: Props) => {
  const [bookInfo, setBookInfo] = useState<{ title: string, author: string }>(
    selectedBook ? { title: selectedBook.title, author: selectedBook.author } : emptyBookInfo
  )
  const { selectedBoard } = container.resolve(BoardsHandler)
  const { isAuthenticated } = container.resolve(AuthHandler)

  const isNewBook = !selectedBook
  const preventCreation = !isAuthenticated && isNewBook && selectedBoard.totalBooksAdded >= maxBooksPerDocument

  let dialogTitle = selectedBook ? 'Edit book' : (preventCreation ? 'Slow down!' : 'Add book')

  useEffect(() => {
    if (!isOpen) {
      setBookInfo(emptyBookInfo)
    }
  }, [isOpen])

  function handleSaveChanges() {
    if (isNewBook) {
      selectedBoard.addBook(bookInfo)
    } else {
      selectedBoard.editBook(selectedBook, bookInfo)
    }

    onOpenChange(false)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(value) => onOpenChange(value)}
      triggerElement={triggerElement}
      title={dialogTitle}
    >
      {preventCreation ? (
        <Text>Please sign up before adding any more books.</Text>
      ) : <>
        <InputSection bookInfo={bookInfo} setBookInfo={setBookInfo} />
        <Spacer mb="$4" />
        <SimpleButton
          onClick={handleSaveChanges}
          disabled={!bookInfo.title || !bookInfo.author}
        >
          {isNewBook ? 'Add' : 'Save'}
        </SimpleButton>
      </>}
    </Dialog>
  )
}

const InputSection = ({ bookInfo, setBookInfo }: {
  bookInfo: { title: string, author: string },
  setBookInfo: Dispatch<SetStateAction<{ title: string, author: string }>>
}) => {
  function updateBookInfo(newValue: string, property: 'title' | 'author') {
    setBookInfo({
      ...bookInfo,
      [property]: newValue
    })
  }

  return (
    <>
      <label>
        Title
        <Spacer mb="$1" />
        <Input
          value={bookInfo.title}
          onChange={(e) => updateBookInfo(e.target.value, 'title')}
          maxLength={50}
        />
      </label>
      <Spacer mb="$3" />
      <label>
        Author
        <Spacer mb="$1" />
        <Input
          value={bookInfo.author}
          onChange={(e) => updateBookInfo(e.target.value, 'author')}
          maxLength={25}
        />
      </label>
    </>
  )
}

export default EditBookInfoDialog