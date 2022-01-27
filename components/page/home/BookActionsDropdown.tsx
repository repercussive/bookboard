import { container } from 'tsyringe'
import { createContext, Dispatch, memo, SetStateAction, useContext, useState } from 'react'
import { styled } from '@/styles/stitches.config'
import { CoreDialogProps } from '@/components/modular/Dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Book from '@/lib/logic/app/Book'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import EditBookInfoDialog from '@/components/page/home/EditBookInfoDialog'
import DeleteBookDialog from '@/components/page/home/DeleteBookDialog'
import ReviewBookDialog from '@/components/page/home/ReviewBookDialog'
import Dropdown from '@/components/modular/Dropdown'
import Icon from '@/components/modular/Icon'
import Flex from '@/components/modular/Flex'
import CheckIcon from '@/components/icons/CheckIcon'
import MenuIcon from '@/components/icons/MenuIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import PencilIcon from '@/components/icons/PencilIcon'
import StarOutlineIcon from '@/components/icons/StarOutlineIcon'

export interface BookActionDialogProps extends CoreDialogProps {
  selectedBook: Book
}

type BookAction = 'review' | 'edit' | 'delete'

const BookActionsContext = createContext<{
  book: Book,
  activeDialog: BookAction | null,
  setActiveDialog: Dispatch<SetStateAction<BookAction | null>>
}>(null!)

const BookActionsDropdown = memo(({ book }: { book: Book }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeDialog, setActiveDialog] = useState<BookAction | null>(null)

  return (
    <BookActionsContext.Provider value={{ book, activeDialog, setActiveDialog }}>
      <BookActionDialog dialogAction="review" />
      <BookActionDialog dialogAction="edit" />
      <BookActionDialog dialogAction="delete" />
      <Dropdown
        onOpenChange={setShowDropdown}
        align="end"
        sideOffset={3}
        triggerElement={<DropdownTrigger highlight={showDropdown} />}
      >
        <DropdownContent />
      </Dropdown>
    </BookActionsContext.Provider>
  )
})

const DropdownTrigger = ({ highlight }: { highlight: boolean }) => {
  return (
    <DropdownButton aria-label="Book actions" open={highlight}>
      <Flex as="span" center>
        <Icon icon={MenuIcon} />
      </Flex>
    </DropdownButton>
  )
}

const DropdownContent = () => {
  const { viewMode } = container.resolve(BoardsHandler)
  const { setActiveDialog } = useContext(BookActionsContext)

  return (
    <>
      <Dropdown.Item onClick={() => setActiveDialog('review')}>
        <Icon icon={viewMode === 'read' ? StarOutlineIcon : CheckIcon} />
        <span>{viewMode === 'read' ? 'View thoughts' : 'Mark as read'}</span>
      </Dropdown.Item>
      <Dropdown.Item onClick={() => setActiveDialog('edit')}>
        <Icon icon={PencilIcon} />
        <span>Edit info</span>
      </Dropdown.Item>
      <Dropdown.Item onClick={() => setActiveDialog('delete')}>
        <Icon icon={TrashIcon} />
        <span>Delete</span>
      </Dropdown.Item>
    </>
  )
}

const bookActionsDialogsMap: Record<BookAction, (props: BookActionDialogProps) => JSX.Element> = {
  review: ReviewBookDialog,
  edit: EditBookInfoDialog,
  delete: DeleteBookDialog
}

const BookActionDialog = ({ dialogAction }: { dialogAction: BookAction }) => {
  const { book, activeDialog, setActiveDialog } = useContext(BookActionsContext)

  if (dialogAction !== activeDialog) return null

  const Component = bookActionsDialogsMap[dialogAction]

  return (
    <Component
      isOpen={dialogAction === activeDialog}
      onOpenChange={(open) => setActiveDialog(open ? dialogAction : null)}
      selectedBook={book}
    />
  )
}

const DropdownButton = styled(DropdownMenu.Trigger, {
  background: 'none',
  width: '1.6rem',
  height: '1.6rem',
  '&:hover span': {
    opacity: 1
  },
  variants: {
    open: {
      true: {
        '& span': {
          opacity: '1 !important'
        }
      },
      false: {
        '& span': {
          opacity: 0.7
        }
      }
    }
  }
})

export default BookActionsDropdown