import { nanoid } from 'nanoid'

export interface BookConstructorOptions {
  title: string
  author: string
}

export default class Book {
  public id
  public title
  public author

  constructor(options: BookConstructorOptions) {
    const { title, author } = options
    this.title = title
    this.author = author
    this.id = nanoid(8)
  }
}
