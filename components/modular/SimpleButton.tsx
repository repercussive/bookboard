import { styled } from '@/styles/stitches.config'

const SimpleButton = styled('button', {
  bg: '$primary',
  color: '$bg',
  padding: '$2',
  borderRadius: '4px',
  '&:hover': {
    bg: '$primaryDark',
  }
})

export default SimpleButton