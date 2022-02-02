import '@abraham/reflection'
import { container } from 'tsyringe'
import { deleteUser } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import initializeFirebase, { registerFirebaseInjectionTokens } from '@/lib/firebase-setup/initializeFirebase'
import UserDataHandler from '@/lib/logic/app/UserDataHandler'
import InitialSyncHandler from '@/lib/logic/app/InitialSyncHandler'
import Book from '@/lib/logic/app/Book'
import Board from '@/lib/logic/app/Board'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import signInDummyUser from '@/test-setup/signInDummyUser'
import getFirebaseAdmin from '@/test-setup/getFirebaseAdmin'
import getDbShortcuts from '@/test-setup/getDbShortcuts'
import teardownFirebase from '@/test-setup/teardownFirebase'

const { db } = getFirebaseAdmin()
const { userDoc, boardDoc } = getDbShortcuts(db)
const firebase = initializeFirebase()

let initialSyncHandler: InitialSyncHandler, userDataHandler: UserDataHandler, boardsHandler: BoardsHandler
let testUserUid = ''

beforeEach(() => {
  registerFirebaseInjectionTokens(firebase)
  initialSyncHandler = container.resolve(InitialSyncHandler)
  userDataHandler = container.resolve(UserDataHandler)
  boardsHandler = container.resolve(BoardsHandler)
})

afterEach(async () => {
  container.clearInstances()
  await db.recursiveDelete(userDoc(testUserUid))
  if (firebase.auth.currentUser) {
    await deleteUser(firebase.auth.currentUser)
  }
})

afterAll(async () => {
  await teardownFirebase(firebase)
})

test('user data (including boards metadata) are correctly uploaded on first sign-in', async () => {
  // setting up user data locally

  userDataHandler.setColorTheme('juniper')
  userDataHandler.setPlant('a', 'frank')

  boardsHandler.selectedBoard.renameBoard('Test board')
  boardsHandler.selectedBoard.markBookAsRead(
    boardsHandler.selectedBoard.addBook(new Book({ title: 'Test book', author: 'Test author' }))
  )

  // sign in & initial sync

  testUserUid = (await signInDummyUser()).uid
  await initialSyncHandler.syncData()

  // ensure correct data & structure uploaded

  const userData = (await userDoc(testUserUid).get()).data()!
  expect(userData.plants).toEqual({ a: 'frank', b: 'george' })
  expect(userData.colorTheme).toEqual('juniper')
  expect(userData.completedBooksCount).toEqual(1)
  expect(userData.boardsMetadata[boardsHandler.selectedBoard.id].name).toEqual('Test board')
})

test('once a user document is created, post-signup sync will never be performed again', async () => {
  // sign in & initial sync

  testUserUid = (await signInDummyUser()).uid
  await initialSyncHandler.syncData()

  // change color theme without using method (which would otherwise trigger a resync)

  userDataHandler.colorTheme = 'coffee'

  // attempt to do initial sync again (it skips)

  await initialSyncHandler.syncData()

  // the color theme in the db will not have changed, because no sync was performed

  const userData = (await userDoc(testUserUid).get()).data()!
  expect(userData.colorTheme).toEqual('vanilla')
})

test('board contents are correctly uploaded on first sign-in', async () => {
  // setting up boards locally 

  const boardA = boardsHandler.selectedBoard
  const boardABookA = boardsHandler.selectedBoard.addBook(new Book({ title: 'Test board A book A', author: 'Test author' }))
  const boardABookB = boardsHandler.selectedBoard.addBook(new Book({ title: 'Test board A book B', author: 'Test author' }))
  boardABookA.updateRating(5)
  boardABookA.updateReview('it was pretty good')
  boardsHandler.selectedBoard.markBookAsRead(boardABookA)

  const boardB = boardsHandler.addBoard(new Board({ name: 'Test board B' }))
  const boardBBook = boardsHandler.selectedBoard.addBook(new Book({ title: 'Test board B book', author: 'Test author' }))

  // sign in & initial sync

  testUserUid = (await signInDummyUser()).uid
  await initialSyncHandler.syncData()

  // ensure correct data & structure uploaded

  const boardADoc = await boardDoc(testUserUid, boardA.id).get()
  const boardAChunk = (await boardADoc.ref.collection('chunks').doc('0').get()).data()
  expect(boardADoc.data()).toEqual({ totalBooksAdded: 2, unreadBooksOrder: [boardABookB.id] })
  expect(boardAChunk).toEqual({
    [boardABookA.id]: {
      title: boardABookA.title,
      author: boardABookA.author,
      rating: boardABookA.rating,
      review: boardABookA.review,
      dateCompleted: {
        _seconds: Timestamp.fromDate(boardABookA.dateCompleted!).seconds,
        _nanoseconds: Timestamp.fromDate(boardABookA.dateCompleted!).nanoseconds,
      }
    },
    [boardABookB.id]: {
      title: boardABookB.title,
      author: boardABookB.author
    }
  })

  const boardBDoc = await boardDoc(testUserUid, boardB.id).get()
  const boardBChunk = (await boardBDoc.ref.collection('chunks').doc('0').get()).data()
  expect(boardBDoc.data()).toEqual({ totalBooksAdded: 1, unreadBooksOrder: [boardBBook.id] })
  expect(boardBChunk).toEqual({
    [boardBBook.id]: {
      title: boardBBook.title,
      author: boardBBook.author
    }
  })
})