import { singleton } from 'tsyringe'
import { makeAutoObservable } from 'mobx'
import DbHandler from '@/lib/logic/app/DbHandler'

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

  constructor(private dbHandler: DbHandler) {
    this.loadColorTheme()
    makeAutoObservable(this)
  }

  public incrementCompletedBooks = () => {
    this.completedBooksCount += 1
  }

  public setColorThemeLocally = async (theme: ThemeId) => {
    if (!themeIds.includes(theme)) theme = 'vanilla'
    this.colorTheme = theme

    if (!isBrowser) return
    localStorage.setItem('colorTheme', theme)
    for (const property of themeProperties) {
      document.documentElement.style.setProperty(`--color-${property}`, `var(--${theme}-color-${property})`)
    }
  }

  public syncColorTheme = async () => {
    await this.dbHandler.updateDoc(this.dbHandler.userDocRef, {
      colorTheme: this.colorTheme
    })
  }

  public setPlantLocally = (shelf: 'a' | 'b', plant: PlantId) => {
    if (!plantIds.includes(plant)) plant = 'george'
    this.plants[shelf] = plant
  }

  public syncPlants = async () => {
    await this.dbHandler.updateDoc(this.dbHandler.userDocRef, {
      plants: this.plants
    })
  }

  private loadColorTheme = () => {
    if (!isBrowser) return

    const storedTheme = localStorage.getItem('colorTheme') as ThemeId | undefined
    if (!storedTheme || !themeIds.includes(storedTheme)) {
      this.setColorThemeLocally('vanilla')
      return
    }
    this.setColorThemeLocally(storedTheme)
  }
}