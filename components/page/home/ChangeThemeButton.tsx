import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import UserDataHandler from '@/logic/app/UserDataHandler'
import ThemesDialog from '@/components/page/home/ThemesDialog'

const ChangeThemeButton = observer(() => {
  const { syncColorTheme, colorTheme } = container.resolve(UserDataHandler)
  const [showDialog, setShowDialog] = useState(false)
  const [themeOnDialogOpen, setThemeOnDialogOpen] = useState(colorTheme)

  function handleClickThemeButton() {
    setThemeOnDialogOpen(colorTheme)
    setShowDialog(true)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open && colorTheme !== themeOnDialogOpen) {
      syncColorTheme()
    }
    setShowDialog(open)
  }

  return (
    <>
      <ThemesDialog isOpen={showDialog} onOpenChange={handleDialogOpenChange} />
      <LightbulbButton aria-label="Change theme" onClick={handleClickThemeButton}>
        <LightbulbSvg />
      </LightbulbButton>
    </>
  )
})

const LightbulbSvg = () => {
  return (
    <svg
      width="2.5rem"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.975 18.056c.03.628.31 2.077 1.185 2.855.874.777 2.044 1.032 2.52 1.063"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="m17.399 4.485.447-.895-.447.895Zm-4.798 0-.447-.895.447.895Zm-.286.458-1-.021 1 .02Zm5.37 0-1 .02 1-.02Zm2.137 6.652.6-.8-.6.8Zm-.992-1.184.924-.382-.924.382Zm-8.652 1.184.6.8-.6-.8Zm.992-1.184-.924-.382.924.382Zm-3.216 7.625a7.034 7.034 0 0 1 2.824-5.641l-1.2-1.6a9.034 9.034 0 0 0-3.624 7.24h2ZM15 25.082a7.046 7.046 0 0 1-7.046-7.046h-2A9.046 9.046 0 0 0 15 27.082v-2Zm7.046-7.046A7.046 7.046 0 0 1 15 25.082v2a9.046 9.046 0 0 0 9.046-9.046h-2Zm-2.824-5.641a7.034 7.034 0 0 1 2.824 5.64h2a9.033 9.033 0 0 0-3.624-7.24l-1.2 1.6Zm-2.537-7.431a16.148 16.148 0 0 0 1.22 5.83l1.85-.765a14.149 14.149 0 0 1-1.07-5.107l-2 .042Zm-3.637.415a4.364 4.364 0 0 1 3.904 0l.894-1.789a6.364 6.364 0 0 0-5.692 0l.894 1.79Zm-.954 5.414a16.148 16.148 0 0 0 1.22-5.83l-1.999-.041a14.149 14.149 0 0 1-1.07 5.107l1.85.764Zm.06-7.203a1.523 1.523 0 0 0-.839 1.332l2 .042a.477.477 0 0 1-.267.415l-.894-1.789Zm6.531 1.332a1.523 1.523 0 0 0-.839-1.332l-.894 1.79a.477.477 0 0 1-.266-.416l1.999-.042Zm1.737 5.873c-.2-.15-.325-.244-.415-.318-.09-.074-.098-.09-.084-.072l-1.58 1.225c.214.278.554.521.88.765l1.2-1.6Zm-2.516-.002c.11.268.225.566.436.837l1.58-1.225s-.009-.01-.033-.062a6.837 6.837 0 0 1-.135-.314l-1.848.764Zm-7.128 1.602c.325-.244.665-.487.88-.765l-1.58-1.225c.013-.018.006-.002-.085.072-.09.074-.215.168-.415.318l1.2 1.6Zm-.532-2.366c-.068.165-.104.25-.135.314-.024.052-.033.061-.034.062l1.58 1.225c.212-.271.326-.569.437-.837l-1.848-.764Zm1.764.472c1.095-.733 2.07-1.05 2.99-1.05s1.895.317 2.99 1.05l1.112-1.663c-1.333-.891-2.69-1.386-4.102-1.386s-2.769.495-4.102 1.386l1.112 1.663Z"
        fill="currentColor"
      />
    </svg>
  )
}

const LightbulbButton = styled('button', {
  position: 'relative',
  height: '2.5rem',
  mb: '3px',
  mr: '-$1',
  bg: 'none',
  transition: 'transform 100ms',
  '&::before': {
    ...defaultPseudo,
    height: '50px',
    transform: 'translateY(-45px)',
    left: 'calc(50% - 1.5px)',
    bottom: '2.2rem',
    width: '3px',
    bg: '$primary',
  },
  '&:hover': {
    transform: 'translateY(5px)'
  }
})

export default ChangeThemeButton