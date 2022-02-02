import { singleton } from 'tsyringe'
import { makeAutoObservable, runInAction } from 'mobx'
import DbHandler, { UserDocumentData } from '@/lib/logic/app/DbHandler'
import Board from '@/lib/logic/app/Board'
import Book from '@/lib/logic/app/Book'

type BoardViewMode = 'unread' | 'read'

export const maxBoards = 50

@singleton()
export default class BoardsHandler {
  public selectedBoard: Board
  public allBoards: Board[] = []
  public viewMode: BoardViewMode = 'unread'
  public unloadedBoardIds: string[] = []

  constructor(private dbHandler: DbHandler) {
    const startingBoard = new Board({
      name: 'Books to read'
    })
    this.addBoard(startingBoard)
    this.selectedBoard = startingBoard
    makeAutoObservable(this)
  }

  public setViewMode = (viewMode: BoardViewMode) => {
    this.viewMode = viewMode
  }

  public addBoard = (newBoard: Board) => {
    if (this.allBoards.length >= maxBoards) {
      throw new Error(`Can't add board; maximum boards limit reached.`)
    }
    this.allBoards.push(newBoard)
    this.selectedBoard = newBoard
    return this.selectedBoard
  }

  public deleteBoard = (boardToDelete: Board) => {
    if (this.allBoards.length === 1) throw new Error('Cannot delete only remaining board.')
    const isDeletingSelectedBoard = this.selectedBoard === boardToDelete
    this.allBoards = this.allBoards.filter((board) => board !== boardToDelete)
    if (isDeletingSelectedBoard) {
      this.selectedBoard = this.allBoards[0]
    }
  }

  public setSelectedBoard = async (board: Board) => {
    this.selectedBoard = board
    await this.loadBoardDataFromDb(board.id)
  }

  public registerBoardsMetadata = (metadata: UserDocumentData['boardsMetadata']) => {
    if (!metadata) return

    let tempBoards: Board[] = []

    for (const [id, { name, timeCreated }] of Object.entries(metadata)) {
      tempBoards.push(new Board({ name, id, timeCreated }))
    }

    this.allBoards = tempBoards.sort((a, b) => a.timeCreated - b.timeCreated)
    this.unloadedBoardIds = this.allBoards.map((board) => board.id)
  }

  public getBoardsMetadata = () => {
    let metadata = {} as Exclude<UserDocumentData['boardsMetadata'], undefined>
    for (const board of this.allBoards) {
      const { name, timeCreated } = board
      metadata[board.id] = { name, timeCreated }
    }
    return metadata
  }

  private loadBoardDataFromDb = async (boardId: string) => {
    if (!this.unloadedBoardIds.includes(boardId)) return

    try {
      const { getDocData, boardDocRef } = this.dbHandler
      const boardDocData = await getDocData(boardDocRef(boardId))
      const boardToPopulate = this.allBoards.find((board) => board.id === boardId)!

      const allBooks = await this.getBooksInBoard(boardId)
      const unreadBooks = {} as Board['unreadBooks']
      const readBooks = {} as Board['readBooks']
      for (const book of Object.values(allBooks)) {
        (book.timeCompleted ? readBooks : unreadBooks)[book.id] = book
      }

      // todo: handle incomplete unreadBooksOrder (compare unreadBooks count vs order length)

      runInAction(() => {
        boardToPopulate.unreadBooks = unreadBooks
        boardToPopulate.readBooks = readBooks
        boardToPopulate.totalBooksAdded = boardDocData?.totalBooksAdded ?? 0
        boardToPopulate.unreadBooksOrder = boardDocData?.unreadBooksOrder ?? []
        this.unloadedBoardIds = this.unloadedBoardIds.filter((id) => id !== boardId)
      })
    } catch (err) {
      throw new Error(`Error populating board ${boardId}: ${err}`)
    }
  }

  private getBooksInBoard = async (boardId: string) => {
    const chunkDocs = await this.dbHandler.getBoardChunkDocs(boardId)
    const books = {} as { [bookId: string]: Book }
    for (const chunk of chunkDocs) {
      for (const [id, properties] of Object.entries(chunk.data())) {
        const { title, author, rating, review, timeCompleted } = properties
        books[id] = new Book({ id, title, author, rating, review, timeCompleted })
      }
    }
    return books
  }
}