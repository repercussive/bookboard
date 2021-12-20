import type { CSS } from '@stitches/react/types/css-util'
import * as AccessibleIcon from '@radix-ui/react-accessible-icon'
import Box from '@/components/modular/Box'

interface Props {
  icon: () => JSX.Element,
  label?: string,
  css?: CSS,
}

const Icon = ({ icon, label, css }: Props) => {
  const IconComponent = icon

  return (
    <Box
      as="span"
      css={{ ...css, display: 'inline-flex', transform: 'scale(1.7)' }}
    >
      <AccessibleIcon.Root label={label ?? ''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" role="presentation">
          <IconComponent />
        </svg>
      </AccessibleIcon.Root>
    </Box>
  )
}

export default Icon