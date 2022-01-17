import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import Book from '@/lib/logic/app/Book'

interface BoardConstructorOptions {
  name: string
}

export default class Board {
  public id
  public name
  public unreadBooks: { [id: string]: Book } = {}
  public unreadBooksOrder: string[] = []

  constructor(options: BoardConstructorOptions) {
    const { name } = options
    this.name = name
    this.id = nanoid(6)
    makeAutoObservable(this)
  }

  public addBook = (newBook: Book) => {
    this.unreadBooks[newBook.id] = newBook
    this.unreadBooksOrder.unshift(newBook.id)
  }

  public get hasUnreadBooks() {
    return Object.keys(this.unreadBooks).length > 0
  }
}
