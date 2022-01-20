import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import Icon from '@/components/modular/Icon'

const StarRatingContext = createContext<{
  selectedValue: number,
  onChange: (value: number) => void,
  hoveredValue: number | null,
  setHoveredValue: Dispatch<SetStateAction<number | null>>
}>(null!)

const StarRating = ({ value, onChange }: { value: number, onChange: (value: number) => void }) => {
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

const Star = ({ value }: { value: number }) => {
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
          icon={RatingStarFilled}
          css={{ position: 'absolute', opacity: calculateFillOpacity() }}
        />
        <Icon
          icon={RatingStarOutline}
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
    width: '0%',
    overflow: 'hidden'
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

const RatingStarFilled = () => {
  return (
    <path
      d="M10.307 7.22c.642-1.6.963-2.401 1.485-2.512a1 1 0 0 1 .416 0c.521.11.843.911 1.485 2.512.365.91.547 1.365.889 1.675.096.087.2.164.31.23.395.239.888.283 1.874.371 1.669.15 2.503.224 2.758.7a1 1 0 0 1 .106.316c.085.533-.529 1.09-1.756 2.207l-.34.31c-.574.522-.86.783-1.026 1.108a2 2 0 0 0-.198.623c-.052.362.032.74.2 1.497l.06.27c.301 1.358.452 2.037.264 2.37a1 1 0 0 1-.824.508c-.382.019-.921-.42-2-1.299-.71-.579-1.065-.868-1.459-.981a2 2 0 0 0-1.102 0c-.394.113-.75.402-1.46.981-1.078.878-1.617 1.318-2 1.3a1 1 0 0 1-.823-.509c-.188-.333-.037-1.012.264-2.37l.06-.27c.168-.757.252-1.135.2-1.497a2 2 0 0 0-.198-.623c-.165-.325-.452-.586-1.026-1.108l-.34-.31c-1.227-1.116-1.84-1.674-1.756-2.207a1 1 0 0 1 .106-.316c.255-.476 1.09-.55 2.758-.7.986-.088 1.479-.132 1.873-.37a2 2 0 0 0 .31-.231c.342-.31.525-.765.89-1.675Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
    />
  )
}

const RatingStarOutline = () => {
  return (
    <path
      d="M10.144 6.628c.786-1.961 1.18-2.942 1.856-2.942.676 0 1.07.98 1.856 2.942l.037.09c.444 1.109.666 1.663 1.12 2 .452.336 1.047.39 2.236.496l.214.019c1.946.174 2.92.261 3.127.88.208.62-.514 1.277-1.96 2.591l-.481.44c-.732.665-1.098.997-1.268 1.434a2.002 2.002 0 0 0-.08.249c-.111.455-.004.937.21 1.903l.067.3c.393 1.775.59 2.662.247 3.045a1 1 0 0 1-.481.296c-.496.135-1.2-.439-2.61-1.587-.925-.754-1.388-1.13-1.919-1.215a2.003 2.003 0 0 0-.63 0c-.532.085-.994.462-1.92 1.215-1.408 1.148-2.113 1.722-2.609 1.587a1 1 0 0 1-.48-.296c-.344-.383-.148-1.27.246-3.045l.067-.3c.214-.966.321-1.448.21-1.903a2.002 2.002 0 0 0-.08-.25c-.17-.436-.536-.768-1.268-1.434l-.482-.439c-1.445-1.314-2.168-1.972-1.96-2.59.209-.62 1.182-.707 3.128-.881l.214-.02c1.19-.106 1.784-.159 2.237-.496.452-.336.675-.89 1.12-1.998l.036-.092Z"
      stroke="currentColor"
      strokeWidth={2}
    />
  )
}

export default StarRating