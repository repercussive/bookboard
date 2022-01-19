import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { styled } from '@/styles/stitches.config'
import Book from '@/lib/logic/app/Book'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import EditBookInfoDialog from '@/components/page/home/EditBookInfoDialog'
import DeleteBookDialog from '@/components/page/home/DeleteBookDialog'
import ReviewBookDialog from '@/components/page/home/ReviewBookDialog'
import Icon from '@/components/modular/Icon'
import Flex from '@/components/modular/Flex'
import CheckIcon from '@/components/icons/CheckIcon'
import MenuIcon from '@/components/icons/MenuIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import PencilIcon from '@/components/icons/PencilIcon'

export interface BookActionDialogProps {
  selectedBook: Book,
  isOpen: boolean,
  onOpenChange: (open: boolean) => void
}

type BookAction = 'review' | 'edit' | 'delete'

const BookActionsContext = createContext<{
  book: Book,
  activeDialog: BookAction | null,
  setActiveDialog: Dispatch<SetStateAction<BookAction | null>>
}>(null!)

const BookActionsDropdown = ({ book }: { book: Book }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeDialog, setActiveDialog] = useState<BookAction | null>(null)

  return (
    <BookActionsContext.Provider value={{ book, activeDialog, setActiveDialog }}>
      <BookActionDialog dialogAction="review" />
      <BookActionDialog dialogAction="edit" />
      <BookActionDialog dialogAction="delete" />
      <DropdownMenu.Root onOpenChange={(value) => setIsDropdownOpen(value)}>
        <DropdownTrigger css={{ '& span': { opacity: isDropdownOpen ? 1 : 0.7 } }}>
          <Flex as="span" center>
            <Icon icon={MenuIcon} />
          </Flex>
        </DropdownTrigger>
        <DropdownContent />
      </DropdownMenu.Root>
    </BookActionsContext.Provider>
  )
}

const DropdownContent = () => {
  const { setActiveDialog } = useContext(BookActionsContext)

  return (
    <DropdownContentWrapper align="end" sideOffset={3}>
      <DropdownItem onClick={() => setActiveDialog('review')}>
        <Icon icon={CheckIcon} />
        Mark as read
      </DropdownItem>
      <DropdownItem onClick={() => setActiveDialog('edit')}>
        <Icon icon={PencilIcon} />
        Edit info
      </DropdownItem>
      <DropdownItem onClick={() => setActiveDialog('delete')}>
        <Icon icon={TrashIcon} />
        Delete
      </DropdownItem>
    </DropdownContentWrapper >
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

const DropdownTrigger = styled(DropdownMenu.Trigger, {
  background: 'none',
  width: '1.6rem',
  height: '1.6rem',
  '&:hover span': {
    opacity: 1
  }
})

const DropdownContentWrapper = styled(DropdownMenu.Content, {
  position: 'relative',
  right: '-$1',
  padding: '$1',
  backgroundColor: '$bg',
  border: 'solid 3px $primary',
  borderRadius: '8px',
  boxShadow: 'var(--color-shadow) 0 0 5px 1px !important',
  fontSize: '$body'
})

const DropdownItem = styled(DropdownMenu.Item, {
  display: 'flex',
  alignItems: 'center',
  borderRadius: '4px',
  padding: '$2 $3',
  userSelect: 'none',
  cursor: 'pointer',
  '&:focus': {
    boxShadow: 'none !important',
    color: '$bg',
    backgroundColor: '$primary !important'
  },
  '& span': {
    marginRight: '$3',
    fontSize: '0.8em'
  },
  '&:not(:last-of-type)': {
    marginBottom: '$1'
  }
})

export default BookActionsDropdown