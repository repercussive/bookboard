import { singleton } from 'tsyringe'
import { makeAutoObservable } from 'mobx'

@singleton()
export default class UserDataHandler {
  public completedBooksCount = 0

  constructor() {
    makeAutoObservable(this)
  }

  public incrementCompletedBooks = () => {
    this.completedBooksCount += 1
  }
}