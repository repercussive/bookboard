import { createContext, FC, useContext } from 'react'
import { styled } from '@/styles/stitches.config'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Board, { BookSortMode } from '@/lib/logic/app/Board'
import Dropdown from '@/components/modular/Dropdown'
import Flex from '@/components/modular/Flex'
import Icon from '@/components/modular/Icon'
import SortIcon from '@/components/icons/SortIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import Spacer from '@/components/modular/Spacer'

const SortBooksDropdownContext = createContext<{ board: Board }>(null!)

const SortBooksDropdown = ({ board }: { board: Board }) => {
  return (
    <SortBooksDropdownContext.Provider value={{ board }}>
      <Dropdown
        align="end"
        sideOffset={1}
        triggerElement={<DropdownTrigger />}
      >
        <SortOption sortMode="newest-first">
          Most recent first
        </SortOption>
        <SortOption sortMode="oldest-first">
          Oldest first
        </SortOption>
        <SortOption sortMode="highest-rated-first">
          Highest rated first
        </SortOption>
        <SortOption sortMode="lowest-rated-first">
          Lowest rated first
        </SortOption>
      </Dropdown>
    </SortBooksDropdownContext.Provider>
  )
}

const SortOption: FC<{ sortMode: BookSortMode }> = ({ children, sortMode }) => {
  const { board } = useContext(SortBooksDropdownContext)

  return (
    <Dropdown.Item onClick={() => board.setReadBooksSortMode(sortMode)} css={{ minWidth: '14rem' }}>
      {children}
      {(sortMode === board.readBooksSortMode) && <>
        <Spacer ml="auto" />
        <Icon icon={CheckIcon} />
      </>}
    </Dropdown.Item>
  )
}

const DropdownTrigger = () => {
  return (
    <DropdownButton aria-label="Sort mode">
      <Flex as="span" center>
        <Icon icon={SortIcon} />
      </Flex>
    </DropdownButton>
  )
}

const DropdownButton = styled(DropdownMenu.Trigger, {
  bg: 'none',
  padding: '$3'
})

export default SortBooksDropdown