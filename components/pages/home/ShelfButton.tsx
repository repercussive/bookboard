import type { FC } from 'react'
import type { CSS } from '@stitches/react/types/css-util'
import { styled } from '@/styles/stitches.config'

interface Props {
  filled?: boolean,
  hoverable?: boolean,
  css?: CSS
}

const ShelfButton: FC<Props> = ({ filled, hoverable, css, children }) => {
  return (
    <StyledButton css={css} filled={filled} hoverable={hoverable}>
      {children}
    </StyledButton>
  )
}

const StyledButton = styled('button', {
  position: 'relative',
  zIndex: 1,
  px: '$3',
  py: '0.4rem',
  bg: '$bg',
  border: 'solid 3px',
  borderBottom: 'none',
  borderColor: '$primary',
  transform: 'skewX(-15deg)',
  transition: 'background-color 120ms, color 120ms',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  '&::after': {
    position: 'absolute',
    inset: 0,
    top: '-3px',
    right: '-0.78rem',
    content: '""',
    borderRight: 'solid 3px',
    borderRightColor: '$primary',
    transform: 'skewX(30deg)',
  },

  variants: {
    filled: {
      true: {
        bg: '$primary',
        color: '$bg',
      }
    },
    hoverable: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          color: '$bg',
          bg: '$buttonHighlight'
        },
      }
    }
  },

  defaultVariants: {
    hoverable: true
  }
})

export default ShelfButton