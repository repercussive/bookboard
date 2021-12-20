import { styled } from '@/styles/stitches.config'
import Flex from '@/components/modular/Flex'

const Shelf = styled(Flex, {
  position: 'relative',
  mx: 'calc($paddingPage * -2)',
  px: '0.6rem',
  pb: '2.6px',
  alignItems: 'flex-end !important',
  '&::after': {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    content: '""',
    borderBottom: 'solid 3px',
    borderBottomColor: '$primary',  
  },
  '@bp1': {
    mx: '0',
    px: '$4'
  }
})

export default Shelf