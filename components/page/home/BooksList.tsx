import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Book from '@/lib/logic/app/Book'
import BookActionsDropdown from '@/components/page/home/BookActionsDropdown'
import StarRatingPreview from '@/components/page/home/StarRatingPreview'
import Box from '@/components/modular/Box'
import Icon from '@/components/modular/Icon'
import Text from '@/components/modular/Text'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import PlusIcon from '@/components/icons/PlusIcon'

const BooksList = observer(() => {
  const { selectedBoard, viewMode } = container.resolve(BoardsHandler)

  const ids = viewMode === 'read'
    ? selectedBoard.getSortedReadBookIds()
    : selectedBoard.unreadBooksOrder

  const books = viewMode === 'read' ? selectedBoard.readBooks : selectedBoard.unreadBooks

  return (
    <Box>
      {!ids.length ? <NoBooksText />
        : <ul>
          {ids.map((id) => (
            <BookListItem
              book={books[id]}
              showRating={viewMode === 'read'}
              key={id}
            />
          ))}
        </ul>
      }
    </Box>
  )
})

const BookListItem = observer(({ book, showRating }: { book: Book, showRating: boolean }) => {
  return (
    <BookListItemWrapper css={{ marginTop: showRating ? '2.25rem' : 0 }}>
      <Flex as="span" direction="column">
        {showRating && (
          <Box
            as="span"
            role="img"
            aria-label={`${book.rating} stars`}
            css={{ position: 'absolute', top: '-1.1rem', transform: 'translateX(2px)' }}
          >
            <StarRatingPreview value={book.rating ?? 0} />
          </Box>
        )}
        <Text>
          {book.title}
        </Text>
        <Text css={{ opacity: 0.5, mt: '$1' }}>
          {book.author}
        </Text>
      </Flex>
      <Spacer ml="auto" />
      <BookActionsDropdown book={book} />
    </BookListItemWrapper>
  )
})

const NoBooksText = observer(() => {
  const { viewMode } = container.resolve(BoardsHandler)

  return (
    <Box css={{ opacity: 0.8, lineHeight: 1.5 }}>
      <Text>
        You haven't {viewMode === 'read' ? 'finished' : 'read'} any books yet!
      </Text>
      {viewMode === 'unread' && (
        <Text css={{ mt: '$2' }}>
          Press
          <Icon label="The add book button" icon={PlusIcon} css={{ mx: '$2', fontSize: '0.8em' }} />
          above to add one.
        </Text>
      )}
    </Box>
  )
})

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