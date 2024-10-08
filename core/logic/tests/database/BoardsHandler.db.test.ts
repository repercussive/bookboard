import '@abraham/reflection'
import { container } from 'tsyringe'
import initializeFirebase, { registerFirebaseInjectionTokens } from 'core/firebase-setup/initializeFirebase'
import { maxBooksPerDocument } from '@/logic/app/DbHandler'
import Board, { BookProperties } from '@/logic/app/Board'
import BoardsHandler from '@/logic/app/BoardsHandler'
import signInDummyUser from '@/logic/tests/_setup/signInDummyUser'
import getFirebaseAdmin from '@/logic/tests/_setup/getFirebaseAdmin'
import getDbShortcuts from '@/logic/tests/_setup/getDbShortcuts'
import teardownFirebase from '@/logic/tests/_setup/teardownFirebase'

const { db } = getFirebaseAdmin()
const { userDoc, boardDoc } = getDbShortcuts(db)
const firebase = initializeFirebase()

let boardsHandler: BoardsHandler
let testUserUid: string

beforeAll(async () => {
  testUserUid = (await signInDummyUser(Date.now().toString())).uid
})

beforeEach(() => {
  registerFirebaseInjectionTokens(firebase)
  boardsHandler = container.resolve(BoardsHandler)
})

afterEach(async () => {
  container.clearInstances()
  await db.recursiveDelete(userDoc(testUserUid))
})

afterAll(async () => {
  await teardownFirebase(firebase)
})

test('adding a board correctly adds it to the database', async () => {
  const testBoard = await boardsHandler.addBoard(new Board({ name: 'Test board' }))

  const boardDocData = (await boardDoc(testUserUid, testBoard.id).get()).data()
  const userDocData = (await userDoc(testUserUid).get()).data()

  expect(boardDocData).toEqual({
    totalBooksAdded: 0,
    unreadBooksOrder: []
  })
  expect(userDocData?.boardsMetadata).toEqual({
    [testBoard.id]: {
      name: testBoard.name,
      timeCreated: testBoard.timeCreated
    }
  })
})

test(`changing a board's name correctly updates the database`, async () => {
  const testBoard = await boardsHandler.addBoard(new Board({ name: 'Test board' }))
  await testBoard.renameBoard('A cool new name')

  const userDocData = (await userDoc(testUserUid).get()).data()
  expect(userDocData?.boardsMetadata[testBoard.id].name).toEqual('A cool new name')
})

test('deleting a board correctly updates the database', async () => {
  const testBoard = await boardsHandler.addBoard(new Board({ name: 'Test board' }))
  testBoard.totalBooksAdded = maxBooksPerDocument * 3

  const testBoardDoc = boardDoc(testUserUid, testBoard.id)
  const chunk1Doc = testBoardDoc.collection('chunks').doc('0')
  const chunk2Doc = testBoardDoc.collection('chunks').doc('1')

  await testBoardDoc.set({})
  await chunk1Doc.set({})
  await chunk2Doc.set({})

  await boardsHandler.deleteBoard(testBoard)

  expect((await userDoc(testUserUid).get()).data()?.boardsMetadata[testBoard.id]).toBeUndefined()
  expect((await testBoardDoc.get()).data()).toBeUndefined()
  expect((await chunk1Doc.get()).data()).toBeUndefined()
  expect((await chunk2Doc.get()).data()).toBeUndefined()
})

test('when a board is selected, it is correctly loaded from the database', async () => {
  //#region populate db, with books split between different documents (chunks)

  const testBoardId = 'test-board-id'
  const testBoardDoc = boardDoc(testUserUid, testBoardId)
  const unreadBookAId = 'unread-book-a'
  const unreadBookAProperties: BookProperties = {
    title: 'An unread book A',
    author: 'Test author',
    chunk: 0
  }
  const unreadBookBId = 'unread-book-b'
  const unreadBookBProperties: BookProperties = {
    title: 'An unread book B',
    author: 'Test author',
    chunk: 1
  }
  const readBookId = 'read-book'
  const readBookProperties: BookProperties = {
    title: 'A read book',
    author: 'Test author',
    chunk: 0,
    timeCompleted: Date.now(),
    rating: 3,
    review: 'pretty good'
  }

  await testBoardDoc.set({
    totalBooksAdded: 3,
    unreadBooksOrder: [unreadBookAId, unreadBookBId]
  })

  await testBoardDoc.collection('chunks').doc('0').set({
    [unreadBookAId]: unreadBookAProperties,
    [readBookId]: readBookProperties
  })

  await testBoardDoc.collection('chunks').doc('1').set({
    [unreadBookBId]: unreadBookBProperties
  })
  //#endregion

  // register the unloaded board

  boardsHandler.registerBoardsMetadata({ [testBoardId]: { name: 'Test board', timeCreated: Date.now() } })

  // select board to trigger download

  await boardsHandler.setSelectedBoard(boardsHandler.allBoards[0])

  // board data + books are correctly loaded

  const loadedBoard = boardsHandler.allBoards[0]

  expect(loadedBoard).toMatchObject({
    totalBooksAdded: 3,
    unreadBooksOrder: [unreadBookAId, unreadBookBId],
  })
  expect(loadedBoard.unreadBooks[unreadBookAId]).toEqual({ ...unreadBookAProperties, id: unreadBookAId })
  expect(loadedBoard.unreadBooks[unreadBookBId]).toEqual({ ...unreadBookBProperties, id: unreadBookBId })
  expect(loadedBoard.readBooks[readBookId]).toEqual({ ...readBookProperties, id: readBookId })

  // the board is no longer listed as unloaded

  expect(boardsHandler.unloadedBoardIds).toEqual([])
})

test(`if book ids are missing from unreadBooksOrder in the board doc, those ids are restored upon loading the board`, async () => {
  // populate db, with unreadBooksOrder missing two book ids

  const testBoardId = 'test-board-id'
  const testBoardDoc = boardDoc(testUserUid, testBoardId)

  await testBoardDoc.set({
    totalBooksAdded: 3,
    unreadBooksOrder: ['book-c'] // "book-a" and "book-b" are missing
  })
  await testBoardDoc.collection('chunks').doc('0').set({
    'book-a': { title: 'Book A', author: 'Test author', chunk: 0 },
    'book-b': { title: 'Book B', author: 'Test author', chunk: 0 },
    'book-c': { title: 'Book C', author: 'Test author', chunk: 0 },
  })

  boardsHandler.registerBoardsMetadata({ [testBoardId]: { name: 'Test board', timeCreated: Date.now() } })

  await boardsHandler.setSelectedBoard(boardsHandler.allBoards[0])
  const loadedBoard = boardsHandler.allBoards[0]

  expect(loadedBoard.unreadBooksOrder).toEqual(['book-a', 'book-b', 'book-c'])
})