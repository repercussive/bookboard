import { singleton } from 'tsyringe'
import { makeAutoObservable } from 'mobx'
import DbHandler from '@/lib/logic/app/DbHandler'

const isBrowser = typeof window !== 'undefined'
const themeIds = ['vanilla', 'moonlight', 'almond', 'laurel', 'coffee', 'berry', 'chalkboard', 'blush', 'fjord', 'juniper', 'blackcurrant', 'milkyway'] as const
const themeProperties = ['bg', 'primary', 'primary-alt', 'shadow', 'board', 'button-alt', 'button-alt-text', 'focus-highlight', 'selection']
const plantIds = ['george', 'frank', 'zoe', 'anita', 'wes', 'leah', 'oliver', 'roman'] as const

export type ThemeId = typeof themeIds[number]
export type PlantId = typeof plantIds[number]

export const unlocks: Array<{ id: ThemeId | PlantId, booksRequired: number }> = [
  { id: 'almond', booksRequired: 1 },
  { id: 'anita', booksRequired: 2 },
  { id: 'laurel', booksRequired: 3 },
  { id: 'coffee', booksRequired: 4 },
  { id: 'wes', booksRequired: 5 },
  { id: 'berry', booksRequired: 6 },
  { id: 'chalkboard', booksRequired: 7 },
  { id: 'zoe', booksRequired: 8 },
  { id: 'blush', booksRequired: 9 },
  { id: 'leah', booksRequired: 10 },
  { id: 'fjord', booksRequired: 11 },
  { id: 'juniper', booksRequired: 12 },
  { id: 'oliver', booksRequired: 13 },
  { id: 'blackcurrant', booksRequired: 14 },
  { id: 'milkyway', booksRequired: 15 },
  { id: 'roman', booksRequired: 16 },
]

export const themesData: Record<ThemeId, { name: string }> = {
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
  milkyway: { name: 'Milky Way' }
}

export const unlockableThemes = unlocks.filter((item) => themeIds.includes(item.id as any))

@singleton()
export default class UserDataHandler {
  public completedBooksCount = 0
  public colorTheme: ThemeId = 'vanilla'
  public plants = { a: 'george' as PlantId, b: 'george' as PlantId }
  public lastSelectedBoardId: string | undefined = undefined

  constructor(private dbHandler: DbHandler) {
    this.loadColorTheme()
    makeAutoObservable(this)
  }

  public incrementCompletedBooks = async () => {
    // 💻
    this.completedBooksCount += 1

    // ☁️
    await this.dbHandler.runWriteOperations(async ({ updateDoc }) => {
      await updateDoc(
        this.dbHandler.userDocRef,
        { completedBooksCount: this.completedBooksCount }
      )
    })
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
    await this.dbHandler.runWriteOperations(async ({ updateDoc }) => {
      await updateDoc(this.dbHandler.userDocRef, {
        colorTheme: this.colorTheme
      })
    })
  }

  public setPlantLocally = (shelf: 'a' | 'b', plant: PlantId) => {
    if (!plantIds.includes(plant)) plant = 'george'
    this.plants[shelf] = plant
  }

  public syncPlants = async () => {
    await this.dbHandler.runWriteOperations(async ({ updateDoc }) => {
      await updateDoc(this.dbHandler.userDocRef, {
        plants: this.plants
      })
    })
  }

  public setLastSelectedBoardId = async (id: string) => {
    await this.dbHandler.runWriteOperations(async ({ updateDoc }) => {
      await updateDoc(this.dbHandler.userDocRef, {
        lastSelectedBoardId: id
      })
    })
  }

  private loadColorTheme = () => {
    if (!isBrowser) return

    if (!!localStorage.getItem('authState')) {
      const storedTheme = localStorage.getItem('colorTheme') as ThemeId | undefined
      if (!storedTheme || !themeIds.includes(storedTheme)) {
        this.setColorThemeLocally('vanilla')
        return
      }
      this.setColorThemeLocally(storedTheme)
    } else {
      this.setColorThemeLocally('vanilla')
    }
  }
}