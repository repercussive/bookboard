import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'
import { memo, ReactNode } from 'react'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import Flex from '@/components/modular/Flex'

interface Props {
  triggerElement: JSX.Element,
  align: 'center' | 'start' | 'end',
  sideOffset?: number,
  alignOffset?: number,
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

const Dropdown = memo(({ triggerElement, align, sideOffset, alignOffset, onOpenChange, children }: Props) => {
  return (
    <RadixDropdownMenu.Root modal={false} onOpenChange={onOpenChange}>
      {(() => triggerElement)()}
      <DropdownContentWrapper align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
        {children}
      </DropdownContentWrapper>
    </RadixDropdownMenu.Root>
  )
})

const DropdownContentWrapper = styled(RadixDropdownMenu.Content, {
  position: 'relative',
  right: '-$1',
  padding: '$1',
  backgroundColor: '$bg',
  border: 'solid 3px $primary',
  borderRadius: '8px',
  boxShadow: 'var(--color-shadow) 0 0 5px 1px !important',
  fontSize: '$body',
  '& > *:not(:last-child)': {
    marginBottom: '$1'
  }
})

const Item = styled(RadixDropdownMenu.Item, {
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
  '& .icon': {
    fontSize: '0.8em',
    '&:not(:last-child)': {
      marginRight: '$3'
    }
  }
})

const Divider = () => {
  return (
    <Flex
      as="span"
      role="presentation"
      css={{
        position: 'relative',
        height: '2px',
        width: '100%',
        my: '0.3rem !important',
        '&::after': {
          ...defaultPseudo,
          bg: '$primary',
          inset: '0 2px'
        }
      }}
    />
  )
}

export default Object.assign(Dropdown, { Item, Divider })