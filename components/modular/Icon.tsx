import type { CSS } from '@stitches/react/types/css-util'
import Box from '@/components/modular/Box'

interface Props {
  icon: () => JSX.Element,
  css?: CSS
}

const Icon = ({ icon, css }: Props) => {
  const IconComponent = icon

  return (
    <Box
      css={{ ...css, display: 'inline-flex', transform: 'scale(1.8)' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none">
        <IconComponent />
      </svg>
    </Box>
  )
}

export default Icon