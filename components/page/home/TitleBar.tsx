import { styled } from '@/styles/stitches.config'
import ChangeThemeButton from '@/components/page/home/ChangeThemeButton'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import Icon from '@/components/modular/Icon'
import UserCircleIcon from '@/components/icons/UserCircleIcon'

const TitleBar = () => {
  return (
    <Wrapper align="center">
      <h1>bookboard</h1>
      <Spacer ml="auto" />
      <Icon icon={UserCircleIcon} css={{ fontSize: '1.2em'}} />
      <Spacer ml="$2" />
      <ChangeThemeButton />
    </Wrapper>
  )
}

const Wrapper = styled(Flex, {
  mb: '$2',
  mx: '-$1',
  '@bp1': {
    mt: '$1',
    mb: '$2'
  },
  '@bp2': {
    mt: '$3',
    mb: '$4'
  },
  '@media only screen and (max-width: 275px)': {
    '& h1': {
      fontSize: '1.25rem'
    }
  }
})

export default TitleBar