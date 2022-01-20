import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Board from '@/components/page/home/Board'
import Shelf from '@/components/page/home/Shelf'
import ShelfButton from '@/components/page/home/ShelfButton'
import ShelfPlant from '@/components/page/home/ShelfPlant'
import BoardNameButton from '@/components/page/home/BoardNameButton'
import Flex from '@/components/modular/Flex'
import Icon from '@/components/modular/Icon'
import Spacer from '@/components/modular/Spacer'
import TitleBar from '@/components/modular/TitleBar'
import MenuIcon from '@/components/icons/MenuIcon'
import Head from 'next/head'

const HomePage = () => {
  return (
    <Flex direction="column" css={{ maxWidth: '650px', m: 'auto' }}>
      <Head><title>Bookboard</title></Head>

      <TitleBar />

      <Shelf>
        <ShelfPlant />
        <Spacer ml="$3" />
        <BoardNameButton />
        <Spacer ml="auto" />
        <ShelfButton label="Open the boards menu" css={{ px: '$2', mr: '0.85rem', ml: '$1' }}>
          <Icon icon={MenuIcon} css={{ position: 'relative', top: '1px' }} />
        </ShelfButton>
      </Shelf>

      <Spacer mb="$4" />

      <Shelf>
        <BoardViewModeSection />
        <Spacer ml="auto" />
        <Spacer ml="$3" />
        <ShelfPlant flip />
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