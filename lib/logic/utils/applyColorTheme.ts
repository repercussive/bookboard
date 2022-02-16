import { ThemeId } from '@/lib/logic/app/UserDataHandler'

const themeProperties = ['bg', 'primary', 'primary-alt', 'shadow', 'board', 'button-alt', 'button-alt-text', 'focus-highlight', 'selection']

export default function applyColorTheme(theme: ThemeId) {
  for (const property of themeProperties) {
    document.documentElement.style.setProperty(`--color-${property}`, `var(--${theme}-color-${property})`)
  }
}