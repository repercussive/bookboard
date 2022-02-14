import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { styled } from '@/styles/stitches.config'
import AuthHandler from '@/lib/logic/app/AuthHandler'
import useWaitForUserData from '@/lib/hooks/useWaitForUserData'
import LandingIllustration from '@/components/page/index/LandingIllustration'
import Flex from '@/components/modular/Flex'
import Icon from '@/components/modular/Icon'
import SimpleButton from '@/components/modular/SimpleButton'
import UserDropdown from '@/components/modular/UserDropdown'
import Spacer from '@/components/modular/Spacer'
import Text from '@/components/modular/Text'
import LoadingScreen from '@/components/modular/LoadingScreen'
import BookIcon from '@/components/icons/BookIcon'
import CloudIcon from '@/components/icons/CloudIcon'
import HeartIcon from '@/components/icons/HeartIcon'
import StarOutlineIcon from '@/components/icons/StarOutlineIcon'
import Head from 'next/head'
import Link from 'next/link'

const LandingPage = observer(() => {
  const { isAuthenticated } = container.resolve(AuthHandler)
  const { isWaiting } = useWaitForUserData()
  const router = useRouter()

  if (isAuthenticated) {
    router.push('/home')
  }

  if (isWaiting) return <LoadingScreen />

  return (
    <LandingWrapper>
      <Head><title>Bookboard</title></Head>

      <MainSectionWrapper>
        <TitleSection />
        <MobileIllustrationWrapper><LandingIllustration /></MobileIllustrationWrapper>
        <MainContentSpacer />

        <MainContentWrapper direction="column">
          <h2>The helpful little book tracker.</h2>
          <Divider />
          <Spacer mb="$2" />
          <FeatureList />
          <Link href="/home" passHref>
            <GetStartedButton>Get started</GetStartedButton>
          </Link>
          <Spacer mb="$4" />
          <Text css={{ textAlign: 'center' }}>No sign-up required to try it out.</Text>
        </MainContentWrapper>

        <MainContentSpacer />
      </MainSectionWrapper>

      <FullIllustrationWrapper><LandingIllustration /></FullIllustrationWrapper>
    </LandingWrapper>
  )
})

const TitleSection = () => {
  const { signIn } = container.resolve(AuthHandler)

  return (
    <Flex align="center" css={{ width: '100%', zIndex: 1 }}>
      <h1>bookboard</h1>
      <Spacer ml="auto" />
      <SignInButton onClick={signIn}>Sign in</SignInButton>
      <UserDropdownWrapper>
        <UserDropdown />
      </UserDropdownWrapper>
    </Flex>
  )
}

const FeatureList = () => {
  return (
    <ul>
      <FeatureListItem css={{ animationDelay: '400ms' }}>
        <Icon icon={BookIcon} /> Organize your to-read list
      </FeatureListItem>
      <FeatureListItem css={{ animationDelay: '500ms' }}>
        <Icon icon={StarOutlineIcon} /> Log books you've completed
      </FeatureListItem>
      <FeatureListItem css={{ animationDelay: '600ms' }}>
        <Icon icon={HeartIcon} /> Read to earn plants & themes
      </FeatureListItem>
      <FeatureListItem css={{ animationDelay: '700ms' }}>
        <Icon icon={CloudIcon} /> Sync across devices for free
      </FeatureListItem>
    </ul>
  )
}

const LandingWrapper = styled(Flex, {
  minHeight: '100vh',
  margin: 'calc(var(--padding-page) * -1)',
  '--color-focus-highlight': 'var(--vanilla-color-primary)',
  '--color-focus-outer-ring': 'var(--vanilla-color-bg)'
})

const MainSectionWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  flexGrow: '1',
  padding: '$4',
  bg: 'var(--vanilla-color-bg)',
  color: 'var(--vanilla-color-primary)',
  'h1, h2': {
    fontWeight: 'normal'
  },
  'h2': {
    maxWidth: '800px',
    fontSize: 'min(3rem, 8vw)',
    textAlign: 'center',
    opacity: 0,
    animation: 'fade-in forwards 400ms 50ms'
  },
  '::selection': {
    bg: 'var(--vanilla-color-button-alt)',
    opacity: 0.2
  },
  '@media screen and (min-width: 870px)': {
    padding: '$8',
    maxWidth: '64vw',
    bg: 'var(--vanilla-color-primary)',
    color: 'var(--vanilla-color-bg)',
    'h2': {
      paddingRight: '1rem',
      marginTop: 'auto',
      fontSize: '4rem',
      textAlign: 'left'
    }
  }
})

const MainContentWrapper = styled(Flex, {
  bg: 'var(--vanilla-color-primary)',
  margin: 'calc(var(--padding-page) * -1)',
  padding: '$8 var(--padding-page)',
  color: 'var(--vanilla-color-bg)',
  flexGrow: 1,
  '@media screen and (min-width: 870px)': {
    flexGrow: 0,
  }
})

const MainContentSpacer = styled('div', {
  '@media screen and (min-width: 870px)': {
    mb: 'auto'
  }
})

const FeatureListItem = styled('li', {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '2rem',
  listStyle: 'none',
  fontSize: '1rem',
  opacity: 0,
  animation: 'fade-in forwards 400ms',
  '&:not(:last-of-type)': {
    marginBottom: '$6'
  },
  'span': {
    fontSize: '0.8em',
    marginLeft: '$1',
    marginRight: '$6'
  },
  '@media screen and (min-width: 870px)': {
    fontSize: '1.25rem',
    marginBottom: '3rem'
  }
})

const GetStartedButton = styled(SimpleButton, {
  padding: '$3 $7',
  bg: 'var(--vanilla-color-bg) !important',
  color: 'var(--vanilla-color-primary) !important',
  fontSize: '1.5rem',
  borderRadius: '8px',
  '&:hover': {
    opacity: 0.9
  }
})

const SignInButton = styled(SimpleButton, {
  '--color-focus-outer-ring': 'var(--vanilla-color-primary)',
  '--color-focus-highlight': 'var(--vanilla-color-bg)',
  padding: '$2 $3',
  fontSize: '1rem',
  '@media screen and (max-width: 330px)': {
    display: 'none'
  },
  '@media screen and (min-width: 870px)': {
    '--color-focus-outer-ring': 'inherit',
    '--color-focus-highlight': 'inherit',
    bg: 'var(--vanilla-color-bg) !important',
    color: 'var(--vanilla-color-primary) !important',
    '&:hover': {
      opacity: 0.9
    },
  }
})

const UserDropdownWrapper = styled('div', {
  '@media screen and (min-width: 330px)': {
    display: 'none'
  }
})

const MobileIllustrationWrapper = styled('div', {
  position: 'relative',
  top: 'calc(-60px)',
  width: 'min(85vw, 270px)',
  marginBottom: '-$2',
  alignSelf: 'center',
  '.lightbulb': {
    display: 'none'
  },
  '@media screen and (min-width: 870px)': {
    display: 'none'
  }
})

const FullIllustrationWrapper = styled('div', {
  display: 'none',
  bg: 'var(--vanilla-color-bg)',
  'svg': {
    position: 'relative',
    top: '-5px',
    left: 'calc(min(4vw, 80px) * -1)',
    height: '85vh',
    width: '100%',
    pointerEvents: 'none'
  },
  '@media screen and (min-width: 870px)': {
    display: 'block'
  },
  '.lightbulb': {
    transform: 'translateY(30px)',
    '@media screen and (min-width: 1550px)': {
      transform: 'none'
    }
  }
})

const Divider = styled('div', {
  width: '100%',
  margin: '$5 0',
  height: '4px',
  bg: 'var(--vanilla-color-bg)',
  borderRadius: '99px',
  '@media screen and (min-width: 500px)': {
    margin: '$8 0',
    height: '5px'
  }
})

export default LandingPage