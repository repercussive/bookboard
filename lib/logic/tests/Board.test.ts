import Book from '@/lib/logic/app/Book'
import Board from '@/logic/app/Board'

function createBoardWithTestBooks() {
  const board = new Board({ name: 'Test board' })
  const testBookA = new Book({ title: 'Test book A', author: 'An author' })
  const testBookB = new Book({ title: 'Test book B', author: 'An author' })
  board.addBook(testBookA)
  board.addBook(testBookB)

  return { board, testBookA, testBookB }
}

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

test(`adding a book to a board adds it to the board's "unreadBooks" object`, () => {
  const { board, testBookA, testBookB } = createBoardWithTestBooks()

  expect(board.unreadBooks).toEqual({
    [testBookA.id]: testBookA,
    [testBookB.id]: testBookB,
  })
})

test(`adding a book to a board pushes the new book id to the start of the "unreadBooksOrder" array`, () => {
  const { board, testBookA, testBookB } = createBoardWithTestBooks()

  expect(board.unreadBooksOrder).toEqual([testBookB.id, testBookA.id])
})

test(`hasUnreadBooks is true only when the board has unread books`, () => {
  const board = new Board({ name: 'Test board' })
  expect(board.hasUnreadBooks).toEqual(false)

  board.addBook(new Book({ title: 'Test book', author: 'An author' }))
  expect(board.hasUnreadBooks).toEqual(true)
})
