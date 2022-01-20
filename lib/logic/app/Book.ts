import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

export interface BookConstructorOptions {
  title: string
  author: string
}

export default class Book {
  public id
  public title
  public author
  public rating?: number
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

  public updateRating = (rating: number) => {
    this.rating = rating
  }

  public updateReview = (review: string) => {
    this.review = review
  }
}
