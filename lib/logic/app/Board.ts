import { makeAutoObservable } from 'mobx'
import { container } from 'tsyringe'
import { nanoid } from 'nanoid'
import { arrayRemove, deleteField, writeBatch } from 'firebase/firestore'
import DbHandler, { maxBooksPerDocument } from '@/lib/logic/app/DbHandler'
import UserDataHandler from '@/lib/logic/app/UserDataHandler'
import deleteUndefinedFields from '@/lib/logic/utils/deleteUndefinedFields'
import exclude from '@/lib/logic/utils/exclude'

interface BoardConstructorOptions {
  name: string,
  id?: string,
  timeCreated?: number,
}

export type BookProperties = {
  title: string
  author: string
  chunk: number
  rating?: number
  review?: string
  timeCompleted?: number
}

export type Book = BookProperties & { id: string }

export type EditableBookProperties = Pick<Book, 'title' | 'author' | 'rating' | 'review'>

export default class Board {
  public id
  public name
  public timeCreated
  public unreadBooks: { [id: string]: Book } = {}
  public unreadBooksOrder: string[] = []
  public readBooks: { [id: string]: Book } = {}
  public totalBooksAdded = 0
  private userDataHandler
  private dbHandler

  constructor(options: BoardConstructorOptions) {
    const { name, id, timeCreated } = options
    this.name = name
    this.id = id ?? nanoid(6)
    this.timeCreated = timeCreated ?? Date.now()
    this.userDataHandler = container.resolve(UserDataHandler)
    this.dbHandler = container.resolve(DbHandler)
    makeAutoObservable(this)
  }

  public renameBoard = async (newName: string) => {
    // 💻
    this.name = newName

    // ☁️
    await this.dbHandler.updateDoc(this.dbHandler.userDocRef, {
      boardsMetadata: { [this.id]: { name: newName } }
    })
  }

  public addBook = async ({ title, author }: { title: string, author: string }) => {
    // 💻
    const newBook: Book = {
      id: nanoid(8),
      title,
      author,
      chunk: Math.floor(this.totalBooksAdded / maxBooksPerDocument),
    }
    this.unreadBooks[newBook.id] = newBook
    this.unreadBooksOrder.unshift(newBook.id)
    this.totalBooksAdded += 1

    // ☁️
    const bookProperties: BookProperties = exclude(newBook, 'id')
    const batch = writeBatch(this.dbHandler.db)
    this.dbHandler.updateDocInBatch(batch, this.dbHandler.boardDocRef(this.id), {
      unreadBooksOrder: this.unreadBooksOrder,
      totalBooksAdded: this.totalBooksAdded
    })
    this.dbHandler.updateDocInBatch(
      batch,
      this.dbHandler.boardChunkDocRef({ boardId: this.id, chunkIndex: newBook.chunk }),
      { [newBook.id]: deleteUndefinedFields({ ...bookProperties }) }
    )
    await batch.commit()

    return this.unreadBooks[newBook.id]
  }

  public editBook = async (book: Book, changes: Partial<EditableBookProperties>) => {
    // 💻
    Object.assign(book, changes)

    // ☁️
    await this.dbHandler.updateDoc(
      this.dbHandler.boardChunkDocRef({ boardId: this.id, chunkIndex: book.chunk }),
      { [book.id]: changes }
    )
  }

  public deleteBook = async (book: Book) => {
    // 💻
    this.removeUnreadBook(book)
    this.removeReadBook(book)

    // ☁️
    const batch = writeBatch(this.dbHandler.db)
    this.dbHandler.updateDocInBatch<any>(batch, this.dbHandler.boardDocRef(this.id), {
      unreadBooksOrder: arrayRemove(book.id)
    })
    this.dbHandler.updateDocInBatch(
      batch,
      this.dbHandler.boardChunkDocRef<any>({ boardId: this.id, chunkIndex: book.chunk }),
      { [book.id]: deleteField() }
    )
    await batch.commit()
  }

  public markBookAsRead = async (book: Book, ratingAndReview?: Pick<BookProperties, 'rating' | 'review'>) => {
    // 💻
    book.timeCompleted = Date.now()
    Object.assign(book, ratingAndReview)
    this.removeUnreadBook(book)
    this.readBooks[book.id] = book
    this.userDataHandler.incrementCompletedBooks()

    // ☁️
    const batch = writeBatch(this.dbHandler.db)
    this.dbHandler.updateDocInBatch<any>(batch, this.dbHandler.boardDocRef(this.id), {
      unreadBooksOrder: arrayRemove(book.id)
    })
    this.dbHandler.updateDocInBatch(
      batch,
      this.dbHandler.boardChunkDocRef({ boardId: this.id, chunkIndex: book.chunk }),
      {
        [book.id]: {
          timeCompleted: book.timeCompleted,
          ...ratingAndReview
        }
      }
    )
    await batch.commit()
  }

  public getSortedReadBookIds = () => {
    return Object.values(this.readBooks)
      .sort((a, b) => (b.timeCompleted ?? 0) - (a.timeCompleted ?? 0))
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
