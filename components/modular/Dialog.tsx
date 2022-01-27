import { ReactNode } from 'react'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import * as RadixDialog from '@radix-ui/react-dialog'
import Flex from '@/components/modular/Flex'
import Icon from '@/components/modular/Icon'
import Spacer from '@/components/modular/Spacer'
import CrossIcon from '@/components/icons/CrossIcon'

interface Props {
  title: string,
  children: ReactNode
  triggerElement?: JSX.Element
  isOpen?: boolean,
  onOpenChange?: (open: boolean) => void
}

const Dialog = ({ title, triggerElement, isOpen, onOpenChange, children }: Props) => {
  return (
    <RadixDialog.Root
      open={isOpen ?? isOpen}
      onOpenChange={(value) => onOpenChange?.(value)}
    >
      {(() => triggerElement)()}
      <RadixDialog.Portal>
        <Overlay>
          <ContentWrapper>
            <TitleSection text={title} />
            <Spacer mb="$3" />
            {children}
          </ContentWrapper>
        </Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

const TitleSection = ({ text }: { text: string }) => {
  return (
    <Flex align="center">
      <RadixDialog.Title>{text}</RadixDialog.Title>
      <Spacer ml="auto" />
      <CloseButton aria-label="Close dialog">
        <Icon icon={CrossIcon} />
      </CloseButton>
    </Flex>
  )
}

const ContentWrapper = styled(RadixDialog.Content, {
  display: 'flex',
  flexDirection: 'column',
  width: 'min(350px, calc(100vw - 1rem))',
  p: '$4',
  m: '$2',
  bg: '$bg',
  border: 'solid 3px $primary',
  borderRadius: '8px',
  boxShadow: 'var(--color-shadow) 0 0 8px 4px !important',
  '& p': {
    fontSize: '$body'
  }
})

const Overlay = styled(RadixDialog.Overlay, {
  zIndex: 1,
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '12.5vh',
  overflowY: 'auto',
  bg: 'none',
  backdropFilter: 'blur(2px)',
  '&::after': {
    ...defaultPseudo,
    bg: '$bg',
    opacity: 0.8,
    zIndex: -1,
  }
})

const CloseButton = styled(RadixDialog.Close, {
  display: 'grid',
  placeItems: 'center',
  width: '2rem',
  height: '2rem',
  bg: 'none',
  '&:hover': {
    color: '$primaryAlt'
  }
})

export default Dialog