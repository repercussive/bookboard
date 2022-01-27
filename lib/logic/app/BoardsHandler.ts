import { singleton } from 'tsyringe'
import { makeAutoObservable } from 'mobx'
import Board from '@/lib/logic/app/Board'

type BoardViewMode = 'unread' | 'read'

@singleton()
export default class BoardsHandler {
  public selectedBoard: Board
  public viewMode: BoardViewMode = 'unread'

  constructor() {
    this.selectedBoard = new Board({
      name: 'Books to read'
    })
    makeAutoObservable(this)
  }

  public setViewMode = (viewMode: BoardViewMode) => {
    this.viewMode = viewMode
  }
}