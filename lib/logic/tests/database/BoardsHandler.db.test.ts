import '@abraham/reflection'
import { container } from 'tsyringe'
import initializeFirebase, { registerFirebaseInjectionTokens } from '@/lib/firebase-setup/initializeFirebase'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import signInDummyUser from '@/test-setup/signInDummyUser'
import getFirebaseAdmin from '@/test-setup/getFirebaseAdmin'
import getDbShortcuts from '@/test-setup/getDbShortcuts'
import teardownFirebase from '@/test-setup/teardownFirebase'
import Board from '@/lib/logic/app/Board'

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
  const unreadBookAProperties = { id: 'unread-book-a', title: 'An unread book A', author: 'Test author' }
  const unreadBookBProperties = { id: 'unread-book-b', title: 'An unread book B', author: 'Test author' }
  const readBookProperties = {
    id: 'read-book',
    title: 'A read book',
    author: 'Test author',
    timeCompleted: Date.now(),
    rating: 3,
    review: 'pretty good'
  }

  await testBoardDoc.set({
    totalBooksAdded: 3,
    unreadBooksOrder: [unreadBookAProperties.id, unreadBookBProperties.id]
  })

  await testBoardDoc.collection('chunks').doc('0').set({
    [unreadBookAProperties.id]: unreadBookAProperties,
    [readBookProperties.id]: readBookProperties
  })

  await testBoardDoc.collection('chunks').doc('1').set({
    [unreadBookBProperties.id]: unreadBookBProperties
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
    unreadBooksOrder: [unreadBookAProperties.id, unreadBookBProperties.id],
  })
  expect(loadedBoard.unreadBooks[unreadBookAProperties.id]).toMatchObject(unreadBookAProperties)
  expect(loadedBoard.unreadBooks[unreadBookBProperties.id]).toMatchObject(unreadBookBProperties)
  expect(loadedBoard.readBooks[readBookProperties.id]).toMatchObject(readBookProperties)

  // the board is no longer listed as unloaded

  expect(boardsHandler.unloadedBoardIds).toEqual([])
})