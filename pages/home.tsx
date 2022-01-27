import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Board from '@/components/page/home/Board'
import Shelf from '@/components/page/home/Shelf'
import BoardActionsDropdown from '@/components/page/home/BoardActionsDropdown'
import ShelfButton from '@/components/page/home/ShelfButton'
import ShelfPlant from '@/components/page/home/ShelfPlant'
import BoardNameButton from '@/components/page/home/BoardNameButton'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import TitleBar from '@/components/modular/TitleBar'
import Head from 'next/head'

const HomePage = () => {
  return (
    <Flex direction="column" css={{ maxWidth: '650px', m: 'auto' }}>
      <Head><title>Bookboard</title></Head>

      <TitleBar />

      <Shelf>
        <Spacer ml="-$1" />
        <ShelfPlant />
        <Spacer ml="$2" />
        <BoardNameButton />
        <Spacer ml="auto" />
        <BoardActionsDropdown />
      </Shelf>

      <Spacer mb="$4" />

      <Shelf>
        <BoardViewModeSection />
        <Spacer ml="auto" />
        <Spacer ml="$3" />
        <ShelfPlant flip />
        <Spacer ml="-$1" />
      </Shelf>

      <Spacer mb="$4" bp1={{ mb: '$6' }} />

      <Board />
    </Flex>
  )
}

const BoardViewModeSection = observer(() => {
  const { viewMode, setViewMode } = container.resolve(BoardsHandler)

  return (
    <>
      <ShelfButton
        onClick={() => setViewMode('unread')}
        filled={viewMode === 'unread'}
        hoverable={viewMode !== 'unread'}
        label="View unread books"
      >
        Unread
      </ShelfButton>
      <Spacer ml="$2" />
      <ShelfButton
        onClick={() => setViewMode('read')}
        filled={viewMode === 'read'}
        hoverable={viewMode !== 'read'}
        label="View books you have read"
      >
        Read
      </ShelfButton>
    </>
  )
})

export default HomePage