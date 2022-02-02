import '@abraham/reflection'
import { container } from 'tsyringe'
import { Timestamp } from 'firebase/firestore'
import initializeFirebase, { registerFirebaseInjectionTokens } from '@/lib/firebase-setup/initializeFirebase'
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
  registerFirebaseInjectionTokens(firebase)
  boardsHandler = container.resolve(BoardsHandler)
  testUserUid = (await signInDummyUser()).uid
})

afterEach(async () => {
  container.clearInstances()
  await db.recursiveDelete(userDoc(testUserUid))
})

afterAll(async () => {
  await teardownFirebase(firebase)
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
    dateCompleted: new Date(),
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
    [testBoardId]: { name: 'Test board', dateCreated: Timestamp.fromDate(new Date()) }
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