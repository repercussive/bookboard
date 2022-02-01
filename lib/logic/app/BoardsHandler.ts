import { singleton } from 'tsyringe'
import { makeAutoObservable } from 'mobx'
import Board from '@/lib/logic/app/Board'

type BoardViewMode = 'unread' | 'read'

export const maxBoards = 50

@singleton()
export default class BoardsHandler {
  public selectedBoard: Board
  public allBoards: Board[] = []
  public viewMode: BoardViewMode = 'unread'

  constructor() {
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

  public setSelectedBoard = (board: Board) => {
    this.selectedBoard = board
  }

  public getBoardsMetadata = () => {
    let metadata = {} as { [boardId: string]: { name: string, dateCreated: Date } }
    for (const board of this.allBoards) {
      const { name, dateCreated } = board
      metadata[board.id] = { name, dateCreated }
    }
    return metadata
  }
}