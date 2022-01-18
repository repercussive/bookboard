import { container } from 'tsyringe'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { styled } from '@/styles/stitches.config'
import Book, { BookConstructorOptions } from '@/lib/logic/app/Book'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Dialog from '@/components/modular/Dialog'
import Spacer from '@/components/modular/Spacer'

interface Props {
  triggerElement?: JSX.Element
  selectedBook?: Book,
  isOpen: boolean,
  onOpenChange: (open: boolean) => void
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
      <SaveChangesButton
        onClick={handleSaveChanges}
        disabled={!bookInfo.title || !bookInfo.author}
      >
        {selectedBook ? 'Save' : 'Add'}
      </SaveChangesButton>
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
        <BookInfoInput
          value={bookInfo.title}
          onChange={(e) => updateBookInfo(e.target.value, 'title')}
        />
      </label>
      <Spacer mb="$3" />
      <label>
        Author
        <Spacer mb="$1" />
        <BookInfoInput
          value={bookInfo.author}
          onChange={(e) => updateBookInfo(e.target.value, 'author')}
        />
      </label>
    </>
  )
}

const BookInfoInput = styled('input', {
  width: '100%',
  border: 'solid 3px $primary',
  borderRadius: '4px',
  bg: 'none'
})

const SaveChangesButton = styled('button', {
  bg: '$primary',
  color: '$bg',
  padding: '$2',
  borderRadius: '4px',
  '&:hover': {
    bg: '$primaryDark',
  }
})

export default EditBookInfoDialog