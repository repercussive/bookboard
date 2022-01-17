import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Book from '@/lib/logic/app/Book'
import BookOptionsDropdown from '@/components/page/home/BookOptionsDropdown'
import Box from '@/components/modular/Box'
import Icon from '@/components/modular/Icon'
import Text from '@/components/modular/Text'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import PlusIcon from '@/components/icons/PlusIcon'

const BooksList = observer(() => {
  const { selectedBoard } = container.resolve(BoardsHandler)

  return (
    <Box>
      {!selectedBoard.hasUnreadBooks ? <NoBooksText />
        : <ul>
          {selectedBoard.unreadBooksOrder.map((id) => (
            <BookListItem
              book={selectedBoard.unreadBooks[id]}
              key={id}
            />
          ))}
        </ul>
      }
    </Box>
  )
})

const BookListItem = observer(({ book }: { book: Book }) => {
  return (
    <BookListItemWrapper>
      <Flex as="span" direction="column">
        <Text as="span">
          {book.title}
        </Text>
        <Text as="span" css={{ opacity: 0.5, mt: '$1' }}>
          {book.author}
        </Text>
      </Flex>
      <Spacer ml="auto" />
      <BookOptionsDropdown book={book} />
    </BookListItemWrapper>
  )
})

const NoBooksText = () => {
  return (
    <Box css={{ opacity: 0.8, lineHeight: 1.5 }}>
      <Text css={{ mb: '$2' }}>You haven't added any books yet!</Text>
      <Text>
        Press
        <Icon label="The add book button" icon={PlusIcon} css={{ mx: '$2', fontSize: '0.8em' }} />
        above to add one.
      </Text>
    </Box>
  )
}

const BookListItemWrapper = styled('li', {
  display: 'flex',
  position: 'relative',
  paddingLeft: '$4',
  '&:not(:last-of-type)': {
    marginBottom: '$4'
  },
  '&:before': {
    ...defaultPseudo,
    top: '18%',
    width: '4px',
    height: '4px',
    background: '$primary',
    borderRadius: '50%',
    opacity: 0.5
  }
})

export default BooksList