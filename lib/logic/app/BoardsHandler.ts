import { singleton } from 'tsyringe'
import { makeAutoObservable } from 'mobx'
import Board from '@/lib/logic/app/Board'

type BoardViewMode = 'unread' | 'read'

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
    this.allBoards.push(newBoard)
    this.selectedBoard = newBoard
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
}