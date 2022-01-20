import Flex from '@/components/modular/Flex'
import Icon from '@/components/modular/Icon'
import StarFillIcon from '@/components/icons/StarFillIcon'
import StarOutlineIcon from '@/components/icons/StarOutlineIcon'

const shellArray = Array.from({ length: 5 })

const StarRatingPreview = ({ value }: { value: number }) => {
  return (
    <Flex align="center" as="span">
      {shellArray.map((_, index) => (
        <Icon
          icon={index < value ? StarFillIcon : StarOutlineIcon}
          css={{
            fontSize: '10px',
            opacity: index < value ? 1 : 0.4,
            '&:not(:last-of-type)': {
              marginRight: '7px'
            }
          }}
          key={index}
        />
      ))}
    </Flex>
  )
}

export default StarRatingPreview