import '@abraham/reflection'
import { container } from 'tsyringe'
import initializeFirebase, { registerFirebaseInjectionTokens } from 'core/firebase-setup/initializeFirebase'
import { maxBooksPerDocument } from '@/logic/app/DbHandler'
import { BookProperties } from '@/logic/app/Board'
import Board from '@/logic/app/Board'
import exclude from '@/logic/utils/exclude'
import signInDummyUser from '@/logic/tests/_setup/signInDummyUser'
import getFirebaseAdmin from '@/logic/tests/_setup/getFirebaseAdmin'
import getDbShortcuts from '@/logic/tests/_setup/getDbShortcuts'
import teardownFirebase from '@/logic/tests/_setup/teardownFirebase'

const { db } = getFirebaseAdmin()
const { userDoc, boardChunkDoc, boardDoc } = getDbShortcuts(db)
const firebase = initializeFirebase()

let testUserUid: string

beforeAll(async () => {
  testUserUid = (await signInDummyUser(Date.now().toString())).uid
})

beforeEach(() => {
  registerFirebaseInjectionTokens(firebase)
})

afterEach(async () => {
  container.clearInstances()
  await db.recursiveDelete(userDoc(testUserUid))
})

afterAll(async () => {
  await teardownFirebase(firebase)
})

test('adding a book to a board correctly updates the database', async () => {
  const board = new Board({ name: 'Test board' })
  const book = await board.addBook(({ title: 'Test book', author: 'Test author' }))

  const chunkData = (await boardChunkDoc(testUserUid, board.id, 0).get()).data()
  expect(chunkData?.[book.id]).toEqual<BookProperties>({
    title: book.title,
    author: book.author,
    chunk: book.chunk
  })
})

test('editing a book correctly updates the database', async () => {
  const board = new Board({ name: 'Test board' })
  const book = await board.addBook(({ title: 'Test book', author: 'Test author' }))

  await board.editBook(book, { title: 'New title', author: 'New author' })

  const chunkData = (await boardChunkDoc(testUserUid, board.id, 0).get()).data()
  expect(chunkData?.[book.id]).toEqual(exclude(book, 'id'))
})

test('removing a book from a board correctly updates the database', async () => {
  const board = new Board({ name: 'Test board' })
  const book = await board.addBook({ title: 'Test book', author: 'Test author' })

  await board.deleteBook(book)

  const chunkData = (await boardChunkDoc(testUserUid, board.id, 0).get()).data()
  expect(chunkData).toEqual({})
})

test('marking a book as read correctly updates the database', async () => {
  const board = new Board({ name: 'Test board' })
  const book = await board.addBook({ title: 'Test book', author: 'Test author' })

  await board.markBookAsRead(book, { rating: 5, review: 'masterpiece' })

  const userData = (await userDoc(testUserUid).get()).data()
  const chunkData = (await boardChunkDoc(testUserUid, board.id, 0).get()).data()

  expect(userData?.completedBooksCount).toEqual(1)
  expect(chunkData?.[book.id]).toMatchObject({
    rating: book.rating,
    review: book.review,
    timeCompleted: book.timeCompleted
  })
})

test('reordering order of unread books correctly updates the database', async () => {
  const board = new Board({ name: 'Test board' })
  const bookA = await board.addBook({ title: 'Test book A', author: 'Test author' })
  const bookB = await board.addBook({ title: 'Test book B', author: 'Test author' })
  const bookC = await board.addBook({ title: 'Test book C', author: 'Test author' })

  await board.updateUnreadBooksOrder([bookB.id, bookA.id, bookC.id])

  const boardData = (await boardDoc(testUserUid, board.id).get()).data()
  expect(boardData?.unreadBooksOrder).toEqual([bookB.id, bookA.id, bookC.id])
})

test('added books are uploaded to the correct chunk document', async () => {
  const board = new Board({ name: 'Test board' })

  for (let chunk = 0; chunk < 3; chunk++) {
    board.totalBooksAdded = chunk * maxBooksPerDocument
    let book = await board.addBook({ title: 'Test book', author: 'Test author' })
    const chunkData = (await boardChunkDoc(testUserUid, board.id, chunk).get()).data()
    expect(chunkData?.[book.id]).not.toBeUndefined()
  }
})
