import { useState } from 'react'
import { styled } from '@/styles/stitches.config'
import Book from '@/lib/logic/app/Book'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import EditBookInfoDialog from '@/components/page/home/EditBookInfoDialog'
import DeleteBookDialog from '@/components/page/home/DeleteBookDialog'
import Icon from '@/components/modular/Icon'
import Flex from '@/components/modular/Flex'
import CheckIcon from '@/components/icons/CheckIcon'
import MenuIcon from '@/components/icons/MenuIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import PencilIcon from '@/components/icons/PencilIcon'

const BookOptionsDropdown = ({ book }: { book: Book }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeDialog, setActiveDialog] = useState<'edit' | 'delete' | 'review' | null>(null)

  return (
    <>
      {activeDialog === 'edit' && (
        <EditBookInfoDialog
          isOpen={activeDialog === 'edit'}
          onOpenChange={(open) => setActiveDialog(open ? 'edit' : null)}
          selectedBook={book}
        />
      )}
      {activeDialog === 'delete' && (
        <DeleteBookDialog
          isOpen={activeDialog === 'delete'}
          selectedBook={book}
          onOpenChange={(open) => setActiveDialog(open ? 'delete' : null)}
        />
      )}

      <DropdownMenu.Root onOpenChange={(value) => setIsDropdownOpen(value)}>

        <DropdownTrigger css={{ '& span': { opacity: isDropdownOpen ? 1 : 0.7 } }}>
          <Flex as="span" center>
            <Icon icon={MenuIcon} />
          </Flex>
        </DropdownTrigger>

        <DropdownContentWrapper align="end" sideOffset={3}>
          <DropdownItem>
            <Icon icon={CheckIcon} />
            Mark as read
          </DropdownItem>
          <DropdownItem onClick={() => setActiveDialog('edit')}>
            <Icon icon={PencilIcon} />
            Edit
          </DropdownItem>
          <DropdownItem onClick={() => setActiveDialog('delete')}>
            <Icon icon={TrashIcon} />
            Delete
          </DropdownItem>
        </DropdownContentWrapper>

      </DropdownMenu.Root>
    </>
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

export default BookOptionsDropdown