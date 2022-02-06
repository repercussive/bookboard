import '@abraham/reflection'
import { container } from 'tsyringe'
import initializeFirebase, { registerFirebaseInjectionTokens } from '@/lib/firebase-setup/initializeFirebase'
import { maxBooksPerDocument } from '@/lib/logic/app/DbHandler'
import { BookProperties } from '@/lib/logic/app/Board'
import Board from '@/lib/logic/app/Board'
import exclude from '@/lib/logic/utils/exclude'
import signInDummyUser from '@/test-setup/signInDummyUser'
import getFirebaseAdmin from '@/test-setup/getFirebaseAdmin'
import getDbShortcuts from '@/test-setup/getDbShortcuts'
import teardownFirebase from '@/test-setup/teardownFirebase'

const { db } = getFirebaseAdmin()
const { userDoc, boardChunkDoc } = getDbShortcuts(db)
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

test('added books are uploaded to the correct chunk document', async () => {
  const board = new Board({ name: 'Test board' })
  let lastBookAdded: any

  for (let i = 0; i < maxBooksPerDocument + 1; i++) {
    lastBookAdded = await board.addBook({ title: 'Test book', author: 'Test author' })
  }

  const chunkData = (await boardChunkDoc(testUserUid, board.id, 1).get()).data()
  expect(chunkData?.[lastBookAdded.id]).not.toBeUndefined()
})