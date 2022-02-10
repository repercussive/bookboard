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
export type BookSortMode = 'newest-first' | 'oldest-first' | 'highest-rated-first' | 'lowest-rated-first'

export default class Board {
  public id
  public name
  public timeCreated
  public unreadBooks: { [id: string]: Book } = {}
  public unreadBooksOrder: string[] = []
  public readBooks: { [id: string]: Book } = {}
  public totalBooksAdded = 0
  public readBooksSortMode: BookSortMode = 'newest-first'
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
    await this.dbHandler.runWriteOperations(async ({ updateDoc }) => {
      await updateDoc(this.dbHandler.userDocRef, {
        boardsMetadata: { [this.id]: { name: newName } }
      })
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
    await this.dbHandler.runWriteOperations(async ({ updateDocInBatch }) => {
      const bookProperties: BookProperties = exclude(newBook, 'id')
      const batch = writeBatch(this.dbHandler.db)
      updateDocInBatch(batch, this.dbHandler.boardDocRef(this.id), {
        unreadBooksOrder: this.unreadBooksOrder,
        totalBooksAdded: this.totalBooksAdded
      })
      updateDocInBatch(
        batch,
        this.dbHandler.boardChunkDocRef({ boardId: this.id, chunkIndex: newBook.chunk }),
        { [newBook.id]: deleteUndefinedFields({ ...bookProperties }) }
      )
      await batch.commit()
    })

    return this.unreadBooks[newBook.id]
  }

  public editBook = async (book: Book, changes: Partial<EditableBookProperties>) => {
    // 💻
    Object.assign(book, changes)

    // ☁️
    await this.dbHandler.runWriteOperations(async ({ updateDoc }) => {
      await updateDoc(
        this.dbHandler.boardChunkDocRef({ boardId: this.id, chunkIndex: book.chunk }),
        { [book.id]: changes }
      )
    })
  }

  public deleteBook = async (book: Book) => {
    // 💻
    this.removeUnreadBook(book)
    this.removeReadBook(book)

    // ☁️
    await this.dbHandler.runWriteOperations(async ({ updateDocInBatch }) => {
      const batch = writeBatch(this.dbHandler.db)
      updateDocInBatch<any>(batch, this.dbHandler.boardDocRef(this.id), {
        unreadBooksOrder: arrayRemove(book.id)
      })
      updateDocInBatch(
        batch,
        this.dbHandler.boardChunkDocRef<any>({ boardId: this.id, chunkIndex: book.chunk }),
        { [book.id]: deleteField() }
      )
      await batch.commit()
    })
  }

  public markBookAsRead = async (book: Book, ratingAndReview?: Pick<BookProperties, 'rating' | 'review'>) => {
    // 💻
    book.timeCompleted = Date.now()
    Object.assign(book, ratingAndReview)
    this.removeUnreadBook(book)
    this.readBooks[book.id] = book
    this.userDataHandler.incrementCompletedBooks()

    // ☁️
    await this.dbHandler.runWriteOperations(async ({ updateDocInBatch }) => {
      const batch = writeBatch(this.dbHandler.db)
      updateDocInBatch<any>(batch, this.dbHandler.boardDocRef(this.id), {
        unreadBooksOrder: arrayRemove(book.id)
      })
      updateDocInBatch(
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
    })
  }

  public setReadBooksSortMode = (sortMode: BookSortMode) => {
    this.readBooksSortMode = sortMode
  }

  public getSortedReadBookIds = () => {
    const mapToIds = (books: Book[]) => books.map((book) => book.id)

    const newestFirst = Object.values(this.readBooks)
      .sort((a, b) => (b.timeCompleted ?? 0) - (a.timeCompleted ?? 0))

    switch (this.readBooksSortMode) {
      case 'newest-first': {
        return mapToIds(newestFirst)
      }
      case 'oldest-first': {
        return mapToIds(newestFirst).reverse()
      }
      case 'highest-rated-first': {
        const highestRatedFirst = newestFirst.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        return mapToIds(highestRatedFirst)
      }
      case 'lowest-rated-first': {
        const lowestRatedFirst = newestFirst.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
        return mapToIds(lowestRatedFirst)
      }
    }
  }

  public updateUnreadBooksOrder = async (newOrder: string[]) => {
    // 💻
    this.unreadBooksOrder = newOrder

    // ☁️
    await this.dbHandler.runWriteOperations(async ({ updateDoc }) => {
      await updateDoc(this.dbHandler.boardDocRef(this.id), {
        unreadBooksOrder: this.unreadBooksOrder
      })
    })
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
