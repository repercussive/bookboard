import { makeAutoObservable } from 'mobx'
import { container } from 'tsyringe'
import { nanoid } from 'nanoid'
import Book from '@/lib/logic/app/Book'
import UserDataHandler from '@/lib/logic/app/UserDataHandler'

interface BoardConstructorOptions {
  name: string
}

export default class Board {
  public id
  public name
  public unreadBooks: { [id: string]: Book } = {}
  public unreadBooksOrder: string[] = []
  public readBooks: { [id: string]: Book } = {}
  private userDataHandler

  constructor(options: BoardConstructorOptions) {
    const { name } = options
    this.name = name
    this.id = nanoid(6)
    this.userDataHandler = container.resolve(UserDataHandler)
    makeAutoObservable(this)
  }

  public renameBoard = (newName: string) => {
    this.name = newName
  }

  public addBook = (newBook: Book) => {
    this.unreadBooks[newBook.id] = newBook
    this.unreadBooksOrder.unshift(newBook.id)
  }

  public deleteBook = (book: Book) => {
    this.removeUnreadBook(book)
    this.removeReadBook(book)
  }

  public markBookAsRead = (book: Book) => {
    book.dateCompleted = new Date()
    this.removeUnreadBook(book)
    this.readBooks[book.id] = book
    this.userDataHandler.incrementCompletedBooks()
  }

  public getSortedReadBookIds = () => {
    return Object.values(this.readBooks)
      .sort((a, b) => (b.dateCompleted?.valueOf() ?? 0) - (a.dateCompleted?.valueOf() ?? 0))
      .map((book) => book.id)
  }

  public updateUnreadBooksOrder = (newOrder: string[]) => {
    this.unreadBooksOrder = newOrder
  }

  private removeUnreadBook = (book: Book) => {
    delete this.unreadBooks[book.id]
    this.unreadBooksOrder = this.unreadBooksOrder.filter((id) => id !== book.id)
  }

  private removeReadBook = (book: Book) => {
    delete this.readBooks[book.id]
  }

  public get hasUnreadBooks() {
    return Object.keys(this.unreadBooks).length > 0
  }
}
