import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import { BookRating } from '@/lib/logic/app/Book'
import Icon from '@/components/modular/Icon'
import StarOutlineIcon from '@/components/icons/StarOutlineIcon'
import StarFillIcon from '@/components/icons/StarFillIcon'

const StarRatingContext = createContext<{
  selectedValue: BookRating,
  onChange: (value: BookRating) => void,
  hoveredValue: number | null,
  setHoveredValue: Dispatch<SetStateAction<number | null>>
}>(null!)

const StarRating = ({ value, onChange }: { value: BookRating, onChange: (value: BookRating) => void }) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  return (
    <StarRatingContext.Provider value={{ selectedValue: value, onChange, hoveredValue, setHoveredValue }}>
      <Wrapper>
        <legend>Rating</legend>
        <Star value={1} />
        <Star value={2} />
        <Star value={3} />
        <Star value={4} />
        <Star value={5} />
      </Wrapper>
    </StarRatingContext.Provider>
  )
}

const Star = ({ value }: { value: BookRating }) => {
  const { selectedValue, onChange, hoveredValue, setHoveredValue } = useContext(StarRatingContext)

  function handleSelect() {
    onChange(value)
  }

  function handleHoverStart() {
    setHoveredValue(value)
  }

  function handleHoverEnd() {
    setHoveredValue(null)
  }

  function calculateFillOpacity() {
    const max = hoveredValue ?? selectedValue
    return value <= max ? 1 : 0
  }

  function calculateOutlineOpacity() {
    const max = hoveredValue ?? selectedValue
    return value <= max ? 1 : 0.5
  }

  return (
    <>
      <input
        value={value}
        id={`star${value}`}
        defaultChecked={value === selectedValue}
        type="radio"
        name="rating"
        className="hidden"
        onChange={handleSelect}
      />
      <label htmlFor={`star${value}`} onMouseOver={handleHoverStart} onMouseLeave={handleHoverEnd}>
        <span className="hidden">{value} Star{value === 1 ? '' : 's'}</span>
        <Icon
          icon={StarFillIcon}
          css={{ position: 'absolute', opacity: calculateFillOpacity() }}
        />
        <Icon
          icon={StarOutlineIcon}
          css={{ pointerEvents: 'none', opacity: calculateOutlineOpacity() }}
        />
      </label>
    </>
  )
}

const Wrapper = styled('fieldset', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: 'none',
  '.hidden': {
    position: 'absolute',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    width: '1px',
    overflow: 'hidden',
    margin: '-1px',
    padding: 0,
    border: 0
  },
  'input:focus + label': {
    position: 'relative',
    '&::after': {
      ...defaultPseudo,
      bottom: '-10px',
      borderBottom: 'solid 3px $primary'
    }
  },
  'input:focus:not(:focus-visible) + label': {
    '&::after': {
      borderBottom: 'none'
    }
  },
  '& legend': {
    marginBottom: '$4'
  },
  'label': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.4rem',
    cursor: 'pointer',
    '&:not(:last-of-type)': {
      marginRight: '$4'
    }
  }
})

export default StarRating