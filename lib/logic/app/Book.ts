import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

export interface BookConstructorOptions {
  title: string
  author: string,
  chunk?: number
  id?: string,
  rating?: number,
  review?: string,
  timeCompleted?: number,
}

export type BookProperties = Pick<Book, 'title' | 'author' | 'chunk' | 'rating' | 'review' | 'timeCompleted'>

export default class Book {
  public id
  public title
  public author
  public chunk
  public rating?: number = undefined
  public review?: string = undefined
  public timeCompleted?: number = undefined

  constructor(options: BookConstructorOptions) {
    const { title, author, id, rating, review, timeCompleted, chunk } = options
    this.title = title
    this.author = author
    this.chunk = chunk ?? 0
    this.id = id ?? nanoid(8)
    this.rating = rating
    this.review = review
    this.timeCompleted = timeCompleted
    makeAutoObservable(this)
  }

  public updateInfo = (newInfo: BookConstructorOptions) => {
    const { title, author } = newInfo
    this.title = title
    this.author = author
  }

  public updateRating = (rating: number) => {
    this.rating = rating
  }

  public updateReview = (review: string) => {
    this.review = review
  }
}
