import { container } from 'tsyringe'
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Board from '@/lib/logic/app/Board'
import ShelfButton from '@/components/page/home/ShelfButton'
import EditBoardDialog from '@/components/page/home/EditBoardDialog'
import DeleteBoardDialog from '@/components/page/home/DeleteBoardDialog'
import Icon from '@/components/modular/Icon'
import Dropdown from '@/components/modular/Dropdown'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import TrashIcon from '@/components/icons/TrashIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import MenuIcon from '@/components/icons/MenuIcon'

type BoardAction = 'add' | 'delete' | null

const BoardActionsContext = createContext<{
  activeDialog: BoardAction,
  setActiveDialog: Dispatch<SetStateAction<BoardAction>>,
  boardToDelete: Board | null,
  setBoardToDelete: Dispatch<SetStateAction<Board | null>>
}>(null!)

const BoardActionsDropdown = () => {
  const [activeDialog, setActiveDialog] = useState<BoardAction>(null)
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null)

  return (
    <BoardActionsContext.Provider value={{ activeDialog, setActiveDialog, boardToDelete, setBoardToDelete }}>
      <BoardActionDialog dialogAction="add" />
      <BoardActionDialog dialogAction="delete" />
      <Dropdown
        align="end"
        sideOffset={5}
        alignOffset={-7}
        triggerElement={<DropdownTrigger />}
      >
        <DropdownContent />
      </Dropdown>
    </BoardActionsContext.Provider>
  )
}

const DropdownTrigger = () => {
  return (
    <ShelfButton
      as={DropdownMenu.Trigger}
      label="Boards menu"
      css={{ px: '$2', mr: '0.85rem', ml: '$1' }}
    >
      <Icon icon={MenuIcon} css={{ position: 'relative', top: '1px' }} />
    </ShelfButton>
  )
}

const DropdownContent = () => {
  const { allBoards, setSelectedBoard } = container.resolve(BoardsHandler)
  const { setActiveDialog, setBoardToDelete } = useContext(BoardActionsContext)

  function handlePressDeleteButton(board: Board) {
    setBoardToDelete(board)
    setActiveDialog('delete')
  }

  return (
    <>
      {allBoards.map((board) => (
        <Flex align="stretch" as="span" key={board.id}>
          <Dropdown.Item
            aria-label={`View board ${board.name}`}
            onClick={() => setSelectedBoard(board)}
            css={{ width: '100%' }}
          >
            {board.name}
          </Dropdown.Item>
          <Spacer ml="auto" />
          <Dropdown.Item
            aria-label={`Delete board ${board.name}`}
            onClick={() => handlePressDeleteButton(board)}
          >
            <Icon icon={TrashIcon} />
          </Dropdown.Item>
        </Flex>
      ))}
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => setActiveDialog('add')} aria-label="Create new board">
        <Icon icon={PlusIcon} />
        <span>New board</span>
      </Dropdown.Item>
    </>
  )
}

const BoardActionDialog = ({ dialogAction }: { dialogAction: BoardAction }) => {
  const { activeDialog, setActiveDialog, boardToDelete } = useContext(BoardActionsContext)

  if (dialogAction !== activeDialog) return null

  if (dialogAction === 'add') {
    return (
      <EditBoardDialog
        createNewBoard
        isOpen={true}
        onOpenChange={(open) => setActiveDialog(open ? 'add' : null)}
      />
    )
  } else {
    if (!boardToDelete) return null
    return (
      <DeleteBoardDialog
        boardToDelete={boardToDelete}
        isOpen={true}
        onOpenChange={(open) => setActiveDialog(open ? 'delete' : null)}
      />
    )
  }
}

export default BoardActionsDropdown