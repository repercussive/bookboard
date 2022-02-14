import type { ScaleValue, PropertyValue } from '@stitches/react'
import { createStitches } from '@stitches/react'

export type SpaceValue = ScaleValue<'space'> | string

export const { styled, css, theme, getCssText } = createStitches({
  theme: {
    colors: {
      bg: 'var(--color-bg)',
      primary: 'var(--color-primary)',
      primaryAlt: 'var(--color-primary-alt)',
      board: 'var(--color-board)',
      buttonAlt: 'var(--color-button-alt)',
      buttonAltText: 'var(--color-button-alt-text)'
    },
    space: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      paddingPage: 'var(--padding-page)'
    },
    fontSizes: {
      body: '0.9rem'
    }
  },
  media: {
    bp1: '(min-width: 500px)',
    bp2: '(min-width: 1000px)',
  },
  utils: {
    m: (value: SpaceValue) => ({
      margin: value
    }),
    mt: (value: SpaceValue) => ({
      marginTop: value
    }),
    mr: (value: SpaceValue) => ({
      marginRight: value
    }),
    mb: (value: SpaceValue) => ({
      marginBottom: value
    }),
    ml: (value: SpaceValue) => ({
      marginLeft: value
    }),
    my: (value: SpaceValue) => ({
      marginTop: value,
      marginBottom: value
    }),
    mx: (value: SpaceValue) => ({
      marginLeft: value,
      marginRight: value
    }),
    p: (value: SpaceValue) => ({
      padding: value
    }),
    pt: (value: SpaceValue) => ({
      paddingTop: value
    }),
    pr: (value: SpaceValue) => ({
      paddingRight: value
    }),
    pb: (value: SpaceValue) => ({
      paddingBottom: value
    }),
    pl: (value: SpaceValue) => ({
      paddingLeft: value
    }),
    py: (value: SpaceValue) => ({
      paddingTop: value,
      paddingBottom: value
    }),
    px: (value: SpaceValue) => ({
      paddingLeft: value,
      paddingRight: value
    }),
    bg: (value: PropertyValue<'background'>) => ({
      background: value
    })
  },
})
