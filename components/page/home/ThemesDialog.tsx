import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { defaultPseudo } from '@/styles/utilStyles'
import { styled } from '@/styles/stitches.config'
import Dialog, { CoreDialogProps as CoreDialogProps } from '@/components/modular/Dialog'
import Flex from '@/components/modular/Flex'
import Icon from '@/components/modular/Icon'
import CheckIcon from '@/components/icons/CheckIcon'

export type ThemeId = 'vanilla' | 'moonlight' | 'almond' | 'laurel' | 'coffee' | 'berry' | 'chalkboard' | 'blush' | 'fjord' | 'juniper' | 'blackcurrant' | 'milkyway'

const themesData: Record<ThemeId, { name: string }> = {
  vanilla: { name: 'Vanilla' },
  moonlight: { name: 'Moonlight' },
  almond: { name: 'Almond' },
  laurel: { name: 'Laurel' },
  coffee: { name: 'Coffee' },
  berry: { name: 'Berry' },
  chalkboard: { name: 'Chalkboard' },
  blush: { name: 'Blush' },
  fjord: { name: 'Fjord' },
  juniper: { name: 'Juniper' },
  blackcurrant: { name: 'Blackcurrant' },
  milkyway: { name: 'Milky Way' },
}

const ThemesDialogContext = createContext<{
  selectedTheme: ThemeId,
  setSelectedTheme: Dispatch<SetStateAction<ThemeId>>
}>(null!)

const ThemesDialog = ({ isOpen, onOpenChange }: CoreDialogProps) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('vanilla')

  useEffect(() => {
    setTheme(selectedTheme)
  }, [selectedTheme])

  return (
    <ThemesDialogContext.Provider value={{ selectedTheme, setSelectedTheme }}>
      <Dialog
        title="Pick a theme"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ThemeItem themeId="vanilla" />
        <ThemeItem themeId="moonlight" />
        <ThemeItem themeId="almond" />
        <ThemeItem themeId="laurel" />
        <ThemeItem themeId="coffee" />
        <ThemeItem themeId="berry" />
        <ThemeItem themeId="chalkboard" />
        <ThemeItem themeId="blush" />
        <ThemeItem themeId="fjord" />
        <ThemeItem themeId="juniper" />
        <ThemeItem themeId="blackcurrant" />
        <ThemeItem themeId="milkyway" />
      </Dialog>
    </ThemesDialogContext.Provider>
  )
}

const ThemeItem = ({ themeId }: { themeId: ThemeId }) => {
  const { selectedTheme, setSelectedTheme } = useContext(ThemesDialogContext)

  return (
    <Flex center css={{ '&:not(:last-of-type)': { mb: '$2' } }}>
      <ThemeLabel>
        {themesData[themeId].name}
        <input
          type="radio"
          name="theme"
          value={themeId}
          className="hidden"
          checked={themeId === selectedTheme}
          onChange={() => setSelectedTheme(themeId)}
        />
        <Flex center as="span">
          {themeId === selectedTheme && <Icon icon={CheckIcon} />}
        </Flex>
      </ThemeLabel>
    </Flex>
  )
}

const themeProperties = ['bg', 'primary', 'primary-alt', 'shadow', 'board', 'button-alt', 'button-alt-text', 'focus-highlight', 'selection']

function setTheme(theme: ThemeId) {
  for (const property of themeProperties) {
    document.documentElement.style.setProperty(`--color-${property}`, `var(--${theme}-color-${property})`)
  }
}

const ThemeLabel = styled('label', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  '& input': {
    '& ~ span': {
      position: 'relative',
      marginLeft: 'auto',
      width: '1.7rem',
      height: '1.7rem',
      color: '$bg',
      border: 'solid 3px $primary',
      borderRadius: '50%',
      fontSize: '0.8em',
      cursor: 'pointer',
      '&::after': {
        ...defaultPseudo,
        bg: '$primary',
        height: '3px',
        top: '2em',
        opacity: 0
      }
    },
    '&:not(:checked):hover ~ span': {
      bg: '$buttonAlt'
    },
    '&:checked ~ span': {
      bg: '$primary'
    },
    '&:focus ~ span': {
      '&::after': {
        opacity: 1
      }
    },
    '&:focus:not(:focus-visible) ~ span': {
      '&::after': {
        opacity: 0
      }
    }
  }
})

export default ThemesDialog