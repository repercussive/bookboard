import { useState } from 'react'
import { styled } from '@stitches/react'
import { defaultPseudo } from '@/styles/utilStyles'
import * as Dialog from '@radix-ui/react-dialog'
import EditBookInfoDialog from '@/components/page/home/EditBookInfoDialog'
import Flex from '@/components/modular/Flex'
import Icon from '@/components/modular/Icon'
import PlusIcon from '@/components/icons/PlusIcon'

const AddBookButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Flex center css={{ position: 'relative', zIndex: 1, transform: 'rotate(2deg)' }}>
      <StickyNote />
      <EditBookInfoDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        triggerElement={(
          <StyledButton aria-label="Add a book to this board">
            <Flex center as="span">
              <Icon
                icon={PlusIcon}
                css={{ position: 'relative', bottom: '0.5px', padding: '0.3em' }}
              />
            </Flex>
          </StyledButton>
        )}
      />
    </Flex>
  )
}

const StyledButton = styled(Dialog.Trigger, {
  padding: '0.35em',
  background: 'none',
  '&::before': { // button background
    ...defaultPseudo,
    zIndex: -1,
    backgroundColor: '$board',
    transition: 'background-color 100ms'
  },
  '&::after': { // covers sticky note flap
    ...defaultPseudo,
    top: 'auto',
    left: 'auto',
    right: '-0.1em',
    bottom: '-0.1em',
    zIndex: -1,
    width: '0.55em',
    height: '0.55em',
    backgroundColor: '$board',
  },
  '&:hover': {
    color: '$buttonAltText',
    '&::before': {
      backgroundColor: '$buttonAlt'
    }
  }
})

const StickyNote = () => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      width="2.2rem"
      style={{ position: 'absolute' }}
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M.4434 2.5402c0-1.0196.8265-1.8461 1.8461-1.8461h20.3077c1.0196 0 1.8462.8265 1.8462 1.8461v16.5972l-5.4178 5.5567H2.2896c-1.0197 0-1.8462-.8266-1.8462-1.8462V2.5403Zm22.1538 0H2.2895V22.848h15.4238v-3.163c0-1.0196.8265-1.8461 1.8461-1.8461h3.0378V2.5403ZM21.3311 19.685h-1.7717v1.8171l1.7717-1.8171Z" fill="currentColor" />
    </svg>
  )
}

export default AddBookButton