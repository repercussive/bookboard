import { container } from 'tsyringe'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { styled } from '@/styles/stitches.config'
import Book, { BookConstructorOptions } from '@/lib/logic/app/Book'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import * as Dialog from '@radix-ui/react-dialog'
import Flex from '@/components/modular/Flex'
import Icon from '@/components/modular/Icon'
import Spacer from '@/components/modular/Spacer'
import CrossIcon from '@/components/icons/CrossIcon'

const emptyBookInfo = { title: '', author: '' }

const AddBookDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [bookInfo, setBookInfo] = useState<BookConstructorOptions>(emptyBookInfo)
  const { selectedBoard } = container.resolve(BoardsHandler)

  useEffect(() => {
    if (!isOpen) {
      setBookInfo(emptyBookInfo)
    }
  }, [isOpen])

  function handleAddBook() {
    selectedBoard.addBook(new Book({ ...bookInfo }))
    onClose()
  }

  return (
    <Dialog.Portal>
      <Overlay>
        <ContentWrapper>
          <TitleSection />
          <Spacer mb="$3" />
          <InputSection bookInfo={bookInfo} setBookInfo={setBookInfo} />
          <Spacer mb="$4" />
          <AddButton
            onClick={handleAddBook}
            disabled={!bookInfo.title || !bookInfo.author}
          >
            Add
          </AddButton>
        </ContentWrapper>
      </Overlay>
    </Dialog.Portal>
  )
}

const TitleSection = () => {
  return (
    <Flex align="center">
      <Dialog.Title>Add book</Dialog.Title>
      <Spacer ml="auto" />
      <CloseButton>
        <Icon icon={CrossIcon} />
      </CloseButton>
    </Flex>
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

const ContentWrapper = styled(Dialog.Content, {
  display: 'flex',
  flexDirection: 'column',
  width: 'min(350px, calc(100vw - 1rem))',
  p: '$4',
  m: '$2',
  bg: '$bg',
  border: 'solid 3px $primary',
  borderRadius: '8px',
  boxShadow: 'var(--color-shadow) 0 0 8px 4px !important',
  '& p': {
    fontSize: '$body'
  }
})

const Overlay = styled(Dialog.Overlay, {
  bg: 'rgba(0, 0, 0, 0.45)',
  zIndex: 1,
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '12.5vh',
  overflowY: 'auto'
})

const BookInfoInput = styled('input', {
  width: '100%',
  border: 'solid 2px $primary',
  borderRadius: '4px',
  bg: 'none'
})

const AddButton = styled('button', {
  bg: '$primary',
  color: '$bg',
  padding: '$2',
  borderRadius: '4px',
  '&:hover': {
    bg: '$primaryDark',
  }
})

const CloseButton = styled(Dialog.Close, {
  display: 'grid',
  placeItems: 'center',
  width: '2rem',
  height: '2rem',
  bg: 'none',
  '&:hover': {
    color: '$primaryDark'
  }
})

export default AddBookDialog