import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import AuthHandler from '@/lib/logic/app/AuthHandler'
import Flex from '@/components/modular/Flex'
import SimpleButton from '@/components/modular/SimpleButton'
import Text from '@/components/modular/Text'

const SignUpPrompt = observer(() => {
  const { signIn, isAuthenticated } = container.resolve(AuthHandler)

  if (isAuthenticated) return null

  return (
    <Wrapper center>
      <Text>
        <SignUpButton onClick={signIn}>Sign up</SignUpButton>to save data
      </Text>
    </Wrapper>
  )
})

const Wrapper = styled(Flex, {
  position: 'relative',
  zIndex: 1,
  mt: 'calc(var(--padding-page) * -1)',
  mb: '$2',
  mx: '-$2',
  py: '0.4rem',
  color: '$bg',
  userSelect: 'none',
  '&::before': {
    ...defaultPseudo,
    position: 'fixed',
    zIndex: -1,
    height: '2.65rem',
    bg: '$primary'
  }
})

const SignUpButton = styled(SimpleButton, {
  mr: '$2',
  py: '0.4rem',
  bg: '$bg !important',
  color: '$primary !important',
  '&:hover': {
    opacity: 0.9
  }
})

export default SignUpPrompt