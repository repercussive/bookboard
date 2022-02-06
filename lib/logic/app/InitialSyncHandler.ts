import { inject, singleton } from 'tsyringe'
import { makeAutoObservable, runInAction } from 'mobx'
import { writeBatch } from 'firebase/firestore'
import { Auth } from 'firebase/auth'
import { BookProperties } from '@/lib/logic/app/Board'
import DbHandler, { UserDocumentData } from '@/lib/logic/app/DbHandler'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import UserDataHandler from '@/lib/logic/app/UserDataHandler'
import deleteUndefinedFields from '@/lib/logic/utils/deleteUndefinedFields'

@singleton()
export default class InitialSyncHandler {
  public isPerformingPostSignupSync = false
  public isSynced = false

  constructor(
    @inject('Auth') private auth: Auth,
    private dbHandler: DbHandler,
    private userDataHandler: UserDataHandler,
    private boardsHandler: BoardsHandler,
  ) {
    makeAutoObservable(this)
  }

  public syncData = async () => {
    if (!this.auth.currentUser) return
    const userData = await this.dbHandler.getDocData(this.dbHandler.userDocRef)
    if (userData) {
      this.handleUserData(userData)
      this.boardsHandler.setSelectedBoard(this.boardsHandler.allBoards[0])
    } else {
      await this.doPostSignupSync()
    }

    runInAction(() => this.isSynced = true)
  }

  private handleUserData(userData: UserDocumentData) {
    const { colorTheme, plants, completedBooksCount } = userData
    this.userDataHandler.setColorThemeLocally(colorTheme ?? 'vanilla')
    this.userDataHandler.setPlantLocally('a', plants?.a ?? 'george')
    this.userDataHandler.setPlantLocally('b', plants?.b ?? 'george')
    this.userDataHandler.completedBooksCount = completedBooksCount ?? 0
    this.boardsHandler.registerBoardsMetadata(userData.boardsMetadata)
  }

  private doPostSignupSync = async () => {
    this.isPerformingPostSignupSync = true

    const batch = writeBatch(this.dbHandler.db)

    const { completedBooksCount, plants, colorTheme } = this.userDataHandler
    batch.set(this.dbHandler.userDocRef, {
      completedBooksCount,
      plants,
      colorTheme,
      boardsMetadata: this.boardsHandler.getBoardsMetadata()
    })

    const boardContents = this.getContentsOfAllBoards()
    for (const boardData of boardContents) {
      const { boardId, totalBooksAdded, unreadBooksOrder, booksDocData } = boardData
      batch.set(this.dbHandler.boardDocRef(boardId), { totalBooksAdded, unreadBooksOrder })
      batch.set(this.dbHandler.boardChunkDocRef({ boardId, chunkIndex: 0 }), booksDocData)
    }

    await batch.commit()
    runInAction(() => this.isPerformingPostSignupSync = false)
  }

  private getContentsOfAllBoards = () => {
    const { allBoards } = this.boardsHandler

    const boardsDocData = [] as Array<{
      boardId: string,
      totalBooksAdded: number,
      unreadBooksOrder: string[],
      booksDocData: { [bookId: string]: BookProperties }
    }>

    for (const board of allBoards) {
      const { id, totalBooksAdded, unreadBooksOrder, unreadBooks, readBooks } = board
      boardsDocData.push({
        boardId: id,
        totalBooksAdded,
        unreadBooksOrder,
        booksDocData: {}
      })

      const allBooks = Object.values({ ...unreadBooks, ...readBooks })
      const { booksDocData } = boardsDocData[boardsDocData.length - 1]

      for (const book of allBooks) {
        const { title, author, chunk, timeCompleted, rating, review } = book
        booksDocData[book.id] = deleteUndefinedFields({ title, author, chunk, timeCompleted, rating, review })
      }
    }

    return boardsDocData
  }
}