import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { defaultPseudo } from '@/styles/utilStyles'
import { styled } from '@/styles/stitches.config'
import UserDataHandler, { ThemeId, themesData, unlocks } from '@/lib/logic/app/UserDataHandler'
import Dialog, { CoreDialogProps as CoreDialogProps } from '@/components/modular/Dialog'
import Flex from '@/components/modular/Flex'
import Icon from '@/components/modular/Icon'
import CheckIcon from '@/components/icons/CheckIcon'
import Text from '@/components/modular/Text'
import LockIcon from '@/components/icons/LockIcon'

const ThemesDialog = ({ isOpen, onOpenChange }: CoreDialogProps) => {
  return (
    <Dialog
      title="Pick a theme"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ThemeItem themeId="vanilla" />
      <ThemeItem themeId="moonlight" />
      <ThemeItem themeId="almond" />
      <ThemeItem themeId="fern" />
      <ThemeItem themeId="coffee" />
      <ThemeItem themeId="berry" />
      <ThemeItem themeId="chalkboard" />
      <ThemeItem themeId="blush" />
      <ThemeItem themeId="fjord" />
      <ThemeItem themeId="juniper" />
      <ThemeItem themeId="blackcurrant" />
      <ThemeItem themeId="milkyway" />
    </Dialog>
  )
}

const ThemeItem = observer(({ themeId }: { themeId: ThemeId }) => {
  const { colorTheme, setColorThemeLocally } = container.resolve(UserDataHandler)
  const { completedBooksCount } = container.resolve(UserDataHandler)

  const unlockInfo = unlocks.find((item) => item.id === themeId)
  const isUnlocked = completedBooksCount >= (unlockInfo?.booksRequired ?? 0)

  return (
    <Flex center css={{ '&:not(:last-of-type)': { mb: '$2' } }}>
      {isUnlocked ? (
        <ThemeLabel>
          {themesData[themeId].name}
          <input
            type="radio"
            name="theme"
            value={themeId}
            className="hidden"
            checked={themeId === colorTheme}
            onChange={() => setColorThemeLocally(themeId)}
          />
          <Flex center as="span">
            {themeId === colorTheme && <Icon icon={CheckIcon} />}
          </Flex>
        </ThemeLabel>
      ) : <LockedTheme themeId={themeId} />}
    </Flex>
  )
})

const LockedTheme = ({ themeId }: { themeId: ThemeId }) => {
  return (
    <Flex center css={{ width: '100%', opacity: 0.3 }}>
      <Text css={{ mr: 'auto', fontSize: '1rem !important' }}>
        {themesData[themeId].name}
      </Text>
      <Flex center as="span" css={{ width: '1.7rem', height: '1.7rem' }}>
        <Icon icon={LockIcon} css={{ fontSize: '0.9em' }} />
      </Flex>
    </Flex>
  )
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