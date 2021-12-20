import Board from '@/components/pages/home/Board'
import Shelf from '@/components/pages/home/Shelf'
import ShelfButton from '@/components/pages/home/ShelfButton'
import ShelfPlant from '@/components/pages/home/ShelfPlant'
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
        <ShelfButton filled>Books to read</ShelfButton>
        <Spacer ml="auto" />
        <ShelfButton label="Open the boards menu" css={{ px: '$2', mr: '$2', ml: '$1' }}>
          <Icon icon={MenuIcon} css={{ position: 'relative', top: '1px' }} />
        </ShelfButton>
      </Shelf>

      <Spacer mb="$4" />

      <Shelf>
        <ShelfButton filled hoverable={false} label="View books you haven't read yet">Not read</ShelfButton>
        <Spacer ml="$2" />
        <ShelfButton label="View books you have read">Read</ShelfButton>
        <Spacer ml="auto" />
        <Spacer ml="$3" />
        <ShelfPlant flip />
      </Shelf>

      <Spacer mb="$4" bp1={{ mb: '$6' }} />

      <Board />
    </Flex>
  )
}

export default HomePage