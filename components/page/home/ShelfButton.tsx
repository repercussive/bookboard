import type { CSS } from '@stitches/react/types/css-util'
import { FC, useRef } from 'react'
import { styled } from '@/styles/stitches.config'
import useElementDimensions from '@/hooks/useElementDimensions'

interface Props {
  onClick?: () => void,
  filled?: boolean,
  hoverable?: boolean,
  label?: string
  css?: CSS,
  as?: any,
}

const ShelfButton: FC<Props> = ({ onClick, filled, hoverable, label, css, as, children }) => {
  const buttonRef = useRef<HTMLButtonElement>(null!)
  const dimensions = useElementDimensions(buttonRef, [children])

  return (
    <StyledButton
      ref={buttonRef}
      onClick={onClick}
      filled={filled}
      hoverable={hoverable}
      aria-label={label}
      as={as}
      css={{
        ...css,
        '&::after': {
          right: `-${0.295 * dimensions.height + 2.8}px`,
          overflow: 'hidden'
        }
      }}
    >
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
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  '&::after': {
    position: 'absolute',
    inset: 0,
    top: '-2.52px',
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
        '&:hover': {
          color: '$buttonAltText',
          bg: '$buttonAlt'
        },
      },
      false: {
        cursor: 'default'
      }
    }
  },

  defaultVariants: {
    hoverable: true
  }
})

export default ShelfButton