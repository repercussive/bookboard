import '@abraham/reflection'
import { container } from 'tsyringe'
import initializeFirebase, { registerFirebaseInjectionTokens } from '@/lib/firebase-setup/initializeFirebase'
import Board, { BookProperties } from '@/lib/logic/app/Board'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import signInDummyUser from '@/test-setup/signInDummyUser'
import getFirebaseAdmin from '@/test-setup/getFirebaseAdmin'
import getDbShortcuts from '@/test-setup/getDbShortcuts'
import teardownFirebase from '@/test-setup/teardownFirebase'

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

test('when a board is selected, it is correctly loaded from the database', async () => {
  // populate db, with books split between different documents (chunks)

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

  // register the unloaded board

  boardsHandler.registerBoardsMetadata({
    [testBoardId]: { name: 'Test board', timeCreated: Date.now() }
  })

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