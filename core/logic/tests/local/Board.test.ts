import '@abraham/reflection'
import { container } from 'tsyringe'
import { maxBooksPerDocument } from '@/logic/app/DbHandler'
import initializeFirebase, { registerFirebaseInjectionTokens } from 'core/firebase-setup/initializeFirebase'
import Board from '@/logic/app/Board'
import UserDataHandler from '@/logic/app/UserDataHandler'

async function createBoardWithTestBooks() {
  const board = new Board({ name: 'Test board' })
  const testBookA = await board.addBook({ title: 'Test book A', author: 'An author' })
  const testBookB = await board.addBook({ title: 'Test book B', author: 'An author' })
  return { board, testBookA, testBookB }
}

const fb = initializeFirebase()

beforeEach(() => {
  registerFirebaseInjectionTokens(fb)
})

afterEach(() => {
  container.clearInstances()
})

test('when a board is created, its properties are correctly assigned', () => {
  const newBoard = new Board({
    name: 'Test board',
  })

  expect(newBoard.name).toEqual('Test board')
})

test('when a board is created, it is automatically assigned a random 6-character id', () => {
  const newBoardA = new Board({ name: 'Test board A' })
  const newBoardB = new Board({ name: 'Test board B' })

  expect(newBoardA.id).not.toEqual(newBoardB.id)
  expect(newBoardA.id.length).toEqual(6)
  expect(newBoardB.id.length).toEqual(6)
})

test('renaming a board works', () => {
  const testBoard = new Board({ name: 'Old name' })
  testBoard.renameBoard('New name')

  expect(testBoard.name).toEqual('New name')
})

test(`adding a book to a board adds it to the board's "unreadBooks" object`, async () => {
  const { board, testBookA, testBookB } = await createBoardWithTestBooks()

  expect(board.unreadBooks).toEqual({
    [testBookA.id]: testBookA,
    [testBookB.id]: testBookB,
  })
})

test(`adding a book to a board pushes the new book id to the start of the "unreadBooksOrder" array`, async () => {
  const { board, testBookA, testBookB } = await createBoardWithTestBooks()

  expect(board.unreadBooksOrder).toEqual([testBookB.id, testBookA.id])
})

test(`adding a book increments the "totalBooksAdded" stat`, async () => {
  const testBoard = new Board({ name: 'Test board' })
  testBoard.addBook({ title: 'Test book A', author: 'Test author' })
  testBoard.addBook({ title: 'Test book B', author: 'Test author' })
  expect(testBoard.totalBooksAdded).toEqual(2)
})

test('newly added books are assigned a random 8-character id', async () => {
  const { testBookA, testBookB } = await createBoardWithTestBooks()

  expect(testBookA.id).not.toEqual(testBookB.id)
  expect(testBookA.id.length).toEqual(8)
  expect(testBookB.id.length).toEqual(8)
})

test('newly added books are assigned to the correct chunk based on the maximum books allowed in a single document', async () => {
  const testBoard = new Board({ name: 'Test board' })

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < maxBooksPerDocument; j++) {
      const book = await testBoard.addBook({ title: `${j}`, author: `${j}` })
      expect(book.chunk).toEqual(i)
    }
  }
})

test('editing a book works', async () => {
  const { board, testBookA } = await createBoardWithTestBooks()

  board.editBook(testBookA, { title: 'A new title', author: 'A new author' })
  expect(testBookA).toMatchObject({
    title: 'A new title',
    author: 'A new author',
  })
})

test(`deleting a book does not decrease the "totalBooksAdded" stat`, async () => {
  const testBoard = new Board({ name: 'Test board' })
  const book = await testBoard.addBook({ title: 'Test book', author: 'Test author' })
  testBoard.deleteBook(book)
  expect(testBoard.totalBooksAdded).toEqual(1)
})

test('deleting a book removes it from the "unreadBooks" object and the "unreadBooksOrder" array', async () => {
  const { board, testBookA, testBookB } = await createBoardWithTestBooks()

  board.deleteBook(testBookA)
  expect(board.unreadBooks[testBookA.id]).toBeUndefined()
  expect(board.unreadBooksOrder).toEqual([testBookB.id])
})

test('marking a book as read removes it from the "unreadBooks" object and the "unreadBooksOrder" array', async () => {
  const { board, testBookA, testBookB } = await createBoardWithTestBooks()

  board.markBookAsRead(testBookA)
  expect(board.unreadBooks[testBookA.id]).toBeUndefined()
  expect(board.unreadBooksOrder).toEqual([testBookB.id])
})

test('marking a book as read moves it to the "readBooks" object', async () => {
  const { board, testBookA } = await createBoardWithTestBooks()

  board.markBookAsRead(testBookA)
  expect(board.readBooks[testBookA.id]).toEqual(testBookA)
})

test(`marking a book as read increments UserDataHandler's completed books count`, async () => {
  const { board, testBookA, testBookB } = await createBoardWithTestBooks()
  board.markBookAsRead(testBookA)
  board.markBookAsRead(testBookB)
  expect(container.resolve(UserDataHandler).completedBooksCount).toEqual(2)
})

test(`hasUnreadBooks is true only when the board has unread books`, () => {
  const board = new Board({ name: 'Test board' })
  expect(board.hasUnreadBooks).toEqual(false)

  board.addBook({ title: 'Test book', author: 'An author' })
  expect(board.hasUnreadBooks).toEqual(true)
})
