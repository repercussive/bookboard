import Box from '@/components/modular/Box'
import Icon from '@/components/modular/Icon'
import Text from '@/components/modular/Text'
import PlusIcon from '@/components/icons/PlusIcon'

const BooksList = () => {
  return (
    <Box>
      <NoBooksText />
    </Box>
  )
}

const NoBooksText = () => {
  return (
    <Box css={{ opacity: 0.8, lineHeight: 1.5 }}>
      <Text css={{ mb: '$2' }}>You haven't added any books yet!</Text>
      <Text>
        Press
        <Icon label="The add book button" icon={PlusIcon} css={{ mx: '$2', fontSize: '0.8em' }} />
        above to add one.
      </Text>
    </Box>
  )
}

export default BooksList