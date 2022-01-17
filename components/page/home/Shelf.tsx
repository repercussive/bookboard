import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import Flex from '@/components/modular/Flex'

const Shelf = styled(Flex, {
  position: 'relative',
  mx: '-$paddingPage',
  px: '0.6rem',
  pb: '2.6px',
  alignItems: 'flex-end !important',
  '&::after': {
    ...defaultPseudo,
    borderBottom: 'solid 3px',
    borderBottomColor: '$primary',  
  },
  '@bp1': {
    px: '$4'
  }
})

export default Shelf