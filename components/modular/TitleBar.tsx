import { styled } from '@/styles/stitches.config'
import ChangeThemeButton from '@/components/page/home/ChangeThemeButton'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'

const TitleBar = () => {
  return (
    <Wrapper align="center">
      <h1>bookboard</h1>
      <Spacer ml="auto" />
      <ChangeThemeButton />
    </Wrapper>
  )
}

const Wrapper = styled(Flex, {
  mt: '$1',
  mb: '$4',
  '@bp1': {
    mt: '$2',
    mb: '$6'
  },
  '@bp2': {
    mt: '$6',
    mb: '$8'
  }
})

export default TitleBar