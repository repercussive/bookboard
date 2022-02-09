import { singleton } from 'tsyringe'
import { makeAutoObservable, runInAction } from 'mobx'
import { deleteField, writeBatch } from 'firebase/firestore'
import { Book } from '@/lib/logic/app/Board'
import DbHandler, { maxBooksPerDocument, UserDocumentData } from '@/lib/logic/app/DbHandler'
import Board from '@/lib/logic/app/Board'

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
    this.addBoard(startingBoard, { preventSync: true })
    this.selectedBoard = startingBoard
    makeAutoObservable(this)
  }

  public setViewMode = (viewMode: BoardViewMode) => {
    this.viewMode = viewMode
  }

  public addBoard = async (newBoard: Board, options?: { preventSync: boolean }) => {
    if (this.allBoards.length >= maxBoards) {
      throw new Error(`Can't add board; maximum boards limit reached.`)
    }

    // 💻
    this.allBoards.push(newBoard)
    this.selectedBoard = newBoard

    // ☁️
    if (!options?.preventSync) {
      const batch = writeBatch(this.dbHandler.db)
      this.dbHandler.updateDocInBatch(batch, this.dbHandler.userDocRef, {
        boardsMetadata: {
          [newBoard.id]: {
            name: newBoard.name,
            timeCreated: newBoard.timeCreated
          }
        }
      })
      this.dbHandler.updateDocInBatch(batch, this.dbHandler.boardDocRef(newBoard.id), {
        totalBooksAdded: 0,
        unreadBooksOrder: []
      })
      await batch.commit()
    }

    return this.selectedBoard
  }

  public deleteBoard = async (boardToDelete: Board) => {
    if (this.allBoards.length === 1) throw new Error('Cannot delete only remaining board.')

    // 💻
    const isDeletingSelectedBoard = this.selectedBoard === boardToDelete
    this.allBoards = this.allBoards.filter((board) => board !== boardToDelete)
    if (isDeletingSelectedBoard) {
      this.selectedBoard = this.allBoards[0]
    }

    // ☁️
    const batch = writeBatch(this.dbHandler.db)
    const chunks = 1 + Math.floor((boardToDelete.totalBooksAdded - 1) / maxBooksPerDocument)
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      this.dbHandler.deleteDocInBatch(batch, this.dbHandler.boardChunkDocRef({ boardId: boardToDelete.id, chunkIndex }))
    }
    this.dbHandler.deleteDocInBatch(batch, this.dbHandler.boardDocRef(boardToDelete.id))
    this.dbHandler.updateDocInBatch<any>(batch, this.dbHandler.userDocRef, {
      boardsMetadata: {
        [boardToDelete.id]: deleteField()
      }
    })
    await batch.commit()
  }

  public setSelectedBoard = async (board: Board) => {
    this.selectedBoard = board
    await this.loadBoardFromDb(board)
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

  private loadBoardFromDb = async (boardToLoad: Board) => {
    if (!this.unloadedBoardIds.includes(boardToLoad.id)) return

    try {
      const { getDocData, boardDocRef } = this.dbHandler
      const boardDocData = await getDocData(boardDocRef(boardToLoad.id))

      const allBooks = await this.loadBooksInBoardFromDb(boardToLoad.id)
      const unreadBooks = {} as Board['unreadBooks']
      const readBooks = {} as Board['readBooks']
      for (const book of Object.values(allBooks)) {
        (book.timeCompleted ? readBooks : unreadBooks)[book.id] = book
      }

      runInAction(() => {
        boardToLoad.unreadBooks = unreadBooks
        boardToLoad.readBooks = readBooks
        boardToLoad.totalBooksAdded = boardDocData?.totalBooksAdded ?? 0
        boardToLoad.unreadBooksOrder = boardDocData?.unreadBooksOrder ?? []
        this.unloadedBoardIds = this.unloadedBoardIds.filter((id) => id !== boardToLoad.id)
      })

      if (Object.keys(boardToLoad.unreadBooks).length !== boardToLoad.unreadBooksOrder.length) {
        await this.handleIncompleteUnreadBooksOrder(boardToLoad)
      }
    } catch (err) {
      throw new Error(`Error populating board ${boardToLoad.id}: ${err}`)
    }
  }

  private loadBooksInBoardFromDb = async (boardId: string) => {
    const chunkDocs = await this.dbHandler.getBoardChunkDocs(boardId)
    const books = {} as { [bookId: string]: Book }
    for (const chunk of chunkDocs) {
      for (const [id, properties] of Object.entries(chunk.data())) {
        books[id] = { id, ...properties }
      }
    }
    return books
  }

  private handleIncompleteUnreadBooksOrder = async (board: Board) => {
    for (const bookId of Object.keys(board.unreadBooks)) {
      if (!board.unreadBooksOrder.includes(bookId)) {
        board.unreadBooksOrder.unshift(bookId)
      }
    }
    await this.dbHandler.updateDoc(this.dbHandler.boardDocRef(board.id), {
      unreadBooksOrder: board.unreadBooksOrder
    })
  }
}