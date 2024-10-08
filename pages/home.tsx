import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import BoardsHandler from '@/logic/app/BoardsHandler'
import DbHandler from '@/logic/app/DbHandler'
import UserDataHandler from '@/logic/app/UserDataHandler'
import useWaitForUserData from '@/hooks/useWaitForUserData'
import useWarnUnsavedChanges from '@/hooks/useWarnUnsavedChanges'
import useHasSignedOut from '@/hooks/useHasSignedOut'
import Board from '@/components/page/home/Board'
import Shelf from '@/components/page/home/Shelf'
import SignUpPrompt from '@/components/page/home/SignUpPrompt'
import TitleBar from '@/components/page/home/TitleBar'
import BoardActionsDropdown from '@/components/page/home/BoardActionsDropdown'
import ShelfButton from '@/components/page/home/ShelfButton'
import ShelfPlant from '@/components/page/home/ShelfPlant'
import BoardNameButton from '@/components/page/home/BoardNameButton'
import NewUnlockDialog from '@/components/page/home/NewUnlockDialog'
import PostSignupSyncDialog from '@/components/page/home/PostSignupSyncDialog'
import LoadingScreen from '@/components/modular/LoadingScreen'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import dynamic from 'next/dynamic'

const HomePage = observer(() => {
  const { isWriteComplete } = container.resolve(DbHandler)
  const { isWaiting } = useWaitForUserData()
  const { hasSignedOut } = useHasSignedOut()
  useWarnUnsavedChanges(!isWriteComplete)

  useEffect(() => {
    const { setColorThemeLocally, colorTheme } = container.resolve(UserDataHandler)
    setColorThemeLocally(colorTheme)
  }, [])

  if (isWaiting || hasSignedOut) return <LoadingScreen />

  return (
    <Wrapper direction="column">
      <PostSignupSyncDialog />
      <NewUnlockDialog />

      <SignUpPrompt />
      <TitleBar />

      <Shelf>
        <Spacer ml="-$2" />
        <ShelfPlant shelfId="a" />
        <Spacer ml="$2" />
        <BoardNameButton />
        <Spacer ml="auto" />
        <BoardActionsDropdown />
      </Shelf>

      <Spacer mb="$2" bp1={{ mb: '$4' }} />

      <Shelf>
        <BoardViewModeSection />
        <Spacer ml="auto" />
        <Spacer ml="$3" />
        <ShelfPlant shelfId="b" flip />
        <Spacer ml="-$2" />
      </Shelf>

      <Spacer mb="$4" bp1={{ mb: '$6' }} />

      <Board />
    </Wrapper>
  )
})

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

const Wrapper = styled(Flex, {
  maxWidth: '650px',
  margin: 'auto',
  '&::after': {
    ...defaultPseudo,
    position: 'fixed',
    zIndex: 1,
    bg: '$bg',
    opacity: 0,
    animation: 'fade-in reverse 180ms linear'
  }
})

export default dynamic(Promise.resolve(HomePage), { ssr: false })