import { singleton } from 'tsyringe'
import { makeAutoObservable } from 'mobx'

const isBrowser = typeof window !== 'undefined'
const themeIds = ['vanilla', 'moonlight', 'almond', 'laurel', 'coffee', 'berry', 'chalkboard', 'blush', 'fjord', 'juniper', 'blackcurrant', 'milkyway'] as const
const themeProperties = ['bg', 'primary', 'primary-alt', 'shadow', 'board', 'button-alt', 'button-alt-text', 'focus-highlight', 'selection']
const plantIds = ['george', 'frank', 'zoe', 'anita', 'wes', 'leah', 'oliver', 'roman'] as const

export type ThemeId = typeof themeIds[number]
export type PlantId = typeof plantIds[number]

@singleton()
export default class UserDataHandler {
  public completedBooksCount = 0
  public colorTheme: ThemeId = 'vanilla'
  public plants = { a: 'george' as PlantId, b: 'george' as PlantId }

  constructor() {
    this.loadColorTheme()
    makeAutoObservable(this)
  }

  public incrementCompletedBooks = () => {
    this.completedBooksCount += 1
  }

  public setColorTheme = (theme: ThemeId) => {
    if (!isBrowser) return

    this.colorTheme = theme
    localStorage.setItem('colorTheme', theme)

    for (const property of themeProperties) {
      document.documentElement.style.setProperty(`--color-${property}`, `var(--${theme}-color-${property})`)
    }
  }

  public setPlant = (shelf: 'a' | 'b', plant: PlantId) => {
    this.plants[shelf] = plant
  }

  private loadColorTheme = () => {
    if (!isBrowser) return

    const storedTheme = localStorage.getItem('colorTheme') as ThemeId | undefined
    if (!storedTheme || !themeIds.includes(storedTheme)) {
      return
    }
    this.setColorTheme(storedTheme)
  }
}