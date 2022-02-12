import Flex from '@/components/modular/Flex'
import Text from '@/components/modular/Text'

const LoadingScreen = () => {
  return (
    <Flex align="center" justify="center" css={{ position: 'fixed', inset: 0, height: '90vh' }}>
      <Text css={{ fontSize: '1rem', opacity: 0, animation: 'fade-in forwards 300ms 250ms' }}>
        Loading...
      </Text>
    </Flex>
  )
}

export default LoadingScreen