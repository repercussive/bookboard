import { singleton } from 'tsyringe'
import { makeAutoObservable } from 'mobx'
import Board from '@/lib/logic/app/Board'

@singleton()
export default class BoardsHandler {
  public selectedBoard: Board

  constructor() {
    this.selectedBoard = new Board({
      name: 'Test board'
    })
    makeAutoObservable(this)
  }
}