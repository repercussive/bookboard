import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import BoardsHandler from '@/logic/app/BoardsHandler'
import AddBookButton from '@/components/page/home/AddBookButton'
import SortBooksDropdown from '@/components/page/home/SortBooksDropdown'
import BooksList from '@/components/page/home/BooksList'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import Text from '@/components/modular/Text'

const Board = observer(() => {
  const { viewMode, selectedBoard, unloadedBoardIds } = container.resolve(BoardsHandler)

  const isLoading = unloadedBoardIds.includes(selectedBoard.id)

  return (
    <Flex center direction="column" css={{ zIndex: 1 }}>
      <Hanger role="presentation" />
      <Wrapper>
        <Flex align="center" css={{ minHeight: '2.4rem' }}>
          <Title>{viewMode === 'unread' ? 'Up next' : `Books you've read`}</Title>
          <Spacer ml="auto" />
          {(viewMode === 'unread' && !isLoading) && <AddBookButton />}
          {(viewMode === 'read' && !isLoading) && <SortBooksDropdown board={selectedBoard} />}
        </Flex>
        <Spacer mb="$3" />
        {isLoading ? <LoadingText /> : <BooksList />}
      </Wrapper>
    </Flex>
  )
})

const LoadingText = () => {
  return (
    <Text css={{ animation: 'pulse infinite 1.2s' }}>
      Loading books...
    </Text>
  )
}

const Wrapper = styled('div', {
  width: 'min(calc(100vw - 1rem), 25rem)',
  maxWidth: '25rem',
  padding: '$4',
  paddingTop: '$3',
  border: 'solid 3px $primary',
  borderRadius: '8px',
  bg: '$board',
})

const Title = styled('h2', {
  fontSize: '1.35rem'
})

const Hanger = styled('div', {
  position: 'relative',
  minWidth: '11px',
  minHeight: '11px',
  marginBottom: '15px',
  borderRadius: '50%',
  backgroundColor: '$bg',
  border: 'solid 3px $primary',
  '&::before': {
    ...defaultPseudo,
    top: '0',
    left: '-13px',
    width: '2.5px',
    height: '30px',
    backgroundColor: '$primary',
    transform: 'rotate(45deg)',
    zIndex: -1,
  },
  '&::after': {
    ...defaultPseudo,
    top: '0',
    left: '15.6px',
    width: '2.5px',
    height: '30px',
    backgroundColor: '$primary',
    transform: 'rotate(-45deg)',
    zIndex: -1
  }
})

export default Board