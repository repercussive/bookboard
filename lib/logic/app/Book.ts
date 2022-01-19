import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

export interface BookConstructorOptions {
  title: string
  author: string
}

export type BookRating = 1 | 2 | 3 | 4 | 5

export default class Book {
  public id
  public title
  public author
  public rating?: BookRating 
  public review?: string
  public dateCompleted?: Date

  constructor(options: BookConstructorOptions) {
    const { title, author } = options
    this.title = title
    this.author = author
    this.id = nanoid(8)
    makeAutoObservable(this)
  }

  public updateInfo = (newInfo: BookConstructorOptions) => {
    const { title, author } = newInfo
    this.title = title
    this.author = author
  }

  public updateRating = (rating: BookRating) => {
    this.rating = rating
  }

  public updateReview = (review: string) => {
    this.review = review
  }
}
