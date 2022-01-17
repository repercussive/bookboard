import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import AddBookButton from '@/components/page/home/AddBookButton'
import BooksList from '@/components/page/home/BooksList'

const Board = () => {
  return (
    <Flex center direction="column">
      <Hanger role="presentation" />
      <Wrapper>
        <Flex align="center">
          <Title>Up next</Title>
          <Spacer ml="auto" />
          <AddBookButton />
        </Flex>
        <Spacer mb="$6" />
        <BooksList />
      </Wrapper>
    </Flex>
  )
}

const Wrapper = styled('div', {
  width: 'min(calc(100vw - 1rem), 25rem)',
  maxWidth: '25rem',
  padding: '$4',
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
  border: 'solid 3px $primary',
  '&::before': {
    ...defaultPseudo,
    top: '3px',
    left: '-13.7px',
    width: '3.5px',
    height: '21px',
    backgroundColor: '$primary',
    borderRadius: '3px',
    transform: 'skewX(-45deg)'
  },
  '&::after': {
    ...defaultPseudo,
    top: '3px',
    left: '15.2px',
    width: '3.5px',
    height: '21px',
    backgroundColor: '$primary',
    borderRadius: '3px',
    transform: 'skewX(45deg)'
  }
})

export default Board