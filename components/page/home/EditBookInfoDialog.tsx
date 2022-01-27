import { container } from 'tsyringe'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Book, { BookConstructorOptions } from '@/lib/logic/app/Book'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Dialog, { CoreDialogProps } from '@/components/modular/Dialog'
import Spacer from '@/components/modular/Spacer'
import SimpleButton from '@/components/modular/SimpleButton'
import Input from '@/components/modular/Input'

interface Props extends CoreDialogProps {
  triggerElement?: JSX.Element,
  selectedBook?: Book
}

const emptyBookInfo = { title: '', author: '' }

const EditBookInfoDialog = ({ triggerElement, selectedBook, isOpen, onOpenChange }: Props) => {
  const [bookInfo, setBookInfo] = useState<BookConstructorOptions>(selectedBook ? { ...selectedBook } : emptyBookInfo)
  const { selectedBoard } = container.resolve(BoardsHandler)

  useEffect(() => {
    if (!isOpen) {
      setBookInfo(emptyBookInfo)
    }
  }, [isOpen])

  function handleSaveChanges() {
    if (selectedBook) {
      selectedBook.updateInfo({ ...bookInfo })
    } else {
      selectedBoard.addBook(new Book({ ...bookInfo }))
    }

    onOpenChange(false)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(value) => onOpenChange(value)}
      triggerElement={triggerElement}
      title={selectedBook ? 'Edit book' : 'Add book'}
    >
      <InputSection bookInfo={bookInfo} setBookInfo={setBookInfo} />
      <Spacer mb="$4" />
      <SimpleButton
        onClick={handleSaveChanges}
        disabled={!bookInfo.title || !bookInfo.author}
      >
        {selectedBook ? 'Save' : 'Add'}
      </SimpleButton>
    </Dialog>
  )
}

const InputSection = ({ bookInfo, setBookInfo }: {
  bookInfo: BookConstructorOptions,
  setBookInfo: Dispatch<SetStateAction<BookConstructorOptions>>
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
        />
      </label>
      <Spacer mb="$3" />
      <label>
        Author
        <Spacer mb="$1" />
        <Input
          value={bookInfo.author}
          onChange={(e) => updateBookInfo(e.target.value, 'author')}
        />
      </label>
    </>
  )
}

export default EditBookInfoDialog