import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

export interface BookConstructorOptions {
  title: string
  author: string,
  id?: string,
  rating?: number,
  review?: string,
  dateCompleted?: Date
}

export type BookProperties = Pick<Book, 'title' | 'author' | 'rating' | 'review' | 'dateCompleted'>

export default class Book {
  public id
  public title
  public author
  public rating?: number = undefined
  public review?: string = undefined
  public dateCompleted?: Date = undefined

  constructor(options: BookConstructorOptions) {
    const { title, author, id, rating, review, dateCompleted } = options
    this.title = title
    this.author = author
    this.id = id ?? nanoid(8)
    this.rating = rating
    this.review = review
    this.dateCompleted = dateCompleted
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
